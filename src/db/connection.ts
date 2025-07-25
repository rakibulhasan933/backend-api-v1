import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { config } from "@/config/config"
import { logger } from "@/utils/logger"
import * as schema from "./schema"

// Create the connection
const client = postgres(config.databaseUrl, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })

// Test the connection
export const testConnection = async () => {
  try {
    await client`SELECT 1`
    logger.info("Database connection established successfully")
  } catch (error) {
    logger.error("Failed to connect to database:", error)
    process.exit(1)
  }
}
