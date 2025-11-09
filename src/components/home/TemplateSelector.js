"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/**
 * A component for selecting a resume template.
 * @param {object} props - The component's props.
 * @param {string} props.selectedTemplate - The currently selected template.
 * @param {function} props.setSelectedTemplate - The function to call when the template changes.
 * @returns {JSX.Element} The rendered component.
 */
export default function TemplateSelector({
  selectedTemplate,
  setSelectedTemplate,
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="template-selector">Select a Template</Label>
      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <SelectTrigger id="template-selector" className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test.html">Test</SelectItem>
          <SelectItem value="Simple.html">Simple</SelectItem>
          <SelectItem value="Professional.html">Professional</SelectItem>
          <SelectItem value="Modern.html">Modern</SelectItem>
          <SelectItem value="Creative.html">Creative</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}