
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
