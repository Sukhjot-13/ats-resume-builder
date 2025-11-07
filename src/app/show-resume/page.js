import React from 'react';

async function getResumeHtml() {
  try {
    const res = await fetch('/api/render-test-html', { cache: 'no-store' });
    if (!res.ok) {
      return `<div>Error: ${res.statusText}</div>`;
    }
    return res.text();
  } catch (error) {
    return `<div>Error: ${error.message}</div>`;
  }
}

export default async function ShowResume() {
  const html = await getResumeHtml();

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
