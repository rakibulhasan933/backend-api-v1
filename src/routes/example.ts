// Example of how to create a route with custom rate limiting
import { Router } from "express"
import { createCustomRateLimit } from "@/middleware/rateLimiting"

import type { Router as ExpressRouter } from "express"
const router: ExpressRouter = Router()

// Custom rate limiter: 5 requests per 10 minutes
const customRateLimit = createCustomRateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 requests per window
    message: "You can only access this endpoint 5 times per 10 minutes",
    skipSuccessfulRequests: false,
})

// Apply custom rate limiting to a specific route
router.get("/limited-endpoint", customRateLimit, (_req, res) => {
    res.json({
        status: "success",
        message: "This endpoint is rate limited to 5 requests per 10 minutes per IP",
        timestamp: new Date().toISOString(),
    })
})

// Another example with different limits
const veryStrictLimit = createCustomRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 2, // Only 2 requests per 5 minutes
    message: "This endpoint allows only 2 requests per 5 minutes",
})

router.get("/very-limited", veryStrictLimit, (_req, res) => {
    res.json({
        status: "success",
        message: "This is a very limited endpoint",
    })
})

export { router as exampleRoutes }
