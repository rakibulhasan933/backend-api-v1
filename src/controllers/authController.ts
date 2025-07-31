import { Request, Response } from 'express';
import { db } from '../database/connection';
import { users, refreshTokens } from '../database/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth';
import { CreateUserRequest, LoginRequest, ApiResponse, User, AuthenticatedRequest } from '../types';
import { createError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, username, password, firstName, lastName }: CreateUserRequest = req.body;

  // Check if user already exists
  const existingUserByEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
    
  const existingUserByUsername = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
    
  const existingUser = [...existingUserByEmail, ...existingUserByUsername];

  if (existingUser.length > 0) {
    throw createError('User with this email or username already exists', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      username,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

  if (!newUser) {
    throw createError('Failed to create user', 500);
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  const refreshToken = generateRefreshToken();

  // Store refresh token
  await db.insert(refreshTokens).values({
    token: refreshToken,
    userId: newUser.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
    isActive: newUser.isActive,
    isVerified: newUser.isVerified,
    createdAt: newUser.createdAt,
  };

  const response: ApiResponse<{ user: User; accessToken: string; refreshToken: string }> = {
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse as User,
      accessToken,
      refreshToken,
    },
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequest = req.body;

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw createError('Account is deactivated', 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken();

  // Store refresh token
  await db.insert(refreshTokens).values({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  const userResponse = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  const response: ApiResponse<{ user: User; accessToken: string; refreshToken: string }> = {
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse as User,
      accessToken,
      refreshToken,
    },
  };

  res.json(response);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw createError('Refresh token is required', 400);
  }

  // Find refresh token in database
  const [refreshTokenRecord] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  if (!refreshTokenRecord || refreshTokenRecord.isRevoked) {
    throw createError('Invalid refresh token', 401);
  }

  if (new Date() > refreshTokenRecord.expiresAt) {
    throw createError('Refresh token has expired', 401);
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, refreshTokenRecord.userId));

  if (!user || !user.isActive) {
    throw createError('User not found or inactive', 401);
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response: ApiResponse<{ accessToken: string }> = {
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
    },
  };

  res.json(response);
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  if (token) {
    // Revoke refresh token
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.token, token));
  }

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.json(response);
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      avatar: users.avatar,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw createError('User not found', 404);
  }

  const userResponse = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const response: ApiResponse<{ user: User }> = {
    success: true,
    message: 'Profile retrieved successfully',
    data: { user: userResponse as User },
  };

  res.json(response);
}); 