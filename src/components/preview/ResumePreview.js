
"use client";

import { useState } from 'react';
import ResumeDisplayView from './ResumeDisplayView';
import TextView from './TextView';
import PdfView from './PdfView';

export default function ResumePreview({ tailoredResume, selectedTemplate }) {
  const [view, setView] = useState('display'); // 'display', 'text', or 'pdf'
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/render-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: tailoredResume,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Error downloading PDF:", await response.text());
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
    setDownloading(false);
  };

  if (!tailoredResume) {
    return null;
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Resume Preview</h2>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-500"
          disabled={downloading}
        >
          {downloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>
      <div className="flex mb-4">
        <button
          onClick={() => setView('display')}
          className={`px-4 py-2 rounded-l-lg ${view === 'display' ? 'bg-accent text-brand-primary' : 'bg-surface text-text-primary'}`}
        >
          Display View
        </button>
        <button
          onClick={() => setView('text')}
          className={`px-4 py-2 ${view === 'text' ? 'bg-accent text-brand-primary' : 'bg-surface text-text-primary'}`}
        >
          Text View
        </button>
        <button
          onClick={() => setView('pdf')}
          className={`px-4 py-2 rounded-r-lg ${view === 'pdf' ? 'bg-accent text-brand-primary' : 'bg-surface text-text-primary'}`}
        >
          PDF View
        </button>
      </div>
      <div className="w-full h-96 bg-bg-primary">
        {view === 'display' && <ResumeDisplayView resumeData={tailoredResume} />}
        {view === 'text' && <TextView resumeData={tailoredResume} template={selectedTemplate} />}
        {view === 'pdf' && <PdfView resumeData={tailoredResume} template={selectedTemplate} />}
      </div>
    </div>
  );
}
