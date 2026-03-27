---

description: "Task list for GitStore.dev Coming Soon Landing Page"
---

# Tasks: GitStore.dev Coming Soon Landing Page

**Input**: Design documents from `/specs/001-coming-soon-landing-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, design.md, contracts/form-api.md

**Tests**: Tests are OPTIONAL per constitution "Test What Matters" principle. Only critical user journey test (form submission) is included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: Root-level `index.html`, `src/`, `tests/`, `public/`, `.github/`
- Static site structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Node.js project with package.json in repository root
- [ ] T002 [P] Install Vite 5.x as build tool dependency
- [ ] T003 [P] Install TypeScript 5.x and configure tsconfig.json in repository root
- [ ] T004 [P] Install TailwindCSS 3.x and PostCSS dependencies
- [ ] T005 [P] Install Prettier for code formatting
- [ ] T006 Create vite.config.ts in repository root with base path configuration for GitHub Pages
- [ ] T007 Create tailwind.config.ts in repository root with custom colors from design.md
- [ ] T008 Create postcss.config.js in repository root for TailwindCSS processing
- [ ] T009 Create .prettierrc.json in repository root with formatting rules
- [ ] T010 Create .gitignore file excluding node_modules, dist, and .env
- [ ] T011 Create src/ directory structure: src/lib/ subdirectory
- [ ] T012 Create public/ directory for static assets
- [ ] T013 Create tests/e2e/ directory structure
- [ ] T014 Create .github/workflows/ directory for GitHub Actions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 Create src/styles.css with TailwindCSS imports (@tailwind base, components, utilities)
- [ ] T016 Create .env.example file documenting VITE_FORMSPREE_FORM_ID variable
- [ ] T017 Install Playwright for end-to-end testing
- [ ] T018 Create playwright.config.ts in repository root with test configuration
- [ ] T019 Create CNAME file in public/ directory with content "gitstore.dev" for custom domain
- [ ] T020 Create placeholder favicon.ico in public/ directory
- [ ] T021 Create .github/workflows/deploy.yml with GitHub Pages deployment workflow per research.md
- [ ] T022 Configure npm scripts in package.json (dev, build, preview, test:e2e)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Coming Soon Message (Priority: P1) 🎯 MVP

**Goal**: Display "Coming Soon" hero message with GitStore value proposition to visitors

**Independent Test**: Visit https://gitstore.dev and verify coming soon message, project description, and dual audience messaging are displayed prominently

### Implementation for User Story 1

- [ ] T023 [P] [US1] Create index.html in repository root with semantic HTML structure (main, section elements)
- [ ] T024 [P] [US1] Add hero section markup to index.html with "Coming Soon" badge, heading, subheading, value proposition per design.md
- [ ] T025 [P] [US1] Add audience tag to index.html: "Built for developers, AI agents, and store operators"
- [ ] T026 [P] [US1] Add meta tags to index.html: title, description, Open Graph tags for social sharing
- [ ] T027 [P] [US1] Apply TailwindCSS utility classes to hero section following design.md specifications (spacing, typography, colors)
- [ ] T028 [P] [US1] Add responsive breakpoints to hero section (mobile-first: text-4xl → md:text-5xl → lg:text-6xl)
- [ ] T029 [US1] Create src/main.ts as application entry point, import styles.css
- [ ] T030 [US1] Link src/main.ts to index.html via script tag with type="module"
- [ ] T031 [US1] Test page load in dev server (npm run dev) and verify <3s load time target

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors see coming soon message with value proposition

---

## Phase 4: User Story 2 - Sign Up for Early Access (Priority: P1) 🎯 MVP

**Goal**: Capture early adopter email addresses via form with honeypot protection

**Independent Test**: Submit an email address through the signup form and verify submission is captured in Formspree dashboard with success confirmation displayed

### Tests for User Story 2 ⚠️

> **NOTE: Critical user journey test only - aligned with "Test What Matters" principle**

- [ ] T032 [US2] Create tests/e2e/signup.spec.ts with Playwright test for email signup happy path (fill email, submit, verify success message)

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create src/lib/validation.ts with email format validation function (RFC 5322 regex)
- [ ] T034 [P] [US2] Create src/lib/honeypot.ts with honeypot field detection logic
- [ ] T035 [P] [US2] Add email signup form markup to index.html with label, input, submit button per design.md
- [ ] T036 [P] [US2] Add honeypot field to form in index.html (hidden via CSS: position absolute, left -5000px, tabindex -1)
- [ ] T037 [P] [US2] Apply TailwindCSS styling to form components per design.md (white background, shadow, border-radius, focus states)
- [ ] T038 [P] [US2] Add success message container to index.html (hidden by default, shown after successful submission)
- [ ] T039 [P] [US2] Add error message container to index.html (hidden by default, shown on validation error or service unavailability)
- [ ] T040 [US2] Implement form submission handler in src/main.ts: validate email, check honeypot, POST to Formspree API per contracts/form-api.md
- [ ] T041 [US2] Add form state management in src/main.ts: disable button during submission, show loading state ("Sending...")
- [ ] T042 [US2] Add success response handler in src/main.ts: hide form, show success message, clear form state
- [ ] T043 [US2] Add error response handler in src/main.ts: show error message (graceful degradation per clarifications), keep form enabled
- [ ] T044 [US2] Add client-side validation feedback in src/main.ts: invalid email shows error below input field
- [ ] T045 [US2] Create Formspree account and configure form with notification email per quickstart.md
- [ ] T046 [US2] Update .env file with actual VITE_FORMSPREE_FORM_ID from Formspree dashboard
- [ ] T047 [US2] Test form submission end-to-end: valid email, invalid email, honeypot filled, service unavailable (mock 503)

**Checkpoint**: At this point, User Stories 1 AND 2 are complete - MVP is functional and testable

---

## Phase 5: User Story 3 - Learn About GitStore (Priority: P2)

**Goal**: Provide additional context about git-optimized e-commerce to qualify leads

**Independent Test**: Read page content and verify it clearly explains git workflows for product catalogs (branch, merge, rollback) and benefits for both technical and business audiences

### Implementation for User Story 3

- [ ] T048 [P] [US3] Expand value proposition section in index.html with detailed explanation of git workflows for product catalogs
- [ ] T049 [P] [US3] Add use case examples to index.html: branch for seasonal changes, merge approved updates, rollback errors
- [ ] T050 [P] [US3] Add benefit highlights to index.html: version control, collaboration, audit trails (technical audience)
- [ ] T051 [P] [US3] Add benefit highlights to index.html: safe experimentation, easy rollback, change tracking (business audience)
- [ ] T052 [US3] Apply TailwindCSS styling to expanded content per design.md (text-lg, leading-relaxed, color-neutral-700)
- [ ] T053 [US3] Add responsive layout adjustments for tablet and desktop breakpoints (max-width 600px for readability)
- [ ] T054 [US3] Test content readability and 30-second understanding goal per success criteria SC-002

**Checkpoint**: User Stories 1, 2, AND 3 are complete - enhanced landing page with qualified lead generation

---

## Phase 6: User Story 4 - Access GitHub Repository (Priority: P3)

**Goal**: Link to open-source GitStore repository for transparency and community access

**Independent Test**: Click GitHub link and verify it navigates to https://github.com/gitstore-dev/gitstore in a new tab

### Implementation for User Story 4

- [ ] T055 [P] [US4] Add GitHub link section to index.html below email form with "View on GitHub" text
- [ ] T056 [P] [US4] Add GitHub icon SVG to index.html (inline SVG, 20px, currentColor fill per design.md)
- [ ] T057 [P] [US4] Set link href to https://github.com/gitstore-dev/gitstore (OSS project, not this website repo)
- [ ] T058 [P] [US4] Add target="_blank" and rel="noopener noreferrer" attributes for security
- [ ] T059 [US4] Apply TailwindCSS styling to GitHub link per design.md (text-primary, hover:text-primary-dark, inline-flex, gap-2)
- [ ] T060 [US4] Test link navigation to GitHub repository in new tab

**Checkpoint**: All user stories (1-4) are complete - full feature set implemented

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final optimizations

- [ ] T061 [P] Create og-image.png in public/ directory (1200x630px, hero text + background per design.md)
- [ ] T062 [P] Optimize images: compress og-image.png to WebP format if >50KB
- [ ] T063 [P] Add footer section to index.html with copyright and open source tagline (optional per design.md)
- [ ] T064 [P] Verify all TailwindCSS classes are used and purged unused styles in production build
- [ ] T065 [P] Add aria-labels to form inputs and buttons for accessibility
- [ ] T066 [P] Test keyboard navigation: tab through form, enter to submit
- [ ] T067 [P] Test mobile responsive design on 375px width (Chrome DevTools device emulation)
- [ ] T068 [P] Test mobile responsive design on 768px width (tablet)
- [ ] T069 [P] Test desktop responsive design on 1024px+ width
- [ ] T070 [P] Run Lighthouse audit and verify 90+ score in all categories (performance, accessibility, best practices, SEO)
- [ ] T071 [P] Verify page load time <3s on 3G network throttling (Chrome DevTools)
- [ ] T072 [P] Verify bundle size <100KB after production build (npm run build output)
- [ ] T073 Run Playwright end-to-end test (npm run test:e2e) and verify all tests pass
- [ ] T074 Manual QA: Test all user stories end-to-end on production build (npm run preview)
- [ ] T075 Verify GitHub Actions workflow deploys successfully to GitHub Pages (push to main branch)
- [ ] T076 Configure custom domain gitstore.dev in GitHub repository settings per quickstart.md
- [ ] T077 Verify production site loads at https://gitstore.dev with HTTPS enabled

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - MVP core
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - MVP critical
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion - Can run parallel with US1/US2 or sequentially
- **User Story 4 (Phase 6)**: Depends on Foundational phase completion - Can run parallel with US1/US2/US3 or sequentially
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for page structure (index.html exists)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for content section existence
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for page structure, US2 for form position reference

### Within Each User Story

- **User Story 1**: All tasks can run in parallel except T029-T031 (entry point setup and testing) which depend on HTML structure
- **User Story 2**:
  - Tests (T032) can be written first before implementation
  - Utility functions (T033-T034) can run in parallel
  - Form markup (T035-T039) can run in parallel
  - Form handler (T040-T047) depends on markup and utilities being complete
- **User Story 3**: All markup tasks (T048-T051) can run in parallel, styling and testing sequential
- **User Story 4**: All tasks can run in parallel except final testing (T060)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (Phase 1)
- All Foundational tasks marked [P] can run in parallel within Phase 2
- Once Foundational phase completes:
  - User Story 1 (P1) starts first for page structure
  - User Story 2 (P1) starts once US1 HTML structure exists (can overlap with US1 styling)
  - User Story 3 (P2) can start after US1 content section exists (can overlap with US2)
  - User Story 4 (P3) can start after US1 structure and US2 form exist (can overlap with US3)
- All Polish tasks marked [P] can run in parallel (Phase 7)

---

## Parallel Example: User Story 2 (Email Signup)

```bash
# Launch utilities in parallel:
Task T033: "Create src/lib/validation.ts with email format validation function"
Task T034: "Create src/lib/honeypot.ts with honeypot field detection logic"

