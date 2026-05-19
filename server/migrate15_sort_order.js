const pool = require('./src/config/db');

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Adding sort_order column to materials table...');

        // Add sort_order column if it doesn't exist
        await client.query(`
            ALTER TABLE materials 
            ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0
        `);

        // Initialize sort_order based on created_at ASC so existing chapters
        // get a sensible default order (oldest = 1, newest = last)
        await client.query(`
            UPDATE materials m
            SET sort_order = sub.row_num
            FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY course_id ORDER BY created_at ASC) AS row_num
                FROM materials
            ) sub
            WHERE m.id = sub.id
        `);

        console.log('✅ sort_order column added and initialized successfully.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        client.release();
        process.exit(0);
    }
};

migrate();
