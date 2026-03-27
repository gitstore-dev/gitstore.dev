# Research: GitStore.dev Coming Soon Landing Page

**Date**: 2026-03-27
**Feature**: 001-coming-soon-landing-page

## Overview

This document captures research decisions for the GitStore.dev landing page implementation, focusing on technology choices that align with the constitution's principles of speed, simplicity, and low overhead.

## Technology Decisions

### 1. Build Tool: Vite 5.x

**Decision**: Use Vite as the build tool and dev server

**Rationale**:
- **Speed**: Lightning-fast hot module replacement (<50ms updates)
- **Simplicity**: Zero-config for basic static sites, minimal boilerplate
- **Modern**: ES modules-first, built-in TypeScript support, optimized production builds
- **Proven**: Industry-standard with 12M+ weekly downloads, mature ecosystem

**Alternatives Considered**:
- **Webpack**: Rejected - slower build times, more complex configuration
- **Parcel**: Rejected - less ecosystem support, fewer plugins for GitHub Pages
- **Plain HTML/CSS**: Rejected - no dev server hot reload, manual asset optimization

**Best Practices**:
- Use `vite build` for production with automatic minification
- Configure `base: '/'` for GitHub Pages root domain deployment
- Enable `build.rollupOptions.output.manualChunks` for optimal code splitting (likely not needed for single page)

---

### 2. Styling: TailwindCSS 3.x

**Decision**: Use TailwindCSS utility-first CSS framework

**Rationale**:
- **Speed**: No context switching between HTML and CSS files, rapid prototyping
- **Simplicity**: No custom CSS architecture needed, purges unused styles automatically
- **Low Overhead**: ~10KB production bundle after purge, built-in responsive utilities
- **Design System Integration**: Works seamlessly with Google Stitch design tokens

**Alternatives Considered**:
- **Plain CSS**: Rejected - requires naming conventions, more boilerplate for responsive design
- **CSS Modules**: Rejected - adds abstraction overhead for single-page site
- **Styled Components**: Rejected - requires React, adds runtime overhead

**Best Practices**:
- Use JIT mode (default in v3.x) for instant compilation
- Define custom colors in `tailwind.config.ts` from Stitch design tokens
- Use `@layer` directives for any custom utility classes
- Configure PurgeCSS to scan `.html` and `.ts` files

---

### 3. Email Form Service

**Decision**: Use Formspree (free tier) or Web3Forms for email capture

**Rationale**:
- **Simplicity**: No backend server needed, just POST to API endpoint
- **Low Overhead**: Free tier supports 50 submissions/month (sufficient for MVP)
- **Speed**: 5-minute integration, no infrastructure setup
- **Reliability**: Handles delivery, retries, and duplicate detection

