# Use official Node.js image as a base image
FROM node:16-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app will run on
EXPOSE 5173

# Run the Vite app in development mode, ensure it listens on all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
