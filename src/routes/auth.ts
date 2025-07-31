import express, { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} from '../controllers/authController';
import {
  validateUserRegistration,
  validateUserLogin,
} from '../utils/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router() as express.Router;

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router; 