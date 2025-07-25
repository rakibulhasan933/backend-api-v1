import bcrypt from "bcryptjs"
import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken"
import { config } from "@/config/config"

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const generateToken = (
  payload: string | object | Buffer,
): string => {
  const secret: Secret = config.jwtSecret || ""
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any,
  }
  return jwt.sign(payload, secret, options)
}

export const verifyToken = (token: string): JwtPayload | string => {
  const secret: Secret = config.jwtSecret || ""
  return jwt.verify(token, secret)
}
