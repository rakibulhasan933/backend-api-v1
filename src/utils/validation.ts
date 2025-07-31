import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
        return;
    }
    next();
};

// User validation rules
export const validateUserRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('username')
        .isLength({ min: 3, max: 50 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-50 characters long and contain only letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('First name must be less than 100 characters'),
    body('lastName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Last name must be less than 100 characters'),
    validate,
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate,
];

// Post validation rules
export const validateCreatePost = [
    body('title')
        .isLength({ min: 1, max: 255 })
        .trim()
        .withMessage('Title must be between 1 and 255 characters'),
    body('content')
        .isLength({ min: 1 })
        .withMessage('Content is required'),
    body('slug')
        .isLength({ min: 1, max: 255 })
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('excerpt')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Excerpt must be less than 500 characters'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    body('featuredImage')
        .optional()
        .isURL()
        .withMessage('Featured image must be a valid URL'),
    body('categoryIds')
        .optional()
        .isArray()
        .withMessage('Category IDs must be an array'),
    body('categoryIds.*')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),
    validate,
];

export const validateUpdatePost = [
    body('title')
        .optional()
        .isLength({ min: 1, max: 255 })
        .trim()
        .withMessage('Title must be between 1 and 255 characters'),
    body('content')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty'),
    body('slug')
        .optional()
        .isLength({ min: 1, max: 255 })
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('excerpt')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Excerpt must be less than 500 characters'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    body('featuredImage')
        .optional()
        .isURL()
        .withMessage('Featured image must be a valid URL'),
    validate,
];

// Comment validation rules
export const validateCreateComment = [
    body('content')
        .isLength({ min: 1, max: 1000 })
        .trim()
        .withMessage('Comment content must be between 1 and 1000 characters'),
    body('postId')
        .isInt({ min: 1 })
        .withMessage('Post ID must be a positive integer'),
    body('parentId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Parent comment ID must be a positive integer'),
    validate,
];

// ID parameter validation
export const validateIdParam = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    validate,
];

// Pagination validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'title', 'viewCount'])
        .withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    validate,
];

// Search validation
export const validateSearch = [
    ...validatePagination,
    query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters'),
    query('category')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Category must be less than 100 characters'),
    query('author')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Author must be less than 100 characters'),
    query('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    query('dateFrom')
        .optional()
        .isISO8601()
        .withMessage('Date from must be a valid ISO date'),
    query('dateTo')
        .optional()
        .isISO8601()
        .withMessage('Date to must be a valid ISO date'),
    validate,
]; 