"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import userData from "../models/user-data";

const PDFViewer = dynamic(() => import("../components/PDFViewer"), {
  ssr: false,
});

const transformData = (parsedData) => {
  const transformed = { ...userData };

  if (parsedData.profile) {
    transformed.profile = { ...transformed.profile, ...parsedData.profile };
  }
  if (parsedData.work_experience) {
    transformed.work_experience = parsedData.work_experience;
  }
  if (parsedData.education) {
    transformed.education = parsedData.education;
  }
  if (parsedData.skills) {
    transformed.skills = parsedData.skills;
  }
  if (parsedData.additional_info) {
    transformed.additional_info = { ...transformed.additional_info, ...parsedData.additional_info };
  }

  return transformed;
};

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [tailoredResume, setTailoredResume] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("test.html");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [downloadingParsed, setDownloadingParsed] = useState(false);
  const [downloadingTailored, setDownloadingTailored] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setParsing(true);
    const formData = new FormData();
    formData.append("resumeFile", file);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const parsedData = await response.json();
        const transformedData = transformData(parsedData);
        console.log("Parsed data:", transformedData);
        setProfile(transformedData);
        await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        });
      } else {
        const errorText = await response.text();
        console.error("Error parsing resume:", errorText);
        alert(`Error parsing resume: ${errorText}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    }
    setParsing(false);
  };

  const handleDownloadParsedResume = async () => {
    if (!profile) return;

    setDownloadingParsed(true);
    try {
      const response = await fetch("/api/render-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: profile,
          template: "test.html",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfPreview(url);

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
    setDownloadingParsed(false);
  };

  const handleGenerateResume = async () => {
    if (!jobDescription) return;

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile, jobDescription, specialInstructions }),
      });

      if (response.ok) {
        const tailoredData = await response.json();
        const transformedData = transformData(tailoredData);
        setTailoredResume(transformedData);
      } else {
        console.error("Error generating resume:", await response.text());
      }
    } catch (error) {
      console.error("Error generating resume:", error);
    }
    setGenerating(false);
  };

  const handleDownloadTailoredResume = async () => {
    if (!tailoredResume) return;

    setDownloadingTailored(true);
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
        setPdfPreview(url);

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
    setDownloadingTailored(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ATS-Friendly Resume Builder
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Upload, Job Description, and Edit */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Upload Your Resume
              </h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={parsing}
                />
                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors ${parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {parsing ? "Parsing..." : "Select a file"}
                </label>
                <p className="mt-2 text-sm text-gray-400">PDF or DOCX</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
              <textarea
                className="w-full h-40 bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
            </div>

            {/* New Special Instructions Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Special Instructions
              </h2>
              <textarea
                className="w-full h-40 bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any special instructions for tailoring your resume (e.g., 'Focus on leadership roles', 'Highlight my experience with React.js')..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
              <button
                onClick={handleGenerateResume}
                className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-500"
                disabled={generating || !profile}
              >
                {generating ? "Generating..." : "Generate Tailored Resume"}
              </button>
            </div>

            {/* Template Selector */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Select a Template</h2>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Simple.html">Simple</option>
                <option value="test.html">Test</option>
                <option value="test-filled.html">Test Filled</option>
              </select>
            </div>
          </div>

          {/* Right Column: Display Profile and Tailored Resume */}
          <div className="space-y-8">
            {profile && profile.profile && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Your Profile</h2>
                  <button
                    onClick={handleDownloadParsedResume}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-500"
                    disabled={downloadingParsed}
                  >
                    {downloadingParsed ? 'Downloading...' : 'Download Parsed Resume'}
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">
                      {profile.profile.full_name}
                    </h3>
                    <p className="text-gray-400">{profile.profile.email}</p>
                    <p className="text-gray-400">{profile.profile.phone}</p>
                    <p className="text-gray-400">{profile.profile.location}</p>
                    <p className="text-gray-400">{profile.profile.website}</p>
                    <p className="text-gray-400">{profile.profile.headline}</p>
                    <p className="mt-4 text-gray-300">
                      {profile.profile.generic_summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Work Experience</h4>
                    <ul className="mt-2 space-y-4">
                      {profile.work_experience.map((exp, i) => (
                        <li key={i}>
                          <p className="font-bold">
                            {exp.job_title} at {exp.company}
                          </p>
                          <p className="text-sm text-gray-400">
                            {exp.start_date} - {exp.end_date}
                          </p>
                          <ul className="list-disc list-inside mt-2 text-gray-300">
                            {exp.responsibilities.map((resp, j) => (
                              <li key={j}>{resp}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Education</h4>
                    <ul className="mt-2 space-y-2">
                      {profile.education.map((edu, i) => (
                        <li key={i}>
                          <p className="font-bold">{edu.institution}</p>
                          <p className="text-gray-400">
                            {edu.degree} in {edu.field_of_study}
                          </p>
                          <p className="text-sm text-gray-400">
                            {edu.start_date} - {edu.end_date}
                          </p>
                          <p className="text-sm text-gray-400">
                            {edu.relevant_coursework}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Skills</h4>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {profile.skills.map((skill, i) => (
                        <li
                          key={i}
                          className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.skill_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {profile.additional_info && (
                    <div>
                      <h4 className="text-lg font-semibold">Additional Information</h4>
                      <ul className="mt-2 space-y-2">
                        <li><span className="font-bold">Languages:</span> {profile.additional_info.languages.join(", ")}</li>
                        <li><span className="font-bold">Certifications:</span> {profile.additional_info.certifications.join(", ")}</li>
                        <li><span className="font-bold">Awards/Activities:</span> {profile.additional_info.awards_activities.join(", ")}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tailoredResume && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Tailored Resume</h2>
                  <button
                    onClick={handleDownloadTailoredResume}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-500"
                    disabled={downloadingTailored}
                  >
                    {downloadingTailored ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">
                      {tailoredResume.profile.full_name}
                    </h3>
                    <p className="text-gray-400">{tailoredResume.profile.email}</p>
                    <p className="text-gray-400">{tailoredResume.profile.phone}</p>
                    <p className="text-gray-400">{tailoredResume.profile.location}</p>
                    <p className="text-gray-400">{tailoredResume.profile.website}</p>
                    <p className="text-gray-400">{tailoredResume.profile.headline}</p>
                    <p className="mt-4 text-gray-300">
                      {tailoredResume.profile.generic_summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Work Experience</h4>
                    <ul className="mt-2 space-y-4">
                      {tailoredResume.work_experience.map((exp, i) => (
                        <li key={i}>
                          <p className="font-bold">
                            {exp.job_title} at {exp.company}
                          </p>
                          <p className="text-sm text-gray-400">
                            {exp.start_date} - {exp.end_date}
                          </p>
                          <ul className="list-disc list-inside mt-2 text-gray-300">
                            {exp.responsibilities.map((resp, j) => (
                              <li key={j}>{resp}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Education</h4>
                    <ul className="mt-2 space-y-2">
                      {tailoredResume.education.map((edu, i) => (
                        <li key={i}>
                          <p className="font-bold">{edu.institution}</p>
                          <p className="text-gray-400">
                            {edu.degree} in {edu.field_of_study}
                          </p>
                          <p className="text-sm text-gray-400">
                            {edu.start_date} - {edu.end_date}
                          </p>
                          <p className="text-sm text-gray-400">
                            {edu.relevant_coursework}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Skills</h4>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {tailoredResume.skills.map((skill, i) => (
                        <li
                          key={i}
                          className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.skill_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {tailoredResume.additional_info && (
                    <div>
                      <h4 className="text-lg font-semibold">Additional Information</h4>
                      <ul className="mt-2 space-y-2">
                        <li><span className="font-bold">Languages:</span> {tailoredResume.additional_info.languages.join(", ")}</li>
                        <li><span className="font-bold">Certifications:</span> {tailoredResume.additional_info.certifications.join(", ")}</li>
                        <li><span className="font-bold">Awards/Activities:</span> {tailoredResume.additional_info.awards_activities.join(", ")}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {pdfPreview && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">PDF Preview</h2>
                <PDFViewer file={pdfPreview} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
