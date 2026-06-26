# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose output
RUN npm config set strict-ssl false && \
    npm config set registry http://registry.npmjs.org/ && \
    npm install --legacy-peer-deps --verbose

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
