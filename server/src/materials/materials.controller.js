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
            ORDER BY m.sort_order ASC, m.created_at ASC
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

        // Assign sort_order = max existing + 1 so new uploads go to the end
        const maxResult = await pool.query(
            'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM materials WHERE course_id = $1',
            [course_id]
        );
        const nextOrder = maxResult.rows[0].next_order;

        await pool.query(
            'INSERT INTO materials (course_id, title, file_url, type, sort_order) VALUES ($1, $2, $3, $4, $5)',
            [course_id, title, file_url, 'pdf', nextOrder]
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
        const [materialsResult, courseResult] = await Promise.all([
            pool.query('SELECT * FROM materials WHERE course_id = $1 ORDER BY sort_order ASC, created_at ASC', [courseId]),
            pool.query('SELECT title FROM courses WHERE id = $1', [courseId])
        ]);

        if (materialsResult.rows.length === 0) {
            return res.status(404).json({ message: 'No materials found for this course' });
        }

        // Check which files actually exist on disk (async, non-blocking)
        const fileChecks = await Promise.all(
            materialsResult.rows.map(async (mat) => {
                const filePath = path.join(__dirname, '../../', mat.file_url);
                try {
                    await fs.promises.access(filePath, fs.constants.F_OK);
                    return { mat, filePath, exists: true };
                } catch {
                    return { mat, filePath, exists: false };
                }
            })
        );

        const validFiles = fileChecks.filter(f => f.exists);
        if (validFiles.length === 0) {
            return res.status(404).json({ message: 'No downloadable files found for this course' });
        }

        const courseTitle = courseResult.rows[0].title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Set headers immediately so the browser knows a download is starting
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${courseTitle}_materials.zip"`);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Use level 1 (fastest compression) instead of 9 — dramatically reduces CPU time on free-tier servers
        const archive = archiver('zip', {
            zlib: { level: 1 }
        });

        archive.on('error', (err) => {
            console.error('Archive error:', err);
            // Headers already sent, can't send JSON — just destroy the connection
            res.destroy();
        });

        archive.pipe(res);

        // Add all valid files to the archive
        for (const { mat, filePath } of validFiles) {
            archive.file(filePath, { name: `${mat.title}.pdf` });
        }

        await archive.finalize();
    } catch (e) {
        console.error('downloadCourse error:', e);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate course zip' });
        }
    }
}

const reorderMaterials = async (req, res) => {
    try {
        // orderedIds: array of material IDs in the new desired order
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json({ message: 'orderedIds array is required' });
        }

        // Update each material's sort_order based on its position in the array
        const updates = orderedIds.map((id, index) =>
            pool.query('UPDATE materials SET sort_order = $1 WHERE id = $2', [index + 1, id])
        );
        await Promise.all(updates);

        res.json({ message: 'Order updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to reorder materials' });
    }
};

module.exports = { getMaterials, getMaterialById, uploadMaterial, updateMaterial, deleteMaterial, downloadCourse, searchMaterials, reorderMaterials };
