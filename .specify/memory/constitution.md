<!--
Sync Impact Report:
Version change: Template → 1.0.0 (initial ratification)
Modified principles: N/A (initial creation)
Added sections: All core principles established
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligned
  ✅ .specify/templates/spec-template.md - Aligned with simplicity principles
  ✅ .specify/templates/tasks-template.md - Reflects minimal overhead approach
Follow-up TODOs: None
-->

# GitStore.dev Website Constitution

## Core Principles

### I. Speed First

Every decision MUST optimize for velocity. Features are delivered incrementally with minimal ceremony. Planning overhead is kept to the absolute minimum needed for clarity. Long design phases, excessive documentation, and over-engineered solutions are rejected in favor of rapid iteration and learning from real usage.

**Rationale**: Speed enables faster feedback cycles, reduces risk of building the wrong thing, and maximizes learning velocity. Time spent on elaborate planning is time not spent delivering value.

**How to apply**: When choosing between two approaches, default to the one that ships faster. Favor proven patterns over novel architectures. Skip optional documentation until it's needed. Launch and iterate rather than perfect before release.

### II. Radical Simplicity

Solutions MUST be as simple as possible while still solving the actual problem. Avoid abstractions, frameworks, patterns, and layers that aren't strictly necessary. Direct, straightforward code is preferred over clever, "extensible" architectures. YAGNI (You Aren't Gonna Need It) is the default stance.

**Rationale**: Complexity is the enemy of speed, maintainability, and understanding. Every abstraction layer adds cognitive load, debugging difficulty, and future constraints. Simple code can be changed quickly when requirements evolve.

**How to apply**: Before adding any abstraction, framework, or pattern, explicitly justify why the simpler approach is insufficient. Three similar code blocks are better than a premature abstraction. Delete unused code immediately rather than "keeping it for later." Favor boring, proven solutions over novel approaches.

### III. Low Overhead

Process, tooling, and infrastructure MUST add minimal friction to shipping. Automated checks are limited to what's essential. Testing focuses on critical paths, not exhaustive coverage. Documentation is minimal and action-oriented. No unnecessary hoops, gates, or ceremony.

**Rationale**: Every process step adds latency and cognitive load. Overhead compounds over time, slowing teams and causing frustration. The goal is to maximize the ratio of value delivered to effort expended.

**How to apply**: Before adding any process, tool, or check, ask: "What happens if we just don't do this?" Only add friction where the cost of failure clearly exceeds the cost of prevention. Prefer lightweight tools over heavyweight solutions. Eliminate any step that doesn't directly contribute to shipping quality software quickly.

### IV. Test What Matters

Testing is targeted, not comprehensive. Tests focus on critical user journeys, edge cases that have caused bugs, and contracts between components. Unit tests are optional—write them only when they provide clear value. Integration tests that exercise real user paths are preferred over mocking-heavy unit tests.

**Rationale**: 100% test coverage is expensive and provides diminishing returns. Tests have a maintenance cost. Over-testing slows iteration and creates brittle test suites that break on every refactor. Strategic testing provides confidence without becoming a burden.

**How to apply**: Before writing tests, ask: "What failure would this catch that's worth the maintenance cost?" Focus on happy paths first, then critical error cases. Skip tests for trivial code (getters, simple utilities). Prefer one integration test over five mocked unit tests. Delete tests that break frequently without catching real bugs.

### V. Ship to Learn

Features are delivered in minimal increments to get user feedback as quickly as possible. Incomplete features can ship behind flags or to limited users. Learning from real usage is prioritized over theoretical correctness. Failures are learning opportunities, not catastrophes.

**Rationale**: Requirements discovered through building and user feedback are more accurate than requirements from upfront planning. The fastest path to the right solution is to ship, observe, and iterate. Waiting until something is "perfect" wastes time on features users may not want.

**How to apply**: Break features into the smallest shippable units. Launch MVPs to get feedback before building the "full" version. Use feature flags to deploy incomplete work. Embrace experimental features and be willing to remove them if they don't work. Measure usage to guide decisions, not assumptions.

## Technical Constraints

### Minimize Dependencies

Only add dependencies when building the functionality yourself would take significantly longer AND maintaining the dependency costs less than maintaining custom code. Prefer standard library solutions. Avoid heavyweight frameworks when lightweight libraries suffice.

**Rationale**: Every dependency is a future liability: security patches, breaking changes, deprecated projects, and version conflicts. The best code is no code; the second best is simple code you control.

### Boring Technology

Default to proven, stable, widely-adopted tools and languages. Avoid bleeding-edge frameworks, alpha releases, and niche technologies unless there's a compelling, documented reason. Optimize for mainstream skills and mature ecosystems.

**Rationale**: Boring technology is well-documented, has fewer surprises, and is easier to hire for. The project's success depends on shipping features, not adopting the latest JavaScript framework.

### Infrastructure as Code

Infrastructure configuration MUST be versioned and reproducible. Manual server setup is prohibited. Deployments MUST be automated and repeatable. Configuration drift is treated as a bug.

**Rationale**: Manual operations don't scale, aren't reproducible, and create knowledge silos. Automated infrastructure reduces errors and enables faster iteration.

## Development Workflow

### Branch → Ship → Repeat

Development follows a simple cycle: create feature branch, implement minimally, ship to users, iterate based on feedback. No separate staging environments required unless deployment risk is high (databases, payments, etc.).

**Rationale**: Complex deployment pipelines and multi-environment strategies add overhead without proportional benefit for most features. Ship to production frequently with confidence via automated checks and monitoring.

### Continuous Deployment

Merging to main MUST trigger automatic deployment to production (or staging for high-risk changes). Manual deployment gates are avoided except for regulated domains. Fast rollback MUST be possible.

**Rationale**: Automation eliminates human error, reduces latency, and enables rapid iteration. Frequent small deployments are safer than large infrequent releases.

### Code Review Lite

Code review focuses on correctness, not style preferences. Reviews SHOULD be fast (under 2 hours) to maintain momentum. Automated linting handles formatting. Trust developers to make good decisions.

**Rationale**: Slow reviews kill momentum and create bottlenecks. Style debates waste time. The goal is to catch bugs and share knowledge, not enforce personal preferences.

## Governance

This constitution is the guiding philosophy for **gitstore.dev**. It supersedes conflicting practices or conventions. All technical decisions SHOULD align with these principles. Violations MUST be explicitly justified—document why simplicity, speed, or low overhead must be compromised.

### Amendment Process

1. Propose change via documented rationale (why current principle is wrong/insufficient)
2. Discuss with team (or solo approval if solo project)
3. Update constitution with version bump
4. Propagate changes to templates and documentation

### Versioning Policy

- **MAJOR**: Fundamental principle change or removal (e.g., dropping simplicity for complexity)
- **MINOR**: New principle added or substantial clarification
- **PATCH**: Wording fixes, typo corrections, minor clarifications

### Compliance Review

Constitution violations are reviewed during code review and planning. Complexity MUST be justified against simpler alternatives in the plan's "Complexity Tracking" section. The constitution guides judgment—it's not a rigid checklist.

**Version**: 1.0.0 | **Ratified**: 2026-03-27 | **Last Amended**: 2026-03-27
