# ---- STAGE 1: Build ----
# Use Node to build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including dev, needed for build)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build
# Output will be in /app/dist folder (Vite default)


# ---- STAGE 2: Serve ----
# Use lightweight Nginx to serve the built files
# This final image has NO Node.js, NO source code - just the built files
FROM nginx:alpine

# Copy built files from Stage 1 into Nginx's serve folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
