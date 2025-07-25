import { z } from "zod"

const configSchema = z.object({
  port: z.number().default(3000),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  databaseUrl: z.string().url(),
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default("7d"),
  rateLimitWindowMs: z.number().default(15 * 60 * 1000), // 15 minutes
  strictRateLimitMax: z.number().default(5), // For strict rate limiting
  rateLimitMaxRequests: z.number().default(100),
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
  logFile: z.string().default("logs/app.log"),
})

const parseConfig = () => {
  const config = {
    port: Number.parseInt(process.env['PORT'] || "3000", 10),
    nodeEnv: process.env['NODE_ENV'] as "development" | "production" | "test",
    databaseUrl: process.env['DATABASE_URL']!,
    jwtSecret: process.env['JWT_SECRET']!,
    jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || "7d",
    rateLimitWindowMs: Number.parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || "900000", 10),
    strictRateLimitMax: Number.parseInt(process.env['STRICT_RATE_LIMIT_MAX'] || "5", 10),
    rateLimitMaxRequests: Number.parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || "100", 10),
    logLevel: process.env['LOG_LEVEL'] as "error" | "warn" | "info" | "debug",
    logFile: process.env['LOG_FILE'] || "logs/app.log",
  }

  return configSchema.parse(config)
}

export const config = parseConfig()
