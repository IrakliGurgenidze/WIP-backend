# WIP-backend

Backend repo for "Work in Progress"

## Overview

This is a Node.js/Express backend using TypeScript, Prisma ORM, JWT authentication, and PostgreSQL. The API supports user signup and login with role-based management (`applicant` and `recruiter`). The project is structured for scalability and easy deployment to cloud platforms like Google Cloud or Firebase.

## Features

- User authentication (signup & login) with bcrypt password hashing and JWT tokens
- Role-based user model (`applicant` or `recruiter`)
- Prisma ORM for type-safe database access
- PostgreSQL database (hosted on Render)
- Modular route and controller structure
- Ready for deployment to Google Cloud or Firebase

## API Endpoints

All endpoints are prefixed with `/api`:

- **GET `/api/hello`**  
  Health check endpoint. Returns `{ message: "Hello from API" }`.

- **POST `/api/auth/signup`**  
  Registers a new user.  
  Body:  
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "role": "applicant" // or "recruiter"
  }
  ```

- **POST `/api/auth/login`**  
  Authenticates a user and returns a JWT token.  
  Body:  
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

## Developer Guide

1. **Install dependencies:**  
   ```
   npm install
   ```

2. **Configure environment:**  
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_jwt_secret
   PORT=8080
   ```

3. **Run Prisma migrations:**  
   ```
   npx prisma migrate deploy
   ```

4. **Start the server:**  
   ```
   npm run build
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

5. **Test endpoints:**  
   Use Postman, Insomnia, or `curl` to test `/api/auth/signup` and `/api/auth/login`.

## Deployment

- Ready for deployment to Google Cloud or Firebase.
- Use the provided `app.yaml` and `.gcloudignore` for Google Cloud.
- Ensure environment variables are set securely in production.

---

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