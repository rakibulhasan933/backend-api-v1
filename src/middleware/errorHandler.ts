import type { Request, Response } from "express"
import { logger } from "@/utils/logger"
import { config } from "@/config/config"

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (err: AppError, req: Request, res: Response) => {
  let { statusCode = 500, message } = err

  logger.error({
    error: err,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    },
  })

  if (config.nodeEnv === "production" && !err.isOperational) {
    message = "Something went wrong!"
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  })
}

export const createError = (message: string, statusCode = 500): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
