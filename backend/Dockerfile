# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app (if applicable, for backend we run TS directly or build)
# For this setup, we'll assume we run dev or build. Let's build.
RUN npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
