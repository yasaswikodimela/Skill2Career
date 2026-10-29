// backend/src/services/geminiService.js
const { GoogleGenAI } = require('@google/genai');

// Initialize client lazily – only when a request arrives
let genAI = null;

const initClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set – Gemini calls will be skipped');
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
};

/**
 * Sends a prompt to Gemini and returns a structured response.
 * The function catches timeouts, quota errors and malformed JSON.
 * @param {string} prompt - The user-visible prompt.
 * @param {number} [timeoutMs=8000] - Max time to wait for response.
 * @returns {Promise<Object|null>} - Expected to contain a `text` field.
 */
const getGeminiResponse = async (prompt, timeoutMs = 8000) => {
  const client = initClient();
  if (!client) return null; // fallback – caller will handle

  try {
    const callPromise = client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: prompt,
    });

    const result = await Promise.race([
      callPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), timeoutMs)),
    ]);

    const text = result?.text || (typeof result?.response?.text === 'function' ? result.response.text() : '');
    return { text };
  } catch (err) {
    console.warn('Gemini call failed:', err.message);
    return null; // fallback
  }
};

module.exports = { getGeminiResponse };
