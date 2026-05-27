const OpenAI = require('openai');
const { Groq } = require('groq-sdk');

/**
 * AI Service for EXIT-IT Intelligence
 * - DeepSeek V4 Flash (NVIDIA) for explain/summarize — high quality
 * - Groq llama-3.3-70b-versatile for quiz generation — fast, low latency
 */

// NVIDIA client for explain/summarize
let nvidia;
try {
  if (process.env.NVIDIA_API_KEY) {
    nvidia = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    console.log('✅ NVIDIA AI (DeepSeek V4 Flash) initialized successfully');
  } else {
    console.warn('⚠️ NVIDIA_API_KEY is missing in .env');
  }
} catch (e) {
  console.error('❌ Failed to initialize NVIDIA AI:', e.message);
}

// Groq client for fast quiz generation
let groq;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq SDK initialized successfully');
  } else {
    console.warn('⚠️ GROQ_API_KEY is missing in .env');
  }
} catch (e) {
  console.error('❌ Failed to initialize Groq SDK:', e.message);
}

const NVIDIA_MODEL = 'deepseek-ai/deepseek-v4-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const aiService = {

  /**
   * Explains a specific portion of text for the student.
   */
  async explainText(text) {
    if (!nvidia) throw new Error('NVIDIA AI not initialized');
    try {
      const completion = await nvidia.chat.completions.create({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional educational assistant for the EXIT-IT platform. Explain text concisely for students using bullet points and bolding where appropriate.',
          },
          {
            role: 'user',
            content: `Explain the following text: "${text}"`,
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1024,
        extra_body: { chat_template_kwargs: { thinking: false } },
        stream: false,
      });
      return completion.choices[0]?.message?.content || 'No explanation generated.';
    } catch (err) {
      console.error('🔴 AI Explain error:', err.message);
      throw err;
    }
  },

  /**
   * STREAMING: Explains a specific portion of text.
   */
  async streamExplainText(text) {
    if (!nvidia) throw new Error('NVIDIA AI not initialized');
    return nvidia.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional educational assistant for the EXIT-IT platform. Explain text concisely for students using bullet points and bolding where appropriate.',
        },
        {
          role: 'user',
          content: `Explain the following text: "${text}"`,
        },
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1024,
      extra_body: { chat_template_kwargs: { thinking: false } },
      stream: true,
    });
  },

  /**
   * Summarizes a passage of study material.
   */
  async summarizeText(text) {
    if (!nvidia) throw new Error('NVIDIA AI not initialized');
    try {
      const completion = await nvidia.chat.completions.create({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: "Summarize study material concisely. Focus on key concepts and 'must-know' facts.",
          },
          {
            role: 'user',
            content: `Summarize this text: "${text}"`,
          },
        ],
        temperature: 0.5,
        top_p: 0.95,
        max_tokens: 1024,
        extra_body: { chat_template_kwargs: { thinking: false } },
        stream: false,
      });
      return completion.choices[0]?.message?.content || 'No summary generated.';
    } catch (err) {
      console.error('🔴 AI Summarize error:', err.message);
      throw err;
    }
  },

  /**
   * STREAMING: Summarizes a passage of study material.
   */
  async streamSummarizeText(text) {
    if (!nvidia) throw new Error('NVIDIA AI not initialized');
    return nvidia.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: "Summarize study material concisely. Focus on key concepts and 'must-know' facts.",
        },
        {
          role: 'user',
          content: `Summarize this text: "${text}"`,
        },
      ],
      temperature: 0.5,
      top_p: 0.95,
      max_tokens: 1024,
      extra_body: { chat_template_kwargs: { thinking: false } },
      stream: true,
    });
  },

  /**
   * Generates multiple-choice questions from material content.
   */
  async generateQuestions(content, difficulty = 'Medium', count = 5) {
    if (!groq) throw new Error('Groq AI not initialized');
    try {
      const skipChars = 2000;
      const maxChars = 5000;
      const startPos = content.length > skipChars ? skipChars : 0;
      const truncatedContent = content.length > (startPos + maxChars)
        ? content.substring(startPos, startPos + maxChars)
        : content.substring(startPos);

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert exam creator. Use ONLY the provided MATERIAL. Return ONLY a valid JSON array. NO extra text.',
          },
          {
            role: 'user',
            content: `Generate ${count} MCQ questions, difficulty: ${difficulty}. JSON format:
[{"question_text":"...","options":[{"text":"...","is_correct":true},{"text":"...","is_correct":false},{"text":"...","is_correct":false},{"text":"...","is_correct":false}],"explanation":"..."}]
MATERIAL: "${truncatedContent}"`,
          },
        ],
        temperature: 0.2,
        max_completion_tokens: 3000,
        top_p: 0.95,
        stream: false,
      });

      let output = completion.choices[0]?.message?.content || '[]';
      const jsonMatch = output.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) output = jsonMatch[0];

      try {
        const parsed = JSON.parse(output);
        return Array.isArray(parsed) ? parsed : (parsed.questions || []);
      } catch (e) {
        console.error('🟠 AI Quiz JSON Parse error:', output);
        return [];
      }
    } catch (err) {
      console.error('🔴 AI Quiz error:', err.message);
      throw err;
    }
  },
};

module.exports = aiService;
