const pool = require('../config/db');

const markCompleted = async (req, res) => {
    try {
        const { materialId } = req.params;
        const userId = req.user.id;
        const { percentage } = req.body;
        
        const pct = percentage !== undefined ? percentage : 100;
        const status = pct === 100 ? 'completed' : 'in_progress';
        
        await pool.query(
            `INSERT INTO user_progress (user_id, material_id, status, percentage, last_accessed_at) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
             ON CONFLICT (user_id, material_id) 
             DO UPDATE SET 
               percentage = GREATEST(user_progress.percentage, EXCLUDED.percentage),
               status = CASE WHEN EXCLUDED.percentage = 100 THEN 'completed' ELSE user_progress.status END,
               last_accessed_at = CURRENT_TIMESTAMP`,
            [userId, materialId, status, pct]
        );
        res.json({ success: true, message: 'Progress recorded' });
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to record progress'});
    }
}

const getOverallProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM materials) as total_materials,
                (SELECT COUNT(*) FROM user_progress WHERE user_id = $1) as completed_materials
        `, [userId]);
        res.json(result.rows[0]);
    } catch(e) {
        console.error(e);
        res.status(500).json({message: 'Failed to fetch overall progress'});
    }
}

const getLastAccessed = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT p.material_id, p.percentage, m.title as material_title, c.title as course_title, c.id as course_id
            FROM user_progress p
            JOIN materials m ON p.material_id = m.id
            JOIN courses c ON m.course_id = c.id
            WHERE p.user_id = $1
            ORDER BY p.last_accessed_at DESC
            LIMIT 1
        `, [userId]);
        
        if (result.rows.length === 0) {
            return res.json(null);
        }
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Failed to fetch last accessed'});
    }
}

const getRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT 
                c.id as course_id,
                c.title,
                c.code,
                c.description,
                (SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id) as total_materials,
                COALESCE(
                    (SELECT SUM(up.percentage) FROM user_progress up 
                     JOIN materials m ON up.material_id = m.id 
                     WHERE m.course_id = c.id AND up.user_id = $1), 0
                ) as completed_sum,
                CASE 
                    WHEN (SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id) = 0 THEN 0
                    ELSE ROUND(
                        COALESCE(
                            (SELECT SUM(up.percentage) FROM user_progress up 
                             JOIN materials m ON up.material_id = m.id 
                             WHERE m.course_id = c.id AND up.user_id = $1), 0
                        )::numeric / (GREATEST((SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id), 1) * 100) * 100
                    )
                END as progress_percentage,
                (SELECT MAX(up.last_accessed_at) FROM user_progress up 
                 JOIN materials m ON up.material_id = m.id 
                 WHERE m.course_id = c.id AND up.user_id = $1) as last_activity
            FROM courses c
            ORDER BY c.title ASC
        `, [userId]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to fetch roadmap progress' });
    }
}

const getOverallCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT 
                CASE 
                    WHEN COUNT(c.id) = 0 THEN 0
                    ELSE ROUND(
                        AVG(
                            CASE 
                                WHEN (SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id) = 0 THEN 0
                                ELSE COALESCE(
                                    (SELECT SUM(up.percentage) FROM user_progress up 
                                     JOIN materials m ON up.material_id = m.id 
                                     WHERE m.course_id = c.id AND up.user_id = $1), 0
                                )::numeric / (GREATEST((SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id), 1) * 100) * 100
                            END
                        )
                    )
                END as overall_progress,
                COUNT(c.id) as total_courses,
                (SELECT COUNT(DISTINCT c2.id) FROM courses c2 
                 JOIN materials m2 ON m2.course_id = c2.id 
                 JOIN user_progress up2 ON up2.material_id = m2.id AND up2.user_id = $1
                 WHERE up2.percentage > 0) as started_courses
            FROM courses c
        `, [userId]);
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to fetch overall course progress' });
    }
}

module.exports = { markCompleted, getOverallProgress, getLastAccessed, getRoadmapProgress, getOverallCourseProgress };
