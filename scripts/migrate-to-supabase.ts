import Database from "better-sqlite3";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const SQLITE_PATH = path.join(__dirname, "../prisma/dev.db");

interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
}

interface VerificationToken {
  identifier: string;
  token: string;
  expires: string;
}

interface Apartment {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string | null;
  propertyType: string;
  unitCount: number | null;
  yearBuilt: number | null;
  amenities: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  apartmentId: string;
  userId: string;
  overallRating: number;
  noiseLevel: number;
  naturalLight: number;
  generalVibe: number;
  title: string;
  experienceSummary: string;
  unitNumber: string | null;
  isUnitVerified: number;
  certifiedPersonalExperience: number;
  isVerified: number;
  leaseStartDate: string | null;
  leaseEndDate: string | null;
  wouldRecommend: number;
  anonymous: number;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

interface Favorite {
  id: string;
  userId: string;
  apartmentId: string;
  createdAt: string;
}

interface HelpfulVote {
  id: string;
  userId: string;
  reviewId: string;
  createdAt: string;
}

async function migrate() {
  console.log("Starting migration from SQLite to Supabase...\n");

  // Connect to SQLite
  console.log("Connecting to SQLite database...");
  const sqlite = new Database(SQLITE_PATH, { readonly: true });

  // Connect to PostgreSQL
  console.log("Connecting to Supabase PostgreSQL...");
  const pgClient = new pg.Client({
    connectionString: process.env.DIRECT_URL,
  });
  await pgClient.connect();

  try {
    // Read data from SQLite
    console.log("\nReading data from SQLite...");

    const users = sqlite.prepare("SELECT * FROM User").all() as User[];
    console.log(`  Users: ${users.length}`);

    const accounts = sqlite.prepare("SELECT * FROM Account").all() as Account[];
    console.log(`  Accounts: ${accounts.length}`);

    const sessions = sqlite.prepare("SELECT * FROM Session").all() as Session[];
    console.log(`  Sessions: ${sessions.length}`);

    const verificationTokens = sqlite
      .prepare("SELECT * FROM VerificationToken")
      .all() as VerificationToken[];
    console.log(`  VerificationTokens: ${verificationTokens.length}`);

    const apartments = sqlite
      .prepare("SELECT * FROM Apartment")
      .all() as Apartment[];
    console.log(`  Apartments: ${apartments.length}`);

    const reviews = sqlite.prepare("SELECT * FROM Review").all() as Review[];
    console.log(`  Reviews: ${reviews.length}`);

    const favorites = sqlite
      .prepare("SELECT * FROM Favorite")
      .all() as Favorite[];
    console.log(`  Favorites: ${favorites.length}`);

    const helpfulVotes = sqlite
      .prepare("SELECT * FROM HelpfulVote")
      .all() as HelpfulVote[];
    console.log(`  HelpfulVotes: ${helpfulVotes.length}`);

    // Insert data into PostgreSQL (in order respecting foreign keys)
    console.log("\nInserting data into Supabase...");

    // 1. Users
    console.log("  Inserting Users...");
    for (const user of users) {
      await pgClient.query(
        `INSERT INTO "User" (id, email, name, password, image, "emailVerified", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          user.id,
          user.email,
          user.name,
          user.password,
          user.image,
          user.emailVerified ? new Date(user.emailVerified) : null,
          new Date(user.createdAt),
          new Date(user.updatedAt),
        ]
      );
    }
    console.log(`    ✓ Inserted ${users.length} users`);

    // 2. Accounts
    console.log("  Inserting Accounts...");
    for (const account of accounts) {
      await pgClient.query(
        `INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`,
        [
          account.id,
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      );
    }
    console.log(`    ✓ Inserted ${accounts.length} accounts`);

    // 3. Sessions
    console.log("  Inserting Sessions...");
    for (const session of sessions) {
      await pgClient.query(
        `INSERT INTO "Session" (id, "sessionToken", "userId", expires)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [
          session.id,
          session.sessionToken,
          session.userId,
          new Date(session.expires),
        ]
      );
    }
    console.log(`    ✓ Inserted ${sessions.length} sessions`);

    // 4. VerificationTokens
    console.log("  Inserting VerificationTokens...");
    for (const token of verificationTokens) {
      await pgClient.query(
        `INSERT INTO "VerificationToken" (identifier, token, expires)
         VALUES ($1, $2, $3)
         ON CONFLICT (identifier, token) DO NOTHING`,
        [token.identifier, token.token, new Date(token.expires)]
      );
    }
    console.log(`    ✓ Inserted ${verificationTokens.length} verification tokens`);

    // 5. Apartments
    console.log("  Inserting Apartments...");
    for (const apt of apartments) {
      await pgClient.query(
        `INSERT INTO "Apartment" (id, name, address, city, state, "zipCode", description, "propertyType", "unitCount", "yearBuilt", amenities, "imageUrl", latitude, longitude, "averageRating", "reviewCount", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         ON CONFLICT (id) DO NOTHING`,
        [
          apt.id,
          apt.name,
          apt.address,
          apt.city,
          apt.state,
          apt.zipCode,
          apt.description,
          apt.propertyType,
          apt.unitCount,
          apt.yearBuilt,
          apt.amenities,
          apt.imageUrl,
          apt.latitude,
          apt.longitude,
          apt.averageRating,
          apt.reviewCount,
          new Date(apt.createdAt),
          new Date(apt.updatedAt),
        ]
      );
    }
    console.log(`    ✓ Inserted ${apartments.length} apartments`);

    // 6. Reviews
    console.log("  Inserting Reviews...");
    for (const review of reviews) {
      await pgClient.query(
        `INSERT INTO "Review" (id, "apartmentId", "userId", "overallRating", "noiseLevel", "naturalLight", "generalVibe", title, "experienceSummary", "unitNumber", "isUnitVerified", "certifiedPersonalExperience", "isVerified", "leaseStartDate", "leaseEndDate", "wouldRecommend", anonymous, helpful, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         ON CONFLICT (id) DO NOTHING`,
        [
          review.id,
          review.apartmentId,
          review.userId,
          review.overallRating,
          review.noiseLevel,
          review.naturalLight,
          review.generalVibe,
          review.title,
          review.experienceSummary,
          review.unitNumber,
          Boolean(review.isUnitVerified),
          Boolean(review.certifiedPersonalExperience),
          Boolean(review.isVerified),
          review.leaseStartDate ? new Date(review.leaseStartDate) : null,
          review.leaseEndDate ? new Date(review.leaseEndDate) : null,
          Boolean(review.wouldRecommend),
          Boolean(review.anonymous),
          review.helpful,
          new Date(review.createdAt),
          new Date(review.updatedAt),
        ]
      );
    }
    console.log(`    ✓ Inserted ${reviews.length} reviews`);

    // 7. Favorites
    console.log("  Inserting Favorites...");
    for (const fav of favorites) {
      await pgClient.query(
        `INSERT INTO "Favorite" (id, "userId", "apartmentId", "createdAt")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [fav.id, fav.userId, fav.apartmentId, new Date(fav.createdAt)]
      );
    }
    console.log(`    ✓ Inserted ${favorites.length} favorites`);

    // 8. HelpfulVotes
    console.log("  Inserting HelpfulVotes...");
    for (const vote of helpfulVotes) {
      await pgClient.query(
        `INSERT INTO "HelpfulVote" (id, "userId", "reviewId", "createdAt")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [vote.id, vote.userId, vote.reviewId, new Date(vote.createdAt)]
      );
    }
    console.log(`    ✓ Inserted ${helpfulVotes.length} helpful votes`);

    console.log("\n✅ Migration completed successfully!");

    // Verify counts
    console.log("\nVerifying data counts in Supabase...");
    const pgCounts = await pgClient.query(`
      SELECT
        (SELECT COUNT(*) FROM "User") as users,
        (SELECT COUNT(*) FROM "Account") as accounts,
        (SELECT COUNT(*) FROM "Session") as sessions,
        (SELECT COUNT(*) FROM "VerificationToken") as verification_tokens,
        (SELECT COUNT(*) FROM "Apartment") as apartments,
        (SELECT COUNT(*) FROM "Review") as reviews,
        (SELECT COUNT(*) FROM "Favorite") as favorites,
        (SELECT COUNT(*) FROM "HelpfulVote") as helpful_votes
    `);

    const counts = pgCounts.rows[0];
    console.log(`  Users: ${counts.users}`);
    console.log(`  Accounts: ${counts.accounts}`);
    console.log(`  Sessions: ${counts.sessions}`);
    console.log(`  VerificationTokens: ${counts.verification_tokens}`);
    console.log(`  Apartments: ${counts.apartments}`);
    console.log(`  Reviews: ${counts.reviews}`);
    console.log(`  Favorites: ${counts.favorites}`);
    console.log(`  HelpfulVotes: ${counts.helpful_votes}`);
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    sqlite.close();
    await pgClient.end();
  }
}

migrate().catch(console.error);
