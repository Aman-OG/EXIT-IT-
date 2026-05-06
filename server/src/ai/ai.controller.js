const aiService = require('../services/ai.service');
const pool = require('../config/db');
const crypto = require('crypto');

/**
 * Utility to hash input for caching
 */
const getHash = (text, modelPrefix = '') => {
  return crypto.createHash('sha256').update(modelPrefix + text).digest('hex');
};

/**
 * Middleware-like check for AI limits (20 per day)
 */
async function checkAiLimit(userId) {
  const today = new Date().toISOString().split('T')[0];
  const res = await pool.query(
    'SELECT action_count FROM ai_usage WHERE user_id = $1 AND usage_date = $2',
    [userId, today]
  );
  
  const count = res.rows.length > 0 ? res.rows[0].action_count : 0;
  if (count >= 20) {
    throw new Error('ACTION_LIMIT_REACHED');
  }
}

/**
 * Increment usage count
 */
async function incrementUsage(userId) {
  const today = new Date().toISOString().split('T')[0];
  await pool.query(`
    INSERT INTO ai_usage (user_id, usage_date, action_count)
    VALUES ($1, $2, 1)
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET action_count = ai_usage.action_count + 1
  `, [userId, today]);
}

exports.explain = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  console.log(`[AI] Processing 'explain' for User ${userId}...`);
  
  if (!text) return res.status(400).json({ message: 'No text provided' });
  
  const hash = getHash(text, 'explain:');

  try {
    // 1. Check Cache
    const cacheRes = await pool.query('SELECT response FROM ai_cache WHERE query_hash = $1', [hash]);
    if (cacheRes.rows.length > 0) {
      console.log('[AI] Cache HIT');
      return res.json({ result: cacheRes.rows[0].response, cached: true });
    }

    // 2. Check Daily Limit
    await checkAiLimit(userId);

    // 3. Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 4. Call Streaming AI
    console.log('[AI] Requesting Streaming from Groq...');
    const stream = await aiService.streamExplainText(text);
    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
    }

    // 5. Update Cache & Usage after stream finishes
    await pool.query('INSERT INTO ai_cache (query_hash, response, model_used) VALUES ($1, $2, $3)', [hash, fullResponse, 'llama-3.1-8b-instant']);
    await incrementUsage(userId);

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    if (err.message === 'ACTION_LIMIT_REACHED') {
      return res.status(429).json({ message: 'Daily limit reached (20 AI actions/day). Please try again tomorrow!' });
    }
    console.error('❌ [AI] Error in explain:', err);
    res.status(500).json({ message: 'AI Explanation Service failed' });
  }
};

exports.summarize = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  console.log(`[AI] Processing 'summarize' for User ${userId}...`);

  if (!text) return res.status(400).json({ message: 'No text provided' });

  const hash = getHash(text, 'summarize:');

  try {
    // 1. Check Cache
    const cacheRes = await pool.query('SELECT response FROM ai_cache WHERE query_hash = $1', [hash]);
    if (cacheRes.rows.length > 0) {
      console.log('[AI] Cache HIT');
      return res.json({ result: cacheRes.rows[0].response, cached: true });
    }

    // 2. Check Daily Limit
    await checkAiLimit(userId);

    // 3. Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 4. Call Streaming AI
    console.log('[AI] Requesting Streaming from Groq...');
    const stream = await aiService.streamSummarizeText(text);
    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
    }

    // 5. Update Cache & Usage
    await pool.query('INSERT INTO ai_cache (query_hash, response, model_used) VALUES ($1, $2, $3)', [hash, fullResponse, 'llama-3.1-8b-instant']);
    await incrementUsage(userId);

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    if (err.message === 'ACTION_LIMIT_REACHED') {
      return res.status(429).json({ message: 'Daily limit reached (20 AI actions/day). Please try again tomorrow!' });
    }
    console.error('❌ [AI] Error in summarize:', err);
    res.status(500).json({ message: 'AI Summarization Service failed' });
  }
};

exports.generateQuiz = async (req, res) => {
  const { content, difficulty, count, courseId, title, isOfficial } = req.body;
  const userId = req.user.id;
  const role = req.user.role;
  console.log(`[AI] Processing 'quiz_gen' for User ${userId}...`);

  if (!content || !courseId) return res.status(400).json({ message: 'Content and Course ID are required' });

  const hash = getHash(content + difficulty + count, 'quiz:');

  try {
    console.log('[AI] Checking cache...');
    const cacheRes = await pool.query('SELECT response FROM ai_cache WHERE query_hash = $1', [hash]);
    let questions;
    
    if (cacheRes.rows.length > 0) {
      console.log('[AI] Cache HIT');
      questions = JSON.parse(cacheRes.rows[0].response);
    } else {
      console.log('[AI] Checking daily limit...');
      await checkAiLimit(userId);

      console.log('[AI] Requesting Questions from Groq (Qwen)...');
      questions = await aiService.generateQuestions(content, difficulty, count);

      if (questions && Array.isArray(questions) && questions.length > 0) {
        console.log('[AI] Saving response to cache and usage...');
        await pool.query('INSERT INTO ai_cache (query_hash, response, model_used) VALUES ($1, $2, $3)', [hash, JSON.stringify(questions), 'qwen-3-32b']);
        await incrementUsage(userId);
      } else {
        console.warn('[AI] No questions generated, aborting quiz creation.');
        return res.status(500).json({ message: 'AI failed to generate questions for this content. Please try broader text.' });
      }
    }

    console.log('[AI] Saving Quiz to Database...');
    const officialFlag = (role === 'admin') ? isOfficial : false;
    const ownerId = officialFlag ? null : userId;

    const quizRes = await pool.query(
      'INSERT INTO quizzes (course_id, title, description, is_official, user_id, difficulty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [courseId, title || `Practice: ${difficulty}`, 'AI Generated Content', officialFlag, ownerId, difficulty]
    );

    const quizId = quizRes.rows[0].id;

    for (const q of questions) {
      const qRes = await pool.query(
        'INSERT INTO questions (quiz_id, question_text, explanation) VALUES ($1, $2, $3) RETURNING id',
        [quizId, q.question_text, q.explanation]
      );
      const questionId = qRes.rows[0].id;

      for (const opt of q.options) {
        await pool.query(
          'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
          [questionId, opt.text, opt.is_correct]
        );
      }
    }

    console.log('[AI] Success.');
    res.json({ message: 'Quiz generated successfully', quizId, official: officialFlag });
  } catch (err) {
    if (err.message === 'ACTION_LIMIT_REACHED') {
      console.warn(`[AI] Limit reached for User ${userId}`);
      return res.status(429).json({ message: 'Daily limit reached (20 AI actions/day). Please try again tomorrow!' });
    }
    console.error('❌ [AI] Error in quiz_gen:', err);
    res.status(500).json({ message: 'AI Quiz Generation Service failed' });
  }
};
