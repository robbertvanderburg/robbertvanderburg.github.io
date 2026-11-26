# Responsive UX review

Robbert's papers, academic CV and email are now reachable in the homepage introduction. At 320 × 568 px, the first preprint starts at 474 px, 116 px earlier than on the live baseline. At 768 and 820 px, the research illustration is centered when the text and figure stack. At desktop sizes the name and portrait keep the same proportions as the outer margins grow. [Baseline audit](BASELINE.md) · [Test report](TEST-REPORT.md)

## Device-by-device assessment

The named devices describe CSS viewport sizes. Each row was exercised on Home, Publications, Academic CV and News, in both themes and all three Playwright engines. “Preprint top” is the measured distance in CSS pixels from the top of the homepage to its first paper. Screenshots open the full page.

| Device and viewport | Preprint top, before → after | Reviewed composition |
| --- | ---: | --- |
| Small smartphone · 320 × 568 | 590 → 474 | The full wordmark takes two lines. The institution gets its own row under the name and portrait. Four hero actions fit in two rows. [Home](screenshots/after/home-320x568-light.webp) |
| iPhone SE · 375 × 667 | 506 → 449 | A direct CV link sits beside Publications in the header. The compact CV index gives Education more space. [CV](screenshots/after/cv-375x667-dark.webp) |
| Modern iPhone · 390 × 844 | 510 → 432 | The portrait sits alongside the identity. The lead title, author list, resources and abstract disclosure are visible together. [Home](screenshots/after/home-390x844-light.webp) |
| Large smartphone · 430 × 932 | 521 → 400 | The larger phone fits the hero action row and the entire lead preprint above the first research section. [Home](screenshots/after/home-430x932-dark.webp) |
| Smartphone landscape · 844 × 390 | 505 → 396 | Full navigation and the two-column introduction fit. The short viewport scrolls past the header, leaving the screen available for reading. [Home](screenshots/after/home-844x390-light.webp) |
| iPad Mini portrait · 768 × 1024 | 503 → 376 | Compact navigation leaves space around the identity. The preprint year sits above the title and the 512 px figure centers under the research prose. [Home](screenshots/after/home-768x1024-dark.webp) |
| iPad Air portrait · 820 × 1180 | 504 → 379 | The bibliography keeps a separate year and venue column. The CV starts with a disclosure. [Publications](screenshots/after/publications-820x1180-light.webp) |
| iPad Pro portrait · 1024 × 1366 | 526 → 438 | Full navigation and the CV rail fit. The introduction and research figure each have two columns. [CV](screenshots/after/cv-1024x1366-light.webp) |
| iPad Mini landscape · 1024 × 768 | 526 → 438 | The same reading width retains the rail, with header clearance above the selected CV section. [CV](screenshots/after/cv-1024x768-dark.webp) |
| iPad Air landscape · 1180 × 820 | 549 → 490 | Long titles wrap within the paper column and leave year and venue aligned at the left. [Publications](screenshots/after/publications-1180x820-light.webp) |
| iPad Pro landscape · 1366 × 1024 | 585 → 497 | Profile and portrait share the opening spread. The first paper and the beginning of the research overview fit below. [Home](screenshots/after/home-1366x1024-dark.webp) |
| Laptop · 1280 × 800 | 567 → 497 | The news archive uses the same page margins for year labels, dated entries and footer groups. [News](screenshots/after/news-1280x800-light.webp) |
| MacBook · 1440 × 900 | 596 → 496 | The name occupies one line. Long paper titles stay within the serif reading column. [Home](screenshots/after/home-1440x900-light.webp) |
| Full HD desktop · 1920 × 1080 | 679 → 496 | Capping the name against its container removes the earlier two-line wrap. Diagram and prose stay aligned across the research section. [Home](screenshots/after/home-1920x1080-dark.webp) |
| QHD desktop · 2560 × 1440 | 679 → 496 | The paper area holds its maximum width. Bibliographic records and research text retain their reading measures. [Home](screenshots/after/home-2560x1440-light.webp) |

[Measurements across all routes and themes](results/geometry.json) · [Before screenshots](screenshots/before/) · [After screenshots](screenshots/after/)

## Resolved issues

**Navigation.** The masthead keeps the full name on internal pages. Publications and CV retain direct links in the compact layout. Escape returns focus to Menu. Resizing the focused trigger into full navigation transfers focus to Research, and collapsing a focused desktop panel returns focus to the trigger. Selecting a homepage section moves keyboard focus into that section. Short viewports scroll naturally. Testing also exposed an overlap between Publications and CV at 320 px with doubled text. Allowing those controls to wrap fixed the overlap.

**Publications and contact.** Publications is the primary hero action. Research, CV and Email follow in reading order. The footer groups academic work and profile links, with the university email beside the affiliation. The newest preprint remains driven by the bibliography and its keyed editorial summary. Each archive record emphasizes Robbert's name and exposes the available PDF, DOI and abstract. “Cite” reveals selectable text, clipboard feedback and an arXiv BibTeX link when available. Active search and year filters have a reset even when matches remain. The current year filter is hidden because all three papers are from 2026.

**Research and portrait.** A reader can follow the two ringed components inside one storm footprint to see how separated parts of a network can share exposure. The caption and alternative text identify the same components. The illustration is schematic. The profile uses the existing layered portrait and local fonts, with two additional WebP sizes. On a 375 px, 2× screen, the browser selected the 7,594-byte 160 px portrait.

**Academic CV.** The phone contents control occupies about 56 px when closed, down from 124 px. On a wider page, a persistent rail follows the record. Course links have 44 px touch height. The print layout keeps dates with their entries and fits the current verified content on one A4 page. The downloadable PDF includes the same teaching, research, education and talk records and retains its links to both slide decks. [Academic CV PDF](../../assets/downloads/robbert-van-der-burg-cv.pdf)

## Remaining verification

The regression suite and visual review cover simulated screen sizes on macOS. Physical iPhone and iPad Safari, VoiceOver and TalkBack remain open checks. A device pass should follow the keyboard and touch paths documented in the test report, especially portrait masking, rotation with the menu open and native PDF reading. Field INP and production Core Web Vitals require real traffic. The branch is local and production still serves the baseline.
