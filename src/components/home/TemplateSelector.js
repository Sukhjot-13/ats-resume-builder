"use client";

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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Select a Template</h2>
      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Test2.html">Test2</option>
        <option value="test.html">Test</option>
        <option value="Simple.html">Simple</option>
        <option value="Professional.html">Professional</option>
        <option value="Modern.html">Modern</option>
        <option value="Creative.html">Creative</option>
      </select>
    </div>
  );
}
