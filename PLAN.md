
# Plan for Authentication and User Management

This document outlines the plan to implement a robust authentication and user management system for the ATS-Friendly Resume Builder.

## 1. Project Overview

The goal is to add the following features:
- User authentication with email OTP (One-Time Password).
- User roles and permissions.
- A system for different user plans.
- Storage of user data and resumes in a MongoDB database.
- A history of generated resumes with metadata.

## 2. Technology Stack

- **Database:** MongoDB
- **ODM:** Mongoose (for schema definition and validation)
- **Authentication:** JSON Web Tokens (JWT) using the `jsonwebtoken` library.
- **Email Service:** Brevo (formerly Sendinblue) for sending OTPs.

## 3. Database Schema

We will use three main collections in MongoDB:

### `users`

This collection will store user information.

```javascript
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true },
  name: { type: String },
  dateOfBirth: { type: Date },
  role: { type: Number, default: 100 }, // 0: owner, 100: user
  plan: { type: ObjectId, ref: 'Plan' },
  createdAt: { type: Date, default: Date.now },
}
```

### `resumes`

This collection will store the actual resume content as a JSON object.

```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  content: { type: Object, required: true }, // The full resume object
  createdAt: { type: Date, default: Date.now },
}
```

### `resume_metadata`

This collection will store metadata about each generated resume, with a reference to the actual resume content in the `resumes` collection.

```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  resumeId: { type: ObjectId, ref: 'Resume', required: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String },
  createdAt: { type: Date, default: Date.now },
}
```

### `plans`

This collection will store information about the different user plans. The details of the plans need to be clarified.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, unique: true },
  // Other plan-specific fields (e.g., price, features) go here
}
```

## 4. Authentication Flow

### Passwordless Login/Registration

1.  User enters their email address.
2.  The backend generates a 6-digit OTP and temporarily stores it.
3.  An email with the OTP is sent to the user via Brevo.
4.  User enters the OTP on the frontend.
5.  The backend verifies the OTP.
6.  If the user already exists in the database, the backend generates an access token and a refresh token and sends them to the frontend. The user is redirected to the dashboard.
7.  If the user does not exist, they are prompted to enter their name, date of birth, and any other required information. Upon submission, a new user is created in the database, tokens are generated, and the user is redirected to the dashboard.

### Token Refresh

1.  When the access token expires, the frontend sends the refresh token to a dedicated endpoint (e.g., `/api/auth/refresh-token`).
2.  The backend verifies the refresh token and issues a new access token.

## 5. API Endpoints

-   `POST /api/auth/otp`: To send an OTP to the user's email.
-   `POST /api/auth/verify-otp`: To verify the OTP and log in or register the user.
-   `POST /api/auth/logout`: To invalidate the refresh token.
-   `POST /api/auth/refresh-token`: To get a new access token.
-   `GET /api/user/profile`: To get the current user's profile.
-   `PUT /api/user/profile`: To update the current user's profile (e.g., name, date of birth).
-   `GET /api/resumes`: To get the list of the user's resumes (history).
-   `POST /api/resumes`: To save a new resume.
-   `GET /api/resumes/:id`: To get a specific resume.

## 6. Frontend Components

-   `LoginPage.js`: A page for the user to enter their email and OTP.
-   `OnboardingPage.js`: A page for new users to enter their profile information after OTP verification.
-   `ProfilePage.js`: A page to display and update the user's profile and plan information.
-   `ResumeHistoryPage.js`: A page to display the list of generated resumes.
-   `PlanSelector.js`: A component to allow users to select a plan.

## 7. Implementation Steps

1.  **Setup:**
    -   Install necessary packages: `mongoose`, `jsonwebtoken`, and the Brevo library.
    -   Set up the MongoDB connection.
    -   Create the Mongoose models for `User`, `Resume`, `ResumeMetadata`, and `Plan`.

2.  **Backend (API Routes):**
    -   Implement the authentication endpoints (`/api/auth/...`).
    -   Implement the resume management endpoints (`/api/resumes/...`).
    -   Create middleware to protect routes that require authentication.

3.  **Frontend (React Components):**
    -   Create the login and onboarding pages.
    -   Implement the logic for handling tokens on the frontend (e.g., storing them securely).
    -   Create the resume history page.
    -   Integrate the new authentication system with the existing application flow.

## 8. Questions for Clarification

-   **Brevo API Key:** Please provide the Brevo API key. It should be stored as `BREVO_API_KEY` in the `.env.local` file.
-   **MongoDB Connection String:** Please provide the MongoDB connection string. It should be stored as `MONGODB_URI` in the `.env.local` file.
-   **User Plans:** What are the details of the different user plans? What features or limitations should each plan have?

