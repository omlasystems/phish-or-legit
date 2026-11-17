# Phish or Legit?

A fast-paced browser game where you act as a bank’s AI firewall: review fictional transfers, messages, and voice-call transcripts, then block scams and approve legitimate activity before the 60-second shift ends.

## Play locally

This is a dependency-free static web app. From the repository directory, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Features

- Animated start screen and end-of-shift report overlay
- 60-second rapid-fire round with shuffled, repeatable scenarios
- Score, speed bonus, streak, accuracy, and personal best saved in your browser
- Generated sound effects using the Web Audio API (toggle sound in the header)
- Keyboard controls: **← Block**, **→ Approve**
- Responsive layout and reduced-motion support
- Fictional training scenarios only; no real transfers or generated deepfake audio

## Safety note

This is a security-awareness training simulation, not financial advice. When in doubt, verify requests through a trusted, independently obtained contact channel. Never share passwords or one-time verification codes.
