const pool = require('../config/db');

// SM-2 spaced repetition algorithm
function sm2(quality, easeFactor, interval, repetitions) {
  if (quality < 3) {
    return { interval: 1, repetitions: 0, easeFactor };
  }
  const newEF = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  let newInterval;
  if (repetitions === 0) newInterval = 1;
  else if (repetitions === 1) newInterval = 6;
  else newInterval = Math.round(interval * newEF);
  return { interval: newInterval, repetitions: repetitions + 1, easeFactor: newEF };
}

// GET /flashcards/decks
exports.getDecks = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        d.id, d.title, d.course_id, d.is_public, d.created_at, d.user_id,
        c.title as course_title, c.code as course_code,
        COUNT(DISTINCT f.id) as card_count,
        COUNT(DISTINCT CASE WHEN fr.next_review_date <= CURRENT_DATE THEN fr.card_id END) as due_count
      FROM flashcard_decks d
      LEFT JOIN courses c ON d.course_id = c.id
      LEFT JOIN flashcards f ON f.deck_id = d.id
      LEFT JOIN flashcard_reviews fr ON fr.card_id = f.id AND fr.user_id = $1
      WHERE d.user_id = $1 OR d.is_public = TRUE OR d.user_id IS NULL
      GROUP BY d.id, c.title, c.code
      ORDER BY d.is_public DESC, d.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch decks' });
  }
};

// POST /flashcards/decks
exports.createDeck = async (req, res) => {
  const userId = req.user.id;
  const { title, course_id, is_public } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
  try {
    const makePublic = (req.user.role === 'admin') ? (is_public || false) : false;
    const result = await pool.query(
      'INSERT INTO flashcard_decks (user_id, course_id, title, is_public) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, course_id || null, title.trim(), makePublic]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create deck' });
  }
};

// DELETE /flashcards/decks/:id
exports.deleteDeck = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT user_id, is_public FROM flashcard_decks WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Deck not found' });
    if (check.rows[0].is_public && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete official course decks' });
    }
    if (!check.rows[0].is_public && check.rows[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await pool.query('DELETE FROM flashcards WHERE deck_id = $1', [id]);
    await pool.query('DELETE FROM flashcard_decks WHERE id = $1', [id]);
    res.json({ message: 'Deck deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete deck' });
  }
};

// GET /flashcards/decks/:id/cards
exports.getCards = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT f.id, f.front, f.back, f.created_at,
        fr.ease_factor, fr.interval_days, fr.repetitions, fr.next_review_date, fr.last_quality
      FROM flashcards f
      LEFT JOIN flashcard_reviews fr ON fr.card_id = f.id AND fr.user_id = $2
      WHERE f.deck_id = $1
      ORDER BY f.created_at ASC
    `, [id, userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
};

// POST /flashcards/decks/:id/cards
exports.addCard = async (req, res) => {
  const { id } = req.params;
  const { front, back } = req.body;
  if (!front?.trim() || !back?.trim()) return res.status(400).json({ message: 'Front and back are required' });
  try {
    const result = await pool.query(
      'INSERT INTO flashcards (deck_id, front, back) VALUES ($1, $2, $3) RETURNING *',
      [id, front.trim(), back.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add card' });
  }
};

// DELETE /flashcards/cards/:id
exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [id]);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete card' });
  }
};

// GET /flashcards/due — cards due for review today
exports.getDueCards = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT f.id, f.front, f.back, f.deck_id, d.title as deck_title,
        COALESCE(fr.ease_factor, 2.5) as ease_factor,
        COALESCE(fr.interval_days, 1) as interval_days,
        COALESCE(fr.repetitions, 0) as repetitions,
        COALESCE(fr.next_review_date, CURRENT_DATE) as next_review_date
      FROM flashcards f
      JOIN flashcard_decks d ON f.deck_id = d.id
      LEFT JOIN flashcard_reviews fr ON fr.card_id = f.id AND fr.user_id = $1
      WHERE (d.user_id = $1 OR d.is_public = TRUE OR d.user_id IS NULL)
        AND COALESCE(fr.next_review_date, CURRENT_DATE) <= CURRENT_DATE
      ORDER BY COALESCE(fr.next_review_date, CURRENT_DATE) ASC
      LIMIT 50
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch due cards' });
  }
};

// POST /flashcards/review — submit review quality (0-5)
exports.submitReview = async (req, res) => {
  const userId = req.user.id;
  const { cardId, quality } = req.body; // quality: 0-5
  if (quality === undefined || cardId === undefined) return res.status(400).json({ message: 'cardId and quality required' });

  try {
    // Get current review state
    const existing = await pool.query(
      'SELECT * FROM flashcard_reviews WHERE user_id = $1 AND card_id = $2',
      [userId, cardId]
    );

    const current = existing.rows[0] || { ease_factor: 2.5, interval_days: 1, repetitions: 0 };
    const { interval, repetitions, easeFactor } = sm2(
      quality,
      current.ease_factor,
      current.interval_days,
      current.repetitions
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    const nextReviewDate = nextReview.toISOString().split('T')[0];

    await pool.query(`
      INSERT INTO flashcard_reviews (user_id, card_id, ease_factor, interval_days, repetitions, next_review_date, last_quality, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id, card_id) DO UPDATE SET
        ease_factor = $3, interval_days = $4, repetitions = $5,
        next_review_date = $6, last_quality = $7, updated_at = NOW()
    `, [userId, cardId, easeFactor, interval, repetitions, nextReviewDate, quality]);

    res.json({ interval, nextReviewDate, easeFactor, repetitions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// GET /flashcards/due-count — just the count for sidebar badge
exports.getDueCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT COUNT(DISTINCT f.id) as count
      FROM flashcards f
      JOIN flashcard_decks d ON f.deck_id = d.id
      LEFT JOIN flashcard_reviews fr ON fr.card_id = f.id AND fr.user_id = $1
      WHERE (d.user_id = $1 OR d.is_public = TRUE OR d.user_id IS NULL)
        AND COALESCE(fr.next_review_date, CURRENT_DATE) <= CURRENT_DATE
    `, [userId]);
    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch due count' });
  }
};

