# ATS-Friendly Resume Builder

This project is an AI-powered resume builder that helps users create ATS-friendly resumes tailored to specific job descriptions. It uses a "Upload -> Parse -> Store -> Tailor" workflow to provide a seamless user experience.

## Project Overview

The application will guide users through the following workflow:

1.  **Upload:** Users upload their existing resume in PDF or DOCX format.
2.  **Parse:** The application parses the resume using an AI model (Google Gemini) to extract structured data.
3.  **Store:** The parsed data is stored in a "Master Profile" which the user can review and edit.
4.  **Tailor:** Users can then paste a job description, and the AI will tailor the resume content to match the requirements of the job.
5.  **Render:** The user can select a template and render the tailored resume as a PDF.

The goal is to implement a robust authentication and user management system, store user data and resumes in a MongoDB database, and provide a history of generated resumes.

## Tech Stack

-   **Framework:** Next.js 14 (App Router)
-   **Database:** MongoDB
-   **ODM:** Mongoose
-   **Authentication:** JSON Web Tokens (JWT) with email OTP
-   **AI Engine:** Google Gemini API
-   **Email Service:** Brevo
-   **PDF Generation:** `@react-pdf/renderer`, `puppeteer`
-   **File Parsing:** `pdf-parse`, `mammoth`, `formidable`, `unpdf`
-   **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root of the project and add the following variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   BREVO_API_KEY=<your-brevo-api-key>
   BREVO_SENDER_EMAIL=<your-brevo-sender-email>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Run the development server:
    ```bash
    npm run dev
    ```

## Database Schema

We use three main collections in MongoDB:

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

This collection will store metadata about each generated resume.

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

This collection will store information about the different user plans.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, unique: true },
  // Other plan-specific fields (e.g., price, features) go here
}
```

## Authentication Flow

### Passwordless Login/Registration

1.  User enters their email address.
2.  The backend generates a 6-digit OTP and temporarily stores it.
3.  An email with the OTP is sent to the user via Brevo.
4.  User enters the OTP on the frontend.
5.  The backend verifies the OTP.
6.  If the user already exists, the backend generates an access token and a refresh token and sends them to the frontend.
7.  If the user does not exist, they are prompted to enter their profile information. Upon submission, a new user is created, tokens are generated, and the user is redirected to the dashboard.

### Token Refresh

1.  When the access token expires, the frontend sends the refresh token to the `/api/auth/refresh-token` endpoint.
2.  The backend verifies the refresh token and issues a new access token.

## API Endpoints

-   `POST /api/auth/otp`: Sends an OTP to the user's email.
-   `POST /api/auth/verify-otp`: Verifies the OTP and logs in or registers the user.
-   `GET /api/auth/verify-token`: Verifies the access token.
-   `GET, PUT /api/user/profile`: To get and update the current user's profile.
-   `POST /api/edit-resume-with-ai`: Edits a resume using AI.
-   `POST /api/generate-content`: Generates tailored resume content based on a job description.
-   `POST /api/parse-resume`: Parses an uploaded resume (PDF or DOCX).
-   `GET /api/preview-pdf`: Previews a PDF.
-   `POST /api/render-pdf`: Renders a resume as a PDF.
-   `GET /api/render-test-html`: Renders a test HTML page.
-   `GET, POST /api/resumes`: To get the list of the user's resumes and to save a new resume.
-   `GET /api/resumes/[id]`: To get a specific resume by ID.

## Future Improvements & To-Do

-   **Implement User Plans:** Define and implement different user plans with varying features and limitations.
-   **Token Refresh Endpoint:** The `/api/auth/refresh-token` endpoint is not yet implemented.
-   **Logout Endpoint:** Implement a `/api/auth/logout` endpoint to invalidate refresh tokens.
-   **Extract business logic into custom hooks:**
    -   Create a `useProfile.js` hook to manage the profile state and the logic for fetching and updating the profile.
    -   Create other custom hooks for managing job description, special instructions, tailored resume, etc.
-   **Clickable links in generated PDFs:** Make links in the generated PDFs clickable.
-   **Admin Configuration:** In the future, an admin interface will be developed to allow for the configuration of application settings, such as token expiration times.
-   **Frontend Components:**
    -   `PlanSelector.js`: A component to allow users to select a plan.
