import { ZodError } from "zod";
import { SubmissionLimitError } from "./errors";
import type { RequestResponse } from "./response";
import { createServiceRequest } from "./service";

const MAX_BODY_BYTES = 16_384;
class BodyTooLargeError extends Error {}

async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new BodyTooLargeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  let bytes = 0;
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as unknown;
  } finally {
    reader.releaseLock();
  }
}

function respond(
  body: RequestResponse,
  status: number,
  extraHeaders?: HeadersInit,
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export function createRequestHandler(submit = createServiceRequest) {
  return async function POST(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    let originAllowed = !origin;
    if (origin) {
      try {
        const parsed = new URL(origin);
        // Host preserves the public host when Next.js uses an internal request URL.
        const publicHost =
          request.headers.get("host") ?? new URL(request.url).host;
        originAllowed =
          /^https?:$/.test(parsed.protocol) &&
          parsed.origin === origin &&
          parsed.host === publicHost;
      } catch {
        originAllowed = false;
      }
    }
    if (
      !originAllowed ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return respond(
        {
          ok: false,
          error: {
            code: "ORIGIN_REJECTED",
            message: "Talebinizi bu sayfadaki form üzerinden gönderin.",
          },
        },
        403,
      );
    }
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    ) {
      return respond(
        {
          ok: false,
          error: {
            code: "UNSUPPORTED_MEDIA_TYPE",
            message: "İstek JSON biçiminde olmalıdır.",
          },
        },
        415,
      );
    }
    let payload: unknown;
    try {
      payload = await readJson(request);
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        return respond(
          {
            ok: false,
            error: {
              code: "PAYLOAD_TOO_LARGE",
              message: "Talep boyutu izin verilen sınırı aşıyor.",
            },
          },
          413,
        );
      }
      return respond(
        {
          ok: false,
          error: {
            code: "INVALID_JSON",
            message: "İstek okunamadı. Geçerli JSON gönderin.",
          },
        },
        400,
      );
    }
    try {
      const record = await submit(payload);
      return respond(
        {
          ok: true,
          data: { id: record.id, createdAt: record.createdAt.toISOString() },
        },
        201,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return respond(
          {
            ok: false,
            error: {
              code: "INVALID_INPUT",
              message: "Lütfen işaretli alanları kontrol edin.",
              fieldErrors: error.flatten().fieldErrors,
            },
          },
          422,
        );
      }
      if (error instanceof SubmissionLimitError) {
        return respond(
          {
            ok: false,
            error: {
              code: "RATE_LIMITED",
              message:
                "Gönderim sınırına ulaşıldı. Lütfen daha sonra tekrar deneyin.",
            },
          },
          429,
          { "Retry-After": String(error.retryAfter) },
        );
      }
      // Do not log request bodies, database errors, credentials, or stack traces.
      console.error("[requests] persistence_failed");
      return respond(
        {
          ok: false,
          error: {
            code: "INTERNAL_ERROR",
            message:
              "Talebiniz kaydedilemedi. Bilgilerinizi koruduk; lütfen tekrar deneyin.",
          },
        },
        500,
      );
    }
  };
}
