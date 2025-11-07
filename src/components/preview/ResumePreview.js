
"use client";

import { useState } from 'react';
import ResumeDisplayView from './ResumeDisplayView';
import TextView from './TextView';
import PdfView from './PdfView';

export default function ResumePreview({ tailoredResume, selectedTemplate }) {
  const [view, setView] = useState('display'); // 'display', 'text', or 'pdf'

  if (!tailoredResume) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Resume Preview</h2>
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
          className={`px-4 py-2 rounded-r-lg ${view === 'pdf' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          PDF View
        </button>
      </div>
      <div className="w-full h-96 bg-white">
        {view === 'display' && <ResumeDisplayView resumeData={tailoredResume} />}
        {view === 'text' && <TextView resumeData={tailoredResume} template={selectedTemplate} />}
        {view === 'pdf' && <PdfView resumeData={tailoredResume} template={selectedTemplate} />}
      </div>
    </div>
  );
}
