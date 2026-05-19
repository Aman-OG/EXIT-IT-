const { Groq } = require('groq-sdk');

/**
 * AI Service for EXIT-IT Intelligence (GROQ EDITION)
 * This edition is hardened to prevent crashes.
 */

// Initialize Groq client
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

const aiService = {
  
  /**
   * Explains a specific portion of text for the student.
   */
  async explainText(text) {
    if (!groq) throw new Error('Groq AI not initialized');
    
    try {
      const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "You are a professional educational assistant for the EXIT-IT platform. Explain text concisely for students using bullet points and bolding where appropriate."
          },
          {
            "role": "user",
            "content": `Explain the following text: "${text}"`
          }
        ],
        "model": "llama-3.1-8b-instant",
        "temperature": 0.7,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false
      });

      return chatCompletion.choices[0]?.message?.content || "No explanation generated.";
    } catch (err) {
      console.error('🔴 Groq Explain error:', err.message);
      throw err;
    }
  },
  
  /**
   * STREAMING: Explains a specific portion of text.
   */
  async streamExplainText(text) {
    if (!groq) throw new Error('Groq AI not initialized');
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional educational assistant for the EXIT-IT platform. Explain text concisely for students using bullet points and bolding where appropriate."
        },
        {
          role: "user",
          content: `Explain the following text: "${text}"`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true
    });
  },

  /**
   * Summarizes a passage of study material.
   */
  async summarizeText(text) {
    if (!groq) throw new Error('Groq AI not initialized');
    
    try {
      const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "Summarize study material concisely. Focus on key concepts and 'must-know' facts."
          },
          {
            "role": "user",
            "content": `Summarize this text: "${text}"`
          }
        ],
        "model": "llama-3.1-8b-instant",
        "temperature": 0.5,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false
      });

      return chatCompletion.choices[0]?.message?.content || "No summary generated.";
    } catch (err) {
      console.error('🔴 Groq Summarize error:', err.message);
      throw err;
    }
  },

  /**
   * STREAMING: Summarizes a passage of study material.
   */
  async streamSummarizeText(text) {
    if (!groq) throw new Error('Groq AI not initialized');
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Summarize study material concisely. Focus on key concepts and 'must-know' facts."
        },
        {
          role: "user",
          content: `Summarize this text: "${text}"`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true
    });
  },

  /**
   * Generates multiple-choice questions from material content.
   */
  async generateQuestions(content, difficulty = 'Medium', count = 5) {
    if (!groq) throw new Error('Groq AI not initialized');
    
    try {
      // Skip the first 2000 chars (usually cover page/TOC) and take a meaningful chunk
      const skipChars = 2000;
      const maxChars = 5000;
      const startPos = content.length > skipChars ? skipChars : 0;
      const truncatedContent = content.length > (startPos + maxChars)
        ? content.substring(startPos, startPos + maxChars)
        : content.substring(startPos);

      const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "You are an expert exam creator. Use ONLY the provided MATERIAL. Return ONLY a valid JSON array. NO extra text."
          },
          {
            "role": "user",
            "content": `Generate ${count} MCQ questions, difficulty: ${difficulty}. JSON format:
[{"question_text":"...","options":[{"text":"...","is_correct":true},{"text":"...","is_correct":false},{"text":"...","is_correct":false},{"text":"...","is_correct":false}],"explanation":"..."}]
MATERIAL: "${truncatedContent}"`
          }
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 0.2,
        "max_completion_tokens": 3000,
        "top_p": 0.95,
        "stream": false
      });

      let output = chatCompletion.choices[0]?.message?.content || "[]";
      
      // Robust Regex to find the JSON array even if there is text around it
      const jsonMatch = output.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
         output = jsonMatch[0];
      }
      
      try {
        const parsed = JSON.parse(output);
        return Array.isArray(parsed) ? parsed : (parsed.questions || []);
      } catch (e) {
        console.error('🟠 Groq Quiz JSON Parse error:', output);
        return [];
      }
    } catch (err) {
      console.error('🔴 Groq Quiz error:', err.message);
      throw err;
    }
  }
};

module.exports = aiService;
