# Verification report

Tested on 26 November 2026. The baseline was the live Pages revision `b93fa1e`. The revised pages were built locally with the repository's GitHub Pages gem 233 and Jekyll 3.10.0. [Device-by-device review](UX-REVIEW.md) · [Playwright results](results/playwright.json) · [Performance measurements](results/lighthouse.json)

## Browser and interaction coverage

| Check | Scope and result |
| --- | --- |
| Browser regression | 54 passing cases, 18 per engine, on Chrome 158.0.8127.38, Firefox 159.0 and Playwright WebKit 27.2. Four routes × 15 viewports × two themes × three engines = 360 route and layout combinations. |
| Intermediate widths | Per-page checks span split-view widths and adjacent boundaries, including 831, 832 and 833 px around the header change. The suite checks reflow, offscreen content and intersections between distinct controls and layout columns. Intentional portrait/network layering is excluded. |
| Text and zoom | All four routes passed with 200% root text at 320 and 640 px. A separate native macOS WKWebView at 200% page zoom reported 640 CSS px in a 1280 px window and 320 CSS px in a 640 px window, with document width equal to layout width on all eight visits. |
| Navigation | Tested opening the disclosure, Escape, outside click, section selection, focus transfer across breakpoints, skip navigation, rotation, touch input, theme switching and persistence. |
| Bibliography | Tested positive and empty searches, announced counts, reset and focus return, year plus text filters, native abstract and citation disclosures, and clipboard success and denial. An isolated Jekyll build with two years, an undated record, missing authors and a 133-character DOI also passed the narrow layout and filtering checks. |
| Academic CV | Section links, disclosure, wide rail and print media passed. The tagged PDF is one A4 page with 12 link annotations, including both slide destinations. The PDF was rendered and inspected. Its receipt matches the print text, visible links and file hash. |
| Progressive enhancement | All four pages remain readable with JavaScript disabled, including the full bibliography and navigation. The suite checks internal routes, fragment targets, PDF signatures and failed requests. Page and console error checks passed. |
| Screenshot comparison | 120 full-page WebPs before and 120 after. A second capture of the revised site matched all 120 references in the same environment. Review included first-view contact sheets for every page and theme, plus detailed inspection of the phone header, portrait, disclosure controls, research figure, footer and print page. |

### Keyboard and touch observations

On the 390 px home page, a keyboard-only walkthrough reached Skip to content, the home wordmark, Publications, Academic CV and Menu in sequence. Enter opened Menu, Tab reached Research, and Escape returned focus to Menu. Activating Research placed focus in the research section. The next Tab reached the project link in its prose. Touch taps in mobile-emulated WebKit and Chrome changed theme, followed Publications, opened a citation and navigated from the CV contents to Education.

A draft run exposed the enlarged-text header collision. A separate WebKit run exposed a timing-sensitive test that counted every animation in the document after a live preference change. The regression now checks the authored network trace and menu transitions under both motion preferences.

## Accessibility

Axe-core 4.14.0 ran WCAG A/AA rules through WCAG 2.2. The baseline had zero reported violations in 24 Chromium scans. The revised suite ran 24 page/viewport/theme scans and three interactive-state scans per engine. All 81 scans returned zero reported violations. The interactive states covered the open menu, empty search and expanded citation. [Baseline axe findings](results/baseline-accessibility.json) · [Revised results](results/playwright.json)

| Foreground or control on paper | Light contrast | Dark contrast |
| --- | ---: | ---: |
| Body text | 15.74:1 | 15.52:1 |
| Secondary text | 7.53:1 | 9.34:1 |
| Wine links and focus indicators | 8.82:1 | 8.77:1 |
| Field boundary | 3.68:1 | 5.92:1 |

The ratios above use relative luminance of the implemented sRGB tokens. Wine on the preprint surface measures 7.87:1 in light mode and 7.61:1 in dark mode. Both print rendering and website zoom received separate checks. A full accessibility conformance assessment, including assistive-technology users, remains outside these results.

