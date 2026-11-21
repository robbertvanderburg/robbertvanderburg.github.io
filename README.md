# robbertvanderburg.github.io

Personal academic website of Robbert van der Burg, PhD candidate in the Department of Mathematics at VU University Amsterdam. It is built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.

**Live site:** <https://robbertvanderburg.github.io>

## Pages

| Page         | Source              | Content                                                     |
| ------------ | ------------------- | ----------------------------------------------------------- |
| About        | `index.html`        | Academic profile, newest preprint, research and recent news   |
| News         | `news.html`         | Full list of news items from `_data/news.yml`               |
| Publications | `publications.html` | Paper list rendered from `_data/publications.yml`           |
| CV           | `cv.html`           | Education, research, teaching and talks              |

## File overview

```
├── _config.yml                  # Site-wide settings: title, author info, social and
│                                  scholar IDs (Semantic Scholar, Google Scholar, ORCID),
│                                  excluded papers, plugins
│
├── _layouts/
│   └── default.html             # Master template wrapping every page
│                                  (head/SEO, nav, footer, JSON-LD structured data)
│
├── _includes/
│   ├── nav.html                 # Top navigation bar with dark/light mode toggle
│   └── footer.html              # Academic footer and secondary navigation
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
│   │   └── publications.js      # Search and year filter on the Publications page
│   └── images/                  # Portrait, favicon and static network illustration
│
├── scripts/
│   └── fetch_publications.py    # Pulls papers from Semantic Scholar → _data/publications.yml
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
  category: Seminar
  title: Talk title
  text: "Summary of the talk."
  venue: Seminar name
  slides: /My_Talk.pdf
```

- Wrap `text` in double quotes and use single quotes inside the HTML.
- A YAML syntax error (for example a stray `"`) **breaks the whole site build**. Check the file before pushing; see [Checking your changes](#checking-your-changes).
- The About page shows the three newest items. The News page shows all of them.

### Talk slides and other files

Put the PDF in the repository root and set the entry’s `slides` field to its root-relative path. An entry with slides also appears under talks in the CV.

### Publications

Publications update **automatically**. Every day at 04:17 UTC, the GitHub Action in `.github/workflows/update-publications.yml` runs `scripts/fetch_publications.py`. The script pulls your papers from [Semantic Scholar](https://www.semanticscholar.org/author/2491518526) (author ID in `_config.yml` under `author.semantic_scholar`) and writes them to `_data/publications.yml`. If the list changed, the action commits the file and the site rebuilds. Because the list is part of the static HTML, search engines see every paper.

- **Run it now:** on GitHub, open **Actions → Update publications → Run workflow**.
- **Run it locally:**
  ```bash
  pip install requests pyyaml
  python scripts/fetch_publications.py
  ```
  Then commit `_data/publications.yml`.
- Newly posted papers can take a few days to show up on Semantic Scholar. Wrong or missing details should be corrected there.
- **Hide a paper:** add its Semantic Scholar paper ID (the last part of a `semanticscholar.org/paper/...` URL) to `semantic_scholar_exclude` in `_config.yml`. Better still, remove it from your claimed author page on Semantic Scholar.
- The anonymous Semantic Scholar API is rate limited, so the script retries on errors. If runs keep failing, [request a free API key](https://www.semanticscholar.org/product/api#api-key-form) and add it as a repository secret named `S2_API_KEY` (**Settings → Secrets and variables → Actions**); the workflow picks it up automatically.
- Don't edit `_data/publications.yml` by hand, because the next run overwrites it.
- GitHub pauses scheduled actions in repositories with no activity for 60 days. If that happens, re-enable the workflow from the Actions tab.
- Run `git pull` before you start editing, because the bot may have pushed a commit since your last pull.

### Bio, research interests, CV

- **Bio and research interests:** edit `index.html`.
- **CV:** edit `cv.html` and copy the pattern of the existing education and teaching entries.
- **Profile photo:** add the image to `assets/images/` and update the `<img>` `src` in `index.html`.
- **Contact and social links:** edit the `author` fields in `_config.yml`. Links with an empty value are hidden.

### Styling

All colours are CSS custom properties at the top of `assets/css/style.scss`, with a light and a dark set. The newest preprint uses a static network illustration in `assets/images/network-study.svg`.

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
