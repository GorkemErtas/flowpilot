# FlowPilot

**Tekrarlayan işleri otomatikleştirin. İşinize odaklanın.**

A fictional Turkish B2B automation service built for the Enteksis full-stack case study. A responsive landing page, validated service-request form, and real PostgreSQL persistence. No real customers, integrations, commercial operations, delivery promises, or measured business outcomes are implied.

**Live demo:** https://flowpilot-orcin.vercel.app/ (Vercel; live form submission and Neon persistence confirmed by the project owner).

**Source:** [GorkemErtas/flowpilot](https://github.com/GorkemErtas/flowpilot). The final revision is the latest commit on `main`; use `git rev-parse HEAD` after pulling to record its full SHA.

## Features and stack

- Turkish copy; original HTML/SVG workflow illustration; responsive navigation; accessible light-default/dark-mode toggle (saved locally in the browser); reduced-motion support and subtle Motion transitions.
- Shared Zod validation and React Hook Form, inline errors, validating/submitting/success/error states, pending-submit protection, and input preservation on failure.
- Success requires an HTTP 201 receipt from a completed PostgreSQL transaction.
- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, Prisma 6, PostgreSQL, Vitest, Testing Library, Playwright, and axe. Exact dependency versions are pinned in `package-lock.json`.
- Node.js **24.x**, npm, and persistent PostgreSQL. Database verification used PostgreSQL 18.

## Architecture

```text
src/
  app/                         Server-rendered page, layout, API route
    api/requests/route.ts      Node runtime HTTP entry point
  components/
    forms/request-form.tsx    Form state, accessibility, HTTP interaction
    layout/                   Responsive navigation and theme toggle
    sections/                 Original product visualization
    ui/                       Icons and motion wrapper
  features/service-requests/
    schema.ts                 Shared normalized, strict Zod validation
    types.ts                  Stable identifiers and Turkish labels
    response.ts               Typed HTTP response contracts
    handler.ts                Bounded parsing and HTTP error mapping
    service.ts                Validation before persistence
    repository.ts             Atomic request + quota transaction
    errors.ts                 Application-level rate-limit error
  lib/db.ts                   Lazy, process-reused Prisma client
prisma/                       Schema and versioned migrations
tests/                        Schema, API, form, database, browser tests
scripts/verify-persistence.mjs Independent-process insert/readback helper
```

Most content uses server components; navigation, motion, and form interaction use client components. Database code is reached exclusively from the Node API, with no `NEXT_PUBLIC_*` connection variables. There is no filesystem, localStorage or in-memory persistence substitute.

## Local setup

1. Install Node 24 (`.nvmrc` is provided) and PostgreSQL, or provision a development database.
2. Run `npm ci`. Postinstall generates Prisma Client without applying migrations.
3. Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell), then replace placeholders.
4. Create an empty `flowpilot` database owned by your development role. For local PostgreSQL: `createdb -h localhost -U YOUR_DB_USER flowpilot`.
5. Run `npm run db:deploy` to apply the committed migrations.
6. Run `npm run dev` and open `http://localhost:3000`.

Do not commit `.env` or use production credentials for tests. URL-encode special characters in database passwords.

| Variable             | Purpose                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | Required at runtime and for migrations. Use the provider's TLS settings in production.            |
| `TEST_DATABASE_URL`  | Separate integration/browser/verification database. Name must end in `_test`; never production.   |
| `PLAYWRIGHT_CHANNEL` | Optional `msedge` or `chrome` to use an installed browser. Otherwise install Playwright Chromium. |

Next.js and Prisma load `.env` locally. Database/browser test scripts explicitly load `.env` when present; shell/CI variables take precedence. Test variables are not required on Vercel.

## Commands

| Command                                           | Purpose                                                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`                                     | Development server                                                                                   |
| `npm run build` / `npm start`                     | Generate Prisma Client and build / serve production application                                      |
| `npm run lint`                                    | ESLint, React and Next.js rules                                                                      |
| `npm run typecheck`                               | Generate route types, then strict TypeScript                                                         |
| `npm run format:check`                            | Prettier verification                                                                                |
| `npm test`                                        | Schema, API and form tests; no database needed                                                       |
| `npm run test:integration`                        | Actual PostgreSQL integration tests                                                                  |
| `npm run test:e2e`                                | Browser checks against the previously built production application                                   |
| `npm run db:generate`                             | Regenerate Prisma Client                                                                             |
| `npm run db:deploy`                               | Apply existing versioned migrations                                                                  |
| `npm run db:migrate -- --name descriptive_change` | Author a migration against a disposable development database; may require shadow-database privileges |
| `npm run db:verify -- write`                      | Insert a marked synthetic record and print its ID                                                    |
| `npm run db:verify -- read ID`                    | Confirm that record from a separate process                                                          |
| `npm run db:verify -- cleanup ID`                 | Remove that exact record after checking its fixture identity                                         |

## Testing and persistence verification

Create a separate `flowpilot_test` database and configure `TEST_DATABASE_URL`. For Playwright, use an empty dedicated schema (for example `?sslmode=require&schema=flowpilot_e2e`) if the test database's `public` schema already contains tables without Prisma migration history; otherwise Prisma can report P3005. The integration role needs schema create/drop permission **inside that test database**. Each integration run applies versioned SQL to a random schema and drops only its own schema. Mocked API/component tests are not evidence of database persistence.

```sh
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser setup applies migrations to `TEST_DATABASE_URL`, starts production on loopback port 3100, submits fictional data through the real API, reads the row through a separate Prisma client, then deletes that exact test row. Quota counters expire naturally. Generated screenshots/reports are ignored by Git.