**Alternatives Considered**:
- **Netlify Forms**: Rejected - requires Netlify hosting (we're using GitHub Pages)
- **GitHub Actions + JSON file**: Rejected - requires commit on every submission (git bloat, rate limits)
- **Custom backend**: Rejected - violates simplicity principle for MVP

**Best Practices (Formspree)**:
- Use POST to `https://formspree.io/f/{form_id}`
- Implement client-side validation before submission
- Add honeypot field (`_gotcha`) for spam protection
- Use `_subject` field to customize email subjects
- Return JSON for AJAX submission: `Accept: application/json`

**Implementation Pattern**:
```typescript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ email, _gotcha: honeypotValue })
})
```

---

### 4. Design System: Google Stitch

**Decision**: Use Google Stitch for design system and component generation

**Rationale**:
- **Speed**: AI-powered design generation, exports to production-ready code
- **Design Quality**: Professional-grade UI patterns, accessibility built-in
- **Integration**: Direct export to HTML/CSS compatible with Vite + Tailwind
- **MCP Integration**: Stitch MCP tools available in this project for direct interaction

**Best Practices**:
- Create DESIGN.md following [Stitch format spec](https://stitch.withgoogle.com/docs/design-md/format/)
- Define semantic tokens (colors, spacing, typography) as design system foundation
- Export components as HTML + Tailwind classes using Stitch MCP tools
- Store design tokens in `tailwind.config.ts` for consistency
- Use Stitch MCP to generate/update designs programmatically

**DESIGN.md Structure** (per Stitch spec):
```markdown
# Design System

## Colors
- Primary: #... (for CTAs, links)
- Secondary: #... (for accents)
- Neutral: #... (for text, backgrounds)

## Typography
- Heading: font-family, sizes, weights
- Body: font-family, sizes, line-height

## Spacing
- Scale: 4px base unit

## Components
- Hero Section
- Email Form
- GitHub Link
```

---

### 5. GitHub Pages Deployment

**Decision**: Deploy to GitHub Pages using GitHub Actions workflow

**Rationale**:
- **Zero Cost**: Free hosting for public repositories
- **Simplicity**: No server management, no DNS complexity (can use custom domain gitstore.dev)
- **Continuous Deployment**: Automatic deployment on merge to main
- **Fast**: Served via GitHub's CDN globally

**Best Practices**:
- Use official `actions/deploy-pages@v4` action
- Build artifact in workflow, upload to Pages
- Configure custom domain in repository settings
- Set `base: '/'` in `vite.config.ts` for root domain

**Workflow Template** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

---

### 6. Testing Strategy

**Decision**: Minimal testing focused on form submission critical path

**Rationale**:
- **Constitution Alignment**: "Test What Matters" - skip trivial code, focus on critical journeys
- **Low Overhead**: Avoid test maintenance burden for simple static page
- **Pragmatic**: One end-to-end test for form submission > multiple unit tests

**Testing Scope**:
1. **E2E Test (Playwright)**: Form submission happy path
   - Fill email field
   - Submit form
   - Verify success message
2. **Unit Test (Vitest, optional)**: Email validation logic
   - Valid email formats pass
   - Invalid formats fail
3. **Manual QA**: Visual checks for responsive design, link functionality

**Alternatives Considered**:
- **Comprehensive Unit Tests**: Rejected - violates "Test What Matters" for simple page
- **Visual Regression Tests**: Rejected - overkill for MVP, adds maintenance overhead
- **No Tests**: Considered - but form submission is critical business goal, warrants one E2E test

---

## Performance Optimization

**Goal**: <3 seconds page load, <100KB initial bundle

**Strategies**:
1. **Vite Production Build**: Automatic minification, tree-shaking
2. **TailwindCSS Purge**: Removes unused styles (~90% reduction)
3. **Image Optimization**: Use WebP format for og-image, inline SVG for icons
4. **Font Strategy**: System font stack (no web fonts) or preload single Google Font
5. **Lazy Loading**: Defer non-critical scripts (analytics, if added later)

**Monitoring**:
- Use Lighthouse CI in GitHub Actions (optional, can add post-MVP)
- Monitor with Google PageSpeed Insights manually

---

## Security Considerations

**Honeypot Field Implementation**:
```html
<!-- Hidden field, positioned off-screen via CSS -->
<input type="text" name="_gotcha" style="position:absolute;left:-5000px" tabindex="-1" autocomplete="off">
```

**Best Practices**:
- Use HTTPS (automatic with GitHub Pages)
- No sensitive data stored client-side
- Email validation prevents injection attacks
- Formspree handles CSRF protection

---

## Domain Configuration

**Custom Domain: gitstore.dev**

**Steps** (post-deployment):
1. Add CNAME record in DNS: `gitstore.dev` → `gitstore-dev.github.io`
2. Configure custom domain in GitHub repository settings
3. Enable "Enforce HTTPS" option
4. Add `CNAME` file to `public/` directory with content: `gitstore.dev`

**Expected Propagation**: 24-48 hours for DNS updates

---

## Open Questions Resolved

1. ~~Email service choice~~ → Formspree (free tier sufficient)
2. ~~Deployment platform~~ → GitHub Pages (zero cost, automatic HTTPS)
3. ~~Testing scope~~ → Minimal E2E test for form, optional unit test for validation
4. ~~Design system integration~~ → Google Stitch with DESIGN.md specification
5. ~~Honeypot implementation~~ → Hidden field + CSS positioning

---

## Repository Structure

**Important Distinction**:
- **OSS Project**: `gitstore-dev/gitstore` - The actual e-commerce engine (main product)
- **This Project**: `gitstore-dev/gitstore.dev` - Landing page/marketing website
- **GitHub MCP**: Available for accessing content from OSS project repository
- **Stitch MCP**: Available for direct design system interaction

**Link Strategy**:
- GitHub repository link points to: `https://github.com/gitstore-dev/gitstore`
- This website repository: `https://github.com/gitstore-dev/gitstore.dev`
- Use GitHub MCP to fetch latest OSS project stats, issues, or README content if needed

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**:
1. Create `data-model.md` (Early Adopter Signup entity schema) ✅
2. Create `design.md` (Google Stitch design system specification) ✅
3. Create `contracts/form-api.md` (Formspree API contract) ✅
4. Create `quickstart.md` (Local development guide) ✅
5. Update agent context file with technology stack ✅
