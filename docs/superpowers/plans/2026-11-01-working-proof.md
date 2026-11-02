# Working Proof Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing portfolio with an original, visual-first editorial site containing six honest case studies, responsive themes, original concept interfaces, and verified GitHub Pages delivery.

**Architecture:** Semantic static HTML pages share two focused stylesheets and one dependency-free JavaScript file. Real project images live in `assets/projects/`; concept interfaces are accessible HTML/CSS/SVG illustrations. Node's built-in test runner validates static integrity, while browser automation provides rendered evidence.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in `node:test`, GitHub Actions, Chrome DevTools/Playwright browser automation.

**Spec:** `docs/superpowers/specs/2026-11-01-working-proof-design.md`

## Global Constraints

- No framework, package install, backend, force-push, or second repository.
- All speculative work must say `Concept Project` and must not claim research participants, testing, adoption, or outcomes.
- Tabibi uses React, C#, .NET, PostgreSQL; never Node.js or MongoDB.
- Sarh remains under development with incomplete enrollment persistence and seeded demo content.
- Khafif remains in development with demo data/test payments and no unverified device/E2E claims.
- Essential content must render without JavaScript and respect reduced motion.
- All site assets and links must work below `/portfolio-UI-UX-Designer/`.

---

### Task 1: Static contract and real visual assets

**Files:**
- Create: `tests/site.test.mjs`
- Create: `assets/projects/*`
- Modify: `.gitignore`

**Interfaces:**
- Produces: optimized local real-project images and a Node test command used by every later task.

- [ ] **Step 1: Write failing static integrity tests**

