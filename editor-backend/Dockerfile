# --- Stage 1: Base & Builder ---
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV CI=true

# CRUCIAL: Added .npmrc to this line so Docker copies your security override
COPY package.json pnpm-lock.yaml tsconfig.json pnpm-workspace.yaml .npmrc ./

# Install all dependencies (including devDependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate Prisma client and compile TypeScript to JavaScript
COPY . .
RUN pnpm prisma generate
RUN pnpm run build

# --- Stage 2: Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy your built application source
COPY --from=builder /app/build ./build

# Copy your full node_modules tree (keeps tsx and prisma engines intact)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["pnpm", "start"]
