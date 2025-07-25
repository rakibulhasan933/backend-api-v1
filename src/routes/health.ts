import { Router } from "express"
import { db } from "@/db/connection"

const router: Router = Router()

router.get("/", async (_, res) => {
  try {
    // Check database connection
    await db.execute("SELECT 1")
    // If the query succeeds, the database is healthy

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
    })
  }
})

export { router as healthRoutes }
