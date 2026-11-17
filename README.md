# Phish or Legit?

A fast-paced browser game where players act as a bank's AI firewall and decide whether a transfer or message is legitimate or a scam.

## How to run

Because this is a lightweight static web app, there are no install dependencies.

1. Open the repo in your terminal.
2. Start a simple local server:

```bash
python3 -m http.server 8000
```

3. Visit `http://localhost:8000` in your browser.

## Gameplay

- Every round presents a transfer, SMS alert, or voice-call scenario.
- Players must choose either `APPROVE` or `BLOCK` before the timer reaches zero.
- Legit transfers earn points; scam attempts cost points and break the streak.
- Each decision is followed by a quick explanation so the player learns the signs of phishing and fraud.

## Controls

- `APPROVE` button: accept legitimate transfers or normal alerts.
- `BLOCK` button: reject scam texts, deepfake voice requests, or suspicious actions.
- `New Shift` button: restart the game with a new round order.
