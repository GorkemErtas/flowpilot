import { describe, expect, it, vi } from "vitest";
import { createRequestHandler } from "@/features/service-requests/handler";
import { createServiceRequest } from "@/features/service-requests/service";
import { SubmissionLimitError } from "@/features/service-requests/errors";
import { validPayload } from "./fixtures";

function request(
  body = JSON.stringify(validPayload),
  headers: Record<string, string> = {},
) {
  return new Request("https://flowpilot.example/api/requests", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("POST request handler", () => {
  it("waits for persistence before returning 201", async () => {
    let complete!: (value: { id: string; createdAt: Date }) => void;
    const save = vi.fn(
      () =>
        new Promise<{ id: string; createdAt: Date }>((resolve) => {
          complete = resolve;
        }),
    );
    const handler = createRequestHandler((input) =>
      createServiceRequest(input, save),
    );
    let responded = false;
    const pending = handler(request()).then((response) => {
      responded = true;
      return response;
    });
    await vi.waitFor(() => expect(save).toHaveBeenCalledOnce());
    expect(responded).toBe(false);
    complete({
      id: "test-confirmed",
      createdAt: new Date("2026-10-13T00:00:00Z"),
    });
    const response = await pending;
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      data: { id: "test-confirmed", createdAt: "2026-10-13T00:00:00.000Z" },
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([
    ["{", 400],
    [JSON.stringify({}), 422],
    [JSON.stringify({ ...validPayload, service: "invalid" }), 422],
    [JSON.stringify({ ...validPayload, email: "invalid" }), 422],
    [JSON.stringify({ ...validPayload, description: "a".repeat(17_000) }), 413],
  ] as const)("rejects invalid input with %i", async (body, status) => {
    const save = vi.fn();
    const response = await createRequestHandler((input) =>
      createServiceRequest(input, save),
    )(request(body));
    expect(response.status).toBe(status);
    expect(save).not.toHaveBeenCalled();
    expect((await response.json()).ok).toBe(false);
  });
  it.each([
    [{ "Content-Type": "text/plain" }, 415],
    [{ Origin: "https://foreign.example" }, 403],
    [{ "Sec-Fetch-Site": "cross-site" }, 403],
    [{ "Content-Length": "20000" }, 413],
  ] as const)(
    "rejects unsupported or unsafe headers",
    async (headers, status) => {
      const submit = vi.fn();
      const response = await createRequestHandler(submit)(
        request(undefined, headers),
      );
      expect(response.status).toBe(status);
      expect(submit).not.toHaveBeenCalled();
    },
  );
  it("returns a safe 500 on database failure", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await createRequestHandler(async () => {
      throw new Error("postgresql://secret:password@db/internal-stack");
    })(request());
    expect(response.status).toBe(500);
    expect(await response.text()).not.toMatch(/secret|password|internal-stack/);
    expect(log).toHaveBeenCalledWith("[requests] persistence_failed");
    log.mockRestore();
  });
  it("returns a truthful retry interval for enforced quotas", async () => {
    const response = await createRequestHandler(async () => {
      throw new SubmissionLimitError(120);
    })(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("120");
  });
});