Use `node:test`, `assert/strict`, `fs`, `path`, and `child_process`. Test all seven public HTML routes, local `href`/`src` targets, one `h1`, image `alt`, canonical metadata, concept labels, and forbidden real-project claims. Initial run must fail because `projects/masar.html`, `projects/wusul.html`, and `projects/mizan.html` do not exist.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const pages = ['index.html','projects/tabibi.html','projects/sarh.html','projects/khafif.html','projects/masar.html','projects/wusul.html','projects/mizan.html'];
for (const page of pages) test(`${page} is a complete public page`, () => {
  assert.ok(existsSync(page), `${page} missing`);
  const html = readFileSync(page, 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /rel="canonical"/);
});
```

- [ ] **Step 2: Run tests and confirm the expected failure**

Run: `node --test tests/site.test.mjs`
Expected: FAIL naming the three missing concept pages.

- [ ] **Step 3: Capture and optimize genuine project assets**

Capture Tabibi's public Arabic doctors screen without changing its data. Copy Sarh's genuine `home.png`, `centers.png`, `admin-dashboard.png`, `parent-dashboard.png`, and mobile drawer capture from the audited clone. Convert large PNGs to WebP with an available local tool or browser screenshot pipeline. Do not use the outdated Sarh cover.

- [ ] **Step 4: Verify asset dimensions and readable crops**

Run the static test again and inspect each image. Expected: only missing-page/content assertions remain; every retained image opens and has a meaningful crop.

### Task 2: Design system and interaction foundation

**Files:**
- Rewrite: `css/style.css`
- Create: `css/mockups.css`
- Rewrite: `js/main.js`
- Modify: `assets/favicon.svg`

**Interfaces:**
- Produces: semantic tokens `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-ink`; shared `.shell`, `.section`, `.button`, `.proof-sheet`, and mockup classes.

- [ ] **Step 1: Add foundation assertions**

Assert that styles include `[data-theme="dark"]`, `:focus-visible`, `prefers-reduced-motion`, and that JavaScript contains `localStorage`, `aria-expanded`, and `aria-live` handling. Run and confirm failure where behavior is absent.

- [ ] **Step 2: Implement tokens and resilient layout**

Use `clamp()` for type/spacing, `minmax(0, 1fr)` for grid children, and separate horizontal gutter from vertical section padding:

```css
.shell { width: min(100% - 2 * var(--gutter), 1440px); margin-inline: auto; }
.section { padding-block: var(--section-space); }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
```

- [ ] **Step 3: Implement interaction behavior**

Theme updates `data-theme`, `aria-label`, `aria-pressed`, and `meta[name=theme-color]`; menu supports Escape and link-close; email copy uses `navigator.clipboard` only in a secure context and retains the visible mailto link. No reveal is required to expose content.

- [ ] **Step 4: Run static tests**

Run: `node --test tests/site.test.mjs`
Expected: foundation assertions PASS; unfinished-page assertions may remain.

### Task 3: Homepage and reusable product proof sheets

**Files:**
- Rewrite: `index.html`
- Modify: `css/style.css`, `css/mockups.css`

**Interfaces:**
- Consumes: design tokens, shared components, local real images.
- Produces: links and preview vocabulary reused by all case studies.

- [ ] **Step 1: Add homepage content assertions**

Assert the presence of `Designed to make sense.`, three real case-study links, three concept links, `Concept Project`, services, process, about, contact, and the supplied email/social URLs. Run before rewrite and confirm failure.

- [ ] **Step 2: Build the complete homepage**

Use one visual-first hero, three asymmetric real-project rows, a distinct concept gallery, service positioning, sequential process, factual about/capabilities, and direct contact. Mockups that duplicate nearby link text use `aria-hidden="true"`; informative real screenshots use meaningful alt text.

- [ ] **Step 3: Run tests and inspect responsive composition**

Run: `node --test tests/site.test.mjs`
Expected: homepage assertions PASS. Serve with `python -m http.server 8000` and inspect hero/gallery at desktop and mobile before continuing.

### Task 4: Six visual case studies

**Files:**
- Rewrite: `projects/tabibi.html`, `projects/sarh.html`, `projects/khafif.html`
- Create: `projects/masar.html`, `projects/wusul.html`, `projects/mizan.html`
- Modify: `css/style.css`, `css/mockups.css`

**Interfaces:**
- Consumes: shared header/footer, real assets, concept-screen classes.
- Produces: six complete, navigable case studies with previous/next work links.

- [ ] **Step 1: Add case-study content tests**

Require responsibility/status headings in real projects and `Research & Design References`, `Assumptions`, and `Concept Project` in every concept. Forbid `Node.js`/`MongoDB` in Tabibi and unsupported metrics/testimonials across the site. Confirm failure before implementation.

- [ ] **Step 2: Build real project narratives**

Present screenshots/design visualizations at meaningful sizes with captions that identify genuine capture versus reconstruction. Explain only decisions supported by the audited implementation. Include current limitations and relevant repository/live links.

- [ ] **Step 3: Build concept narratives and actual screens**

Masar includes downloadable plan, offline progress, and sync states. Wusul includes task list, evidence upload, check answers, and error recovery. Mizan includes cash overview, commitments, and cautious scenario comparison. Use coherent shared components within each concept and cite the verified references in the spec.

- [ ] **Step 4: Run all static tests**

Run: `node --test tests/site.test.mjs`
Expected: PASS for all seven pages and all factual guardrails.

### Task 5: Metadata, documentation, and deployment contract

**Files:**
- Create: `404.html`, `sitemap.xml`, `assets/og-image.png`
- Modify: `robots.txt`, `README.md`, `.github/workflows/deploy.yml` only if validation requires a change

**Interfaces:**
- Produces: complete GitHub Pages source with canonical/OG metadata and reproducible QA commands.

- [ ] **Step 1: Add route/metadata assertions**

Validate every sitemap URL against a local page, the exact repository-subpath canonical base, robots sitemap URL, and OG image existence. Confirm any missing artifact fails.

- [ ] **Step 2: Implement metadata and documentation**

Document local serving, Node tests, project updates, image provenance, concept ethics, exact deployment URL, and publishing commands. Keep the existing root-artifact workflow unless a concrete problem requires modification.

- [ ] **Step 3: Run full static verification**

Run: `node --test tests/site.test.mjs`
Expected: all tests PASS.

### Task 6: Rendered QA, refinement, and publishing evidence

**Files:**
- Create: `docs/qa/QA.md`, `docs/qa/*.png`

**Interfaces:**
- Consumes: locally served static site.
- Produces: screenshot evidence, measured browser results, and a truthful publishing handoff.

- [ ] **Step 1: Exercise browser behavior**

At each required width (320, 375, 390, 430, 768, 1024, 1280, 1440, 1600), assert `document.documentElement.scrollWidth <= innerWidth`. Test light/dark themes, menu keyboard behavior, internal routes, reduced motion, and missing-image/console errors.

- [ ] **Step 2: Capture and critique screenshots**

Capture desktop/mobile homepage light/dark, project gallery, all three real case studies, and all three concept case studies. Review hierarchy, overflow, cropping, text contrast, and mockup legibility; refine CSS/content and rerun static tests after each material correction.

- [ ] **Step 3: Record evidence and inspect remote state**

Write actual results and limitations to `docs/qa/QA.md`. Run `git status --short`, `git diff --check`, `git diff --stat`, and `git ls-remote origin refs/heads/main`. Do not commit/push without explicit authorization at the moment of publishing; never force-push.

- [ ] **Step 4: Verify deployment only if publishing occurs**

If an authorized push is completed, watch the Pages workflow and inspect the deployed URL and representative case-study routes. Otherwise state that the redesign is locally verified and provide:

```bash
git add index.html 404.html css js assets projects tests docs README.md robots.txt sitemap.xml .gitignore .github/workflows/deploy.yml
git commit -m "Redesign portfolio around visual product case studies"
git push origin main
```
