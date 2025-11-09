"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Using Input for styling, but keeping type="file"

/**
 * A component for uploading a resume file.
 * @param {object} props - The component's props.
 * @param {boolean} props.parsing - Whether a file is currently being parsed.
 * @param {function} props.handleFileUpload - The function to call when a file is uploaded.
 * @returns {JSX.Element} The rendered component.
 */
export default function ResumeUpload({ parsing, handleFileUpload }) {
  const fileInputRef = useRef(null);

  const onFileChange = (event) => {
    handleFileUpload(event.target.files[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Input
            type="file"
            accept=".pdf,.docx"
            onChange={onFileChange}
            className="hidden"
            id="resume-upload"
            ref={fileInputRef}
            disabled={parsing}
          />
          <Button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer"
            disabled={parsing}
          >
            {parsing ? "Parsing..." : "Select a file"}
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">PDF or DOCX</p>
        </div>
      </CardContent>
    </Card>
  );
}
