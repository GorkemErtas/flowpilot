import { describe, expect, it } from "vitest";
import { serviceRequestSchema } from "@/features/service-requests/schema";
import { validPayload } from "./fixtures";

describe("request validation", () => {
  it("accepts and normalizes a valid payload", () => {
    expect(
      serviceRequestSchema.parse({
        ...validPayload,
        fullName: "  Örnek Kullanıcı  ",
        email: "  ORNEK@EXAMPLE.COM  ",
        description: `  ${validPayload.description}  `,
      }),
    ).toEqual(validPayload);
  });
  it.each([
    {},
    null,
    [],
    "value",
    12,
    { ...validPayload, email: "invalid" },
    { ...validPayload, service: "unknown" },
    { ...validPayload, description: "short" },
    { ...validPayload, fullName: 42 },
    { ...validPayload, unexpected: true },
  ])("rejects malformed values: %j", (input) => {
    expect(serviceRequestSchema.safeParse(input).success).toBe(false);
  });
  it.each(["fullName", "email", "service", "description"])(
    "requires %s",
    (field) => {
      const input: Record<string, unknown> = { ...validPayload };
      delete input[field];
      expect(serviceRequestSchema.safeParse(input).success).toBe(false);
    },
  );
  it.each([
    ["fullName", 2],
    ["fullName", 100],
    ["description", 10],
    ["description", 2000],
  ] as const)("accepts %s at %i characters", (field, size) => {
    expect(
      serviceRequestSchema.safeParse({
        ...validPayload,
        [field]: "a".repeat(size),
      }).success,
    ).toBe(true);
  });
  it.each([
    ["fullName", 1],
    ["fullName", 101],
    ["description", 9],
    ["description", 2001],
  ] as const)("rejects %s at %i characters", (field, size) => {
    expect(
      serviceRequestSchema.safeParse({
        ...validPayload,
        [field]: "a".repeat(size),
      }).success,
    ).toBe(false);
  });
  it("enforces trimmed lengths and the email boundary", () => {
    expect(
      serviceRequestSchema.safeParse({
        ...validPayload,
        fullName: "   ",
        description: "          ",
      }).success,
    ).toBe(false);
    const domain = `${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(57)}.com`;
    expect(
      serviceRequestSchema.safeParse({
        ...validPayload,
        email: `${"a".repeat(64)}@${domain}`,
      }).success,
    ).toBe(true);
    expect(
      serviceRequestSchema.safeParse({
        ...validPayload,
        email: `${"a".repeat(65)}@${domain}`,
      }).success,
    ).toBe(false);
  });
});
