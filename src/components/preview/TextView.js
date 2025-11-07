
"use client";

import { useState, useEffect } from 'react';

export default function TextView({ resumeData, template }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const fetchHtml = async () => {
      const response = await fetch('/api/render-test-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: resumeData,
          template: template,
        }),
      });
      const html = await response.text();
      setHtml(html);
    };

    fetchHtml();
  }, [resumeData, template]);

  return (
    <>
      {html && (
        <iframe
          srcDoc={html}
          className="w-full h-full"
          title="Resume Text Preview"
        />
      )}
    </>
  );
}
