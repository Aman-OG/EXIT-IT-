const pool = require('../config/db');
const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

// GET /videos/material/:materialId — get videos for a chapter
exports.getVideosForMaterial = async (req, res) => {
  const { materialId } = req.params;
  try {
    const result = await pool.query(
      `SELECT v.*, u.name as added_by_name
       FROM material_videos v
       LEFT JOIN users u ON v.added_by = u.id
       WHERE v.material_id = $1
       ORDER BY v.created_at ASC`,
      [materialId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};

// POST /videos/material/:materialId — admin adds a video manually
exports.addVideo = async (req, res) => {
  const { materialId } = req.params;
  const { youtube_url, title } = req.body;
  const userId = req.user.id;

  if (!youtube_url?.trim()) return res.status(400).json({ message: 'YouTube URL is required' });

  // Extract video ID from URL
  const videoId = extractYouTubeId(youtube_url);
  if (!videoId) return res.status(400).json({ message: 'Invalid YouTube URL' });

  try {
    const result = await pool.query(
      `INSERT INTO material_videos (material_id, youtube_url, youtube_id, title, added_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [materialId, youtube_url.trim(), videoId, title?.trim() || null, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add video' });
  }
};

// DELETE /videos/:videoId — admin removes a video
exports.deleteVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    await pool.query('DELETE FROM material_videos WHERE id = $1', [videoId]);
    res.json({ message: 'Video removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

// POST /videos/material/:materialId/ai-suggest — AI generates queries, YouTube returns results
exports.aiSuggestVideos = async (req, res) => {
  const { materialId } = req.params;

  try {
    // Get material title and course info
    const matRes = await pool.query(
      `SELECT m.title, c.title as course_title
       FROM materials m
       JOIN courses c ON m.course_id = c.id
       WHERE m.id = $1`,
      [materialId]
    );
    if (matRes.rows.length === 0) return res.status(404).json({ message: 'Material not found' });

    const { title, course_title } = matRes.rows[0];

    // Use Groq for fast query generation
    let searchQueries = [
      `${title} tutorial`,
      `${title} ${course_title} explained`,
      `${title} lecture`
    ];

    try {
      let raw = '';
      const aiPrompt = `Generate 3 YouTube search queries for educational videos about: "${title}" (course: ${course_title})`;
      
      if (process.env.GROQ_API_KEY) {
        const { Groq } = require('groq-sdk');
        const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const aiCompletion = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Return ONLY a valid JSON array of 3 YouTube search query strings. No explanation, no markdown.' },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.7,
          max_completion_tokens: 150,
          stream: false,
        });
        raw = aiCompletion.choices[0]?.message?.content?.trim() || '';
      } else if (process.env.GEMINI_API_KEY) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        const result = await model.generateContent(
          `Return ONLY a valid JSON array of 3 YouTube search query strings. No explanation, no markdown.\n\n${aiPrompt}`
        );
        raw = result.response.text()?.trim() || '';
      }

      if (raw) {
        const cleaned = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            searchQueries = parsed.slice(0, 3);
          }
        }
      }
    } catch (aiErr) {
      console.warn('[Videos] AI query generation failed, using fallback queries:', aiErr.message);
    }

    // Search YouTube for each query
    const allResults = [];
    for (const query of searchQueries) {
      try {
        const ytRes = await axios.get(YOUTUBE_SEARCH_URL, {
          params: {
            key: YOUTUBE_API_KEY,
            q: query,
            part: 'snippet',
            type: 'video',
            maxResults: 3,
            relevanceLanguage: 'en',
            videoEmbeddable: 'true',
          },
        });

        const videos = ytRes.data.items.map(item => ({
          youtube_id: item.id.videoId,
          youtube_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium?.url,
          description: item.snippet.description?.substring(0, 150),
          query,
        }));
        allResults.push(...videos);
      } catch (ytErr) {
        console.error(`[Videos] YouTube search failed for query "${query}":`, ytErr.message);
      }
    }

    // Deduplicate by video ID
    const seen = new Set();
    const unique = allResults.filter(v => {
      if (seen.has(v.youtube_id)) return false;
      seen.add(v.youtube_id);
      return true;
    });

    res.json({ videos: unique, queries: searchQueries });
  } catch (err) {
    console.error('[Videos] AI suggest error:', err);
    res.status(500).json({ message: 'Failed to suggest videos' });
  }
};

// Helper: extract YouTube video ID from various URL formats
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
