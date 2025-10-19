# Frontend Dockerfile for development
FROM node:20.9.0-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Expose port
EXPOSE 3000

# Default command
CMD ["bun", "dev"]
