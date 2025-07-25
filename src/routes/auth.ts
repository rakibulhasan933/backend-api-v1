import { Router } from "express"
import { z } from "zod"
import { db } from "@/db/connection"
import { users } from "@/db/schema"
import { hashPassword, comparePassword, generateToken } from "@/utils/auth"
import { validate } from "@/middleware/validation"
import { createError } from "@/middleware/errorHandler"
import { eq } from "drizzle-orm"

const router: Router = Router()

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
})

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      throw createError("User already exists", 409)
    }

    const passwordHash = await hashPassword(password)

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
      })

    const token = generateToken({ userId: newUser?.id })

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw createError("Invalid credentials", 401)
    }

    const token = generateToken({ userId: user.id })

    res.json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
})

export { router as authRoutes }