## Performance

Lighthouse 13.6.0 ran against the locally served production builds in headless Chrome. Each route was measured once with the default mobile preset and once with the desktop preset, using simulated throttling. The scores were **100 in Performance, Accessibility, Best Practices and SEO** in each of the eight final runs. The eight baseline runs also scored 100 across the four categories.

| Page | Mobile LCP, before → after | Desktop LCP, before → after | Final mobile CLS | Final desktop CLS |
| --- | ---: | ---: | ---: | ---: |
| Home | 1.09 → 1.08 s | 0.54 → 0.54 s | 0 | 0 |
| Publications | 1.05 → 1.05 s | 0.25 → 0.26 s | 0.00067 | 0.00031 |
| Academic CV | 0.93 → 0.94 s | 0.25 → 0.25 s | 0.00037 | 0 |
| News | 0.92 → 0.92 s | 0.25 → 0.25 s | 0 | 0.00015 |

Total blocking time was 0 ms in all eight revised runs. The differences between single runs are small enough that they should not be interpreted as changes in real-user speed. The measurements contain recorded timestamps, presets, scores and metric values. Field INP and production LCP/CLS remain unmeasured. [Lighthouse data](results/lighthouse.json)

## Links, content and build

- On the revised pages, 25 distinct external destinations returned HTTP 200 after redirects. The Semantic Scholar profile returned HTTP 202, which confirms receipt of the request but leaves the destination content unconfirmed. All three added arXiv BibTeX destinations also returned citation records matching the linked identifiers. [HTTP observations](results/external-links.json)
- The existing publication synchronization script ran against Semantic Scholar in an isolated copy. It produced three papers and a byte-identical YAML file, SHA-256 `10234b8ff081eebc5d99cd208e09403d953cb347b4aaa6d3aaf7e0b20d40273d`. The workflow, exclusions and academic source records have no changes on the feature branch.
- The production build generated the existing four page URLs, local fonts, robots file, sitemap, structured data, verification file and original slide PDFs. Audit screenshots, reports and development dependencies are excluded from the published site. The original backup and branch creation precede the implementation. [Production baseline](BASELINE.md)

## Reproduce

Install the repository's Ruby dependencies, Node development dependencies and Playwright browsers. The browser suite starts its own Jekyll server on loopback. To use an existing local build, set `SITE_URL`. This audit used `CHROMIUM_CHANNEL=chrome` for the installed Chrome browser.

```sh
bundle install
npm ci
npx playwright install chromium firefox webkit
JEKYLL_ENV=production bundle exec jekyll build
npm test
npm run cv:pdf -- --check
python3 tests/check-links.py _site
```

For screenshot comparison, install the WebP command-line utility `cwebp` and serve the revision under test. The recorded captures used cwebp 1.6.0, a device scale factor of 1, reduced motion, decoded images and loaded local fonts. Exact comparisons depend on matching browser, OS/font rendering and encoder versions.

```sh
# First terminal
JEKYLL_ENV=production bundle exec jekyll serve --no-watch
# Second terminal, using the same browser channel as the reference
CHROMIUM_CHANNEL=chrome npm run audit:compare
```

The capture command is `npm run audit:capture -- after`. To repeat the baseline, serve a separate checkout of the backup tag, set `SITE_URL` to that server and pass `before` to the capture command from this branch. The generator writes references, while the comparison command reads them.

To repeat Lighthouse, use version 13.6.0 on each local route. Pass `--only-categories=performance,accessibility,best-practices,seo --chrome-flags=--headless --output=json`, adding `--preset=desktop` for the desktop pass. Use a production build for canonical URLs and PDF generation.

## Limits and recommended checks

No physical iPhone, iPad, mobile Safari app or human screen-reader session was exercised. WebKit rendering, native page zoom and emulated touch provide distinct evidence for those paths. A short physical Safari/VoiceOver pass should cover rotation, menu focus, the diagram description and the PDF download. Real-user performance could be assessed after an approved release if sufficient traffic is available.
