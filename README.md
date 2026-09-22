# Forge Fitness Tracker

**Train. Track. Progress.**

Forge is a mobile-first personal training dashboard built around progressive overload, low-friction workout logging, recovery, nutrition adherence and fortnightly physique reviews.

## Why Forge?
Most fitness trackers make logging the workout harder than doing it. Forge is deliberately opinionated: open it, see today's plan, log weight + reps, run the rest timer, move on.

## Current features
- Day-aware training dashboard
- Per-set weight and rep logging
- Built-in rest timer
- Spoken rest countdown with pause, skip and +30 second controls
- Contextual Ask Forge coaching with optional machine-photo checks
- One-tap exercise substitutions that remain attached to today's log
- Workout completion progress
- Recovery-day protocols
- Daily protein, hydration, creatine and calorie adherence
- Local-first persistence (no account required)
- Progressive-overload guidance
- Responsive glass UI designed for use in the gym

## Roadmap
- Fortnightly body-metrics and progress-photo flow
- Previous-session set comparison
- PR detection and progression suggestions
- Training history and charts
- Optional cloud sync

## Stack
Vanilla HTML, CSS and JavaScript. Intentionally lightweight and deployable anywhere.

Ask Forge uses `OPENAI_API_KEY` when configured in Vercel. It can also use `AI_GATEWAY_API_KEY` or Vercel OIDC through AI Gateway. `FORGE_AI_MODEL` is optional.

## Privacy
Workout logs remain local in the browser using localStorage. Ask Forge sends only the current exercise context, the question and any explicitly attached machine photo to the configured AI service; photos are not stored by this app.

---
Built as a focused personal fitness engineering project by Prafful Indirala.
