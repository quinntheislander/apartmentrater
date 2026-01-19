-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HelpfulVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HelpfulVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HelpfulVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apartment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" TEXT NOT NULL DEFAULT 'apartment',
    "unitCount" INTEGER,
    "yearBuilt" INTEGER,
    "amenities" TEXT,
    "imageUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "averageRating" REAL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Apartment" ("address", "amenities", "city", "createdAt", "description", "id", "imageUrl", "latitude", "longitude", "name", "propertyType", "state", "unitCount", "updatedAt", "yearBuilt", "zipCode") SELECT "address", "amenities", "city", "createdAt", "description", "id", "imageUrl", "latitude", "longitude", "name", "propertyType", "state", "unitCount", "updatedAt", "yearBuilt", "zipCode" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE INDEX "Apartment_city_state_idx" ON "Apartment"("city", "state");
CREATE INDEX "Apartment_zipCode_idx" ON "Apartment"("zipCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_apartmentId_idx" ON "Favorite"("apartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_apartmentId_key" ON "Favorite"("userId", "apartmentId");

-- CreateIndex
CREATE INDEX "HelpfulVote_reviewId_idx" ON "HelpfulVote"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "HelpfulVote_userId_reviewId_key" ON "HelpfulVote"("userId", "reviewId");
