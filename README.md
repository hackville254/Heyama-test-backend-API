# Heyama Objects API

Backend service to manage a collection of Objects with images stored on S3. Built with NestJS, MongoDB (Mongoose), and documented via Swagger.

## Features
- Objects: `title`, `description`, `imageUrl`, `createdAt`
- REST API: create, list, get by id, delete
- S3 presigned upload URL generation and image deletion
- Swagger UI at `/api`

## Tech Stack
- NestJS 11 (Express)
- MongoDB + Mongoose (manual providers)
- AWS SDK v3 (S3 presign + delete)
- TypeScript, ESLint, Prettier, pnpm

## API
- `POST /objects/upload-url` → returns `{ uploadUrl, publicUrl, key }`
- `POST /objects` → body `{ title, description, imageUrl }`
- `GET /objects` → list objects
- `GET /objects/:id` → object by id
- `DELETE /objects/:id` → removes DB record and S3 image

## Upload Flow
1. Call `POST /objects/upload-url` with `filename`, `contentType`
2. PUT file to `uploadUrl` with `Content-Type`
3. Save record via `POST /objects` using returned `publicUrl`

## Setup
```bash
pnpm install
```
Requirements: Node 22+, pnpm, MongoDB (local or Atlas), S3 bucket.

## Environment
Create `.env`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/heyama
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket
PORT=3000
```
Never commit real secrets.

## Run
```bash
pnpm start        # dev
pnpm start:dev    # watch
pnpm start:prod   # production
```
Open Swagger: `http://localhost:3000/api` (fallback to `3001` if `3000` is busy).

## Tests
```bash
pnpm test         # unit
pnpm test:e2e     # e2e
pnpm test:cov     # coverage
```

## Project Structure
- `src/objects` controllers, service, schema, providers
- `src/s3` S3 service (presign, delete)
- `src/database` Mongoose connection provider
- `src/main.ts` bootstrap + Swagger

## Collaboration
- Code style: Prettier + ESLint; run `pnpm run lint` and `pnpm run format`
- Keep controllers thin; business logic in services
- Use DTOs and types; avoid committing secrets
- Open PRs with clear scope and tests when possible
