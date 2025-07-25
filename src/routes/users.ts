import { Router } from "express"
import { z } from "zod"
import { db } from "@/db/connection"
import { users } from "@/db/schema"
import { authenticate, type AuthRequest } from "@/middleware/auth"
import { validate } from "@/middleware/validation"
import { eq } from "drizzle-orm"

const router: Router = Router()

const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().min(3).max(50).optional(),
  }),
})

router.get("/profile", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1)

    res.json({
      status: "success",
      data: { user },
    })
  } catch (error) {
    next(error)
  }
})

router.put("/profile", authenticate, validate(updateUserSchema), async (req: AuthRequest, res, next) => {
  try {
    const { firstName, lastName, username } = req.body

    const [updatedUser] = await db
      .update(users)
      .set({
        firstName,
        lastName,
        username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
      })

    res.json({
      status: "success",
      data: { user: updatedUser },
    })
  } catch (error) {
    next(error)
  }
})

export { router as userRoutes }
