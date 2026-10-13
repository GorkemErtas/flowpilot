CREATE TABLE "RequestQuota" (
    "key" VARCHAR(96) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RequestQuota_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "RequestQuota_expiresAt_idx" ON "RequestQuota"("expiresAt");
