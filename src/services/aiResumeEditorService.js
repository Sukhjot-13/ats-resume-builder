import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '@/lib/logger';

/**
 * Edits a user's resume based on a natural language query.
 * @param {object} resume - The user's current resume data.
 * @param {string} query - The user's edit request.
 * @returns {Promise<object>} The updated resume data.
 */
export async function editResumeWithAI(resume, query) {
  logger.info({ file: 'src/services/aiResumeEditorService.js', function: 'editResumeWithAI' }, 'editResumeWithAI function triggered');
  logger.debug({ file: 'src/services/aiResumeEditorService.js', function: 'editResumeWithAI', query }, 'AI edit query received');
  // Construct the prompt for the Gemini API
  let prompt = `
    [TASK]
    You are an expert resume editor. Your task is to edit the user's resume based on their natural language query.
    You will receive the user's current resume data and their edit query.
    Your output MUST be a JSON object with the same schema as the user's resume data.
    Analyze the user's query and determine if the requested changes are valid and can be accommodated within the existing resume schema.
    If the changes are valid, apply them and return the updated resume data.
    If the changes are not valid (e.g., the user asks to add a field that doesn't exist in the schema), you should return an error message. For now, just return the original resume data if the query is invalid.

    [USER'S CURRENT RESUME DATA]
    ${JSON.stringify(resume, null, 2)}

    [USER'S EDIT QUERY]
    "${query}"

    [INSTRUCTIONS]
    1. Carefully analyze the [USER'S EDIT QUERY] to understand the requested changes.
    2. Modify the [USER'S CURRENT RESUME DATA] to reflect the requested changes.
    3. Ensure the output is a valid JSON object with the same schema as the user's resume data.
    4. If the query is ambiguous or cannot be fulfilled within the given schema, it is acceptable to return the original resume data without modification.
    5. The output JSON schema should be as follows:
    {
      "profile": {
        "full_name": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "website": "...",
        "headline": "...",
        "generic_summary": "..."
      },
      "work_experience": [
        {
          "job_title": "...",
          "company": "...",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "is_current": false,
          "responsibilities": ["...", "..."]
        }
      ],
      "education": [
        {
          "institution": "...",
          "degree": "...",
          "field_of_study": "...",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "relevant_coursework": "..."
        }
      ],
      "skills": [
        { "skill_name": "...", "category": "..." }
      ],
      "additional_info": {
        "languages": [],
        "certifications": [],
        "awards_activities": []
      }
    }
  `;

  // Call the Gemini API to generate the edited content
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```json/g, "").replace(/```/g, "");
  const lastBraceIndex = text.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    text = text.substring(0, lastBraceIndex + 1);
  }
  logger.debug({ file: 'src/services/aiResumeEditorService.js', function: 'editResumeWithAI', aiResponse: text }, 'AI generated content');

  // Parse the JSON response and return it
  try {
    const editedData = JSON.parse(text);
    logger.info({ file: 'src/services/aiResumeEditorService.js', function: 'editResumeWithAI' }, 'AI edited resume parsed successfully');
    return editedData;
  } catch (e) {
    logger.error({ file: 'src/services/aiResumeEditorService.js', function: 'editResumeWithAI', error: e, aiResponse: text }, 'Error parsing AI generated JSON');
    throw new Error(`AI parsing error: ${text}`);
  }
}
