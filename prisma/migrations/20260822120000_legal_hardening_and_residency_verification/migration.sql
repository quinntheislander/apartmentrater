-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageAttestedAt" TIMESTAMP(3),
ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "privacyVersion" TEXT,
ADD COLUMN     "tosAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "tosVersion" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "moderationStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "removedReason" TEXT,
ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationId" TEXT;

-- CreateTable
CREATE TABLE "ResidencyVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "documentType" TEXT,
    "status" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "nameMatched" BOOLEAN NOT NULL DEFAULT false,
    "unitMatched" BOOLEAN NOT NULL DEFAULT false,
    "unitSmartyConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "coveredFrom" TIMESTAMP(3),
    "coveredTo" TIMESTAMP(3),
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResidencyVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reporterIp" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "fulfilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResidencyVerification_userId_apartmentId_unitNumber_idx" ON "ResidencyVerification"("userId", "apartmentId", "unitNumber");

-- CreateIndex
CREATE INDEX "ResidencyVerification_apartmentId_idx" ON "ResidencyVerification"("apartmentId");

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_idx" ON "ReviewReport"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReport_status_idx" ON "ReviewReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DataRequest_token_key" ON "DataRequest"("token");

-- CreateIndex
CREATE INDEX "DataRequest_email_idx" ON "DataRequest"("email");

-- CreateIndex
CREATE INDEX "DataRequest_token_idx" ON "DataRequest"("token");

-- CreateIndex
CREATE INDEX "Review_moderationStatus_idx" ON "Review"("moderationStatus");

-- CreateIndex
CREATE INDEX "Review_verificationId_idx" ON "Review"("verificationId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "ResidencyVerification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidencyVerification" ADD CONSTRAINT "ResidencyVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidencyVerification" ADD CONSTRAINT "ResidencyVerification_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

