-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "googlePlaceId" TEXT;

-- CreateTable
CREATE TABLE "ApiUsage" (
    "metric" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("metric","day")
);

-- Match the other tables: block Supabase's public API; Prisma connects as the owner
ALTER TABLE "ApiUsage" ENABLE ROW LEVEL SECURITY;
