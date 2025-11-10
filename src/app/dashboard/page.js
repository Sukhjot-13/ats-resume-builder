"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";
import JobDescriptionInput from "@/components/home/JobDescriptionInput";
import SpecialInstructionsInput from "@/components/home/SpecialInstructionsInput";
import ResumePreview from "@/components/preview/ResumePreview";
import TemplateSelector from "@/components/home/TemplateSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, Trash2, Eye, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DotsLoading from "@/components/ui/DotsLoading";

export default function DashboardPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [tailoredResume, setTailoredResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("Simple.html");
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const profileResponse = await apiClient("/api/user/profile");
        if (profileResponse.ok) {
          setProfile(await profileResponse.json());
        } else {
          if (profileResponse.status === 401) {
            router.push("/login");
            return;
          }
          const errData = await profileResponse.json();
          setError(errData.error || "Failed to fetch profile");
        }

        const resumesResponse = await apiClient("/api/resumes");
        if (resumesResponse.ok) {
          setResumes(await resumesResponse.json());
        } else {
          if (resumesResponse.status === 401) {
            router.push("/login");
            return;
          }
          const errData = await resumesResponse.json();
          setError(errData.error || "Failed to fetch resumes");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiClient, router]);

  const currentProfileName = profile?.name || profile?.email || "User";

  const handleGenerateResume = async () => {
    setGenerating(true);
    setError(null);
    if (!profile?.mainResume) {
      setError(
        "Please upload your master resume in the profile section first."
      );
      setGenerating(false);
      return;
    }
    try {
      const generateResponse = await apiClient("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: profile.mainResume.content,
          jobDescription,
          specialInstructions,
        }),
      });

      if (generateResponse.ok) {
        const { resume, metadata } = await generateResponse.json();
        setTailoredResume(resume);

        const saveResponse = await apiClient("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: resume, metadata }),
        });

        if (saveResponse.ok) {
          const newResume = await saveResponse.json();
          setResumes([newResume, ...resumes]);
        } else {
          setError(
            (await saveResponse.json()).error || "Failed to save resume."
          );
        }
      } else {
        setError(
          (await generateResponse.json()).error || "Error generating resume."
        );
      }
    } catch (error) {
      setError("An unexpected error occurred during resume generation.");
    }
    setGenerating(false);
  };

  const handleDeleteResume = async (resumeId) => {
    setDeletingId(resumeId);
    setError(null);
    try {
      const response = await apiClient(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setResumes(resumes.filter((resume) => resume._id !== resumeId));
      } else {
        setError((await response.json()).error || "Error deleting resume.");
      }
    } catch (error) {
      setError("An unexpected error occurred during resume deletion.");
    }
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-10 p-4 sm:p-6 md:p-8 max-w-8xl mx-auto bg-bg-primary text-text-primary">
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        {loading ? (
          <h1 className="text-4xl font-bold text-accent">
            <DotsLoading />
          </h1>
        ) : (
          <h1 className="text-4xl font-bold text-accent">
            Welcome, {currentProfileName}!
          </h1>
        )}
        <p className="text-text-muted mt-2">
          {`Ready to land your dream job? Let"s tailor your resume.`}
        </p>
      </div>

      {error && (
        <Card className="border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <CardContent className="p-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <div>
              <p className="font-semibold">An error occurred:</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">
                Create Your Resume
              </CardTitle>
              <CardDescription className="text-text-muted">
                Select a template and provide the job details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
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
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-border bg-surface h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">
                Tailored Resume Preview
              </CardTitle>
              <CardDescription className="text-text-muted">
                Review your AI-generated resume below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generating ? (
                <div className="flex items-center justify-center p-8 h-96 border-2 border-dashed border-border rounded-lg">
                  <p className="text-text-muted">Generating your resume...</p>
                </div>
              ) : tailoredResume ? (
                <ResumePreview
                  tailoredResume={tailoredResume}
                  selectedTemplate={selectedTemplate}
                />
              ) : (
                <div className="flex items-center justify-center p-8 h-96 border-2 border-dashed border-border rounded-lg">
                  <p className="text-text-muted">
                    Your tailored resume preview will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-accent">
          Your Saved Resumes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-md border-border bg-surface">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="p-8 text-center text-text-muted shadow-md border-border bg-surface">
            <PlusCircle className="mx-auto h-12 w-12 mb-4 text-accent" />
            <p>No resumes found. Generate your first resume above!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((resume) => (
                <Card
                  key={resume._id}
                  className="shadow-md hover:shadow-xl transition-shadow duration-300 border-border bg-surface"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-accent">
                      {resume.metadata?.jobTitle || "Untitled Resume"}
                    </CardTitle>
                    {resume.metadata?.companyName && (
                      <CardDescription className="text-text-muted">
                        Company: {resume.metadata.companyName}
                      </CardDescription>
                    )}
                    <CardDescription className="text-text-muted">
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button
                      onClick={() => setTailoredResume(resume.content)}
                      className="flex-1 bg-accent text-brand-primary hover:bg-accent/90"
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button
                      onClick={() => handleDeleteResume(resume._id)}
                      disabled={deletingId === resume._id}
                      className="flex-1"
                      variant="destructive"
                    >
                      {deletingId === resume._id ? (
                        "Deleting..."
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
