
"use client";

import { useState } from 'react';
import ResumeDisplayView from './ResumeDisplayView';
import TextView from './TextView';
import PdfView from './PdfView';
import ReactPdfView from './ReactPdfView';

export default function ResumePreview({ tailoredResume, selectedTemplate }) {
  const [view, setView] = useState('display'); // 'display', 'text', 'pdf', or 'react-pdf'
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
          className={`px-4 py-2 rounded-l-lg ${view === 'display' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Display View
        </button>
        <button
          onClick={() => setView('text')}
          className={`px-4 py-2 ${view === 'text' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Text View
        </button>
        <button
          onClick={() => setView('pdf')}
          className={`px-4 py-2 ${view === 'pdf' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          PDF View
        </button>
        <button
          onClick={() => setView('react-pdf')}
          className={`px-4 py-2 rounded-r-lg ${view === 'react-pdf' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          React PDF
        </button>
      </div>
      <div className="w-full h-96 bg-white">
        {view === 'display' && <ResumeDisplayView resumeData={tailoredResume} />}
        {view === 'text' && <TextView resumeData={tailoredResume} template={selectedTemplate} />}
        {view === 'pdf' && <PdfView resumeData={tailoredResume} template={selectedTemplate} />}
        {view === 'react-pdf' && <ReactPdfView resumeData={tailoredResume} template={selectedTemplate} />}
      </div>
    </div>
  );
}
