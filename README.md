# Academic Website

Personal academic website built with Jekyll and hosted on GitHub Pages.

## File overview

```
├── _config.yml                  # Site-wide settings: name, bio, social links,
│                                  Semantic Scholar ID, SEO metadata, plugins
│
├── _layouts/
│   └── default.html             # Master HTML template wrapping every page
│                                  (nav, footer, theme toggle, JSON-LD structured data)
│
├── _includes/
│   ├── nav.html                 # Top navigation bar with dark/light mode toggle
│   └── footer.html              # Page footer
│
├── _data/
│   └── news.yml                 # News items shown on the About page
│                                  (add entries here to announce papers, talks, etc.)
│
├── assets/
│   ├── css/
│   │   └── style.scss           # All styling — colors, typography, layout, dark/light
│   │                              mode via CSS custom properties
│   ├── js/
│   │   ├── theme.js             # Dark/light toggle logic (persists choice, detects
│   │   │                          system preference)
│   │   └── publications.js      # Fetches papers from Semantic Scholar API, renders
│   │                              them with search and year filter
│   └── images/                  # Profile photo and other images
│
├── index.html                   # About page — profile card, research interests, news
├── publications.html            # Publications page — auto-populated from Semantic Scholar
├── cv.html                      # CV page — education timeline, research, skills, teaching
│
├── favicon.svg                  # Browser tab icon (wine-red "R")
├── robots.txt                   # Tells search engines where to find sitemap.xml
├── Gemfile                      # Ruby dependencies for Jekyll
└── README.md                    # This file
```

## How to update content

For big changes, create a new branch (this way, the website is not changed "live").

**News items** — edit `_data/news.yml`, newest entry first:
```yaml
- date: 2026-04-01
  text: "Your update here. HTML like <a href='...'>links</a> and <em>emphasis</em> works."
```

**Bio and research interests** — edit `index.html` directly.

**CV entries** — edit `cv.html`. Follow the existing pattern for timeline entries and cards.

**Publications** — automatic. Set your Semantic Scholar author ID in `_config.yml` under `author.semantic_scholar`. Papers update on each page load.

**Profile photo** — replace the placeholder in `assets/images/` and update the `<img>` src in `index.html`.

**Social/contact links** — edit the author fields in `_config.yml`. Links with empty values are hidden automatically.

## Local development

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.
