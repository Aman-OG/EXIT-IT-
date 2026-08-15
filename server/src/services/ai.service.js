const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Groq } = require('groq-sdk');

/**
 * AI Service for EXIT-IT Intelligence
 * - Primary: Google Gemini 2.0 Flash
 * - Fallback: Groq (llama-3.1-8b-instant for explain/summarize, qwen3.6-27b for quiz gen)
 */

// ---------- Gemini client (primary) ----------
let gemini;
try {
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    gemini = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    console.log('✅ Google Gemini AI (primary) initialized successfully');
  } else {
    console.warn('⚠️ GEMINI_API_KEY is missing in .env');
  }
} catch (e) {
  console.error('❌ Failed to initialize Gemini AI:', e.message);
}

// ---------- Groq client (fallback) ----------
let groq;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq SDK (fallback) initialized successfully');
  } else {
    console.warn('⚠️ GROQ_API_KEY is missing in .env');
  }
} catch (e) {
  console.error('❌ Failed to initialize Groq SDK:', e.message);
}

// Groq models
const GROQ_FAST_MODEL = 'llama-3.1-8b-instant';        // fast for explain/summarize
const GROQ_SMART_MODEL = 'qwen/qwen3.6-27b';           // smart for quiz generation

// Helper: check that at least one AI backend is available
function requireAI(forFeature) {
  if (!gemini && !groq) {
    throw new Error(`No AI service available for ${forFeature}. Set GEMINI_API_KEY or GROQ_API_KEY in .env`);
  }
}

const aiService = {

  /**
   * Explains a specific portion of text for the student.
   */
  async explainText(text) {
    requireAI('explain');

    const systemPrompt = 'You are a professional educational AI assistant for the EX-IT platform. Provide direct, clean, and concise explanations for students using bolding and bullet points where appropriate. Do not include greetings or introductory pleasantries.';
    const userPrompt = `Explain the following text directly and concisely: "${text}"`;

    // Primary: Gemini
    if (gemini) {
      try {
        const result = await gemini.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        return result.response.text() || 'No explanation generated.';
      } catch (err) {
        console.warn('⚠️ Gemini explain failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback: Groq
    const completion = await groq.chat.completions.create({
      model: GROQ_FAST_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
      stream: false,
    });
    return completion.choices[0]?.message?.content || 'No explanation generated.';
  },

  /**
   * STREAMING: Explains a specific portion of text.
   * Returns an async iterable that yields chunks with choices[0].delta.content.
   */
  async streamExplainText(text) {
    requireAI('stream-explain');

    const systemPrompt = 'You are a professional educational AI assistant for the EX-IT platform. Provide direct, clean, and concise explanations for students using bolding and bullet points where appropriate. Do not include greetings or introductory pleasantries.';
    const userPrompt = `Explain the following text directly and concisely: "${text}"`;

    // Primary: Gemini streaming
    if (gemini) {
      try {
        return await createGeminiStreamAdapter(`${systemPrompt}\n\n${userPrompt}`);
      } catch (err) {
        console.warn('⚠️ Gemini stream-explain failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback: Groq streaming
    return groq.chat.completions.create({
      model: GROQ_FAST_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
      stream: true,
    });
  },

  /**
   * Summarizes a passage of study material.
   */
  async summarizeText(text) {
    requireAI('summarize');

    const systemPrompt = "You are a professional educational AI assistant for the EX-IT platform. Summarize study material directly and concisely into key concepts and must-know facts using bullet points. Do not include greetings or introductory pleasantries.";
    const userPrompt = `Summarize this text: "${text}"`;

    // Primary: Gemini
    if (gemini) {
      try {
        const result = await gemini.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        return result.response.text() || 'No summary generated.';
      } catch (err) {
        console.warn('⚠️ Gemini summarize failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback: Groq
    const completion = await groq.chat.completions.create({
      model: GROQ_FAST_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_completion_tokens: 1024,
      stream: false,
    });
    return completion.choices[0]?.message?.content || 'No summary generated.';
  },

  /**
   * STREAMING: Summarizes a passage of study material.
   */
  async streamSummarizeText(text) {
    requireAI('stream-summarize');

    const systemPrompt = "You are a professional educational AI assistant for the EX-IT platform. Summarize study material directly and concisely into key concepts and must-know facts using bullet points. Do not include greetings or introductory pleasantries.";
    const userPrompt = `Summarize this text: "${text}"`;

    // Primary: Gemini streaming
    if (gemini) {
      try {
        return await createGeminiStreamAdapter(`${systemPrompt}\n\n${userPrompt}`);
      } catch (err) {
        console.warn('⚠️ Gemini stream-summarize failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback: Groq streaming
    return groq.chat.completions.create({
      model: GROQ_FAST_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_completion_tokens: 1024,
      stream: true,
    });
  },

  /**
   * Generates multiple-choice questions from material content.
   */
  async generateQuestions(content, difficulty = 'Medium', count = 5) {
    requireAI('quiz-generation');

    const skipChars = 2000;
    const maxChars = 5000;
    const startPos = content.length > skipChars ? skipChars : 0;
    const truncatedContent = content.length > (startPos + maxChars)
      ? content.substring(startPos, startPos + maxChars)
      : content.substring(startPos);

    const systemPrompt = 'You are an expert exam creator. Use ONLY the provided MATERIAL. Return ONLY a valid JSON array. NO extra text, NO markdown fences.';
    const userPrompt = `Generate ${count} MCQ questions, difficulty: ${difficulty}. JSON format:
[{"question_text":"...","options":[{"text":"...","is_correct":true},{"text":"...","is_correct":false},{"text":"...","is_correct":false},{"text":"...","is_correct":false}],"explanation":"..."}]
MATERIAL: "${truncatedContent}"`;

    // Primary: Gemini
    if (gemini) {
      try {
        const result = await gemini.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        const output = result.response.text() || '[]';
        return parseQuizJSON(output);
      } catch (err) {
        console.warn('⚠️ Gemini quiz generation failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback: Groq with smart model
    const completion = await groq.chat.completions.create({
      model: GROQ_SMART_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_completion_tokens: 3000,
      top_p: 0.95,
      stream: false,
    });

    const output = completion.choices[0]?.message?.content || '[]';
    return parseQuizJSON(output);
  },
};

/**
 * Parse quiz JSON from AI response, handling markdown wrappers and edge cases.
 */
function parseQuizJSON(output) {
  let cleaned = output.trim();
  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();

  const jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (jsonMatch) cleaned = jsonMatch[0];

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : (parsed.questions || []);
  } catch (e) {
    console.error('🟠 AI Quiz JSON Parse error:', cleaned.substring(0, 200));
    return [];
  }
}

/**
 * Creates an async iterable that wraps Gemini streaming to mimic OpenAI/Groq's
 * streaming format (chunks with choices[0].delta.content).
 */
async function createGeminiStreamAdapter(prompt) {
  const streamResult = await gemini.generateContentStream(prompt);
  
  // Return an async iterable wrapper
  return {
    [Symbol.asyncIterator]() {
      const iterator = streamResult.stream[Symbol.asyncIterator]();
      return {
        async next() {
          const { done, value } = await iterator.next();
          if (done) return { done: true };
          const text = value.text();
          return {
            done: false,
            value: {
              choices: [{ delta: { content: text || '' } }],
            },
          };
        },
      };
    },
  };
}

module.exports = aiService;
