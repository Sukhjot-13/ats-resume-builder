"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiClient } from '@/hooks/useApiClient'; // Assuming useApiClient is available

export default function ResumeHistoryPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const apiClient = useApiClient(); // Use the custom API client

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await apiClient('/api/resumes');

        if (response.ok) {
          const data = await response.json();
          setResumes(data);
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to fetch resumes');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [apiClient]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Card className="p-6 text-center">
          <CardTitle>Loading Resumes...</CardTitle>
          <CardDescription>Please wait while we fetch your resume history.</CardDescription>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Card className="border-destructive bg-destructive/10 text-destructive p-6 text-center">
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Your Resumes</h1>
      {resumes.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <CardTitle>No resumes found.</CardTitle>
          <CardDescription>Start by creating one from your dashboard!</CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((resume) => (
            <Card key={resume._id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {resume.metadata?.jobTitle || 'Untitled Resume'}
                </CardTitle>
                {resume.metadata?.companyName && (
                  <CardDescription>Company: {resume.metadata.companyName}</CardDescription>
                )}
                <CardDescription>Created: {new Date(resume.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* You might want to add a button here to view the resume in detail */}
                <Button onClick={() => router.push(`/show-resume?id=${resume._id}`)} className="w-full">
                  View Resume
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}