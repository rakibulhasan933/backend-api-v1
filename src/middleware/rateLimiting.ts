import rateLimit from "express-rate-limit"
import { logger } from "@/utils/logger"

// Default rate limiter (existing global one)
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/api/health"), // Skip health checks
})

// Strict rate limiter for specific routes (5 requests per IP)
export const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 requests per window per IP
    message: {
        error: "Rate limit exceeded",
        message: "Too many requests to this endpoint. You can make only 5 requests per 15 minutes.",
        retryAfter: "15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip} on route: ${req.path}`)
        res.status(429).json({
            error: "Rate limit exceeded",
            message: "Too many requests to this endpoint. You can make only 5 requests per 15 minutes.",
            retryAfter: "15 minutes",
        })
    },
})

// Very strict rate limiter for sensitive operations (1 request per minute)
export const sensitiveRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // Only 1 request per minute per IP
    message: {
        error: "Rate limit exceeded",
        message: "This is a sensitive operation. Only 1 request per minute is allowed.",
        retryAfter: "1 minute",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Custom rate limiter factory for flexible configurations
export const createCustomRateLimit = (options: {
    windowMs: number
    max: number
    message?: string
    skipSuccessfulRequests?: boolean
}) => {
    return rateLimit({
        windowMs: options.windowMs,
        max: options.max,
        message: options.message || "Rate limit exceeded",
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: options.skipSuccessfulRequests || false,
        handler: (req, res) => {
            logger.warn(`Custom rate limit exceeded for IP: ${req.ip} on route: ${req.path}`)
            res.status(429).json({
                error: "Rate limit exceeded",
                message: options.message || "Too many requests, please try again later.",
            })
        },
    })
}
