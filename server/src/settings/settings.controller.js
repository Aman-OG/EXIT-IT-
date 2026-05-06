const pool = require('../config/db');

// Public route to get non-sensitive settings (like exam components)
const getSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM system_settings');
    const settings = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error fetching settings'});
  }
};

// Admin route to overwrite global variables
const updateSetting = async (req, res) => {
  const { key, value } = req.body;
  
  if(!key || value === undefined) {
      return res.status(400).json({ message: 'Key and Value required' });
  }

  try {
    await pool.query('INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [key, value]);
    res.json({ message: 'Setting updated successfully' });
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Error updating setting'});
  }
};

module.exports = { getSettings, updateSetting };
