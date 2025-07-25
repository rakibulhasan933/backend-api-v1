import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"

import { config } from "@/config/config"
import { logger } from "@/utils/logger"
import { globalRateLimit } from "@/middleware/rateLimiting"
import { errorHandler } from "@/middleware/errorHandler"
import { notFoundHandler } from "@/middleware/notFoundHandler"
import { authRoutes } from "@/routes/auth"
import { userRoutes } from "@/routes/users"
import { healthRoutes } from "@/routes/health"
import { exampleRoutes } from "./routes/example"

const app: express.Application = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin:
      process.env['NODE_ENV'] === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
)

// Global rate limiting (applied to all routes except those that skip it)
app.use(globalRateLimit)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
)

// Routes
app.use("/api/health", healthRoutes)
app.use("/api/", exampleRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Error handling middleware
app.use(notFoundHandler)
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
})

export { app, server }
