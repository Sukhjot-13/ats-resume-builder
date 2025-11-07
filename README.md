# ATS-Friendly Resume Builder

This project is an AI-powered resume builder that helps users create ATS-friendly resumes tailored to specific job descriptions. It uses a "Upload -> Parse -> Store -> Tailor" workflow to provide a seamless user experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Phases](#project-phases)
  - [Phase 0: Project Setup & Core Technology](#phase-0-project-setup--core-technology)
  - [Phase 1: Database Schema & Authentication](#phase-1-database-schema--authentication)
  - [Phase 2: Resume Parsing & "Master Profile" UI](#phase-2-resume-parsing--master-profile-ui)
  - [Phase 3: The AI "Brain" (Content Tailoring)](#phase-3-the-ai-brain-content-tailoring)
  - [Phase 4: PDF Renderer (Templates & API)](#phase-4-pdf-renderer-templates--api)
  - [Phase 5: The "Generator" UI Page](#phase-5-the-generator-ui-page)
  - [Phase 6: Dashboard & Resume History](#phase-6-dashboard--resume-history)

## Project Overview

The application will guide users through the following workflow:

1.  **Upload:** Users upload their existing resume in PDF or DOCX format.
2.  **Parse:** The application parses the resume using an AI model (Google Gemini) to extract structured data.
3.  **Store:** The parsed data is stored in a "Master Profile" which the user can review and edit.
4.  **Tailor:** Users can then paste a job description, and the AI will tailor the resume content to match the requirements of the job.
5.  **Render:** The user can select a template and render the tailored resume as a PDF.

## Refactoring Ideas

-   **Extract business logic into custom hooks:**
    -   Create a `useProfile.js` hook to manage the profile state and the logic for fetching and updating the profile.
    -   Create other custom hooks for managing job description, special instructions, tailored resume, etc.
-   **Make links in generated PDFs clickable.**

## Tech Stack

-   **Framework:** Next.js 14 (App Router)
-   **Database & Auth:** Supabase
-   **AI Engine:** Google Gemini API
-   **PDF Generation:** `@react-pdf/renderer`
-   **File Parsing:** `pdf-parse`, `mammoth`, `formidable`
-   **Hosting:** Vercel

## Project Phases

### Phase 0: Project Setup & Core Technology

This phase focuses on setting up the project and installing the necessary dependencies.

**1. Initialize Next.js Project:**
   - A standard Next.js 14 project with the App Router is initialized.

**2. Install Dependencies:**
   - **Core:**
     ```bash
     npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-ui-react @google/generative-ai @react-pdf/renderer
     ```
   - **Parsing Stack:**
     ```bash
     npm install formidable pdf-parse mammoth
     npm install -D @types/formidable
     ```

**3. Environment Variables:**
   - Set up environment variables for Supabase and Google Gemini API keys.

### Phase 1: Database Schema & Authentication

This phase involves setting up the database schema and user authentication.

**1. Database Schema:**
   - The following tables will be created in Supabase:
     - `profiles`: Stores user profile information.
     - `work_experience`: Stores work experience details.
     - `education`: Stores education details.
     - `skills`: Stores user skills.
     - `generated_resumes`: Stores information about generated resumes.

**2. Authentication:**
   - Supabase Auth will be used for user authentication.

### Phase 2: Resume Parsing & "Master Profile" UI

This phase implements the core logic of parsing the user's resume and creating a "Master Profile".

**1. API Route for Resume Parsing:**
   - **File Location:** `app/api/parse-resume/route.ts`
   - **Method:** `POST`
   - **Functionality:**
     - Accepts a file upload (`.pdf` or `.docx`).
     - Extracts the text from the file.
     - Sends the text to the Gemini API to be structured into JSON.
     - Returns the structured JSON to the client.

**2. "Master Profile" UI:**
   - **File Location:** `app/(dashboard)/profile/page.tsx`
   - **User Flow:**
     - **New User:**
       - The user is prompted to upload their resume.
       - A loading spinner is shown while the resume is being parsed.
       - The parsed data is used to populate the forms on the page.
       - The user can review and edit the data before saving it to the database.
     - **Returning User:**
       - The forms are pre-filled with the user's data from the database.
       - A "Re-upload / Re-parse Resume" button is available for users who want to start over.
   - **"Save Profile" Button:**
     - This button saves the data from the forms to the Supabase tables.

### Phase 3: The AI "Brain" (Content Tailoring)

This phase implements the AI-powered content tailoring feature.

**1. API Route for Content Generation:**
   - **File Location:** `app/api/generate-content/route.ts`
   - **Functionality:**
     - Fetches the user's "generic data" from the database.
     - Receives a `jobDescription` from the request.
     - Uses the Gemini API to tailor the resume content based on the job description.

### Phase 4: PDF Renderer (Templates & API)

This phase focuses on rendering the tailored resume as a PDF.

**1. API Route for PDF Rendering:**
   - **File Location:** `app/api/render-pdf/route.ts`
   - **Functionality:**
     - Takes the tailored JSON from Phase 3.
     - Selects a `react-pdf` template.
     - Renders the resume as a PDF.

**2. Resume Templates:**
   - **File Location:** `app/components/resume-templates/`
   - A collection of resume templates will be created using `@react-pdf/renderer`.

### Phase 5: The "Generator" UI Page

This phase implements the UI for the resume generation process.

**1. Generator UI:**
   - **File Location:** `app/(dashboard)/generate/page.tsx`
   - **Functionality:**
     - A text area for the user to paste the job description.
     - A dropdown to select a resume template.
     - A "Generate" button that orchestrates the calls to the `/api/generate-content` and `/api/render-pdf` APIs.

### Phase 6: Dashboard & Resume History

This phase implements the user dashboard and resume history.

**1. Dashboard:**
   - **File Location:** `app/(dashboard)/page.tsx`
   - **Functionality:**
     - Displays a list of previously generated resumes from the `generated_resumes` table.

### Admin Configuration

In the future, an admin interface will be developed to allow for the configuration of application settings, such as token expiration times. The access and refresh token lifetimes will be stored as configurable variables in the database.