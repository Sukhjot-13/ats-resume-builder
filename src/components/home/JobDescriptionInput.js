"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * A component for inputting a job description.
 * @param {object} props - The component's props.
 * @param {string} props.jobDescription - The current job description.
 * @param {function} props.setJobDescription - The function to call when the job description changes.
 * @returns {JSX.Element} The rendered component.
 */
export default function JobDescriptionInput({ jobDescription, setJobDescription }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="job-description">Job Description</Label>
      <Textarea
        id="job-description"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="min-h-[120px]"
      />
    </div>
  );
}
