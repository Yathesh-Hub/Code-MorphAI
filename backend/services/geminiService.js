const { getModel } = require('../config/gemini');

const translateCode = async (code, sourceLang, targetLang) => {
  const model = getModel();
  const prompt = `You are an expert software engineer.
Analyze the following code written in ${sourceLang}.
Check if it contains any syntax errors or is syntactically invalid for ${sourceLang}.
If there are syntax errors or if it is invalid, return exactly:
SYNTAX_ERROR: <detailed description of the syntax error>

If the code is syntactically valid and correct, translate the code from ${sourceLang} to ${targetLang}.
Preserve functionality and best practices.
Return only the translated code.
No explanations. No markdown fences.

Code:
${code}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  // Strip markdown code fences if present
  return text.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();
};

const explainCode = async (code) => {
  const model = getModel();
  const prompt = `Explain this code in simple language.
Provide:
1. Purpose
2. Variables
3. Loops
4. Conditions
5. Output

Code:
${code}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

const analyzeCode = async (code) => {
  const model = getModel();
  const prompt = `Analyze this code and return only valid JSON with no markdown, no code fences:
{
  "summary": "",
  "timeComplexity": "",
  "spaceComplexity": "",
  "readabilityScore": 0,
  "maintainabilityScore": 0,
  "issues": [],
  "suggestions": []
}

Code:
${code}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned);
};

const findIssues = async (code) => {
  const model = getModel();
  const prompt = `Review this code and identify issues. Return only valid JSON with no markdown, no code fences:
{
  "bugs": [],
  "runtimeErrors": [],
  "logicIssues": [],
  "securityVulnerabilities": [],
  "performanceIssues": []
}

Code:
${code}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { translateCode, explainCode, analyzeCode, findIssues };
