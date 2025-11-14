
# ATS-Friendly Resume Builder

## Project Overview

This project is a web-based, AI-powered resume builder designed to help users create and tailor their resumes to be friendly for Applicant Tracking Systems (ATS). Users can create a profile, upload their existing resume to be parsed, and then generate new resumes tailored to specific job descriptions. The application uses a passwordless, OTP-based authentication system for security and convenience. The backend is built with Next.js API routes and uses MongoDB for data storage. The AI features are powered by Google's Gemini API.

## Features

*   **Passwordless Authentication**: Secure OTP-based login system using email.
*   **Resume Parsing**: Automatically parse `.pdf` and `.docx` resumes to populate the user's profile.
*   **AI-Powered Content Generation**: Generate resume content tailored to a specific job description.
*   **AI-Powered Resume Editing**: Edit the resume using natural language queries.
*   **Multiple Resume Templates**: Choose from several HTML-based templates to generate a PDF resume.
*   **Resume Management**: Save and manage multiple resume versions.
*   **PDF Generation**: Render resumes as PDF files for downloading.

## Technologies Used

*   **Frontend**: Next.js, React, Tailwind CSS
*   **Backend**: Next.js API Routes, Node.js
*   **Database**: MongoDB with Mongoose
*   **AI**: Google Gemini API (`@google/generative-ai`)
*   **Authentication**: `jose` for JWT, `crypto` for hashing
*   **PDF/Document Processing**: `puppeteer` for PDF generation, `unpdf` for PDF text extraction, `mammoth` for DOCX text extraction
*   **Email**: Brevo (`@getbrevo/brevo`) for sending OTP emails
*   **Linting**: ESLint

## Architecture Overview

The application follows a standard Next.js architecture, with the frontend and backend combined in a single project.

*   **Frontend**: The frontend is built with React components and Next.js pages. It uses a custom hook (`useApiClient`) to interact with the backend API.
*   **Backend**: The backend is implemented using Next.js API Routes. It handles authentication, user profile management, resume operations, and AI-powered features.
*   **Database**: A MongoDB database is used to store user data, refresh tokens, and resumes. Mongoose is used as the Object Data Modeling (ODM) library.
*   **Services**: The business logic for AI features and PDF rendering is encapsulated in separate service modules.
*   **Authentication**: The authentication system is token-based. A short-lived access token is stored in a cookie, and a long-lived refresh token is stored in an `httpOnly` cookie. The refresh token is also stored in the database (hashed) for security. Refresh token rotation is implemented to enhance security.

## File Structure

The project follows a standard Next.js file structure.

