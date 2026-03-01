# Development-friendly Dockerfile for frontend
FROM node:18-alpine

# set working directory
WORKDIR /app

# ensure dev dependencies are installed so Tailwind/PostCSS are available
ENV NODE_ENV=development

# copy package manifests and install deps (include devDependencies for Tailwind/PostCSS)
COPY package.json package-lock.json* ./
# Use npm ci when lockfile is present to get reproducible installs and include dev deps.
RUN if [ -f package-lock.json ]; then npm ci --include=dev; else npm install; fi

# copy source
COPY . .

# expose dev port
EXPOSE 5173

# start development server (bind to all interfaces via script)
CMD ["npm", "run", "dev"]
