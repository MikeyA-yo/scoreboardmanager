# Live Scoreboard Management

This project implements a live scoreboard web application with Next.js App Router and MongoDB.

## Core Entities
- User: username, email, passwordHash
- Event: name (slug), description, creatorId, managementPasswordHash, teams[2..10], sessions[]
- Session: name, scores[] aligned with teams order

## Features Implemented (Phase 1)
- Landing page with create event form
- Create event API (POST /api/events)
- Public event view /event/[name]
- Management view /event/[name]/manage with add/update sessions via password auth placeholder
- Polling (naive full reload) every 5s in public view

## Upcoming (Planned)
- Integrate Better Auth for accounts (replace managementPassword for creators)
- Refined polling using JSON diff update instead of reload
- Input validation improvements & server-side sanitization
- Rate limiting & basic abuse protection
- Tests (unit + integration)

## Environment
Copy `.env.example` to `.env.local` and set values.

```
MONGODB_URI=...
BETTER_AUTH_SECRET=...
```

## Dev
`npm run dev`

## Folder Structure
- app/api/events: REST endpoints for events
- app/event/[name]: Public scoreboard
- app/event/[name]/manage: Management UI
- components: Reusable UI components
- lib/mongodb.ts: MongoDB connection helper
- types/models.ts: Shared TypeScript interfaces

## Notes
This is an initial scaffold; security (auth, validation) needs enhancement before production use.
