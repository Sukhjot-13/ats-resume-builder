import React from 'react';
import { pdf } from '@react-pdf/renderer';

const PdfResumeRenderer = async ({ resumeData, Template }) => {
  const pdfBlob = await pdf(<Template resumeData={resumeData} />).toBuffer();
  return pdfBlob;
};

export default PdfResumeRenderer;
