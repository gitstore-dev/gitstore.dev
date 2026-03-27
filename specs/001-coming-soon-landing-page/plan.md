# Implementation Plan: GitStore.dev Coming Soon Landing Page

**Branch**: `001-coming-soon-landing-page` | **Date**: 2026-03-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-coming-soon-landing-page/spec.md`

## Summary

Build a single-page coming soon website for GitStore (a git-optimized e-commerce engine) featuring:
- "Coming Soon" hero message with value proposition
- Email signup form for early adopters with honeypot protection
- GitHub repository link (to OSS project: `gitstore-dev/gitstore`)
- Dual audience messaging (primary: developers/AI agents; secondary: business users)
- Responsive design, 3-second load time target

**Repository Context**:
- **This Project**: `gitstore-dev/gitstore.dev` (landing page/website)
- **OSS Project**: `gitstore-dev/gitstore` (the e-commerce engine, linked from page)
- **MCP Tools Available**: Stitch MCP (design system), GitHub MCP (OSS project access)

Technical approach: Static site built with Vite + TailwindCSS, designed with Google Stitch (via MCP), deployed to GitHub Pages via GitHub Actions on merge to main.

## Technical Context

**Language/Version**: TypeScript 5.x with Vite 5.x
**Primary Dependencies**: Vite (build tool), TailwindCSS (styling), Google Stitch (design system)
**Storage**: Static JSON file or third-party form service (e.g., Formspree, Web3Forms, or Netlify Forms) for email capture
**Testing**: Vitest for unit tests (optional per constitution), Playwright for critical user journey tests
**Target Platform**: Modern web browsers (last 2 versions of Chrome, Firefox, Safari, Edge), mobile-first responsive
**Project Type**: Static website (single-page application)
**Performance Goals**: <3s page load, <100KB initial bundle, 90+ Lighthouse score
**Constraints**: No backend server, must work with GitHub Pages static hosting, form submission via third-party or GitHub Actions
**Scale/Scope**: Single landing page, estimated <500 visitors/day initially, scales horizontally via CDN

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Speed First ✅
- **Pass**: Vite enables rapid development and hot reload; TailwindCSS utility-first approach avoids custom CSS overhead; Static site ships immediately without backend complexity

### Radical Simplicity ✅
- **Pass**: No framework abstraction (pure Vite + vanilla TS/JS), single HTML file, minimal JS for form validation, no state management, no routing, no database

### Low Overhead ✅
- **Pass**: GitHub Actions automates deployment with zero manual steps; No server management; Form submission offloaded to third-party service; Minimal dependencies

### Test What Matters ✅
- **Pass**: Tests focus on critical user journeys (form submission, validation) rather than exhaustive coverage; Constitution explicitly allows optional unit tests

### Ship to Learn ✅
- **Pass**: MVP landing page ships first; Can iterate messaging and design based on real signup data; Feature flags not needed for static content

### Minimize Dependencies ✅
- **Pass**: Only 3 core dependencies (Vite, TailwindCSS, Google Stitch); All are mature, widely-adopted tools; No framework overhead (React/Vue/etc.)

### Boring Technology ✅
- **Pass**: Vite is industry-standard build tool; TailwindCSS is proven and widely-adopted; TypeScript is mainstream; Static sites are the simplest deployment model

### Infrastructure as Code ✅
- **Pass**: GitHub Actions workflow defined in `.github/workflows/deploy.yml`; Vite config versioned; Deployment fully automated and reproducible

### Continuous Deployment ✅
- **Pass**: Merge to main triggers automatic GitHub Pages deployment; No manual deployment gates; Rollback via git revert

### Code Review Lite ✅
- **Pass**: Small changeset for single page; Review focuses on correctness of form logic and design fidelity; Prettier handles formatting

**Gate Status**: ✅ All gates passed. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/001-coming-soon-landing-page/
├── plan.md              # This file
├── research.md          # Technology choices and best practices
├── data-model.md        # Email signup entity schema
├── design.md            # Google Stitch design system specification
├── quickstart.md        # Local development guide
└── contracts/
    └── form-api.md      # Email submission contract
```

### Source Code (repository root)

```text
/
├── index.html           # Single-page entry point
├── src/
│   ├── main.ts          # Application entry, form handler
│   ├── styles.css       # TailwindCSS imports
│   └── lib/
│       ├── validation.ts    # Email validation logic
│       └── honeypot.ts      # Honeypot field handler
├── public/
│   ├── favicon.ico
│   └── og-image.png     # Open Graph preview image
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
├── tests/
│   ├── form.test.ts     # Form submission tests (Vitest)
│   └── e2e/
│       └── signup.spec.ts   # Playwright end-to-end test
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

**Structure Decision**: Single project structure (Option 1 adapted for static site). No backend/frontend split needed since this is a static landing page. Form submission handled by third-party service or GitHub Actions webhook. Design assets from Google Stitch stored in `public/` or inlined as SVG.

## Complexity Tracking

No violations - all constitution principles satisfied.

---

*Phase 0 (Research) and Phase 1 (Design) outputs will be generated next.*
