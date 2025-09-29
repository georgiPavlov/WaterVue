# WaterVue Frontend Container
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://waterplantapp:8001

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    bash

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Default command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
