require('dotenv').config();
const pool = require('./src/config/db');
pool.query('SELECT * FROM system_settings').then(r => console.log(r.rows)).catch(console.error).finally(() => process.exit(0));
