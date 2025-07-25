# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .env .env

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
# Set environment variable for production
ENV NODE_ENV=production



# Install necessary packages

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --frozen-lockfile && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000


# Start the application
CMD ["node", "dist/index.js"]
