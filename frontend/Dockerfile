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

# Build the app
RUN npm run build

# Expose port (Vite preview port or separate server)
EXPOSE 5173

# Start command
CMD ["npm", "run", "dev", "--", "--host"]