For independent restart verification: run `npm run db:verify -- write`, copy the ID, restart **your isolated test** PostgreSQL instance, then run `npm run db:verify -- read ID`. Finish with `cleanup ID`. This helper writes through Prisma directly; the browser test verifies the complete UI/API/service path.

Executed results and limits are in [AI_LOG.md](AI_LOG.md). Automated axe scans do not replace a full manual accessibility audit. No Lighthouse score is claimed without an executed report.

## API

`POST /api/requests` requires `Content-Type: application/json` and at most **16 KiB of actual streamed body data**. Unknown properties are rejected.

```json
{
  "fullName": "Örnek Kullanıcı",
  "email": "ornek@example.com",
  "service": "WORKFLOW_AUTOMATION",
  "description": "Kurgusal bir ekibin tekrarlayan raporlama sürecini değerlendirmek istiyoruz."
}
```

| Field         | Validation                                                |
| ------------- | --------------------------------------------------------- |
| `fullName`    | Trimmed, 2–100 characters                                 |
| `email`       | Trimmed, lowercased, valid format, at most 254 characters |
| `service`     | One exact identifier from the table below                 |
| `description` | Trimmed, 10–2000 characters                               |

| Identifier                  | UI label                     |
| --------------------------- | ---------------------------- |
| `WORKFLOW_AUTOMATION`       | İş Akışı Otomasyonu          |
| `AI_INTEGRATION`            | Yapay Zekâ Entegrasyonu      |
| `DATA_REPORTING_AUTOMATION` | Veri ve Raporlama Otomasyonu |

HTTP 201, only after commit:

```json
{
  "ok": true,
  "data": {
    "id": "generated-record-id",
    "createdAt": "2026-10-13T00:00:00.000Z"
  }
}
```

Failure shape:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Lütfen işaretli alanları kontrol edin.",
    "fieldErrors": { "email": ["Geçerli bir e-posta adresi girin."] }
  }
}
```

| Status | Meaning                                                               |
| ------ | --------------------------------------------------------------------- |
| 400    | Malformed JSON/invalid UTF-8                                          |
| 403    | Invalid/foreign browser origin or cross-site fetch                    |
| 413    | Body exceeds 16 KiB                                                   |
| 415    | Unsupported media type                                                |
| 422    | Missing, unknown or invalid fields                                    |
| 429    | Database-enforced quota; includes `Retry-After`                       |
| 500    | Unexpected application/database failure; no internal details returned |

Only POST is implemented; Next.js returns 405 for unsupported methods. Responses are non-cacheable. Browser Origin is compared with public Host to accommodate internal/proxy URLs. This is a browser defense, not authentication: non-browser clients can omit or forge headers.

### Abuse controls and reliability limits

Transactions use the PostgreSQL clock and shared fixed-window counters: **3 accepted requests per normalized email/hour**, and **30 globally/minute**. Counters and the insert commit together; rejected/failed inserts roll back all changes. Expired counters are cleaned during later submissions. No process-local/IP limiter is claimed.

Windows allow boundary bursts. Email is unverified; attackers can consume the shared allowance. These controls do not replace hosting-level DDoS protection. No CAPTCHA or external security service is introduced. Database errors produce a generic event without payloads, credentials or stack traces.

After connection loss, the form cannot know whether the server committed; it reports that uncertainty and retains input. There is no idempotency key/deduplication across retries, so a retry may create another record. Agree retention/access procedures before accepting real personal data; the demo requests fictional information.

## Vercel deployment

`vercel.json` is included. The project owner deployed the app to [Vercel](https://flowpilot-orcin.vercel.app/) with a Neon PostgreSQL database and confirmed a successful live form submission and database record. New code commits still require a successful Vercel redeployment and smoke test.

1. Import the GitHub repository into Vercel; select Node **24.x**.
2. Provision persistent hosted PostgreSQL near the function region. Give previews a separate database/branch.
3. Configure runtime `DATABASE_URL` securely in Vercel. Use the provider's Prisma-compatible pooler and TLS parameters. The example starts with `connection_limit=1&pool_timeout=10`; tune to provider quotas/concurrency.
4. Apply `npm run db:deploy` in a controlled release step using the provider's **direct** migration connection as `DATABASE_URL`. Use migration-role credentials only in that step. Never run `migrate dev`, `db push`, or tests against production.
5. Build with `npm run build`. Prisma Client is regenerated on install/build to avoid cached-client mismatch. Builds do not migrate or insert records.
6. Submit fictional data through the deployed form and verify its returned ID in the target database. Verify restart persistence, headers and logs; record the actual live URL and deployed commit SHA.

The runtime role needs request inserts and quota read/write/delete; migration permissions can be separate. Never prefix database variables with `NEXT_PUBLIC_`. Production credentials remain owner-controlled. Do not commit secrets or use the production database for tests.

References: [Vercel Node runtimes](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Prisma v6 serverless deployment](https://www.prisma.io/docs/orm/v6/prisma-client/deployment/serverless), [database connections](https://docs.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections).

## Scope and known limitations

No authentication, admin dashboard, notifications, real integrations or workflow execution engine. Descriptions are plain text and never rendered as HTML. Fonts are downloaded at build time by `next/font` and served locally afterward; cold builds need outbound font access.

The final dependency audit is recorded in `AI_LOG.md`. A transitive development-only `braces` advisory currently propagates through Next.js's lint configuration; no forced downgrade or advisory suppression is applied. Recheck upstream patches before public deployment. `AI_LOG.md` documents AI contributions, actual checks, corrected mistakes and remaining human review.