# Launch form markup in parallel:
Task T035: "Add email signup form markup to index.html"
Task T036: "Add honeypot field to form in index.html"
Task T037: "Apply TailwindCSS styling to form components"
Task T038: "Add success message container to index.html"
Task T039: "Add error message container to index.html"

# Then sequential:
Task T040-T047: Form handler implementation and testing
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T014)
2. Complete Phase 2: Foundational (T015-T022) → Foundation ready
3. Complete Phase 3: User Story 1 (T023-T031) → Coming soon message displayed
4. Complete Phase 4: User Story 2 (T032-T047) → Email signup functional
5. **STOP and VALIDATE**: Test US1 + US2 independently, verify MVP functionality
6. Run critical E2E test (T032) to validate form submission
7. Deploy to GitHub Pages (T075) and test production site
8. **MVP COMPLETE** - Can deploy/demo to early users

### Incremental Delivery (Add User Stories 3 + 4)

After MVP is validated and deployed:

1. Add Phase 5: User Story 3 (T048-T054) → Enhanced content for lead qualification
2. Test US3 independently → Deploy/Demo
3. Add Phase 6: User Story 4 (T055-T060) → GitHub repository link
4. Test US4 independently → Deploy/Demo
5. Complete Phase 7: Polish (T061-T077) → Final optimizations and production readiness
6. **FULL FEATURE SET COMPLETE**

