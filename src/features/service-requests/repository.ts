import { createHash } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";
import { getDb } from "@/lib/db";
import { SubmissionLimitError } from "./errors";
import type { ServiceRequestPayload } from "./schema";

export type RequestReceipt = { id: string; createdAt: Date };
export type RequestRepository = (
  payload: ServiceRequestPayload,
) => Promise<RequestReceipt>;

async function consumeQuota(
  tx: Prisma.TransactionClient,
  key: string,
  expiresAt: Date,
  maximum: number,
  now: Date,
) {
  const quota = await tx.requestQuota.upsert({
    where: { key },
    create: { key, count: 1, expiresAt },
    update: { count: { increment: 1 } },
    select: { count: true },
  });
  if (quota.count > maximum) {
    throw new SubmissionLimitError(
      Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)),
    );
  }
}

export async function persistRequest(
  payload: ServiceRequestPayload,
  db: PrismaClient = getDb(),
): Promise<RequestReceipt> {
  return db.$transaction(
    async (tx) => {
      // PostgreSQL is the shared clock and counter store for every deployed instance.
      const [clock] = await tx.$queryRaw<
        Array<{ now: Date }>
      >`SELECT CURRENT_TIMESTAMP AS now`;
      const now = clock.now;
      const minute = Math.floor(now.getTime() / 60_000);
      const hour = Math.floor(now.getTime() / 3_600_000);
      const emailHash = createHash("sha256")
        .update(payload.email)
        .digest("hex");
      await tx.requestQuota.deleteMany({ where: { expiresAt: { lte: now } } });
      await consumeQuota(
        tx,
        `global:${minute}`,
        new Date((minute + 1) * 60_000),
        30,
        now,
      );
      await consumeQuota(
        tx,
        `email:${hour}:${emailHash}`,
        new Date((hour + 1) * 3_600_000),
        3,
        now,
      );
      return tx.serviceRequest.create({
        data: payload,
        select: { id: true, createdAt: true },
      });
    },
    { maxWait: 5000, timeout: 10_000 },
  );
}
