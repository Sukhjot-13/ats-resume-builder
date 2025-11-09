"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react"; // Import icon

/**
 * A component for inputting special instructions and generating a tailored resume.
 * @param {object} props - The component's props.
 * @param {string} props.specialInstructions - The current special instructions.
 * @param {function} props.setSpecialInstructions - The function to call when the special instructions change.
 * @param {function} props.handleGenerateResume - The function to call when the "Generate Tailored Resume" button is clicked.
 * @param {boolean} props.generating - Whether a tailored resume is currently being generated.
 * @param {object} props.profile - The user's profile data.
 * @returns {JSX.Element} The rendered component.
 */
export default function SpecialInstructionsInput({
  specialInstructions,
  setSpecialInstructions,
  handleGenerateResume,
  generating,
  profile,
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="special-instructions">Special Instructions</Label>
      <Textarea
        id="special-instructions"
        placeholder="Add any special instructions for tailoring your resume (e.g., 'Focus on leadership roles', 'Highlight my experience with React.js')..."
        value={specialInstructions}
        onChange={(e) => setSpecialInstructions(e.target.value)}
        className="min-h-[120px]"
      />
      <Button
        onClick={handleGenerateResume}
        className="w-full"
        disabled={generating || !profile}
      >
        {generating ? (
          "Generating..."
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> Generate Tailored Resume
          </>
        )}
      </Button>
    </div>
  );
}
