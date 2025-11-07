"use client";

import { useState, useEffect, useRef } from "react";
import userData from "../models/user-data";
import ResumeUpload from "../components/home/ResumeUpload";
import JobDescriptionInput from "../components/home/JobDescriptionInput";
import SpecialInstructionsInput from "../components/home/SpecialInstructionsInput";
import TemplateSelector from "../components/home/TemplateSelector";
import ResumePreview from "../components/preview/ResumePreview";

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
    if (
      Array.isArray(parsedData.skills) &&
      parsedData.skills.every((skill) => typeof skill === "string")
    ) {
      transformed.skills = parsedData.skills.map((skill) => ({
        skill_name: skill,
        category: "Uncategorized",
      }));
    } else {
      transformed.skills = parsedData.skills;
    }
  }
  if (parsedData.additional_info) {
    transformed.additional_info = {
      ...transformed.additional_info,
      ...parsedData.additional_info,
    };
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
  const [selectedTemplate, setSelectedTemplate] = useState("Simple.html");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        const transformedData = transformData(data);
        setProfile(transformedData);
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
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />

            <ResumeUpload
              parsing={parsing}
              handleFileUpload={handleFileUpload}
            />

            <JobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />

            <SpecialInstructionsInput
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
              handleGenerateResume={handleGenerateResume}
              generating={generating}
              profile={profile}
            />
          </div>

          {/* Right Column: Display Profile and Tailored Resume */}
          <div className="space-y-8">
            {tailoredResume ? (
              <ResumePreview
                tailoredResume={tailoredResume}
                selectedTemplate={selectedTemplate}
              />
            ) : (
              profile &&
              profile.profile && (
                <ResumePreview
                  tailoredResume={profile}
                  selectedTemplate={selectedTemplate}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
