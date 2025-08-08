# WIP-backend
Backend repo for "Work in Progress"

8/8/2025

New Work:
- Finalized tentative `User` model in `prisma/schema.prisma`, including enum-based role management (`applicant` vs. `recruiter`)
- Set up a live PostgreSQL database using Render; connected Prisma client successfully via remote `DATABASE_URL`
- Created and tested foundational `authController.ts` with `signup` and `login` logic using bcrypt and JWT
- Implemented route structure and auth middleware for protected API endpoints
- Confirmed deployment via working `POST /api/auth/signup` and `POST /api/auth/login` endpoints from Insomnia

Issues:
- Needed to refactor project structure slightly to align with Firebase’s Cloud Functions layout (without overhauling folder hierarchy)
- Firebase function deployment flow had a learning curve - requires adjustments to TypeScript output and import paths
- Still need to test JWT-protected endpoints in production and set up Firebase environment variables securely
- This week will work to develop candidate info and ID search pages

8/1/2025

Work so far:
- Established basic project skeleton and directory structure
- Set up development environment with TypeScript and Node.js
- Integrated Prisma ORM for structured, type-safe db queries
- Prepared for future API and service layer development

Issues:
- Backend is underdeveloped, spent a lot of time researching similar projects, organizing local environment, and laying out basics of frontend. 
- Need to begin building out API tools and DB integrations.