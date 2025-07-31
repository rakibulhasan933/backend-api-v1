import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
    // Server configuration
    nodeEnv: string;
    port: number;
    host: string;

    // Database configuration
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
        url: string;
    };

    // JWT configuration
    jwt: {
        secret: string;
        expiresIn: string;
    };

    // Rate limiting
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };

    // CORS
    cors: {
        origin: string;
    };

    // Logging
    logLevel: string;
}

const config: Config = {
    nodeEnv: process.env['NODE_ENV'] || 'development',
    port: parseInt(process.env['PORT'] || '3000', 10),
    host: process.env['HOST'] || 'localhost',

    database: {
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT'] || '5432', 10),
        user: process.env['DB_USER'] || 'postgres',
        password: process.env['DB_PASSWORD'] || 'password',
        name: process.env['DB_NAME'] || 'production_app',
        url: process.env['DATABASE_URL'] || `postgresql://postgres:password@localhost:5432/production_app`,
    },

    jwt: {
        secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-this-in-production',
        expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
    },

    rateLimit: {
        windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
        maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
    },

    cors: {
        origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    },

    logLevel: process.env['LOG_LEVEL'] || 'info',
};

export default config; 