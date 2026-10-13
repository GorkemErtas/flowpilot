import { z } from "zod";

export const requestReceiptSchema = z.object({
  ok: z.literal(true),
  data: z.object({ id: z.string().min(1), createdAt: z.string().datetime() }),
});

export const requestFailureSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.enum([
      "INVALID_JSON",
      "INVALID_INPUT",
      "UNSUPPORTED_MEDIA_TYPE",
      "PAYLOAD_TOO_LARGE",
      "ORIGIN_REJECTED",
      "RATE_LIMITED",
      "INTERNAL_ERROR",
    ]),
    message: z.string(),
    fieldErrors: z.record(z.array(z.string()).optional()).optional(),
  }),
});

export type RequestResponse =
  z.infer<typeof requestReceiptSchema> | z.infer<typeof requestFailureSchema>;
