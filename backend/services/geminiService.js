const { getModel } = require('../config/gemini');

const stripFences = (text) =>
  text.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();

const callGemini = async (prompt, retries = 3) => {
  const model = getModel();
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      if (err.status === 429 && i < retries - 1) {
        const delay = 16000;
        console.log(`Rate limited, retrying in ${delay / 1000}s... (attempt ${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
};

const translateCode = async (code, sourceLang, targetLang) => {
  const prompt = `You are an expert software engineer.
Translate the following code from ${sourceLang} to ${targetLang}.
Preserve functionality and best practices.
Return only translated code.
No explanations.

Code:
${code}`;
  return stripFences(await callGemini(prompt));
};

const explainCode = async (code) => {
  const prompt = `Explain this code in simple language.
Provide:
1. Purpose
2. Variables
3. Loops
4. Conditions
5. Output

Code:
${code}`;
  return await callGemini(prompt);
};

const analyzeCode = async (code) => {
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
  return JSON.parse(stripFences(await callGemini(prompt)));
};

const findIssues = async (code) => {
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
  return JSON.parse(stripFences(await callGemini(prompt)));
};

module.exports = { translateCode, explainCode, analyzeCode, findIssues };
