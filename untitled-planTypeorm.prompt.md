## Plan: Backend Car-lease API (TypeORM)

TL;DR - Finish and standardize the backend on TypeORM: fix datasource entity paths, remove or replace Prisma usages, implement missing controllers/services (booking, vehicle, review, transaction, wallet, image upload), add TypeORM migrations and seeds, secure environment, add tests/CI, and produce API docs + deployment artifacts.

**Steps**
1. Confirm scope and constraints (blocking):
   - Confirm `backend/` is canonical and `editor-backend/` will be used only as a reference.
   - Confirm target DB (Postgres recommended) and dev/test DB choice (SQLite for CI/local optional).

2. Fix DB wiring and project configuration
   1. Update entity discovery in `backend/src/db/datasource.ts` so TypeORM finds actual entities under `src/controllers/src-entity/` or move entities to `src/entities/`.
   2. Ensure `tsconfig.json` and `package.json` scripts support transpile/run for TypeORM runtime (add `build`, `start`, and `dev` with `ts-node`/`tsx`).
   3. Add `backend/src/lib/prisma.ts` removal plan: remove Prisma client imports from `backend` controllers and validators; replace with TypeORM repository usage.

3. Replace Prisma usage with TypeORM repository patterns
   1. Search for `prisma` imports in `backend/` (e.g., `backend/src/controllers/src-control/userControl.ts`, `backend/src/validators/auth.ts`) and replace each query with repository calls: `getRepository(Entity).findOne`, `save`, `createQueryBuilder` when needed.
   2. Centralize DB access: add a `getRepository()` helper or use `AppDataSource.getRepository()` everywhere.

4. Implement missing core controllers and services
   - Implement `bookingControl`, `vehicleControl`, `reviewControl`, `transactionControl`, `walletControl` in `backend/src/controllers/src-control/` following `userControl` patterns.
   - Implement `ImageUpload` service in `backend/src/services/ImageUpload.ts` or integrate Cloudinary/Multer from `editor-backend` if you prefer remote storage.
   - Add validators under `backend/src/validators/` for input validation, and use `class-validator` / `class-transformer` with TypeORM entities.
   - Ensure controllers return consistent response shapes and HTTP status codes.

5. Add migrations and seeds (TypeORM)
   1. Add TypeORM CLI config and scripts: `typeorm migration:generate`, `typeorm migration:run`, and `typeorm migration:revert` (or use `ts-node` compatible migration runner).
   2. Create initial migration from entities and commit the SQL/TS migration files under `backend/src/db/migrations/`.
   3. Implement a `seed` script to create admin user, sample vehicles, bookings, and wallets.

6. Routes, route compiler, and Swagger
   - Wire controllers into `backend/src/routes/routes.ts`. Use RESTful paths: `/auth`, `/users`, `/vehicles`, `/bookings`, `/reviews`, `/transactions`, `/wallets`.
   - Keep/adjust `backend/src/routes/routeCompiler.ts` to reflect current routes and generate Swagger data.
   - Run/update `backend/swagger.js` to generate `swagger.json` and serve Swagger UI from `/docs` during dev; commit `swagger.json` or generate in CI.

7. Authentication & Authorization
   - Replace Prisma-based auth validators with TypeORM-based checks in `backend/src/validators/auth.ts`.
   - Implement role middleware: `isAuthenticated`, `isAdmin`, `isOwner` using JWT tokens with access + refresh tokens.
   - Store refresh tokens securely (e.g., DB table `refresh_tokens` with relation to `User` entity).

8. Tests & CI
   - Add unit tests for each controller and service using Jest or Vitest. Mock DB with an in-memory DB (SQLite) or use test containers for Postgres.
   - Add integration tests for critical flows: signup/login, vehicle create/list, booking lifecycle, review creation, wallet transaction.
   - Add GitHub Actions: `lint`, `build`, `test`, and optional `migrations:check`.

