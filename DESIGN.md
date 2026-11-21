---
name: Robbert van der Burg
description: An editorial design system for a personal mathematics research website
colors:
  paper: '#fafaf7'
  surface: '#f0efeb'
  ink: '#201f20'
  muted: '#555452'
  wine: '#7b2d3b'
  line: '#d6d2cd'
  strong-line: '#87817c'
  feature: '#602532'
  on-feature: '#fff8ef'
  on-feature-sub: '#efd7d8'
  dark-paper: '#19181a'
  dark-surface: '#242225'
  dark-ink: '#f5efea'
  dark-muted: '#c1bbba'
  dark-wine: '#eba3b1'
  dark-line: '#4a4446'
  dark-strong-line: '#9c9396'
  dark-feature: '#542430'
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(3.5rem, 6.6vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2rem, 3.15vw, 2.9rem)"
    fontWeight: 400
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
  button: "3px"
  field: "2px"
spacing:
  section: "clamp(2.8rem, 5.6vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "0.58rem 1.08rem"
  filter-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.6rem 0.85rem"
---

# Academic website design

## Overview

A journal contributor’s profile sets the tone. The researcher’s name, studio portrait and newest preprint lead the homepage. The archive, bibliography and CV use the same typefaces, rules and margins to organize denser material.

The original site at commit `0592a04` paired Source Serif 4, DM Sans and JetBrains Mono with a wine-red accent on warm paper. It used a 960px column, a 2.4rem name, a rounded 240px portrait, pill-shaped profile links, bordered research cards and an animated footer canvas. The redesign carries forward the palette, type families and authentic photograph.

## Colors

Paper is the reading surface. The secondary surface distinguishes the bibliography filters and footer. Ink carries titles, muted ink carries research prose and authors, and wine identifies links and the italic surname. The featured preprint has its own deep burgundy ground with ivory text. In dark mode links turn rose and the paper turns charcoal.

## Typography

Use regular, optically sized Source Serif 4 for headings and paper titles, DM Sans for narrative and controls, and JetBrains Mono for short dates, section labels and captions. The three families are served from local WOFF2 files. Keep author order and paper titles intact through line wrapping. On small screens the homepage name scales between 2.45rem and 3.7rem next to the portrait.

## Layout

Desktop pages share an 86% column capped at 74rem. Below 58rem the column expands to 90%. Research prose has a 65-character measure. The bibliography and activity archive reserve a left column for dates, with titles, authors or summaries, and source links grouped to the right.

At 47rem the dates move above their entries, section headings move above the prose and the CV contents become an inline list. The hero keeps the name and portrait side by side while its description and actions use the full column. Print styles omit navigation and filters and keep each CV or bibliography entry together where space permits.

## Elevation & Depth

An opaque, sticky masthead sits above the page. Fine rules separate sections and records. The portrait has two burgundy corner marks on its frame. The lead preprint carries a static network illustration alongside its text on wide screens.

## Shapes

Paper sections, the featured preprint and the portrait are rectangular. Form fields and buttons have a slight corner radius. Borders on inputs use the stronger rule color so the outline remains legible in either theme.

## Components

- **Masthead.** A small network drawing precedes the researcher’s name. The current navigation item has an underline, and the divided-circle control switches themes. The mobile menu discloses the same links.
- **Actions.** A solid wine button identifies the primary action. The adjacent outlined button and underlined contact link have progressively less visual weight. Keyboard focus uses a two-pixel outline with a four-pixel offset.
- **Bibliography.** Each row carries a year, linked serif title, author list, venue or status, and available resources. The search field and year selector use visible labels. An empty result offers a filter reset.
- **News and CV.** Year, date and category labels anchor chronological records. Rules and whitespace separate entries, keeping slide links next to the talks they document.
- **Motion.** Buttons change color over 150ms when motion is permitted. The network mark and the featured illustration are static.
