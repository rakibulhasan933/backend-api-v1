# Node.js Production Application

A production-ready Node.js application built with TypeScript, Express, and Drizzle ORM.

## Features

- **TypeScript** - Full type safety
- **Express.js** - Web framework
- **Drizzle ORM** - Type-safe database operations [^2]
- **PostgreSQL** - Database
- **JWT Authentication** - Secure authentication
- **Input Validation** - Using Zod schemas [^1]
- **Error Handling** - Centralized error handling
- **Logging** - Winston logger
- **Security** - Helmet, CORS, Rate limiting
- **Testing** - Jest testing framework
- **Docker** - Containerization
- **CI/CD** - GitHub Actions

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Docker (optional)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd nodejs-production-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Set up the database:
\`\`\`bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Or push schema directly (development)
npm run db:push

# Seed the database
npm run db:seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed the database
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

### Health
- `GET /api/health` - Health check endpoint

## Docker

### Build and run with Docker:
\`\`\`bash
npm run docker:build
npm run docker:run
\`\`\`

### Using Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

## Database Schema

The application uses Drizzle ORM with PostgreSQL. Schema is defined in `src/db/schema.ts` with the following tables:

- **users** - User accounts
- **posts** - Blog posts
- **sessions** - User sessions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |

## Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## Production Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Set production environment variables

3. Run database migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

4. Start the server:
\`\`\`bash
npm start
\`\`\`

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt password hashing
- **Input Validation** - Zod schema validation

## Monitoring and Logging

- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Health Check** - `/api/health` endpoint
- **Error Tracking** - Centralized error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## License

MIT License
