# Puppeteer PDF Generation Documentation

This document provides a comprehensive guide to the Puppeteer-based PDF generation functionality in the ATS-Friendly Resume Builder application.

## 1. Overview

Puppeteer is a Node.js library that provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol. It is used in this project to generate PDF resumes from HTML templates.

The process involves the following steps:

1.  A request is sent from the frontend to a Next.js API route.
2.  The API route calls the `pdfRenderService`.
3.  The `pdfRenderService` reads an HTML template, injects the user's resume data into it, and then uses Puppeteer to render the HTML as a PDF.
4.  The generated PDF is sent back to the frontend as a response.

## 2. Installation

To use Puppeteer, you need to install it as a dependency:

```bash
npm install puppeteer
```

When you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API.

## 3. API Endpoints

There are two API endpoints for PDF generation:

-   `/api/render-pdf` (for downloading the PDF)
-   `/api/preview-pdf` (for displaying the PDF in the browser)

### 3.1. `/api/render-pdf`

-   **Method:** `POST`
-   **Description:** This endpoint generates a PDF and sends it back with a `Content-Disposition` header, which prompts the user to download the file.
-   **Request Body:**

    ```json
    {
      "resumeData": { ... },
      "template": "template-name.html"
    }
    ```

    -   `resumeData`: An object containing the user's resume information.
    -   `template`: The name of the HTML template file to use for the resume.

-   **API Route Code (`src/app/api/render-pdf/route.js`):**

    ```javascript
    import { NextResponse } from 'next/server';
    import { renderPdf } from '../../../services/pdfRenderService';

    export async function POST(request) {
      try {
        const { resumeData, template } = await request.json();
        const pdfBuffer = await renderPdf(resumeData, template);

        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="resume.pdf"',
          },
        });
      } catch (error) {
        return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
      }
    }
    ```

### 3.2. `/api/preview-pdf`

-   **Method:** `POST`
-   **Description:** This endpoint generates a PDF and sends it back with a `Content-Type` of `application/pdf`, which allows it to be embedded in an `<iframe>` on the frontend.
-   **Request Body:** Same as `/api/render-pdf`.
-   **API Route Code (`src/app/api/preview-pdf/route.js`):**

    ```javascript
    import { NextResponse } from 'next/server';
    import { renderPdf } from '../../../services/pdfRenderService';

    export async function POST(request) {
      console.log("Received request for PDF preview");
      try {
        const { resumeData, template } = await request.json();
        console.log("Resume data for PDF preview:", JSON.stringify(resumeData, null, 2));
        console.log("Template for PDF preview:", template);

        const pdfBuffer = await renderPdf(resumeData, template);

        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
          },
        });
      } catch (error) {
        console.error("Error generating PDF preview:", error);
        return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
      }
    }
    ```

## 4. Core Logic (`pdfRenderService.js`)

The main PDF generation logic resides in `src/services/pdfRenderService.js`.

```javascript
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

// ... (formatDate function)

export async function renderPdf(resumeData, template, returnHtml = false) {
  // Read the HTML template from the file system
  const templatePath = path.join(
    process.cwd(),
    "src",
    "components",
    "resume-templates",
    "html-templates",
    template
  );
  let html = await fs.readFile(templatePath, "utf-8");

  // Replace placeholders in the HTML with resume data
  // ... (HTML replacement logic)

  if (returnHtml) {
    return html;
  }

  // Launch Puppeteer to generate the PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
}
```

## 5. Frontend Integration (`PdfView.js`)

The `PdfView` component is responsible for fetching and displaying the PDF preview.

-   **File:** `src/components/preview/PdfView.js`
-   **Code:**

    ```javascript
    "use client";

    import { useState, useEffect } from 'react';

    export default function PdfView({ resumeData, template }) {
      const [pdfUrl, setPdfUrl] = useState('');

      useEffect(() => {
        const fetchPdf = async () => {
          const response = await fetch('/api/preview-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resumeData: resumeData,
              template: template,
            }),
          });
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        };

        fetchPdf();

        return () => {
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }
        };
      }, [resumeData, template]);

      return (
        <>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume PDF Preview"
            />
          )}
        </>
      );
    }
    ```

## 6. Troubleshooting

-   **Error: `Failed to launch the browser process`**: This can happen if the environment is missing necessary dependencies for Chromium. For Debian-based Linux, you might need to install the following:
    ```bash
    sudo apt-get install -yq --no-install-recommends libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
    ```
-   **Long Generation Times:** PDF generation can be slow. Ensure that you are not unnecessarily re-rendering the PDF. The `useEffect` hook in `PdfView.js` is set up to only re-fetch the PDF when the `resumeData` or `template` props change.
-   **Fonts not rendering correctly:** If you are using custom fonts, make sure they are accessible to Puppeteer. You can use `@font-face` in your CSS and ensure the font files are served correctly.
