# Step 1: Use official Node.js lightweight image
FROM node:18-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package files first (for caching - if code changes but packages don't, this layer is reused)
COPY package*.json ./

# Step 4: Install only production dependencies (no nodemon etc.)
RUN npm install --production

# Step 5: Copy the rest of your backend code
COPY . .

# Step 6: Tell Docker this container uses port 5000
EXPOSE 5000

# Step 7: Start the server
CMD ["node", "server.js"]