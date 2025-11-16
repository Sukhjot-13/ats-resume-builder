# PDF Generation with @react-pdf/renderer

## Objective
To replace the current PDF generation mechanism with `@react-pdf/renderer` for improved flexibility and capabilities. This will involve creating new components, a new test template, and a dedicated API route for testing before full integration.

## Plan

### 1. Install @react-pdf/renderer package
- **Status:** Completed
- **Description:** Install the `@react-pdf/renderer` npm package to enable React-based PDF rendering.
- **Command:** `npm install @react-pdf/renderer`

### 2. Explore existing template structure
- **Status:** Completed
- **Description:** Analyze the current resume template structure (e.g., `src/components/resume-templates/html-templates/`) to understand how data is passed and rendered. This will inform the design of the new `@react-pdf/renderer` compatible template.

### 3. Create a new 'classic' test template using React components
- **Status:** Completed
- **Description:** Develop a new React component that mimics the visual style and content structure of the existing "classic" resume template, but designed to work with `@react-pdf/renderer`'s components (e.g., `<Document>`, `<Page>`, `<Text>`, `<View>`). This template will be placed in a new directory, e.g., `src/components/resume-templates/pdf-templates/ClassicTemplate.js`.

### 4. Create a new PDF generation component using @react-pdf/renderer
- **Status:** Completed
- **Description:** Create a core component (e.g., `src/components/preview/PdfResumeRenderer.js`) that takes resume data and the chosen `@react-pdf/renderer` template component as props. This component will use `PDFViewer` or `pdf()` from `@react-pdf/renderer` to generate the PDF document.

### 5. Create a new API route for testing the new PDF generation component
- **Status:** Completed
- **Description:** Implement a new API route (e.g., `src/app/api/render-pdf-react/route.js`) that:
    - Accepts resume data (e.g., via POST request).
    - Calls the new `PdfResumeRenderer` component with the resume data and the new 'classic' template.
    - Returns the generated PDF as a buffer or stream.
    - This route will allow isolated testing of the `@react-pdf/renderer` implementation.

### 6. Create a new /test page and display the test resume data in a separate component.
- **Status:** Completed
- **Description:** Create a new Next.js page at `src/app/test/page.js` that displays a PDF generated from temporary resume data using the `ReactPdfView` component.

## Progress Tracking
- [X] Install @react-pdf/renderer package
- [X] Explore existing template structure
- [X] Create a new 'classic' test template using React components
- [X] Create a new PDF generation component using @react-pdf/renderer
- [X] Create a new API route for testing the new PDF generation component
- [X] Create a new /test page and display the test resume data in a separate component.