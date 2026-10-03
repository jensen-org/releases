---
name: Jensen release landing, direction 4a
description: Light, monochrome release page for Jensen with a download card and an animated codebase graph.
colors:
  paper: "#fbfbf9"
  ink: "#111110"
  surface: "#ffffff"
  surface-2: "#f6f6f3"
  muted: "#55544f"
  muted-2: "#5d5c57"
  muted-3: "#76756f"
  muted-4: "#8a8983"
  muted-5: "#a3a29c"
  status: oklch(0.68 0.16 150)
  activity: oklch(0.62 0.15 255)
  diff-removed: oklch(0.45 0.14 25)
  diff-removed-bg: oklch(0.96 0.03 25)
  diff-added: oklch(0.42 0.12 150)
  diff-added-bg: oklch(0.96 0.04 150)
typography:
  heading:
    fontFamily: Geist
    fontSize: 5.25rem
    fontWeight: 500
    lineHeight: 0.98
  body:
    fontFamily: Geist
    fontSize: 1.1875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geist Mono
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 14px
  pill: 999px
spacing:
  unit: 4px
northstar:
  mode: persuade
  stack: vue
  libraries:
    components: none, hand written
    icons: none, text glyphs only
    fonts: geist, self hosted
  allow:
    - { rule: NS-SLOP-EMOJI-ICON, reason: the approved mockup uses text arrows and the command key glyph as typographic marks }
  ignore: []
---

# Jensen release landing, direction 4a

Light theme only. Ink on warm paper, mono labels in tracked capitals, one animated figure.

## Layout

A single 100svh hero. Header, then a two column grid (copy and download card on the left, a 640px graph figure on the right), then a footer. Below 1100px the columns stack. A video pane follows later, once the product video exists.

## Typography

Geist for copy, Geist Mono for labels. Headline 84px, tracking -0.045em. Mono labels 10 to 12px, tracking .06 to .14em, uppercase.

## Color

Ink and paper carry the page. Greys step from muted to muted-5. Green marks status and added lines, blue marks activity, red marks removed lines. Hairlines are ink at 8 to 12 percent.

## Motion

One 44 second loop of four scenarios, each 11 seconds: ask, read, then a diff or a blast radius. Reduced motion shows a single still frame.
