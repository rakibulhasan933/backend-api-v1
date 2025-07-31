# Production Node.js Application

A production-ready Node.js application built with TypeScript, Drizzle ORM, PostgreSQL, and Docker.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Authentication**: JWT-based authentication with refresh tokens
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Docker**: Multi-stage Docker builds for production and development
- **Database**: PostgreSQL with proper migrations and schema management
- **Error Handling**: Centralized error handling with proper logging
- **API Documentation**: RESTful API with comprehensive endpoints

## 📋 Prerequisites

- Node.js 18+ 
- Bun 1.0+
- Docker and Docker Compose
- PostgreSQL (if running locally)

## 🛠️ Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nodejs-production-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker run -d \
     --name postgres \
     -e POSTGRES_DB=production_app \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     postgres:15-alpine
   ```

5. **Generate and run database migrations**
   ```bash
   bun run db:generate
   bun run db:push
   ```

6. **Start development server**
   ```bash
   bun run dev
   ```

### Option 2: Docker Development

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd nodejs-production-app
   ```

2. **Start with Docker Compose**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Start with development profile
   docker-compose --profile dev up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec app bun run db:generate
   docker-compose exec app bun run db:push
   ```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration management
├── controllers/     # Route controllers
├── database/        # Database schema and connection
├── middleware/      # Custom middleware
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer your-access-token
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Health Check
```http
GET /health
```

## 🐳 Docker Commands

### Development
```bash
# Start development environment
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev

# Stop development environment
docker-compose --profile dev down
```

### Production
```bash
# Build and start production environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop production environment
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Database Operations
```bash
# Generate migrations
docker-compose exec app bun run db:generate

# Push schema changes
docker-compose exec app bun run db:push

# Open Drizzle Studio
docker-compose exec app bun run db:studio
```

## 📝 Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build the application for production
- `bun start` - Start production server
- `bun run db:generate` - Generate database migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio
- `bun run db:seed` - Seed database with sample data
- `bun run db:test-seed` - Test and verify seed data
- `bun run clean` - Clean build directory

## 🔧 Configuration

The application uses environment variables for configuration. Copy `env.example` to `.env` and modify as needed:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=production_app
DATABASE_URL=postgresql://postgres:password@localhost:5432/production_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Express-validator for request validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **SQL Injection Protection**: Drizzle ORM prevents SQL injection

## 🚀 Deployment

### Production Deployment

1. **Build the Docker image**
   ```bash
   docker build -t production-app .
   ```

2. **Run with environment variables**
   ```bash
   docker run -d \
     --name production-app \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL=your-production-db-url \
     -e JWT_SECRET=your-production-jwt-secret \
     production-app
   ```

### Environment Variables for Production

Make sure to set these environment variables in production:

- `NODE_ENV=production`
- `DATABASE_URL` - Your production PostgreSQL connection string
- `JWT_SECRET` - A strong, unique secret key
- `CORS_ORIGIN` - Your frontend domain

## 📊 Monitoring

The application includes health check endpoints and logging:

- Health check: `GET /health`
- Application logs are available via Docker logs
- Database connection monitoring
- Request/response logging with Morgan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review the API endpoints
3. Check the logs for error messages
4. Open an issue on GitHub

## 🔄 Database Migrations

When you make changes to the database schema:

1. Update the schema in `src/database/schema.ts`
2. Generate migrations: `bun run db:generate`
3. Apply migrations: `bun run db:push`

## 🌱 Database Seeding

The application includes a comprehensive seeding system to populate the database with sample data for development and testing.

### Seed Data Overview

The seed script creates the following sample data:

- **Users**: 4 users (1 admin, 3 regular users)
- **Categories**: 5 categories (Technology, Business, Lifestyle, Travel, Food)
- **Posts**: 5 sample posts with different statuses
- **Comments**: 7 comments (5 approved, 2 pending) with nested replies
- **Post-Category Relations**: Each post assigned to 1-3 categories
- **Refresh Tokens**: Sample refresh token for admin user

### Running the Seed Script

```bash
# Seed the database with sample data
bun run db:seed
```

### Testing Seed Data

```bash
# Test and verify the seed data
bun run db:test-seed
```

### Sample Credentials

After seeding, you can use these test credentials:

- **Admin User**: `admin@example.com` / `admin123`
- **Regular User**: `john.doe@example.com` / `password123`

### Seed Script Features

- **Password Hashing**: All passwords are properly hashed using bcrypt
- **Realistic Data**: Sample posts with proper content and metadata
- **Relationship Testing**: Verifies all database relationships work correctly
- **Status Variations**: Includes published, draft, and pending content
- **Category Assignment**: Randomly assigns posts to multiple categories
- **Nested Comments**: Includes comment replies to test hierarchical data

### Customizing Seed Data

To modify the seed data, edit the following files:

- `scripts/seed.ts` - Main seed script with sample data
- `scripts/test-seed.ts` - Test script to verify seed data

The seed script includes:
- User creation with different roles and verification statuses
- Category creation with slugs and descriptions
- Post creation with various statuses and view counts
- Comment creation with approval statuses
- Post-category relationship creation
- Refresh token creation for testing authentication

### Seed Script Output

When you run the seed script, you'll see output like:

```
🌱 Starting database seeding...
🗑️  Clearing existing data...
👥 Seeding users...
✅ Created 4 users
📂 Seeding categories...
✅ Created 5 categories
📝 Seeding posts...
✅ Created 5 posts
🏷️  Seeding post categories...
✅ Created 12 post-category relations
💬 Seeding comments...
✅ Created 7 comments
🔄 Seeding comment replies...
✅ Created 2 comment replies
🔐 Seeding refresh tokens...
✅ Created refresh token for admin user
🎉 Database seeding completed successfully!

📊 Summary:
- Users: 4
- Categories: 5
- Posts: 5
- Comments: 9
- Post-Category Relations: 12
- Refresh Tokens: 1

🔑 Test Credentials:
Admin: admin@example.com / admin123
User: john.doe@example.com / password123
```

## 🧪 Testing

To add tests to this application:

1. Install testing dependencies (Jest, Supertest)
2. Create test files in a `tests/` directory
3. Add test scripts to `package.json`
4. Run tests with `bun test`

## 📈 Performance

This application is optimized for production with:

- Multi-stage Docker builds
- Connection pooling
- Rate limiting
- Efficient database queries
- Proper error handling
- Graceful shutdown handling 