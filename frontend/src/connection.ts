import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HassConnection, HomeAssistant } from "./types";

/** Signed image URLs are valid 24 h: data older than this is reloaded. */
export const REFRESH_AFTER_MS = 12 * 60 * 60 * 1000;
/** How often an always visible page (wall tablet) checks the age of its data. */
export const REFRESH_CHECK_MS = 15 * 60 * 1000;

type Host = ReactiveControllerHost & HTMLElement & { hass?: HomeAssistant };

/**
 * Reloads a view when the WebSocket comes back after being lost (phone asleep, network change),
 * and, with `maxAge`, when its data gets old (signed image URLs expire).
 *
 * A reload is only triggered after an actual disconnection: seen by the connection ("disconnected"
 * event, `hass.connected` false) or reported by the view (`connectionLost()`, a call rejected with a
 * connection error). Ordinary `hass` updates never reload.
 */
export class ConnectionWatcher implements ReactiveController {
  private connection?: HassConnection;
  private lost = false;
  private loadedAt: number | null = null;
  private timer?: ReturnType<typeof setInterval>;

  constructor(
    private readonly host: Host,
    private readonly options: { reload: () => void; maxAge?: number },
  ) {
    host.addController(this);
  }

  hostConnected() {
    this.attach();
    if (this.options.maxAge) {
      document.addEventListener("visibilitychange", this.checkAge);
      this.timer = setInterval(this.checkAge, REFRESH_CHECK_MS);
    }
  }

  hostDisconnected() {
    this.detach();
    document.removeEventListener("visibilitychange", this.checkAge);
    clearInterval(this.timer);
  }

  hostUpdate() {
    this.attach(); // HA may give a new connection object
    const connected = this.host.hass?.connected;
    if (connected === false) this.lost = true;
    else if (connected === true) this.recover();
  }

  /** The data is fresh (loaded or reloaded successfully). */
  loaded() {
    this.loadedAt = Date.now();
  }

  /** A call failed with a connection error: reload once the connection is back. */
  connectionLost() {
    this.lost = true;
    // Already reconnected (the "ready" event came before the rejection was handled).
    if (this.connection?.connected) this.recover();
  }

  private onDisconnected = () => {
    this.lost = true;
  };

  private recover = () => {
    // hass.connected can lag behind the socket: wait until it is really open.
    if (!this.lost || this.connection?.connected === false) return;
    this.lost = false;
    this.options.reload();
  };

  private checkAge = () => {
    if (document.visibilityState === "hidden" || this.lost || this.loadedAt === null) return;
    if (Date.now() - this.loadedAt < this.options.maxAge!) return;
    this.options.reload();
  };

  private attach() {
    const connection = this.host.hass?.connection;
    if (connection === this.connection) return;
    this.detach();
    this.connection = connection;
    connection?.addEventListener("ready", this.recover);
    connection?.addEventListener("disconnected", this.onDisconnected);
  }

  private detach() {
    this.connection?.removeEventListener("ready", this.recover);
    this.connection?.removeEventListener("disconnected", this.onDisconnected);
    this.connection = undefined;
  }
}
