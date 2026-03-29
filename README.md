# Academic Website — Jekyll + GitHub Pages

A clean, modern academic website with wine-red accent colors and dark/light mode support.

## Quick Setup

### 1. Create a GitHub repository

Create a new repository named `yourusername.github.io` (replace `yourusername` with your actual GitHub username).

### 2. Push this site

```bash
cd site
git init
git add .
git commit -m "Initial academic website"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

Go to your repository → **Settings** → **Pages** → set source to **GitHub Actions** (or "Deploy from a branch" → `main`).

Your site will be live at `https://yourusername.github.io` within a minute or two.

### 4. Configure your details

Edit `_config.yml` and fill in:

```yaml
author:
  name: Your Name
  email: your.email@vu.nl
  semantic_scholar: "YOUR_SEMANTIC_SCHOLAR_ID"   # ← Required for auto-publications
  google_scholar: "YOUR_GOOGLE_SCHOLAR_ID"
  orcid: "0000-0000-0000-0000"
  github: "yourusername"
  linkedin: "yourprofile"
```

#### Finding your Semantic Scholar author ID

1. Go to [semanticscholar.org](https://www.semanticscholar.org/)
2. Search for your name and find your profile
3. Your author ID is the number at the end of the URL:
   `https://www.semanticscholar.org/author/Your-Name/1234567` → ID is `1234567`

### 5. Add your photo

Replace `assets/images/profile-placeholder.svg` with your photo saved as `assets/images/profile.jpg`, then update `index.html`:

```html
<img src="{{ '/assets/images/profile.jpg' | relative_url }}" ...>
```

## Updating Content

### Add news items

Edit `_data/news.yml`:

```yaml
- date: 2026-04-01
  text: "Your news here. HTML is supported for <a href='...'>links</a> and <em>emphasis</em>."
```

### Edit your bio / CV

- **About page**: Edit `index.html`
- **CV page**: Edit `cv.html` — fill in dates, add teaching, talks, etc.
- **Publications**: Automatic from Semantic Scholar! Just set your author ID.

### Dark / Light Mode

The toggle in the nav bar persists the user's choice via `localStorage`. It also auto-detects system preference (`prefers-color-scheme`) as a default.

## Local Development

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.

## File Structure

```
├── _config.yml           # Site settings & author info
├── _data/
│   └── news.yml           # News items for the About page
├── _includes/
│   ├── nav.html            # Navigation bar
│   └── footer.html         # Footer
├── _layouts/
│   └── default.html        # Main page layout
├── assets/
│   ├── css/style.scss      # All styles (dark/light mode)
│   ├── js/theme.js         # Theme toggle logic
│   ├── js/publications.js  # Semantic Scholar fetcher
│   └── images/             # Profile photo goes here
├── index.html              # About page
├── publications.html       # Publications page
└── cv.html                 # CV page
```

## License

Feel free to use and modify this template for your own academic website.
