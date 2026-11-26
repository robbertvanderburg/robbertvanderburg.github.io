---
name: Robbert van der Burg
description: An editorial design system for a personal mathematics research website
colors:
  paper: '#fbfaf7'
  surface: '#f2efea'
  ink: '#201f20'
  muted: '#55514e'
  wine: '#7b2d3b'
  line: '#d6d2cd'
  strong-line: '#87817c'
  preprint-paper: '#f2ece8'
  portrait-paper: '#ede5df'
  diagram: '#9e5966'
  diagram-line: '#cdb2b5'
  dark-paper: '#19181a'
  dark-surface: '#242225'
  dark-ink: '#f5efea'
  dark-muted: '#c1bbba'
  dark-wine: '#eba3b1'
  dark-line: '#4a4446'
  dark-strong-line: '#9c9396'
  dark-preprint-paper: '#2c2228'
  dark-portrait-paper: '#34292e'
  dark-diagram: '#c88795'
  dark-diagram-line: '#79505b'
typography:
  display:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(2.35rem, 4.8vw, 4.35rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  profile-name:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(2.3rem, 5.2cqi, 4.1rem)"
    fontWeight: 700
    lineHeight: 1.02
  headline:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.15vw, 2.9rem)"
    fontWeight: 650
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.32rem, 1.8vw, 1.65rem)"
    fontWeight: 400
    lineHeight: 1.26
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  metadata:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.775rem"
    lineHeight: 1.55
    letterSpacing: "0.045em"
rounded:
  button: "3rem"
  field: "0.45rem"
  figure: "0.85rem"
spacing:
  gutter: "clamp(1rem, 4vw, 3.625rem)"
  section: "clamp(2.8rem, 5.6vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "0.6rem 1.35rem"
  filter-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.55rem 0.65rem"
---

# Academic website design

## Overview

A journal contributor’s profile sets the tone. The researcher’s name, studio portrait and newest preprint lead the homepage. The archive, bibliography and CV use the same typefaces, rules and margins to organize denser material.

The original site at commit `0592a04` paired Source Serif 4, DM Sans and JetBrains Mono with a wine-red accent on warm paper. It used a 960px column, a 2.4rem name, a rounded 240px portrait, pill-shaped profile links, bordered research cards and an animated footer canvas. The redesign carries forward the palette, type families and authentic photograph.

## Colors

Warm paper fills the page. Thin rules divide records, while the preprint and research figure each have a lightly tinted surface. Wine identifies links, controls, dates and the portrait's network. The dark theme uses charcoal paper and rose accents. Field outlines use the stronger line token. The lighter line is for editorial separation.

## Typography

DM Sans sets the profile name, headings, controls and body. Source Serif 4 sets the masthead wordmark and academic titles. JetBrains Mono sets dates, years and result counts. Long research paragraphs use a 65ch measure, with 66ch for news and CV descriptions. The name scales with its content container. Keeping the surname together preserves a natural two-line phone heading. All three families load locally with `font-display: swap`.

## Layout

A centered 80rem container, including its fluid gutters, anchors the masthead, main content and footer. Section spacing ranges from 2.8rem to 5rem. On wide screens the profile pairs the introduction with a portrait above a circular matte and a network drawing. Publications leads a short row of actions. The newest synchronized preprint follows.

| Available space | Composition |
| --- | --- |
| Masthead up to 52rem | Full name, direct Publications and Academic CV links, and a menu for Research, News, Contact and theme. The CV label shortens on phones. At the narrowest widths the name takes precedence over its mark. Enlarged controls can wrap below the name. |
| Page content up to 36rem | The introduction extends across the page below the identity and portrait. The smallest layout gives the affiliation its own row. Paper metadata, timeline and archive entries stack. Very narrow reading widths also stack the portrait. |
| Page content up to 48rem | The research figure centers below the prose. Intermediate widths use a title column beside each project's description and resource. Latest preprint metadata sits above its paper title. |
| Page content up to 56rem | The CV starts with an “On this page” disclosure. Wider layouts use a sticky contents rail. |
| Wide page | The research diagram sits alongside the text. Publication metadata has a separate column. The capped page width keeps the profile and bibliography aligned on large displays. |

The masthead becomes sticky only when the full menu fits and the viewport has sufficient height. Its measured height provides clearance for reading anchored sections. Both footer groups follow the same outer margins.

## Components

- **Profile and research figure.** Reserve space for the portrait before loading. Supply 160, 320, 512 and 760 pixel WebP sources. The hero loads with high priority. The separate storm-footprint SVG loads lazily and includes text describing the circled components.
- **Bibliography.** Keep titles, author order, venue and available links tied to the source record. Emphasize the profile owner's complete name. Label preprint DOIs explicitly. A native citation disclosure contains selectable text and available export actions. Search announces the result count and offers a reset while filters are active.
- **Navigation and controls.** Make the primary action a solid wine pill. Keep supporting actions underlined and important standalone controls at least 44 CSS px high. Mark the current destination with an underline. Use a two-pixel focus outline and preserve focus across changes in navigation layout.
- **Motion and theme.** The optional network trace runs once. Menu and control feedback obey the reduced-motion preference. The theme follows the system until the reader chooses an override.
- **Academic CV.** Keep dates alongside their entries when space allows. Use the same content for the screen, the print stylesheet and the downloadable A4 PDF. The print version keeps academic entries together and suppresses navigation and controls.
