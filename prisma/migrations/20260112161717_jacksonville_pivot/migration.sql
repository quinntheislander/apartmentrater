/*
  Warnings:

  - You are about to drop the column `amenitiesRating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `cleanliness` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `cons` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `management` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `pestControl` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `petFriendly` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `pros` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `safety` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `valueForMoney` on the `Review` table. All the data in the column will be lost.
  - Added the required column `experienceSummary` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generalVibe` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `naturalLight` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apartmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallRating" REAL NOT NULL,
    "noiseLevel" INTEGER NOT NULL,
    "naturalLight" INTEGER NOT NULL,
    "generalVibe" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "experienceSummary" TEXT NOT NULL,
    "unitNumber" TEXT,
    "isUnitVerified" BOOLEAN NOT NULL DEFAULT false,
    "certifiedPersonalExperience" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "leaseStartDate" DATETIME,
    "leaseEndDate" DATETIME,
    "wouldRecommend" BOOLEAN NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("anonymous", "apartmentId", "createdAt", "helpful", "id", "isVerified", "leaseEndDate", "leaseStartDate", "noiseLevel", "overallRating", "title", "unitNumber", "updatedAt", "userId", "wouldRecommend") SELECT "anonymous", "apartmentId", "createdAt", "helpful", "id", "isVerified", "leaseEndDate", "leaseStartDate", "noiseLevel", "overallRating", "title", "unitNumber", "updatedAt", "userId", "wouldRecommend" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_apartmentId_idx" ON "Review"("apartmentId");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
