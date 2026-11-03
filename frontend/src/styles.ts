import { css } from "lit";

/** Shared look, built only on HA theme variables (light/dark follow automatically). */
export const sharedStyles = css`
  :host {
    color: var(--primary-text-color);
    --cb-radius: var(--ha-card-border-radius, 12px);
    --cb-gap: 16px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--divider-color);
    border-radius: 18px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  .btn:hover {
    background: var(--secondary-background-color);
  }
  .btn.primary {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color);
  }
  .btn.danger {
    border-color: var(--error-color);
    color: var(--error-color);
  }
  .btn.danger.primary {
    background: var(--error-color);
    color: var(--text-primary-color);
  }
  .btn ha-icon {
    --mdc-icon-size: 18px;
  }
  .btn[aria-pressed="true"] {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 12px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .card {
    border-radius: var(--cb-radius);
    background: var(--card-background-color);
    box-shadow: var(--ha-card-box-shadow, none);
    border: 1px solid var(--ha-card-border-color, var(--divider-color));
  }
  .muted {
    color: var(--secondary-text-color);
  }
  .message {
    margin: 48px auto;
    max-width: 480px;
    text-align: center;
    color: var(--secondary-text-color);
  }
  .error {
    color: var(--error-color);
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
`;
