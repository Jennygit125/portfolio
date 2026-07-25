# --- Stage 1: Base & Builder ---
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV CI=true

# Copy manifest files and security configuration
COPY package.json pnpm-lock.yaml tsconfig.json pnpm-workspace.yaml .npmrc ./

# Install dependencies allowing native build scripts to execute
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --unsafe-perm

# Copy the rest of the source code
COPY . .

# Generate Prisma client and compile TypeScript to JavaScript
RUN pnpm prisma generate
RUN pnpm run build

# --- Stage 2: Production Runner ---
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts and runtime dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Start command executed instantly once the container boots up
CMD ["pnpm", "start"]
