# robbertvanderburg.github.io

Personal academic website of Robbert van der Burg, PhD candidate in the Department of Mathematics at VU University Amsterdam. It is built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.

**Live site:** <https://robbertvanderburg.github.io>

## Pages

| Page         | Source              | Content                                                     |
| ------------ | ------------------- | ----------------------------------------------------------- |
| About        | `index.html`        | Profile card, research interests, three latest news items   |
| News         | `news.html`         | Full list of news items from `_data/news.yml`               |
| Publications | `publications.html` | Paper list rendered from `_data/publications.yml`           |
| CV           | `cv.html`           | Education timeline, research, skills, teaching              |

## File overview

```
├── _config.yml                  # Site-wide settings: title, author info, social and
│                                  scholar IDs (OpenAlex, Google Scholar, ORCID), plugins
│
├── _layouts/
│   └── default.html             # Master template wrapping every page
│                                  (head/SEO, nav, footer, JSON-LD structured data)
│
├── _includes/
│   ├── nav.html                 # Top navigation bar with dark/light mode toggle
│   └── footer.html              # Page footer (also loads the network background)
│
├── _data/
│   ├── news.yml                 # News items, newest first (shown on About and News)
│   └── publications.yml         # AUTO-GENERATED publication list — do not edit by hand
│
├── assets/
│   ├── css/style.scss           # All styling: colours, typography, layout, and dark/light
│   │                              mode via CSS custom properties
│   ├── js/
│   │   ├── theme.js             # Dark/light toggle (remembers the choice, follows the
│   │   │                          system preference by default)
│   │   ├── network.js           # Animated network graph drawn on the header canvas
│   │   └── publications.js      # Search and year filter on the Publications page
│   └── images/                  # Profile photo and favicons
│
├── scripts/
│   └── fetch_publications.py    # Pulls works from the OpenAlex API → _data/publications.yml
│
├── .github/workflows/
│   └── update-publications.yml  # Daily GitHub Action that runs the script above and
│                                  commits any changes
│
├── *.pdf                        # Talk slides, linked from news items
├── googlec7394654ebbf34ba.html  # Google Search Console verification — keep it
├── robots.txt                   # Points search engines to sitemap.xml
└── Gemfile                      # Ruby dependencies (github-pages, SEO tag, sitemap)
```

## Updating content

For larger changes, work on a separate branch. Every push to `main` goes live.

### News

Add an entry at the **top** of `_data/news.yml`:

```yaml
- date: 2026-04-01
  text: "<b>Headline:</b> Your update here. HTML such as <a href='...'>links</a> and <em>emphasis</em> works."
```

- Wrap `text` in double quotes and use single quotes inside the HTML.
- A YAML syntax error (for example a stray `"`) **breaks the whole site build**. Check the file before pushing; see [Checking your changes](#checking-your-changes).
- The About page shows the three newest items. The News page shows all of them.

### Talk slides and other files

Put the PDF in the repository root and link to it from a news item:

```html
Slides <a href='My_Talk.pdf' download='My_Talk_Robbert'>here</a>.
```

### Publications

Publications update **automatically**. Every day at 04:17 UTC, the GitHub Action in `.github/workflows/update-publications.yml` runs `scripts/fetch_publications.py`. The script pulls your works from [OpenAlex](https://openalex.org/) (author ID in `_config.yml` under `author.openalex`) and writes them to `_data/publications.yml`. If the list changed, the action commits the file and the site rebuilds. Because the list is part of the static HTML, search engines see every paper.

- **Run it now:** on GitHub, open **Actions → Update publications → Run workflow**.
- **Run it locally:**
  ```bash
  pip install requests pyyaml
  python scripts/fetch_publications.py
  ```
  Then commit `_data/publications.yml`.
- Newly posted papers can take a few days to show up in OpenAlex.
- Don't edit `_data/publications.yml` by hand, because the next run overwrites it.
- GitHub pauses scheduled actions in repositories with no activity for 60 days. If that happens, re-enable the workflow from the Actions tab.
- Run `git pull` before you start editing, because the bot may have pushed a commit since your last pull.

### Bio, research interests, CV

- **Bio and research interests:** edit `index.html`.
- **CV:** edit `cv.html` and copy the pattern of the existing timeline entries and cards.
- **Profile photo:** add the image to `assets/images/` and update the `<img>` `src` in `index.html`.
- **Contact and social links:** edit the `author` fields in `_config.yml`. Links with an empty value are hidden.

### Styling

All colours are CSS custom properties at the top of `assets/css/style.scss`, with a light and a dark set. The background network in `assets/js/network.js` reads the current theme and has its own colour values in `getColors()`.

## Local development

Requires Ruby (3.x) and Bundler.

```bash
bundle install
bundle exec jekyll serve      # add --livereload to refresh on save
```

Then open <http://localhost:4000>. The built site goes to `_site/`, which git ignores.

Changes to `_config.yml` only take effect after you restart `jekyll serve`.

### Checking your changes

```bash
# Check that the news file is valid YAML
ruby -ryaml -rdate -e 'YAML.load_file("_data/news.yml", permitted_classes: [Date]); puts "ok"'

# Full production build: fails loudly on errors
bundle exec jekyll build
```

## Deployment

GitHub Pages builds and deploys the site automatically on every push to `main`. If a deploy fails, see the **Actions** tab of the repository (the "pages build and deployment" run).
