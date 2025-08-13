# WIP-backend

Backend repo for "Work in Progress"

## Overview

This is a Node.js/Express backend using TypeScript, Prisma ORM, JWT authentication, and PostgreSQL. The API supports user signup and login with role-based management (`applicant` and `recruiter`). The project is structured for scalability and easy deployment to cloud platforms like Google Cloud or Firebase.

## Features

- User authentication (signup & login) with bcrypt password hashing and JWT tokens
- Role-based user model (`applicant` or `recruiter`) with separate profile schemas
- Secure profile management with JWT-protected endpoints
- Work experience tracking for applicants
- Applicant search functionality for recruiters
- Prisma ORM for type-safe database access
- PostgreSQL database (hosted on Render)
- Modular route and controller structure
- JWT middleware for protected endpoints
- Ready for deployment to Google Cloud or Firebase

## API Endpoints

All endpoints are prefixed with `/api`:

### Authentication Endpoints

- **GET `/api/hello`**  
  Health check endpoint. Returns `{ message: "Hello from API" }`.

- **POST `/api/auth/signup`**  
  Registers a new user and creates corresponding profile.  
  Body:  
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "role": "applicant" // or "recruiter"
  }
  ```
  Response:
  ```json
  {
    "message": "Signup successful",
    "user": {
      "email": "user@example.com",
      "role": "applicant",
      "profileCreated": true
    }
  }
  ```

- **POST `/api/auth/login`**  
  Authenticates a user and returns JWT token with user data.  
  Body:  
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
  Response:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "applicant"
    }
  }
  ```

### Profile Endpoints (Protected)

All profile endpoints require authentication via `Authorization: Bearer <token>` header.

- **GET `/api/profile/applicant`**  
  Retrieves the authenticated user's applicant profile with work experience.  
  Headers: `Authorization: Bearer <jwt_token>`  
  Response:
  ```json
  {
    "profile": {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "university": "Stanford University",
      "major": "Computer Science",
      "graduationYear": 2024,
      "gpa": 3.8,
      "skills": ["JavaScript", "React", "Node.js"],
      "experienceLevel": "junior",
      "workExperience": [
        {
          "id": 1,
          "companyName": "Google",
          "location": "Mountain View, CA",
          "startDate": "2023-06-01T00:00:00.000Z",
          "endDate": "2024-08-01T00:00:00.000Z",
          "roleDescription": "Software Engineering Intern"
        }
      ],
      "user": {
        "email": "user@example.com",
        "role": "applicant",
        "createdAt": "2025-08-13T00:00:00.000Z"
      }
    }
  }
  ```

- **PUT `/api/profile/applicant`**  
  Updates the authenticated user's applicant profile (partial updates supported).  
  Headers: `Authorization: Bearer <jwt_token>`  
  Body (all fields optional):
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "university": "Stanford University",
    "major": "Computer Science",
    "graduationYear": 2024,
    "gpa": 3.8,
    "portfolioUrl": "https://johndoe.dev",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "skills": ["JavaScript", "React", "Node.js"],
    "interests": ["Web Development", "AI"],
    "experienceLevel": "junior",
    "preferredLocations": ["San Francisco", "Remote"],
    "salaryExpectation": 85000,
    "availability": "full-time",
    "other": ["Additional info"]
  }
  ```
  Response:
  ```json
  {
    "message": "Profile updated successfully",
    "profile": { /* updated profile object */ }
  }
  ```

- **GET `/api/profile/recruiter`**  
  Retrieves the authenticated user's recruiter profile.  
  Headers: `Authorization: Bearer <jwt_token>`

- **PUT `/api/profile/recruiter`**  
  Updates the authenticated user's recruiter profile (partial updates supported).  
  Headers: `Authorization: Bearer <jwt_token>`  
  Body (all fields optional):
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1234567890",
    "company": "TechCorp Inc.",
    "position": "Senior Talent Acquisition Manager",
    "department": "Human Resources",
    "companySize": "large",
    "industry": "Technology",
    "linkedinUrl": "https://linkedin.com/in/janesmith",
    "companyUrl": "https://techcorp.com",
    "hiringSectors": ["technology", "engineering", "data science"],
    "experienceLevels": ["junior", "mid", "senior"],
    "other": ["Remote work friendly", "Diversity focused"]
  }
  ```

### Work Experience Endpoints (Protected)

- **POST `/api/profile/applicant/work-experience`**  
  Adds a new work experience entry for the authenticated applicant.  
  Headers: `Authorization: Bearer <jwt_token>`  
  Body:
  ```json
  {
    "companyName": "Google",
    "location": "Mountain View, CA",
    "startDate": "2023-06-01",
    "endDate": "2024-08-01", // optional, null for current job
    "roleDescription": "Software Engineering Intern working on search algorithms"
  }
  ```
  Response:
  ```json
  {
    "message": "Work experience added successfully",
    "workExperience": {
      "id": 1,
      "companyName": "Google",
      "location": "Mountain View, CA",
      "startDate": "2023-06-01T00:00:00.000Z",
      "endDate": "2024-08-01T00:00:00.000Z",
      "roleDescription": "Software Engineering Intern working on search algorithms"
    }
  }
  ```

