import { PrismaClient } from "@prisma/client";

const databaseGlobal = globalThis as unknown as { flowpilotDb?: PrismaClient };

export function getDb(): PrismaClient {
  if (!databaseGlobal.flowpilotDb) {
    databaseGlobal.flowpilotDb = new PrismaClient({ log: [] });
  }
  return databaseGlobal.flowpilotDb;
}
