import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { Request as ExpressRequest } from 'express';
import { users, posts, categories, comments, refreshTokens } from '../database/schema';

// Database model types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status?: 'draft' | 'published';
  featuredImage?: string;
  categoryIds?: number[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  status?: 'draft' | 'published';
  featuredImage?: string;
  categoryIds?: number[];
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Express Request with user
export interface AuthenticatedRequest extends ExpressRequest {
  user?: User;
}

// Pagination
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search and filter
export interface SearchQuery extends PaginationQuery {
  search?: string;
  category?: string;
  author?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
} 