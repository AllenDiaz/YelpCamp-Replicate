# Use Node.js LTS version
FROM node:20-alpine

# Install dependencies for building
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Configure npm for SSL and install dependencies
RUN npm config set strict-ssl false && \
    npm config set registry http://registry.npmjs.org/ && \
    npm install

# Copy all application files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application using npx
RUN npx next build

# Expose port
EXPOSE 3001

# Set port environment variable
ENV PORT=3001

# Start the application
CMD ["npm", "start"]
