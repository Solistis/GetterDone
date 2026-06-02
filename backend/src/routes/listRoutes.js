const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM list
            ORDER BY created_at DESC
            `
        );

        res.json({
            success: true,
            lists: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// CREATE list
router.post("/", async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        const result = await pool.query(
        `
        INSERT INTO list (name, description, color, icon)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [name, description || null, color || null, icon || null]
        );

        res.status(201).json({
        success: true,
        list: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        success: false,
        error: error.message,
        });
    }
});

module.exports = router;