- **PUT `/api/profile/applicant/work-experience/:experienceId`**  
  Updates a specific work experience entry (user can only update their own).  
  Headers: `Authorization: Bearer <jwt_token>`  
  Body: Same as POST above  
  Response:
  ```json
  {
    "message": "Work experience updated successfully",
    "workExperience": { /* updated work experience object */ }
  }
  ```

- **DELETE `/api/profile/applicant/work-experience/:experienceId`**  
  Deletes a specific work experience entry (user can only delete their own).  
  Headers: `Authorization: Bearer <jwt_token>`  
  Response:
  ```json
  {
    "message": "Work experience deleted successfully"
  }
  ```

### Search Endpoints (Recruiter Only)

- **GET `/api/search/applicants`**  
  Search for applicants based on various criteria (recruiter only).  
  Headers: `Authorization: Bearer <jwt_token>`  
  Query Parameters:
  - `graduationYear` (number)
  - `major` (string) - partial match
  - `university` (string) - partial match  
  - `experienceLevel` (string): entry, junior, mid, senior
  - `minGpa`, `maxGpa` (number)
  - `skills` (array) - multiple values supported
  - `preferredLocations` (array) - multiple values supported
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 50)

- **GET `/api/search/applicants/:applicantId`**  
  Get detailed applicant profile (recruiter only).  
  Headers: `Authorization: Bearer <jwt_token>`

## Security Features

- **JWT Authentication**: All profile endpoints require valid JWT tokens
- **User Isolation**: Users can only access and modify their own data
- **Role Validation**: Role-specific endpoints verify user permissions
- **Token-based Authorization**: User identity extracted from cryptographically signed tokens

## Database Schema

The application uses separate profile models for different user types:

- **User**: Base authentication model with email, password, and role
- **ApplicantProfile**: Extended profile for job seekers with academic info, work experience, skills, and preferences
- **RecruiterProfile**: Extended profile for recruiters with company info and hiring preferences
- **WorkExperience**: Separate model for applicant work history with company details and date ranges

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
   npx prisma generate
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
   Use Postman, Insomnia, or `curl` to test authentication and profile endpoints.

### Testing with Authentication

1. **Get a JWT token by logging in:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

2. **Use the token in subsequent requests:**
   ```bash
   curl -X GET http://localhost:8080/api/profile/applicant \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

## Deployment

- Ready for deployment to Google Cloud or Firebase.
- Use the provided `app.yaml` and `.gcloudignore` for Google Cloud.
- Ensure environment variables are set securely in production.

---

## Changelog

**August 13, 2025**

New Work:
- Implemented recruiter profile management with GET and PUT endpoints supporting company information, hiring preferences, and role validation
- Added comprehensive applicant search functionality for recruiters with advanced filtering by graduation year, major, university, GPA range, skills, experience level, and preferred locations
- Enhanced search system with pagination, case-insensitive text matching, array field searches, and performance optimization
- Implemented secure profile management system with JWT-protected endpoints
- Added comprehensive applicant profile endpoint (GET, PUT) with partial update support
- Created work experience management with full CRUD operations (POST, PUT, DELETE)
- Established robust security model ensuring users can only access their own data
- Enhanced authentication flow with proper token validation and user isolation
- Documented all new endpoints with request/response examples and security details

Technical improvements:
- User data isolation through JWT-extracted user IDs
- Role-based access control for profile endpoints
- Secure work experience management with ownership validation
- Database optimization with indexes for search performance
- Comprehensive error handling and validation

**8/8/2025**

New Work:
- Finalized tentative `User` model in `prisma/schema.prisma`, including enum-based role management (`applicant` vs. `recruiter`)
- Set up a live PostgreSQL database using Render; connected Prisma client successfully via remote `DATABASE_URL`
- Created and tested foundational `authController.ts` with `signup` and `login` logic using bcrypt and JWT
- Implemented route structure and auth middleware for protected API endpoints
- Confirmed deployment via working `POST /api/auth/signup` and `POST /api/auth/login` endpoints from Insomnia

Issues:
- Needed to refactor project structure slightly to align with Firebase's Cloud Functions layout (without overhauling folder hierarchy)
- Firebase function deployment flow had a learning curve - requires adjustments to TypeScript output and import paths
- Still need to test JWT-protected endpoints in production and set up Firebase environment variables securely
- This week will work to develop candidate info and ID search pages

**8/1/2025**

Work so far:
- Established basic project skeleton and directory structure
- Set up development environment with TypeScript and Node.js
- Integrated Prisma ORM for structured, type-safe db queries
- Prepared for future API and service layer development

Issues:
- Backend is underdeveloped, spent a lot of time researching similar projects, organizing local environment, and laying out basics of frontend. 
- Need to begin building out API tools and DB integrations.