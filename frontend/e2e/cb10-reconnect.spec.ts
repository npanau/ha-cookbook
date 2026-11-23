import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * Closes the HA WebSocket and holds the reconnection (like a phone asleep) until `resume()`.
 * Uses the frontend's own connection: suspendReconnectUntil() + suspend().
 */
async function dropConnection(page: Page) {
  await page.evaluate(() => {
    const conn = (document.querySelector("home-assistant") as unknown as {
      hass: { connection: { suspendReconnectUntil(p: Promise<void>): void; suspend(): void } };
    }).hass.connection;
    conn.suspendReconnectUntil(new Promise((resolve) => ((window as unknown as { resumeWs: () => void }).resumeWs = resolve)));
    conn.suspend();
  });
  // The socket closes asynchronously.
  await page.waitForFunction(
    () => !(document.querySelector("home-assistant") as unknown as { hass: { connection: { connected: boolean } } })
      .hass.connection.connected,
  );
  return {
    resume: () => page.evaluate(() => (window as unknown as { resumeWs: () => void }).resumeWs()),
  };
}

test("CB10 : la fiche se recharge d'elle-même après une coupure de connexion", async ({ cookbook, member, uid }) => {
  const { page } = cookbook;
  await cookbook.goto();
  const first = await cookbook.createRecipe({ name: `Clafoutis ${uid}` });
  const second = await cookbook.createRecipe({ name: `Far breton ${uid}` });
  await cookbook.goto(`/recipe/${first.id}`);
  const sheet = cookbook.sheet();
  const title = sheet.getByRole("heading", { level: 1 });
  await expect(title).toHaveText(`Clafoutis ${uid}`);

  // Opened while disconnected (the call is rejected): no error, loaded once the connection is back.
  let connection = await dropConnection(page);
  await page.evaluate((url) => {
    history.pushState(null, "", url);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }, `/cookbook/recipe/${second.id}`);
  await expect(sheet.getByText("Chargement…")).toBeVisible();
  await connection.resume();
  await expect(title).toHaveText(`Far breton ${uid}`);
  await expect(sheet.getByText("Une erreur est survenue")).toHaveCount(0);

  // Changed elsewhere while this page is disconnected: shown once reconnected, without reloading the page.
  connection = await dropConnection(page);
  await member.goto();
  await member.callWS({ type: "cookbook/update", recipe_id: second.id, name: `Far breton aux pruneaux ${uid}` });
  await connection.resume();
  await expect(title).toHaveText(`Far breton aux pruneaux ${uid}`);
});
