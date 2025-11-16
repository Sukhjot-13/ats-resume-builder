"use client";

import { useState, useEffect } from 'react';

export default function TextView({ resumeData, template }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumeData || !template) {
      setHtml('');
      setLoading(false);
      setError('Please provide resume data and a template.');
      return;
    }

    const fetchHtml = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/render-test-html', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeData, template }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlContent = await response.text();
        setHtml(htmlContent);
      } catch (e) {
        console.error("Failed to fetch resume HTML:", e);
        setError("Failed to load resume preview.");
        setHtml('');
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [resumeData, template]);

  if (loading) {
    return <div className="p-4 text-center">Loading resume preview...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <>
      {html ? (
        <iframe
          srcDoc={html}
          className="w-full h-full border-none"
          title="Resume Text Preview"
        />
      ) : (
        <div className="p-4 text-center text-gray-500">No resume data or template selected for preview.</div>
      )}
    </>
  );
}
