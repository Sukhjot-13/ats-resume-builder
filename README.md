# ATS-Resume-Builder

This is a Next.js application designed to help users create ATS-friendly resumes. It provides features for parsing existing resumes, generating tailored content using AI, and rendering resumes in different templates.

## Features

*   **Resume Parsing:** Users can upload their existing resume (PDF or DOCX) and the application will parse it to extract structured data.
*   **AI-Powered Content Generation:** The application uses a generative AI model to tailor resume content for specific job descriptions.
*   **Resume Editing with AI:** Users can edit their resume using natural language queries.
*   **Multiple Resume Templates:** The application provides several resume templates (Simple, Modern, Creative, Professional) to choose from.
* `PLAN.md` is a file that contains the plan for the project.
*   **PDF Rendering:** Users can preview and download their resume as a PDF.
*   **Authentication:** The application uses a JWT-based authentication system with OTP (One-Time Password) verification via email.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **AI:** [Google Generative AI (Gemini)](https://ai.google.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **PDF Generation:** [Puppeteer](https://pptr.dev/)
*   **File Parsing:** [mammoth](https://www.npmjs.com/package/mammoth) (for .docx), [unpdf](https://www.npmjs.com/package/unpdf) (for .pdf)
*   **Email:** [Brevo](https://www.brevo.com/)

## Project Structure

The project follows a standard Next.js `src` directory structure.

```
/
├── public/ # Static assets
├── src/
│   ├── app/ # Next.js App Router
│   │   ├── api/ # API routes
│   │   ├── (pages)/ # Page components
│   │   └── layout.js # Root layout
│   ├── components/ # React components
│   │   ├── resume-templates/ # HTML templates for resumes
│   │   └── ui/ # UI components from shadcn/ui
│   ├── hooks/ # Custom React hooks
│   ├── lib/ # Library functions (e.g., database connection)
│   ├── models/ # Mongoose models
│   └── services/ # Business logic services
├── .env.local # Environment variables
└── package.json # Project dependencies
```

### `src/models`

This directory contains the Mongoose schemas for the database models:

*   `plan.js`: Defines the schema for user plans.
*   `refreshToken.js`: Stores refresh tokens for authentication.
*   `resume.js`: Defines the main schema for resume data.
*   `resumeMetadata.js`: Stores metadata associated with a resume (e.g., job title, company name).
*   `user.js`: Defines the schema for user accounts.

### `src/services`

This directory contains the core business logic of the application:

*   `aiResumeEditorService.js`: Handles editing resumes with AI.
*   `contentGenerationService.js`: Generates tailored resume content using AI.
*   `pdfRenderService.js`: Renders resumes to PDF using Puppeteer.
*   `resumeParsingService.js`: Parses resume files (PDF, DOCX) to extract text and structured data.

## API Endpoints

The API endpoints are defined in the `src/app/api` directory.

### Authentication

*   `POST /api/auth/otp`: Sends an OTP to the user's email.
*   `POST /api/auth/verify-otp`: Verifies the OTP and returns JWT access and refresh tokens.
*   `POST /api/auth/verify-token`: Verifies the refresh token and returns a new access token.
*   `POST /api/auth/logout`: Clears the authentication cookies.

### Resumes

*   `GET /api/resumes`: Retrieves all resumes for the authenticated user.
*   `POST /api/resumes`: Creates a new resume for the authenticated user.
*   `GET /api/resumes/[id]`: Retrieves a specific resume by its ID.
*   `DELETE /api/resumes/[id]`: Deletes a specific resume by its ID.

### User

*   `GET /api/user/profile`: Retrieves the profile of the authenticated user.
*   `PUT /api/user/profile`: Updates the profile of the authenticated user.

### AI & PDF

*   `POST /api/parse-resume`: Parses an uploaded resume file.
*   `POST /api/generate-content`: Generates tailored resume content.
*   `POST /api/edit-resume-with-ai`: Edits a resume using an AI query.
*   `POST /api/preview-pdf`: Generates a PDF preview of a resume.
*   `POST /api/render-pdf`: Generates a downloadable PDF of a resume.

## Authentication Flow

1.  The user enters their email address.
2.  The application sends a `POST` request to `/api/auth/otp`.
3.  The server generates a 6-digit OTP, saves it to the user's record in the database, and emails it to the user.
4.  The user enters the OTP.
5.  The application sends a `POST` request to `/api/auth/verify-otp` with the email and OTP.
6.  The server verifies the OTP. If it's valid, it generates a short-lived JWT access token and a long-lived refresh token.
7.  The access token is stored in a cookie and sent with subsequent requests to protected API routes.
8.  When the access token expires, the client sends the refresh token to `/api/auth/verify-token` to get a new access token.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ats-resume-builder.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    BREVO_API_KEY=
    BREVO_SENDER_EMAIL=
    GEMINI_API_KEY=
    MONGODB_URI=
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.