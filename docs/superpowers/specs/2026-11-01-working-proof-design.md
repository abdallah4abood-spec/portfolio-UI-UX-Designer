# Working Proof — Portfolio Redesign Specification

**Date:** 2026-11-01
**Owner:** Abdallah Almnaama
**Delivery:** Static GitHub Pages site; no backend or build step.

## Product and audience

This is the professional portfolio of Abdallah Almnaama, UI/UX Designer & Frontend Developer. Its primary audiences are potential freelance clients, product teams, and recruiters. Its single job is to make Abdallah's product thinking and implementation quality visible, then provide a low-friction route to email contact.

## Art direction: Working Proof

The site treats product work as annotated proof rather than decorative thumbnails. The signature element is a layered “proof sheet”: genuine product interfaces and original concept screens are composed as working artifacts with cobalt callouts that correspond to concrete design decisions.

- **Palette:** mineral `#EDF1EF`, paper `#F8FAF7`, ink `#13201D`, cobalt `#3155D9`, amber `#F2B84B`; dark ink `#0D1618`, raised `#152225`, pale text `#EDF4F0`, periwinkle `#9AADFF`, amber `#FFD078`.
- **Type:** Bricolage Grotesque for expressive display, Onest for readable interface/body copy, IBM Plex Mono for folio labels and evidence annotations.
- **Layout:** a disciplined twelve-column editorial grid with asymmetric project compositions. Numbering is reserved for sequential processes and case-study evidence indexes.
- **Signature:** product proof sheets with restrained rotation, cropped interface detail, and short annotations tied to actual UX decisions.
- **Motion:** one composed entrance and small interface feedback only. Content never depends on reveal JavaScript. Reduced-motion users receive immediate content.

This intentionally avoids the generic cream/serif/terracotta portfolio, acid-on-black creative-developer treatment, and dense broadsheet imitation.

## Information architecture

### Homepage

1. Persistent navigation: Work, Services, Process, About, Contact; theme and accessible mobile menu.
2. Hero: “Designed to make sense.” Role, concise positioning, Work and Email actions, and a visual proof sheet using real project imagery.
3. Selected work: Tabibi, Sarh, Khafif with distinct large visuals, factual role/status boundaries, and case-study links.
4. Independent design explorations: Masar, Wusul, Mizan. Every preview and page is labelled **Concept Project**.
5. Services: product UX and UI, responsive frontend, design-system cleanup. No unsupported claims or packaged pricing.
6. Process: Frame, Structure, Design, Build, Verify. Described as a general approach, not invented project history.
7. About and capabilities grounded in supplied education and project evidence.
8. Contact: direct email, GitHub, LinkedIn, and a short project-inquiry prompt.

### Real case studies

- **Tabibi:** live healthcare platform; genuine Arabic/RTL interface capture. React, C#, .NET, PostgreSQL. Team project; Abdallah worked primarily on frontend with API, business-logic, and schema contributions. Never list Node.js or MongoDB. Never repeat simulation figures as adoption.
- **Sarh:** Arabic-first educational directory and management platform. Next.js 14, React 18, TypeScript, PostgreSQL, Prisma, Tailwind CSS; an AI service exists in the repository. Real screenshots use fictional seed data. Search/filter/sort/pagination are implemented; enrollment persistence and some portal features are incomplete. No public live-demo claim.
- **Khafif:** Arabic-first low-bandwidth shopping app in development. Expo, React Native, TypeScript, Expo Router, TanStack Query, Medusa v2, PostgreSQL, Docker. Product visuals are labelled design visualizations based on implementation, not device screenshots. Demo catalog and test payments are not commercial activity. No unverified test totals or device/E2E claims.

Each real case study includes overview, context, responsibility boundary, interface evidence, UX decisions, implementation notes, current limitations, and next steps.

### Concept case studies

All concepts are self-initiated speculative design work. Their sample names, content, and data are illustrative. No user research, adoption, testing, or business outcomes are claimed.

- **Masar:** offline-first study planning for intermittent connectivity. Key flows: download a weekly plan, complete work locally, understand sync state. References: web.dev Offline UX guidelines and WCAG status messages.
- **Wusul:** accessible public-service application tracker. Key flows: understand tasks, upload evidence, review answers, recover from errors. References: GOV.UK Task list, Check answers, Error summary, and WCAG 2.2.
- **Mizan:** variable-income planning for freelancers. Key flows: separate committed costs, understand available cash, compare a cautious scenario. References: CFPB financial well-being report and Penn State Extension guidance on irregular income.

Each concept includes a brief, category observations, explicit assumptions, proposed decisions, coherent interface screens, accessibility considerations, ethical boundaries, next validation questions, and Research & Design References with links.

## Technical architecture

Use semantic HTML pages, shared CSS, and dependency-free JavaScript. `css/style.css` owns tokens, layout, navigation, content, and responsive rules. `css/mockups.css` owns product proof sheets and concept interface illustrations. `js/main.js` owns theme, mobile menu, copy-email feedback, current year, and nonessential progressive enhancement.

All internal references use relative paths, including `../` from `projects/`. Case studies remain explicit `.html` routes. GitHub Actions publishes the repository root. Canonical and Open Graph URLs use `https://abdallah4abood-spec.github.io/portfolio-UI-UX-Designer/`.

## Accessibility, performance, and SEO

- One `h1` per page, logical headings, landmarks, skip link, descriptive image alternatives, and decorative mockups hidden where appropriate.
- Keyboard-accessible navigation and controls, visible `:focus-visible`, touch targets of at least 44 px where practical, and WCAG 2.2 AA contrast targets.
- Native theme initialization with saved preference and system fallback; theme-control state remains accurate.
- `prefers-reduced-motion` support and no essential reveal dependency.
- Responsive images with dimensions, lazy loading below the fold, and optimized local assets.
- Unique titles/descriptions, canonical links, Open Graph/Twitter metadata, sitemap, robots directive, and useful 404 page.

## Verification

Run Node static integrity tests before and after implementation. Serve locally and verify every route, internal link, theme, menu, email-copy fallback, keyboard focus, reduced motion, and console state. Inspect 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1600 px widths in both themes where relevant. Capture and review homepage, gallery, real case-study, and concept case-study screenshots on desktop and mobile. Record actual evidence and unresolved limitations in `docs/qa/QA.md`.

## Publishing constraints

Do not overwrite unrelated work, create another repository, or force-push. Inspect working tree and remote before any publishing action. Do not claim deployment without verifying the live URL. If authenticated publishing is unavailable or unsafe, provide exact commands instead.
