# Portfolio: Abdallah Almnaama

Static portfolio (HTML, CSS, JavaScript; no build step) for a UI/UX Designer & Frontend Developer.

## Run locally
`python3 -m http.server 8000`, then open http://localhost:8000

## Deploy to GitHub Pages
1. Create a repository (for example `portfolio`) and push these files to `main`.
2. In Settings > Pages, set Source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` publishes the site. Expected URL: `https://abdallah4abood-spec.github.io/portfolio/`.
All asset paths are relative, so any repository name works.

## Update content
- Design tokens (light and dark): top of `css/style.css`.
- Home page: `index.html`. Case studies: `projects/*.html`.
- Add a project: copy a file in `projects/`, add a card to the grid in `index.html`.
- Real screenshots: put images in `assets/` and replace the `.vis` blocks (keep the alt text meaningful).
- After deployment, add `<link rel="canonical">` and an `og:image` to each page head.
