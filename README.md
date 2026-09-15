# Elysian — Luxury Hotel Booker

[![CI](https://github.com/Rudra-ctrl-07/elysian-luxury-hotel-booker/actions/workflows/ci.yml/badge.svg)](https://github.com/Rudra-ctrl-07/elysian-luxury-hotel-booker/actions/workflows/ci.yml)

A luxury hotel booking web app with a full customer flow: browse hotels and rooms, view offers, sign up / log in, book a stay, and review booking history. Ships as two parts — a React SPA frontend and an Express + Prisma backend — with internationalization (English/Spanish UI strings via `LanguageContext`).

## Features

- **10 routed pages** (HashRouter): Home, Rooms, Offers, About, Contact, Login, Signup, Profile, Booking, Booking History
- **Protected routes** — booking, profile, and history require a logged-in user (`components/ProtectedRoute.tsx`)
- **Auth** — client-side auth context (`contexts/AuthContext.tsx`) with login/signup/logout and session restore on load
- **Hotel data** — mock catalog in `data/mockData.ts` (Elysian Grand NY, Elysian Palace Paris, Elysian Sands Maldives, …) with rooms, offers, testimonials
- **Backend** (`backend/`) — Express + Prisma (SQLite) API with JWT auth, hotels/rooms/bookings/offers/testimonials routes, availability checking, Joi validation, rate limiting. Has been run locally (`dev.db` present)

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind, react-router-dom
- **Backend:** Express, TypeScript, Prisma (SQLite), JWT, bcryptjs, Joi, Helmet, CORS, rate limiting

## Run locally

### Frontend

```bash
npm install
npm run dev
```

### Backend (optional — frontend currently runs on mock data)

```bash
cd backend
npm install
cp env.example .env
npm run migrate     # prisma migrate dev — creates/updates dev.db
npm run seed        # seed hotels/rooms
npm run dev         # API server
```

See `backend/README.md` for the full endpoint list.

## Project structure

```
├── App.tsx                # Router + Auth/Language providers
├── pages/                 # 10 page components
├── components/            # Header, Footer, ProtectedRoute, …
├── contexts/              # AuthContext, LanguageContext
├── data/mockData.ts       # Hotels, rooms, offers, testimonials
├── utils/                 # auth helpers
└── backend/               # Express + Prisma API (own README)
```

## Status / known limitations

- The frontend currently renders mock data; wiring the pages to the backend API is the main remaining step
- Auth state is client-side only in the frontend (the backend has its own JWT flow, not yet connected)
- No tests on either side; not deployed
