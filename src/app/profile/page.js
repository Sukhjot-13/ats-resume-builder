"use client";

import { useState, useEffect } from 'react';
import { useApiClient } from '@/hooks/useApiClient';
import ResumeUpload from '@/components/profile/ResumeUpload';
import ResumePreview from '@/components/preview/ResumePreview';
import TemplateSelector from '@/components/home/TemplateSelector';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Assuming shadcn/ui switch component

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [masterResume, setMasterResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('Simple.html');
  const [showAiEditor, setShowAiEditor] = useState(false);
  const [aiEditQuery, setAiEditQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient('/api/user/profile');

        if (response.ok) {
          const data = await response.json();
          setName(data.name || '');
          if (data.dateOfBirth) {
            setDateOfBirth(new Date(data.dateOfBirth).toISOString().split('T')[0]);
          }
          if (data.mainResume) {
            setMasterResume(data.mainResume.content);
          }
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [apiClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dateOfBirth }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setParsing(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      const response = await apiClient('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Resume parsed successfully!');
        
        const profileResponse = await apiClient('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mainResume: data }),
        });

        if (profileResponse.ok) {
          const updatedUser = await profileResponse.json();
          setMasterResume(updatedUser.mainResume.content);
        } else {
          const errData = await profileResponse.json();
          setError(errData.error || 'Failed to update profile with new resume.');
        }

      } else {
        const data = await response.json();
        setError(data.error || 'Failed to parse resume.');
      }
    } catch (err) {
      setError('An unexpected error occurred during resume parsing.');
    } finally {
      setParsing(false);
    }
  };

  const handleAiEdit = async () => {
    setEditing(true);
    setError('');
    setSuccess('');

    if (!masterResume) {
      setError("Please upload a master resume before attempting AI edits.");
      setEditing(false);
      return;
    }

    try {
      const response = await apiClient('/api/edit-resume-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume: masterResume, query: aiEditQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setMasterResume(data);
        setSuccess('Resume updated successfully with AI!');
        setShowAiEditor(false);
        setAiEditQuery('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to edit resume with AI.');
      }
    } catch (err) {
      setError('An unexpected error occurred during AI edit.');
    }

    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Your Profile</h1>

      {error && (
        <Card className="border-destructive bg-destructive/10 text-destructive">
          <CardContent className="p-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
      {success && (
        <Card className="border-green-500 bg-green-500/10 text-green-500">
          <CardContent className="p-4">
            <p className="font-semibold">Success:</p>
            <p>{success}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <ResumeUpload parsing={parsing} handleFileUpload={handleFileUpload} />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">AI Editor</CardTitle>
              <Switch
                checked={showAiEditor}
                onCheckedChange={setShowAiEditor}
                id="ai-editor-mode"
              />
            </CardHeader>
            <CardContent>
              {showAiEditor && (
                <div className="grid gap-4">
                  <Textarea
                    placeholder="Describe the changes you want to make to your master resume (e.g., 'Expand on my project management experience', 'Remove the section about hobbies')..."
                    value={aiEditQuery}
                    onChange={(e) => setAiEditQuery(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <Button onClick={handleAiEdit} disabled={editing || !masterResume}>
                    {editing ? 'Editing...' : 'Submit AI Edit'}
                  </Button>
                </div>
              )}
              {!masterResume && showAiEditor && (
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a master resume first to use the AI editor.
                </p>
              )}
            </CardContent>
          </Card>

          <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
        </div>
        <div>
          {masterResume ? (
            <Card>
              <CardHeader>
                <CardTitle>Master Resume Preview</CardTitle>
                <CardDescription>This is your current master resume.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResumePreview tailoredResume={masterResume} selectedTemplate={selectedTemplate} />
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center p-8 h-full">
              <CardDescription>Upload a resume to see its preview here.</CardDescription>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}