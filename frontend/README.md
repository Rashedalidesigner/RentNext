# RentNest Frontend — Assignment 5 🏠

RentNest is a responsive rental-property marketplace built with **Next.js App Router, React, TypeScript and Tailwind CSS** and connected to the supplied Express/Prisma API.

## Features

- Public home page and property marketplace
- Property search/filter UI
- Property details and gallery UI
- Tenant registration/login and rental request workflow
- Tenant dashboard, saved properties, payments and reviews
- Stripe checkout success/cancel pages
- Landlord listing create/update/delete UI and request approval/rejection
- Admin user directory with explicit ban/unban actions
- Responsive/mobile-friendly layouts
- Next.js App Router catch-all routing with browser URL synchronization
- Middleware role protection for `/dashboard/*`
- Configurable backend API client in `src/lib/api.ts`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend configuration

`.env.local` is configured for the supplied backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Make sure the backend is running on port 4000 before using authenticated features.

## Production build

```bash
npm run build
npm start
```
