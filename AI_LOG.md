# AI contribution log

## Context

Codex implemented this fictional Enteksis case study from the supplied brief. No human review, deployment, or real customer use is claimed. Git identity and the initial repository history were preserved.

## Milestones and decisions

- Repository inspection: only the initial README existed; the working tree was clean.
- Foundation (`ed51a5e`): strict TypeScript, Next.js App Router, Tailwind, Prisma PostgreSQL model and versioned migration, shared Zod validation and stable service identifiers. TypeScript and lint passed before committing.
- Interface: Turkish content, teal/ivory/lime design tokens, original CSS workflow visualization, semantic sections, responsive navigation, and reduced-motion-aware reveals. Product workflow graphics are illustrative, not live integrations or real metrics. Form and backend are the next separate milestone.
- Dependency review: initial framework pins were outdated. Registry and official Next.js security guidance were consulted; upgraded to Next.js 16.4.0 / React 19.3.0, patched Vitest and PostCSS, and installed form/browser test tooling. npm 10.9.0 hit an internal peer-graph error; an alternate resolver completed installation. A clean install will be checked before delivery.

## Verification transparency

- Initial production build was blocked by sandbox process-launch permissions; this was not an application compilation failure.
- Earlier progress incorrectly attributed installation trouble to OneDrive without evidence. The tool returned after 30 seconds while installation was still active; a second install overlapped it. Generated `node_modules` was rebuilt; no source or history was removed.
- Backend verification: 36 Vitest schema/API tests passed. Three PostgreSQL integration tests passed against a fresh random test schema: committed readback through a new Prisma connection, six concurrent requests admitting exactly three per email, and quota rollback on a real database constraint failure. Tests apply the versioned SQL migrations and drop only their own schema. Browser behavior is not yet verified.
- Interface TypeScript and lint passed; production compilation succeeded after granting process-launch access. An isolated PostgreSQL 18 cluster was initialized under ignored `.local/` on loopback port 55432, separate from the user's existing service.
- Backend: Prisma transaction commits both request and quota counters, using the database clock. Fixed-window limits are three accepted requests per normalized email/hour and 30 accepted requests globally/minute. Counters are shared across instances; no IP identity or in-memory limiter is claimed. The API also checks origin, JSON content type, actual streamed byte size, and input schema.

## Human handoff

Review the code, product wording, privacy/retention policy, target PostgreSQL connection, and production hosting configuration before public use. Deployment requires the owner's credentials and authorization.
