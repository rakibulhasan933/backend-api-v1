import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "@/utils/auth"
import { db } from "@/db/connection"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    username: string
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token) as { userId: string }

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (!user[0]) {
      return res.status(401).json({ error: "Invalid token" })
    }

    req.user = user[0]
    next()
    return
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
