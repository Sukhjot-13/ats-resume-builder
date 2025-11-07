"use client";

/**
 * A component for displaying a resume.
 * @param {object} props - The component's props.
 * @param {string} props.title - The title of the resume display.
 * @param {object} props.resumeData - The resume data to display.
 * @param {function} props.handleDownload - The function to call when the download button is clicked.
 * @param {boolean} props.downloading - Whether the resume is currently being downloaded.
 * @param {string} props.downloadButtonText - The text to display on the download button.
 * @returns {JSX.Element} The rendered component.
 */
export default function ResumeDisplay({
  title,
  resumeData,
  handleDownload,
  downloading,
  downloadButtonText,
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-500"
          disabled={downloading}
        >
          {downloading ? "Downloading..." : downloadButtonText}
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold">
            {resumeData.profile.full_name}
          </h3>
          <p className="text-gray-400">{resumeData.profile.email}</p>
          <p className="text-gray-400">{resumeData.profile.phone}</p>
          <p className="text-gray-400">{resumeData.profile.location}</p>
          <p className="text-gray-400">{resumeData.profile.website}</p>
          <p className="text-gray-400">{resumeData.profile.headline}</p>
          <p className="mt-4 text-gray-300">
            {resumeData.profile.generic_summary}
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold">Work Experience</h4>
          <ul className="mt-2 space-y-4">
            {resumeData.work_experience.map((exp, i) => (
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
            {resumeData.education.map((edu, i) => (
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
            {resumeData.skills.map((skill, i) => (
              <li
                key={i}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.skill_name}
              </li>
            ))}
          </ul>
        </div>
        {resumeData.additional_info && (
          <div>
            <h4 className="text-lg font-semibold">
              Additional Information
            </h4>
            <ul className="mt-2 space-y-2">
              <li>
                <span className="font-bold">Languages:</span>{" "}
                {resumeData.additional_info.languages.join(", ")}
              </li>
              <li>
                <span className="font-bold">Certifications:</span>{" "}
                {resumeData.additional_info.certifications.join(", ")}
              </li>
              <li>
                <span className="font-bold">Awards/Activities:</span>{" "}
                {resumeData.additional_info.awards_activities.join(", ")}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}