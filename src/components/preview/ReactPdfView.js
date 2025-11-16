"use client";

import { useState, useEffect } from 'react';

export default function ReactPdfView({ resumeData, template }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/render-pdf-react', {
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
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
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
      {loading && <div className="flex justify-center items-center h-full">Loading...</div>}
      {pdfUrl && !loading && (
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Resume PDF Preview"
        />
      )}
    </>
  );
}