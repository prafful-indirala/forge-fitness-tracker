# Forge design context

## Product intent

Forge is a mobile-first workout companion designed for use between sets. The interface should feel focused, calm and decisive: one current exercise, large tap targets, minimal typing and no unnecessary navigation.

## Visual language

- Dark near-black canvas with subtle green and blue ambient light.
- Translucent glass panels with restrained borders and shadows.
- Mint green (`#69df98`) is the single action/success accent.
- Inter is the UI typeface. Headlines are bold and compact; supporting text is muted.
- Corners are rounded but not playful: 14–26px depending on component scale.

## Interaction contract

- The current exercise remains the visual and semantic focus.
- Previous and Next change the active exercise and return the viewport to the top.
- Logged sets and workout substitutions persist locally on the device.
- Ask Forge opens as a modal bottom sheet on phones and a centered dialog on larger screens. It restores focus when closed and preserves a question after request errors.
- Photo upload accepts JPG, PNG and WebP, validates size/type before sending and shows a removable preview.
- AI suggestions never silently alter the workout. A replacement is applied only through an explicit “Use … today” action and is recorded as an override of the programmed exercise.
- Rest coaching starts when a set is checked. It supports +30 seconds, pause/resume and skip. Voice, chime and vibration can be independently disabled.

## Layering

1. Page content
2. Primary navigation (`--z-nav`)
3. Sticky rest timer (`--z-rest`)
4. Ask Forge dialog (`--z-dialog` / native top layer)
5. Toasts (`--z-toast`)

## Accessibility and resilience

- All controls use semantic buttons and visible keyboard focus.
- The Ask Forge dialog uses the native dialog focus boundary, supports Escape and dismisses on its backdrop.
- Timer status and coaching results use live regions without announcing every visual update unnecessarily.
- Reduced-motion preferences disable nonessential animation.
- AI, speech, sound and vibration failures degrade independently; workout logging remains available.
