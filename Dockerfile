# 1) Use node to build
FROM node:22.8-alpine AS build

# Create a directory in the container, e.g. /app
WORKDIR /app

# Copy *only* package.json & package-lock.json from the front folder
COPY front/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular code
COPY front/ .

# Build the Angular app
RUN npm run build

# 2) Use NGINX to serve the built app
FROM nginx:alpine

# Copy from the build stage into NGINX
COPY --from=build /app/dist/front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
