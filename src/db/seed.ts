import "dotenv/config"
import { db } from "./connection"
import { users, posts } from "./schema"
import { hashPassword } from "@/utils/auth"
import { logger } from "@/utils/logger"

async function seed() {
  try {
    logger.info("Starting database seed...")

    // Create sample users
    const hashedPassword = await hashPassword("password123")

    const [user1, user2] = await db
      .insert(users)
      .values([
        {
          email: "john@example.com",
          username: "john_doe",
          passwordHash: hashedPassword,
          firstName: "John",
          lastName: "Doe",
          isVerified: true,
        },
        {
          email: "jane@example.com",
          username: "jane_smith",
          passwordHash: hashedPassword,
          firstName: "Jane",
          lastName: "Smith",
          isVerified: true,
        },
      ])
      .returning()

    // Create sample posts
    if (!user1?.id || !user2?.id) {
      throw new Error("User IDs are missing, cannot seed posts.");
    }

    await db.insert(posts).values([
      {
        title: "Getting Started with Node.js",
        content: "This is a comprehensive guide to getting started with Node.js...",
        slug: "getting-started-with-nodejs",
        authorId: user1.id,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "TypeScript Best Practices",
        content: "Learn the best practices for writing TypeScript code...",
        slug: "typescript-best-practices",
        authorId: user2.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    ])

    logger.info("Database seeded successfully!")
  } catch (error) {
    logger.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()
