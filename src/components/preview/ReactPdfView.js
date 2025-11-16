
"use client";

import { useState, useEffect } from 'react';

export default function ReactPdfView({ resumeData, template }) {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch('/api/render-pdf-react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          template: template, // Although the template is not used in the new API for now
        }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    if (resumeData) {
      fetchPdf();
    }

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
