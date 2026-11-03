/**
 * Bootstraps the throwaway E2E Home Assistant (port 8124) through its HTTP/WebSocket APIs:
 * onboarding with an admin, Cookbook config entry, a non-admin member, and a logged-in browser
 * session (storage state) per user. No UI involved, so HA login-page changes cannot break it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const HA_URL = process.env.E2E_HA_URL ?? "http://localhost:8124";
const CLIENT_ID = `${HA_URL}/`;

export const USERS = {
  admin: { name: "Admin E2E", username: "e2e-admin", password: "e2e-admin-password" },
  member: { name: "Membre E2E", username: "e2e-membre", password: "e2e-membre-password" },
} as const;
export type UserKey = keyof typeof USERS;

export const storageStatePath = (user: UserKey) => `e2e/.auth/${user}.json`;

interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

async function request<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);
  const response = await fetch(`${HA_URL}${path}`, { ...init, headers });
  if (!response.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

const json = (body: unknown, token?: string): RequestInit & { token?: string } => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
  token,
});

async function waitForHa(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const response = await fetch(`${HA_URL}/api/onboarding`);
      if (response.ok) return (await response.json()) as { step: string; done: boolean }[];
    } catch {
      /* not up yet */
    }
    if (Date.now() > deadline) throw new Error(`Home Assistant not reachable at ${HA_URL}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

const exchangeCode = (code: string) =>
  request<Tokens>("/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: CLIENT_ID }),
  });

/** Logs a user in through the HA login flow API. */
async function login(user: UserKey): Promise<Tokens> {
  const { username, password } = USERS[user];
  const flow = await request<{ flow_id: string }>(
    "/auth/login_flow",
    json({ client_id: CLIENT_ID, handler: ["homeassistant", null], redirect_uri: CLIENT_ID }),
  );
  const result = await request<{ type: string; result: string }>(
    `/auth/login_flow/${flow.flow_id}`,
    json({ client_id: CLIENT_ID, username, password }),
  );
  if (result.type !== "create_entry") throw new Error(`Login failed for ${username}: ${JSON.stringify(result)}`);
  return exchangeCode(result.result);
}

/** Runs WebSocket commands with an access token (Node's built-in WebSocket). */
async function websocket(token: string, commands: Record<string, unknown>[]): Promise<unknown[]> {
  const ws = new WebSocket(`${HA_URL.replace(/^http/, "ws")}/api/websocket`);
  const results: unknown[] = [];
  let id = 0;
  return new Promise((resolve, reject) => {
    const next = () => {
      if (id === commands.length) {
        ws.close();
        resolve(results);
        return;
      }
      const command = commands[id];
      ws.send(JSON.stringify({ id: ++id, ...command }));
    };
    ws.addEventListener("error", () => reject(new Error("WebSocket error")));
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (msg.type === "auth_invalid") reject(new Error("WebSocket auth invalid"));
      else if (msg.type === "auth_ok") next();
      else if (msg.type === "result") {
        if (!msg.success) {
          reject(new Error(`WebSocket command failed: ${JSON.stringify(msg.error)}`));
          return;
        }
        results.push(msg.result);
        next();
      }
    });
  });
}

/** Browser storage state: HA frontend reads its tokens and language from localStorage. */
function writeStorageState(user: UserKey, tokens: Tokens) {
  const hassTokens = {
    hassUrl: HA_URL,
    clientId: CLIENT_ID,
    expires: Date.now() + tokens.expires_in * 1000,
    ...tokens,
  };
  const path = storageStatePath(user);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    JSON.stringify({
      cookies: [],
      origins: [
        {
          origin: HA_URL,
          localStorage: [
            { name: "hassTokens", value: JSON.stringify(hassTokens) },
            { name: "selectedLanguage", value: JSON.stringify("fr") },
          ],
        },
      ],
    }),
  );
}

async function onboard(): Promise<string> {
  const { auth_code } = await request<{ auth_code: string }>(
    "/api/onboarding/users",
    json({ client_id: CLIENT_ID, language: "fr", ...USERS.admin }),
  );
  const { access_token: token } = await exchangeCode(auth_code);
  await request("/api/onboarding/core_config", json({}, token));
  await request("/api/onboarding/analytics", json({}, token));
  await request("/api/onboarding/integration", json({ client_id: CLIENT_ID, redirect_uri: `${CLIENT_ID}?auth_callback=1` }, token));
  return token;
}

/** Adds the Cookbook integration, retrying while HA is still loading integrations. */
async function addCookbook(token: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const flow = await request<{ flow_id: string; type: string }>(
        "/api/config/config_entries/flow",
        json({ handler: "cookbook" }, token),
      );
      const result = await request<{ type: string }>(`/api/config/config_entries/flow/${flow.flow_id}`, json({}, token));
      if (result.type !== "create_entry") throw new Error(`Unexpected flow result ${JSON.stringify(result)}`);
      return;
    } catch (error) {
      if (attempt >= 20) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default async function globalSetup() {
  const steps = await waitForHa();
  if (steps.some((step) => step.done)) {
    throw new Error(
      "The E2E Home Assistant is already onboarded: restart it fresh (make e2e does) — never run E2E on a real instance.",
    );
  }
  const token = await onboard();
  await addCookbook(token);

  const [member] = (await websocket(token, [
    { type: "config/auth/create", name: USERS.member.name, group_ids: ["system-users"] },
  ])) as { user: { id: string } }[];
  await websocket(token, [
    {
      type: "config/auth_provider/homeassistant/create",
      user_id: member.user.id,
      username: USERS.member.username,
      password: USERS.member.password,
    },
  ]);

  for (const user of Object.keys(USERS) as UserKey[]) writeStorageState(user, await login(user));
}
