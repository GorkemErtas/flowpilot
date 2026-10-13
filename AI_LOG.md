# AI contribution log

## Context

Codex implemented this fictional Enteksis case study from the supplied brief. No human review, deployment, or real customer use is claimed. Git identity and the initial repository history were preserved.

## Milestones and decisions

- Repository inspection: only the initial README existed; the working tree was clean.
- Foundation (`ed51a5e`): strict TypeScript, Next.js App Router, Tailwind, Prisma PostgreSQL model and versioned migration, shared Zod validation and stable service identifiers. TypeScript and lint passed before committing.
- Interface (`ec21fd0`): Turkish content, teal/ivory/lime design tokens, original CSS workflow visualization, semantic sections, responsive navigation, and reduced-motion-aware reveals. Product graphics are illustrative, not live integrations or real metrics.
- Dependency review: initial framework pins were outdated. Registry and official Next.js security guidance were consulted; upgraded to Next.js 16.4.0 / React 19.3.0, patched Vitest and PostCSS, and installed form/browser test tooling. npm 10.9.0 hit an internal peer-graph error; an alternate resolver completed installation. Final standard `npm ci` succeeded without the alternate resolver under temporary Node 24.21.0. The installed system Node version was not changed.

## Verification transparency

- Initial production build was blocked by sandbox process-launch permissions; this was not an application compilation failure.
- Earlier progress incorrectly attributed installation trouble to OneDrive without evidence. The tool returned after 30 seconds while installation was still active; a second install overlapped it. Generated `node_modules` was rebuilt; no source or history was removed.
- Backend (`fcd85f7`): 36 Vitest schema/API tests passed at this milestone. Three PostgreSQL integration tests passed against a fresh random test schema: committed readback through a new Prisma connection, six concurrent requests admitting exactly three per email, and quota rollback on a real database constraint failure. Tests apply versioned SQL and drop only their own schema.
- Interface TypeScript and lint passed; production compilation succeeded after granting process-launch access. An isolated PostgreSQL 18 cluster was initialized under ignored `.local/` on loopback port 55432, separate from the user's existing service.
- Backend: Prisma transaction commits both request and quota counters, using the database clock. Fixed-window limits are three accepted requests per normalized email/hour and 30 accepted requests globally/minute. Counters are shared across instances; no IP identity or in-memory limiter is claimed. The API also checks origin, JSON content type, actual streamed byte size, and input schema.
- Form (`c42e9e1`): 42 unit/component tests passed at this milestone. Six form scenarios verify invalid-field focus, duplicate-submit blocking while pending, success only after a well-formed HTTP 201 receipt, 500/429 input preservation, malformed success rejection, and connection-loss uncertainty. These component tests mock HTTP only and are distinct from real PostgreSQL tests.
- Browser quality milestone: headless Edge against the production build revealed reduced-motion transparency, public/internal Host mismatch, missing Escape behavior, missing icon requests, narrow-screen heading clipping, and two low-contrast text colors. Fixed and verified with 47 unit/component tests and eight passing Playwright tests: four viewport sizes (320/390/768/1440), keyboard navigation, two axe WCAG A/AA scans with zero detected violations, and browser form → HTTP 201 → actual database readback. Screenshots were inspected by Codex; no human visual review is claimed. The readback record `cmv6dws3p0000lz8kh5ztm1cl` was removed by the test's exact-ID cleanup.

## Final clean-install verification — 2026-10-13

- Standard lockfile-based `npm ci`, including automatic Prisma generation: passed on temporary Node 24.21.0 / npm 10.9.0.
- ESLint, strict TypeScript with fresh Next route types, Prettier and Git whitespace checks: passed.
- Vitest: **47 unit/component tests + 3 real PostgreSQL integration tests passed**.
- Production build: passed; static landing page and Node API route generated without a database connection at build time.
- Playwright: **8 tests passed** against production in headless Edge; zero console/page errors in four viewport checks, no horizontal/heading overflow, zero detected axe violations at 390/1440 pixels. This does not establish complete WCAG conformance or cross-browser coverage.
- Final full browser submission/readback ID: `cmv6elbrv0000lzz02vfyyzjl`; test cleanup deleted exactly that row.
- Independent restart proof: helper inserted `cmv6e8s4m0000lzw4bd4g9423`, the isolated PostgreSQL server was fully stopped/restarted, and a new process read the same ID and timestamp successfully. Exact-ID fixture cleanup completed. The helper and integration isolation checks are committed for reproduction.
- Runtime dependency audit (`npm audit --omit=dev`): **0 reported vulnerabilities**. Full audit: **5 high development-only findings**, all propagated through `braces` → `micromatch` → `fast-glob` → Next ESLint tooling ([advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)). No available fix was applied via a forced framework downgrade; no advisory was suppressed. Recheck upstream fixes before public deployment.
- No Lighthouse score, human audit, hosted deployment, public final source revision, or live URL is claimed. No remote push was performed.

## Delivery tooling

Node 24 is pinned for local/Vercel compatibility. Prisma generates on install and build; type checking generates Next route declarations. Runtime/test environment variables, migrations, isolated tests, verification cleanup, fixed-window limits, retry uncertainty, and Vercel release steps are documented. `.env*` (except the placeholder example), database files, dependencies, build output and generated route declarations are ignored. The local trust-auth PostgreSQL cluster was bound only to loopback port 55432 under `.local/postgres`; it is test infrastructure, not production configuration.

Delivery tooling was committed as `a89676c`; final documentation adds the setup, API contract, deployment procedure, known limits and verification instructions. The isolated PostgreSQL process was stopped after verification; its ignored `.local/postgres` data remains available. No other PostgreSQL service was restarted or stopped. Human review and deployment remain outstanding.

## Human handoff

Review the code, product wording, privacy/retention policy, target PostgreSQL connection, and production hosting configuration before public use. Deployment requires the owner's credentials and authorization.
