const pool = require('../config/db');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const searchMaterials = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.json([]);
        }

        const searchTerm = `%${q}%`;
        const result = await pool.query(`
            SELECT id, title, description, course_id, file_url, created_at
            FROM materials
            WHERE title ILIKE $1 OR description ILIKE $1
            ORDER BY created_at DESC
            LIMIT 10
        `, [searchTerm]);

        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to search materials' });
    }
};

const getMaterials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT 
                m.*,
                EXISTS (SELECT 1 FROM user_progress up WHERE up.material_id = m.id AND up.user_id = $2) as is_completed
            FROM materials m
            WHERE m.course_id = $1
            ORDER BY m.created_at DESC
        `, [courseId, userId]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to fetch materials' });
    }
};


const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const result = await pool.query(
            'UPDATE materials SET title = $1 WHERE id = $2 RETURNING *',
            [title, id]
        );
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to update material' });
    }
}

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        // Optionally delete the physical file here if needed
        await pool.query('DELETE FROM materials WHERE id = $1', [id]);
        res.json({ message: 'Material deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to delete material' });
    }
}

const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Material not found' });
        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to fetch material' });
    }
}

const uploadMaterial = async (req, res) => {
    try {
        const { course_id, title } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const file_url = `/uploads/${req.file.filename}`;

        await pool.query(
            'INSERT INTO materials (course_id, title, file_url, type) VALUES ($1, $2, $3, $4)',
            [course_id, title, file_url, 'pdf']
        );
        res.json({ message: 'Material uploaded successfully', file_url });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to save material db reference' });
    }
}

const downloadCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materialsResult = await pool.query('SELECT * FROM materials WHERE course_id = $1', [courseId]);
        const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [courseId]);

        if (materialsResult.rows.length === 0) {
            return res.status(404).json({ message: 'No materials found for this course' });
        }

        const courseTitle = courseResult.rows[0].title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        res.attachment(`${courseTitle}_materials.zip`);

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(res);

        materialsResult.rows.forEach(mat => {
            const filePath = path.join(__dirname, '../../', mat.file_url);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: `${mat.title}.pdf` });
            }
        });

        archive.finalize();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to generate course zip' });
    }
}

module.exports = { getMaterials, getMaterialById, uploadMaterial, updateMaterial, deleteMaterial, downloadCourse, searchMaterials };
