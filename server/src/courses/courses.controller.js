const pool = require('../config/db');

const getCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT 
                c.*,
                (SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id) as total_materials,
                (SELECT COALESCE(SUM(percentage), 0) / 100.0 FROM user_progress up 
                 JOIN materials m ON up.material_id = m.id 
                 WHERE m.course_id = c.id AND up.user_id = $1) as completed_materials
            FROM courses c
            ORDER BY c.title ASC
        `, [userId]);
        res.json(result.rows);
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to fetch courses'});
    }
}

const createCourse = async (req, res) => {
    try {
        const { title, code, description } = req.body;
        const result = await pool.query(
            'INSERT INTO courses (title, code, description) VALUES ($1, $2, $3) RETURNING *',
            [title, code, description]
        );
        res.json(result.rows[0]);
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to create course'});
    }
}

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, code, description } = req.body;
        const result = await pool.query(
            'UPDATE courses SET title = $1, code = $2, description = $3 WHERE id = $4 RETURNING *',
            [title, code, description, id]
        );
        res.json(result.rows[0]);
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to update course'});
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM courses WHERE id = $1', [id]);
        res.json({ message: 'Course deleted successfully' });
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to delete course'});
    }
}

const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.json([]);
        }

        const searchTerm = `%${q}%`;
        const result = await pool.query(`
            SELECT id, title, code, description
            FROM courses
            WHERE title ILIKE $1 OR code ILIKE $1 OR description ILIKE $1
            ORDER BY title ASC
            LIMIT 10
        `, [searchTerm]);

        res.json(result.rows);
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to search courses'});
    }
}

module.exports = { getCourses, createCourse, updateCourse, deleteCourse, searchCourses };