```
/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── (pages)/      # Page components
│   │   ├── layout.js     # Root layout
│   │   └── page.js       # Home page
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library and utility functions
│   ├── models/           # Mongoose models
│   └── services/         # Business logic services
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Detailed File Descriptions

### Root Directory

*   `.gitignore`: Specifies files and directories to be ignored by Git.
*   `data.json`: Contains sample resume data, likely for testing and development.
*   `eslint.config.mjs`: Configuration file for ESLint.
*   `jsconfig.json`: JavaScript configuration file, used here to define path aliases.
*   `next.config.mjs`: Configuration file for Next.js.
*   `package.json`: Defines project metadata, dependencies, and scripts.
*   `postcss.config.mjs`: Configuration file for PostCSS, used with Tailwind CSS.
*   `README.md`: This file.

### `src/app`

*   `globals.css`: Global CSS styles.
*   `layout.js`: The root layout of the application.
*   `page.js`: The home page of the application.
*   `proxy.js`: A middleware for handling authentication and authorization for protected routes.

### `src/app/api`

#### `auth`

*   `otp/route.js`: Handles sending an OTP to the user's email for login.
*   `verify-otp/route.js`: Verifies the OTP, generates access and refresh tokens, and creates a new user if one doesn't exist.
*   `verify-token/route.js`: Verifies the refresh token and issues a new access token (token rotation).

#### Other API Routes

*   `edit-resume-with-ai/route.js`: Handles editing the user's main resume using an AI query.
*   `generate-content/route.js`: Generates tailored resume content based on a job description.
*   `parse-resume/route.js`: Parses a resume file (`.pdf` or `.docx`) and returns structured JSON data.
*   `preview-pdf/route.js`: Generates a PDF preview of a resume.
*   `profile/route.js`: Handles reading from and writing to the `data.json` file.
*   `render-pdf/route.js`: Renders a resume to a downloadable PDF file.
*   `render-test-html/route.js`: Renders a test HTML version of a resume, using `data.json`.
*   `resumes/route.js`: Handles getting all resumes for a user and creating a new resume.
*   `resumes/[id]/route.js`: Handles getting and deleting a specific resume.
*   `user/profile/route.js`: Handles getting and updating a user's profile data.

### `src/components`

*   `diff/DiffViewer.js`: A component to display the difference between two texts.
*   `home/JobDescription.js`, `home/JobDescriptionInput.js`: Components for inputting a job description.
*   `home/SpecialInstructionsInput.js`: A component for inputting special instructions for the AI.
*   `home/TemplateSelector.js`: A dropdown to select a resume template.
*   `preview/PdfView.js`: Displays a PDF preview of a resume.
*   `preview/ResumeDisplayView.js`: Displays a structured view of the resume data.
*   `preview/ResumePreview.js`: A tabbed view for previewing the resume in different formats.
*   `preview/TextView.js`: Displays a text/HTML view of the resume.
*   `profile/ResumeUpload.js`: A component for uploading a resume file.
*   `resume-templates/html-templates/`: A directory containing HTML templates for the resumes.

### `src/hooks`

*   `useApiClient.js`: A custom hook that provides an API client with automatic token handling.

### `src/lib`

*   `mongodb.js`: Handles the connection to the MongoDB database.
*   `utils.js`: Contains utility functions, including:
    *   `sha256(string)` / `hashToken(string)`: Hashes a string using the SHA256 algorithm.
    *   `generateAccessToken(userId)`: Generates a new access token.
    *   `generateRefreshToken(userId)`: Generates a new refresh token.
    *   `verifyToken(token, tokenType)`: Verifies an access or refresh token.

### `src/models`

*   `plan.js`: Mongoose model for a subscription plan.
*   `refreshToken.js`: Mongoose model for storing refresh tokens.
*   `resume.js`: Mongoose model for storing resume data.
*   `resumeMetadata.js`: Mongoose model for storing metadata about generated resumes.
*   `user.js`: Mongoose model for user data.

### `src/services`

*   `aiResumeEditorService.js`: Service for editing a resume using AI.
*   `contentGenerationService.js`: Service for generating tailored resume content.
*   `pdfRenderService.js`: Service for rendering a resume to a PDF.
*   `resumeParsingService.js`: Service for parsing resume files.

## Known Issues and Areas for Improvement

*   **Inconsistent Hashing Algorithm**: <span style="color:green">**RESOLVED**</span> The hashing algorithm for refresh tokens is now consistent across the application.
*   **Code Duplication**:
    *   <span style="color:green">**RESOLVED**</span> The `sha256` function is no longer duplicated.
    *   The components `src/components/home/JobDescription.js` and `src/components/home/JobDescriptionInput.js` are identical. One of them should be removed.
*   **Unused Component Props**: The `TextView` component in `src/components/preview/TextView.js` fetches its content from a test route and does not use its `resumeData` and `template` props. This component seems to be for debugging purposes and should be updated to use the props if it's intended for production use.
*   **Hardcoded Template Names**: The `TemplateSelector` component has hardcoded template names. It would be better to fetch the list of available templates from the server.
*   **Error Handling**: The error handling in some of the API routes could be improved to provide more specific error messages to the client.

## Setup and Running the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ats-resume-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    MONGODB_URI=<your-mongodb-connection-string>
    BREVO_API_KEY=<your-brevo-api-key>
    BREVO_SENDER_EMAIL=<your-brevo-sender-email>
    GEMINI_API_KEY=<your-google-gemini-api-key>
    ACCESS_TOKEN_SECRET=<your-access-token-secret>
    REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.
