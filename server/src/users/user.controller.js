const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Generate JWT for HTTP-only cookie
const generateToken = (res, userId, role) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only require HTTPS in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    // First registered user gets admin role if specified, otherwise user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, streak_freezes) VALUES ($1, $2, $3, $4) RETURNING id, name, email, theme, role, current_streak, max_streak, streak_freezes',
      [name, email, hashedPassword, 2]
    );

    if (newUser.rows.length > 0) {
      generateToken(res, newUser.rows[0].id, newUser.rows[0].role);
      res.status(201).json(newUser.rows[0]);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if (validPassword) {
        generateToken(res, user.rows[0].id, user.rows[0].role);
        res.status(200).json({
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
          theme: user.rows[0].theme,
          role: user.rows[0].role,
          current_streak: user.rows[0].current_streak,
          max_streak: user.rows[0].max_streak,
          streak_freezes: user.rows[0].streak_freezes
        });
        return;
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await pool.query('SELECT id, name, email, theme, role, current_streak, max_streak, total_score, streak_freezes FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length > 0) {
      res.status(200).json(user.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTheme = async (req, res) => {
  const { theme } = req.body;
  try {
    const user = await pool.query('UPDATE users SET theme = $1 WHERE id = $2 RETURNING id, theme', [theme, req.user.id]);
    if (user.rows.length > 0) {
      res.status(200).json(user.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateName = async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
     return res.status(400).json({ message: 'Name is required' });
  }
  try {
    const user = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, theme, role, current_streak, max_streak, total_score, streak_freezes', 
      [name.trim(), req.user.id]
    );
    if (user.rows.length > 0) {
      res.status(200).json(user.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating name' });
  }
};

// Admin basic stats function
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    res.status(200).json({
      totalUsers: parseInt(userCount.rows[0].count, 10),
      activeQuizzes: 0, // Placeholder
      averageScore: 0, // Placeholder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    // Check user's last active date
    const result = await pool.query('SELECT last_active_date, current_streak, max_streak, streak_freezes FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    let { last_active_date, current_streak, max_streak, streak_freezes } = result.rows[0];
    
    // Fallback if null (shouldn't happen with migration)
    if (streak_freezes == null) streak_freezes = 2;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let lastActive = last_active_date ? new Date(last_active_date) : null;
    if (lastActive) lastActive.setHours(0,0,0,0);

    const msInDay = 24 * 60 * 60 * 1000;
    
    let updated = false;
    let freezesUsed = 0;

    if (!lastActive) {
      // First time tracking
      current_streak = 1;
      max_streak = 1;
      updated = true;
    } else {
      const diffDays = Math.round((today - lastActive) / msInDay);
      
      if (diffDays === 1) {
        // Consecutive day
        current_streak += 1;
        if (current_streak > max_streak) max_streak = current_streak;
        
        // Award a freeze every 7 days (cap at 3)
        if (current_streak % 7 === 0 && streak_freezes < 3) {
           streak_freezes += 1;
        }
        updated = true;
      } else if (diffDays > 1) {
        // Missing days! Can freezes save them?
        // diffDays - 1 represents the completely blank days without interaction
        const missedDays = diffDays - 1;
        
        if (streak_freezes >= missedDays) {
          // Survived! Consume freezes, keep streak
          streak_freezes -= missedDays;
          freezesUsed = missedDays;
          current_streak += 1; // Count today!
          if (current_streak > max_streak) max_streak = current_streak;
        } else {
          // Streak broken
          current_streak = 1;
          // Freezes don't reset when broken or maybe they do? Let's not punish entirely, just let them keep whatever freeze remains, or reset to 2.
          // Resetting back to 2 is fair since they lost their entire streak progress.
          streak_freezes = 2; 
        }
        updated = true;
      } else {
        // Already active today
      }
    }

    if (updated) {
      await pool.query(
        'UPDATE users SET current_streak = $1, max_streak = $2, streak_freezes = $3, last_active_date = CURRENT_DATE WHERE id = $4',
        [current_streak, max_streak, streak_freezes, userId]
      );
    }

    res.json({ current_streak, max_streak, streak_freezes, updated, freezesUsed });
  } catch (err) {
    console.error('Streak update error:', err);
    res.status(500).json({ message: 'Server error updating streak' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateTheme,
  getDashboardStats,
  updateStreak,
  updateName,
};
