# Abdallah Almnaama — Working Proof Portfolio

A visual-first static portfolio for a UI/UX Designer & Frontend Developer. Built with semantic HTML, shared CSS, and dependency-free JavaScript; no build step or backend is required.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. On Windows, `py -m http.server 8000` is equivalent.

## Verify

```bash
node --test tests/site.test.mjs
node tests/browser-qa.mjs
git diff --check
```

The Node suite checks all seven public case-study routes, canonical metadata, local asset resolution, image alternatives and dimensions, concept-project boundaries, selected factual constraints, sitemap coverage, robots metadata, the social image, and the 404 page.

The browser runner uses Node built-ins and an installed Chrome or Edge executable. Set `CHROME_PATH` if the browser is not in a standard location. It starts its own local server, checks 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1600 px widths, exercises both themes and keyboard interactions, and replaces the evidence in `docs/qa/`. Actual results and limitations are recorded in `docs/qa/QA.md`.

## Structure

- `index.html` — editorial homepage, real work, concepts, services, process, about, and contact.
- `projects/*.html` — six complete case studies with explicit previous/next navigation.
- `css/style.css` — semantic light/dark tokens, layout, typography, components, case studies, and responsive rules.
- `js/main.js` — theme persistence, mobile navigation, copy-email feedback, current year, and active navigation.
- `assets/projects/` — genuine Tabibi/Sarh captures and the Khafif implementation-aware design visualization.
- `assets/concepts/` — original SVG interface screens for the three concept projects.
- `tests/site.test.mjs` — static integrity contracts.
- `docs/qa/` — browser QA evidence and screenshots.
- `docs/superpowers/` — design specification and implementation plan.

## Content and provenance

- **Tabibi:** genuine public demo capture. Team project; primary frontend responsibility with additional API, business-logic, and schema contributions. React, C#, .NET, PostgreSQL.
- **Sarh:** genuine running-application captures from the project repository, using fictional seed content. The product remains under development and some workflows are incomplete.
- **Khafif:** original SVG visualization based on the Expo implementation, design tokens, and documented flows. It is not a device screenshot. Demo data and test payments are not commercial activity.
- **Masar, Wusul, Mizan:** self-initiated **Concept Projects**. Their sample content is illustrative. Each case study includes assumptions, proposed decisions, validation questions, and Research & Design References.

Do not add unsupported client names, research findings, testimonials, adoption, revenue, or performance claims. Keep speculative and real work visibly distinct.

## Update content

- Edit semantic design tokens at the top of `css/style.css`.
- Add a project page under `projects/`, then add its homepage preview, sitemap URL, and static-test route.
- Keep all internal asset references relative. From `projects/`, use `../assets/`, `../css/`, and `../js/` so repository-subpath hosting works.
- Give raster and SVG images meaningful `alt`, `width`, and `height` attributes. Mark genuinely decorative images with empty alternatives.
- Preserve the single-`h1` structure, visible focus states, reduced-motion support, and no-JavaScript content access.

## Deploy to GitHub Pages

The existing workflow `.github/workflows/deploy.yml` publishes the repository root through GitHub Actions.

1. Confirm the working tree and remote before staging anything.
2. Commit the intended files on `main` and push to `origin/main`.
3. In repository **Settings → Pages**, select **GitHub Actions** as the source.
4. Wait for the Pages workflow, then verify the live site and representative case-study routes.

Expected deployment URL:

`https://abdallah4abood-spec.github.io/portfolio-UI-UX-Designer/`

Publishing commands, after reviewing the actual diff:

```bash
git add index.html 404.html css js assets projects tests docs README.md robots.txt sitemap.xml .gitignore .github/workflows/deploy.yml
git commit -m "Redesign portfolio around visual product case studies"
git push origin main
```

Never force-push. A local test result is not proof of deployment; verify the deployed URL before describing publishing as successful.
