import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { persistRequest } from "@/features/service-requests/repository";
import { createServiceRequest } from "@/features/service-requests/service";
import { createRequestHandler } from "@/features/service-requests/handler";
import { validPayload } from "../fixtures";

const connection = process.env.TEST_DATABASE_URL;
if (!connection)
  throw new Error(
    "TEST_DATABASE_URL must point to a dedicated PostgreSQL database ending in _test.",
  );
const url = new URL(connection);
if (!url.pathname.endsWith("_test"))
  throw new Error("Refusing to test against a database not ending in _test.");
const schema = `test_${randomUUID().replaceAll("-", "")}`;
url.searchParams.set("schema", schema);
const clientOptions = { datasources: { db: { url: url.toString() } } };
const db = new PrismaClient(clientOptions);
let schemaCreated = false;

beforeAll(async () => {
  await db.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  const directory = new URL("../../prisma/migrations/", import.meta.url);
  for (const entry of (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const sql = await readFile(
      new URL(`${entry.name}/migration.sql`, directory),
      "utf8",
    );
    for (const statement of sql.split(";").filter((part) => part.trim()))
      await db.$executeRawUnsafe(statement);
  }
});

beforeEach(async () => {
  await db.serviceRequest.deleteMany();
  await db.requestQuota.deleteMany();
});

afterAll(async () => {
  if (schemaCreated)
    await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
  await db.$disconnect();
});

describe("real PostgreSQL persistence (no repository mocks)", () => {
  it("returns 201 then reads the committed record with a fresh connection", async () => {
    const response = await createRequestHandler((input) =>
      createServiceRequest(input, (payload) => persistRequest(payload, db)),
    )(
      new Request("http://localhost/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    await db.$disconnect();
    const reader = new PrismaClient(clientOptions);
    try {
      const stored = await reader.serviceRequest.findUniqueOrThrow({
        where: { id: body.data.id },
      });
      expect(stored).toMatchObject(validPayload);
      expect(stored.createdAt.toISOString()).toBe(body.data.createdAt);
      console.info(
        `Verified PostgreSQL insert + fresh-connection readback: ${stored.id}`,
      );
    } finally {
      await reader.$disconnect();
    }
  });
  it("enforces per-email limits under concurrent inserts", async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, () => persistRequest(validPayload, db)),
    );
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(3);
    expect(await db.serviceRequest.count()).toBe(3);
    for (const result of results)
      if (result.status === "rejected")
        expect(result.reason.name).toBe("SubmissionLimitError");
  });
  it("rolls back quota changes when a real database write fails", async () => {
    await expect(
      persistRequest({ ...validPayload, fullName: "x".repeat(101) }, db),
    ).rejects.toThrow();
    expect(await db.serviceRequest.count()).toBe(0);
    expect(await db.requestQuota.count()).toBe(0);
  });
});
