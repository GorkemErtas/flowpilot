import { PrismaClient } from "@prisma/client";

const connection = process.env.TEST_DATABASE_URL;
if (!connection || !new URL(connection).pathname.endsWith("_test")) {
  throw new Error(
    "Set TEST_DATABASE_URL to a separate PostgreSQL database ending in _test.",
  );
}

const [operation, id] = process.argv.slice(2);
const db = new PrismaClient({ datasources: { db: { url: connection } } });
const fixture = {
  fullName: "Kurgusal Test Kaydı",
  email: "persistence-check@example.com",
  service: "WORKFLOW_AUTOMATION",
  description:
    "FlowPilot kalıcılık doğrulaması için oluşturulmuş kurgusal test kaydı.",
};

try {
  if (operation === "write") {
    const saved = await db.serviceRequest.create({
      data: fixture,
      select: { id: true },
    });
    console.info(JSON.stringify(saved));
  } else if (["read", "cleanup"].includes(operation) && id) {
    const record = await db.serviceRequest.findUniqueOrThrow({ where: { id } });
    for (const [field, expected] of Object.entries(fixture)) {
      if (record[field] !== expected)
        throw new Error("Record does not belong to this verification fixture.");
    }
    if (operation === "cleanup") {
      await db.serviceRequest.delete({ where: { id } });
      console.info(JSON.stringify({ id, removed: true }));
    } else {
      console.info(
        JSON.stringify({
          id,
          persisted: true,
          createdAt: record.createdAt.toISOString(),
        }),
      );
    }
  } else {
    throw new Error(
      "Usage: npm run db:verify -- write | read <id> | cleanup <id>",
    );
  }
} finally {
  await db.$disconnect();
}
