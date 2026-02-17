# Railway App

A full stack app for railway management with three user types:
- **Admin**: Full access (first Google login becomes admin)
- **Athlete**: Authenticated users (Google login)
- **Guest**: Read-only, no login required

## Tech Stack
- React (frontend)
- Node.js/Express (backend)
- PostgreSQL (database)
- Google OAuth (authentication)

## Setup
1. Clone the repo and install dependencies in both `frontend` and backend root:
   ```bash
   cd frontend && npm install
   cd ../ && npm install
   ```
2. Set up PostgreSQL and run the schema:
   ```bash
   psql -U your_db_user -d your_db_name -f backend/schema.sql
   ```
3. Fill in `backend/.env` with your credentials and Google OAuth keys.
4. Start backend:
   ```bash
   node backend/index.js
   ```
5. Start frontend:
   ```bash
   cd frontend && npm start
   ```

## Auth
- Visit `/auth/google` to login.
- `/api/me` returns current user info and role.

## Roles
- First user to login is assigned `admin`.
- All others are `athlete`.
- Not logged in = `guest`.

---
Replace placeholders in `.env` with your actual credentials.