// POST /flashcards/decks/:id/ai-generate
exports.aiGenerateCards = async (req, res) => {
  const { id } = req.params;
  const { topic, count = 10 } = req.body;
  if (!topic?.trim()) return res.status(400).json({ message: 'Topic is required' });

  try {
    let cards = [];
    if (process.env.NVIDIA_API_KEY) {
      const OpenAI = require('openai');
      const nvidia = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const completion = await nvidia.chat.completions.create({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          {
            role: 'system',
            content: `You are an educational flashcard generator. Generate exactly ${count} flashcards as a JSON array. Each object must have "front" (question) and "back" (answer). Return ONLY valid JSON array, no markdown, no explanation.`
          },
          {
            role: 'user',
            content: `Generate ${count} flashcards about: ${topic}`
          }
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 4096,
        extra_body: { chat_template_kwargs: { thinking: false } },
        stream: false,
      });

      const raw = completion.choices[0].message.content.trim();
      const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      cards = JSON.parse(jsonStr);
    } else if (process.env.GROQ_API_KEY) {
      const { Groq } = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an educational flashcard generator. Generate exactly ${count} flashcards as a JSON array. Each object must have "front" (question) and "back" (answer). Return ONLY valid JSON array, no markdown, no explanation.`
          },
          {
            role: 'user',
            content: `Generate ${count} flashcards about: ${topic}`
          }
        ],
        temperature: 0.7,
      });
      const raw = completion.choices[0].message.content.trim();
      const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      cards = JSON.parse(jsonStr);
    } else if (process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `You are an educational flashcard generator. Generate exactly ${count} flashcards about: ${topic} as a JSON array. Each object must have "front" (question) and "back" (answer). Return ONLY valid JSON array, no markdown, no explanation.`;
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();
      const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      cards = JSON.parse(jsonStr);
    } else {
      return res.status(400).json({ message: 'AI API Key is missing in server .env (NVIDIA_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY required)' });
    }

    if (!Array.isArray(cards)) throw new Error('Invalid response format');

    // Insert all cards into the deck
    const inserted = [];
    for (const card of cards) {
      if (!card.front || !card.back) continue;
      const result = await pool.query(
        'INSERT INTO flashcards (deck_id, front, back) VALUES ($1, $2, $3) RETURNING *',
        [id, card.front.trim(), card.back.trim()]
      );
      inserted.push(result.rows[0]);
    }

    res.status(201).json({ message: `Generated ${inserted.length} cards`, cards: inserted });
  } catch (err) {
    console.error('AI generate error:', err);
    res.status(500).json({ message: 'Failed to generate flashcards: ' + err.message });
  }
};

// POST /flashcards/decks/:id/csv-import
exports.csvImport = async (req, res) => {
  const { id } = req.params;
  const { csvData } = req.body; // raw CSV string sent from frontend

  if (!csvData?.trim()) return res.status(400).json({ message: 'CSV data is required' });

  try {
    const lines = csvData.trim().split('\n');
    const inserted = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Support comma and semicolon separators, handle quoted fields
      const parts = line.match(/(".*?"|[^,;]+)(?=[,;]|$)/g);
      if (!parts || parts.length < 2) {
        errors.push(`Line ${i + 1}: Invalid format`);
        continue;
      }

      const front = parts[0].replace(/^"|"$/g, '').trim();
      const back = parts[1].replace(/^"|"$/g, '').trim();

      if (!front || !back) {
        errors.push(`Line ${i + 1}: Empty front or back`);
        continue;
      }

      const result = await pool.query(
        'INSERT INTO flashcards (deck_id, front, back) VALUES ($1, $2, $3) RETURNING *',
        [id, front, back]
      );
      inserted.push(result.rows[0]);
    }

    res.status(201).json({
      message: `Imported ${inserted.length} cards`,
      cards: inserted,
      errors
    });
  } catch (err) {
    console.error('CSV import error:', err);
    res.status(500).json({ message: 'Failed to import CSV: ' + err.message });
  }
};

// PUT /flashcards/cards/:id
exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { front, back } = req.body;
  if (!front?.trim() || !back?.trim()) return res.status(400).json({ message: 'Front and back are required' });
  try {
    const result = await pool.query(
      'UPDATE flashcards SET front = $1, back = $2 WHERE id = $3 RETURNING *',
      [front.trim(), back.trim(), id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Card not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update card' });
  }
};
