# robbertvanderburg.github.io

Personal academic website of Robbert van der Burg, PhD candidate in the Department of Mathematics at VU University Amsterdam. It is built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.

**Live site:** <https://robbertvanderburg.github.io>

## Pages

| Page         | Source              | Content                                                     |
| ------------ | ------------------- | ----------------------------------------------------------- |
| About        | `index.html`        | Profile card, research interests, three latest news items   |
| News         | `news.html`         | Full list of news items from `_data/news.yml`               |
| Publications | `publications.html` | Paper list fetched live from Semantic Scholar               |
| CV           | `cv.html`           | Education timeline, research, skills, teaching              |

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
│   └── footer.html              # Page footer (also loads the network background)
│
├── _data/
│   └── news.yml                 # News items, newest first (shown on About and News)
│
├── assets/
│   ├── css/style.scss           # All styling: colours, typography, layout, and dark/light
│   │                              mode via CSS custom properties
│   ├── js/
│   │   ├── theme.js             # Dark/light toggle (remembers the choice, follows the
│   │   │                          system preference by default)
│   │   ├── network.js           # Animated network graph drawn on the header canvas
│   │   └── publications.js      # Fetches papers from Semantic Scholar and renders them
│   │                              with search and year filter on the Publications page
│   └── images/                  # Profile photo and favicons
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

Publications update **automatically**. The Publications page fetches your papers in the visitor's browser from the [Semantic Scholar API](https://api.semanticscholar.org/), using the author ID in `_config.yml` under `author.semantic_scholar`. There is nothing to run or commit: once a paper appears on your [Semantic Scholar author page](https://www.semanticscholar.org/author/2491518526), it appears on the site.

- **Hide a paper:** add its Semantic Scholar paper ID (the last part of a `semanticscholar.org/paper/...` URL) to `semantic_scholar_exclude` in `_config.yml`. Better still, remove it from your claimed author page on Semantic Scholar, which fixes it everywhere.
- **Missing or wrong paper details:** correct them on Semantic Scholar; newly posted papers can take a few days to be indexed.
- Each browser caches the list for a day, so changes may take up to a day to show for returning visitors.
- The anonymous API is rate limited. The page retries automatically and falls back to the cached copy; if both fail, it links to Semantic Scholar instead.
- Because the list is loaded with JavaScript, it is not part of the static HTML that search engines index.

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