9. Docker, deployment, and observability
   - Create a production-ready `Dockerfile` and `docker-compose.yml` (copy patterns from `editor-backend` as needed).
   - Add healthcheck endpoint and configure logging (morgan + structured logger).
   - Add a migration-run step in container entrypoint to ensure DB schema is up-to-date in deployments.

10. Security & housekeeping
   - Remove committed `.env` and rotate credentials; add `.env.example` and `.gitignore`.
   - Add rate-limiting, input sanitization, helmet, and CORS configuration.
   - Run dependency vulnerability checks and add scheduled audits in CI.

**Relevant files (edit or reference)**
- `backend/src/db/datasource.ts` — update entity paths and DB config: [backend/src/db/datasource.ts](backend/src/db/datasource.ts#L1)
- `backend/src/controllers/src-entity/` — entity definitions to be used by TypeORM: [backend/src/controllers/src-entity/](backend/src/controllers/src-entity/)
- `backend/src/controllers/src-control/userControl.ts` — example controller to emulate: [backend/src/controllers/src-control/userControl.ts](backend/src/controllers/src-control/userControl.ts#L1)
- `backend/src/validators/auth.ts` — replace Prisma usage with TypeORM logic: [backend/src/validators/auth.ts](backend/src/validators/auth.ts#L1)
- `backend/src/services/ImageUpload.ts` — implement or integrate upload service: [backend/src/services/ImageUpload.ts](backend/src/services/ImageUpload.ts#L1)
- `backend/src/routes/routes.ts` — route wiring: [backend/src/routes/routes.ts](backend/src/routes/routes.ts#L1)
- `backend/swagger.js` — update generator to current endpoints: [backend/swagger.js](backend/swagger.js#L1)

**Verification**
1. `npm run dev` starts with no TypeORM discovery errors and entities are recognized by `AppDataSource`.
2. `npm run migrate` applies migrations and the DB schema matches the entities.
3. Integration smoke test: signup -> create vehicle -> book vehicle -> create review -> wallet transaction all complete with correct DB mutations.
4. `tsc --noEmit` and `npm run lint` pass.
5. Swagger UI loads at `/docs` and matches implemented endpoints.

**Decisions & assumptions**
- This plan assumes `backend/` will be the single canonical service and `editor-backend/` is reference-only.
- Target DB: Postgres in production; SQLite allowed for local tests.
- Use JWT for auth and store refresh tokens in DB.

**Missing items and blockers (what you lack today)**
1. `AppDataSource` entity path misconfiguration (must be fixed): [backend/src/db/datasource.ts](backend/src/db/datasource.ts#L1).
2. Mixed usage of Prisma in several `backend` files (`prisma` imports) — these must be replaced with TypeORM repository logic (search & replace required).
3. Missing migrations in `backend/src/db/migrations/` — add TypeORM migration setup and initial migration.
4. Empty controllers for booking/vehicle/review/transaction/wallet — need implementations.
5. `ImageUpload` service is a stub — implement local storage or Cloudinary integration.
6. Missing `build`/`start` scripts in `backend/package.json` and missing Docker compose for `backend`.
7. Committed `.env` with secrets — must remove and rotate.
8. No tests or CI — add tests and GitHub Actions.

**Further considerations**
1. Do you want to keep `editor-backend` around as a separate working Prisma server or remove it to avoid confusion?
2. Do you want Cloudinary for image storage in production? (I can implement both local dev and Cloudinary production flows.)
3. Do you prefer `class-validator` for DTO validation or a custom validator layer?

**Next steps I can take**
- Produce a file-by-file change plan (exact edits for each file) and a patch you can apply, or
- Start implementing the TypeORM fixes: update `datasource.ts`, replace Prisma calls in `userControl.ts` and `validators/auth.ts`, and add a sample migration and seed.

Tell me which next step (file patches or implement fixes) and whether you want Cloudinary integration now.