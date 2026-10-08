# RentNest — Connected Next.js + Express/Prisma

This is the repaired RentNest assignment package. It contains the Next.js frontend and the supplied Express/Prisma backend.

## 1. Start the backend

Requirements: Node.js 20+ and a PostgreSQL database.

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env` instead of `copy`.

Edit `.env` and set at least:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=4000
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
ACCESS_TOKEN_EXPEIR=1d
REFRESH_TOKEN_EXPEIR=7d
ACCESS_TOKEN_SOLT_ROUND=10
REFRESH_TOKEN_SOLT_ROUND=10
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Then:

```bash
npx prisma generate
npm run dev
```

Backend health check: `http://localhost:4000/`

## 2. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend already contains `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 3. What was repaired

- Public properties now load even when nobody is logged in.
- API connection failures show a useful message instead of a generic crash.
- Empty backend property image arrays now get safe marketplace placeholders.
- User avatar rendering has a safe fallback.
- Admin Ban and Unban actions are now explicit instead of both toggling the state.
- Payment detail endpoint was corrected from a catch-all `/:id` route to `/payments/:id`.
- Payment detail reads the ID from URL params instead of `req.body`.
- Payment customer IDs are made unique per rental payment.
- Refresh-token user lookup is awaited correctly.
- Backend CORS now uses `FRONTEND_URL` instead of a hard-coded origin.
- Backend port/frontend URL have sensible local defaults.
- The canonical Prisma schema was repaired so `schema.prisma` contains the generated application's models/enums instead of only the datasource block.
- Setup documentation was corrected to match the actual connected implementation.

## 4. Important note about the environment

I repaired the source code and created a visual preview, but this execution environment cannot reach `registry.npmjs.org`, so it cannot download the project's npm dependencies and run a real Next.js build here. Your local machine needs internet access for the first `npm install`.

After installation, use:

```bash
cd frontend
npm run build
```

and, separately for the backend:

```bash
cd backend
npm run build
```

## Preview

A static visual preview of the repaired RentNest home page is included in `preview/rentnest-home-preview.png`.
