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
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(4rem, 7.5vw, 6.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
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

Paper, warm secondary surfaces and wine accents carry through the profile, bibliography, archive and CV. Dark mode keeps the charcoal ground and rose links.

## Typography

The name and major headings use a bold DM Sans face. Source Serif 4 carries bibliographic and academic record titles. JetBrains Mono sets dates and paper metadata.

## Layout

On wide screens the name stretches across a central cutout of the original studio portrait. The introduction and newest preprint flank the photograph. A rounded navigation strip links to the three research areas. On smaller screens the title and role sit beside the portrait, followed by the introduction and paper.

## Components

The shared header centers the navigation on wide screens and includes a theme switch and contact action. A solid wine pill marks the primary action. The academic pages share the display hierarchy, labeled controls and ruled records. Paper links identify the abstract, PDF and DOI.
