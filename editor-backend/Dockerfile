# --- Stage 1: Base & Builder ---
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV CI=true

# Copy manifest files first for optimal layer caching
COPY package.json pnpm-lock.yaml tsconfig.json pnpm-workspace.yaml .npmrc ./

# Install all dependencies (including devDependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code (including prisma schema)
COPY . .

# Generate Prisma client and compile TypeScript to JavaScript
RUN pnpm prisma generate
RUN pnpm run build

# --- Stage 2: Production Runner ---
FROM node:22-alpine AS runner
# Enable corepack here so 'pnpm' exists in the runner container
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and runtime dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["pnpm", "start"]
