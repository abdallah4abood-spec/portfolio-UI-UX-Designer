# Rendered QA

## Scope and status

Verified locally on 2026-11-02 with Node.js, an ephemeral local static server, and installed headless Chrome controlled through the Chrome DevTools Protocol. The runner uses Node built-ins only; no packages or build step are required.

These results apply to the local redesign. They do not establish that GitHub Pages deployment succeeded.

## Commands and observed results

```bash
node --test tests/site.test.mjs
```

Observed: 30 tests passed, 0 failed.

```bash
node tests/browser-qa.mjs
```

Observed:

- 63 responsive checks passed, 0 failed.
- 7 interaction checks passed, 0 failed.
- 22 page screenshots captured.
- 7 native SVG artwork captures rendered at 1440 × 960.
- No fatal runner error.

The machine-readable output is `docs/qa/results.json`.

## Responsive coverage

All seven public routes were checked at 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1600 px:

- `index.html`
- `projects/tabibi.html`
- `projects/sarh.html`
- `projects/khafif.html`
- `projects/masar.html`
- `projects/wusul.html`
- `projects/mizan.html`

Each route/width combination checked for horizontal overflow, broken images, duplicate IDs, unnamed controls, hidden primary content, local HTTP failures, console errors, and uncaught JavaScript exceptions.

## Interaction coverage

The browser runner verified:

1. The skip link receives the first Tab and navigates to the main content.
2. The mobile menu opens by keyboard and Escape restores trigger focus.
3. The mobile menu closes after navigation and outside click.
4. The theme control updates its semantics and survives reload.
5. System color scheme is respected when no preference is saved.
6. Copy email reports a useful status.
7. Reduced motion disables animation and smooth scrolling.

## Screenshot inventory

All files below are in `docs/qa/screenshots/`.

| Coverage | Files |
| --- | --- |
| Homepage, light and dark | `homepage-light-1440.png`, `homepage-light-390.png`, `homepage-dark-1440.png`, `homepage-dark-390.png` |
| Concept gallery | `concept-gallery-1440.png`, `concept-gallery-390.png` |
| Tabibi | `tabibi-light-1440.png`, `tabibi-light-390.png`, `tabibi-dark-1440.png`, `tabibi-dark-390.png` |
| Sarh | `sarh-light-1440.png`, `sarh-light-390.png` |
| Khafif | `khafif-light-1440.png`, `khafif-light-390.png` |
| Masar | `masar-light-1440.png`, `masar-light-390.png`, `masar-dark-1440.png`, `masar-dark-390.png` |
| Wusul | `wusul-light-1440.png`, `wusul-light-390.png` |
| Mizan | `mizan-light-1440.png`, `mizan-light-390.png` |

The homepage, gallery, all six case studies, sampled dark case studies, and mobile layouts were visually reviewed. The corrected 1200 × 630 social card at `assets/og-image.png` was also rendered and reviewed separately.

## Native artwork inventory

The following 1440 × 960 renders are in `docs/qa/artwork/` and were visually reviewed without page scaling or cropping:

- `khafif-screens.png`
- `masar-overview.png`
- `masar-flow.png`
- `wusul-overview.png`
- `wusul-flow.png`
- `mizan-overview.png`
- `mizan-flow.png`

## Visual issues found and corrected

- Social card: reduced the two amber-label lines from 27 px to 24 px after the second line exceeded its card; rerendered and confirmed the correction.
- Concept gallery: changed cropped 1.15-ratio thumbnails to uncropped 3:2 presentation so the proof sheets remain intact.
- Khafif artwork: moved the product and cart titles below the phone display island to remove Arabic ascender collisions.
- Wusul artwork: repositioned the desktop header label and reduced the fixed-width sidebar label to remove overlap.
- Mizan artwork: reduced the disclaimer size so it remains inside its panel.

## Limitations

- Automated checks and screenshot review are not a complete WCAG audit, screen-reader test, real-device test, or cross-browser certification.
- Browser automation used Chromium only. Safari, Firefox, assistive technology, touch hardware, and slow physical devices still need separate testing.
- Local route checks do not validate external product availability, third-party links, GitHub Actions, or GitHub Pages behavior.
- No Lighthouse score, real-user performance measurement, usability outcome, or accessibility conformance claim is made.
- Deployment has not been verified as part of this local QA run.