### Parallel Team Strategy

With multiple developers (if applicable):

1. Team completes Setup + Foundational together (T001-T022)
2. Once Foundational is done:
   - Developer A: User Story 1 (T023-T031) - Page structure and hero
   - Developer B: User Story 2 (T032-T047) - Form functionality (waits for T023 to complete for HTML structure)
   - Developer C: User Story 3 (T048-T054) - Enhanced content (waits for T023-T025 to complete)
   - Developer D: User Story 4 (T055-T060) - GitHub link (waits for T023, T035 to complete)
3. Stories complete and integrate independently
4. Team collaborates on Phase 7: Polish (T061-T077)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US#] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- E2E test (T032) is the only test per "Test What Matters" principle - focuses on critical form submission journey
- Unit tests for validation.ts and honeypot.ts are optional (can be added post-MVP if maintenance cost justified)
- Commit after each task or logical group for easy rollback
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Follow quickstart.md for local development workflow commands (npm run dev, npm run build, npm run test:e2e)

---

## Success Validation Checklist

Before marking feature complete, verify:

- [ ] User Story 1: Visit https://gitstore.dev → See "Coming Soon" message and value proposition (SC-001, SC-002)
- [ ] User Story 2: Submit email → Receive success confirmation → Verify in Formspree dashboard (SC-003, SC-006)
- [ ] User Story 2: Submit invalid email → See error message
- [ ] User Story 2: Fill honeypot field → Submission silently rejected
- [ ] User Story 3: Read page content → Understand git workflows for product catalogs within 30 seconds (SC-002)
- [ ] User Story 4: Click GitHub link → Opens https://github.com/gitstore-dev/gitstore in new tab
- [ ] Performance: Page loads in <3s on standard broadband (SC-001)
- [ ] Performance: Bundle size <100KB (check npm run build output)
- [ ] Performance: Lighthouse score 90+ (run npm run build && npm run preview, then Lighthouse audit)
- [ ] Mobile: Page functional and readable on 375px width (SC-004)
- [ ] E2E Test: Playwright test passes (npm run test:e2e)
- [ ] Deployment: GitHub Actions workflow succeeds on push to main
- [ ] Production: Site accessible at https://gitstore.dev with HTTPS
