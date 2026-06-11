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

// GET all items for one list
router.get("/:id/items", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM item
            WHERE list_id = $1
            ORDER BY created_at DESC
            `,
            [id]
        );

        res.json({
            success: true,
            items: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// get or retrieve a list or category by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT * 
            FROM list
            WHERE list_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "List not found",
            });
        }

        res.json({
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

// Update category list
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, color, icon } = req.body || {};

        const result = await pool.query(
        `
        UPDATE list
        SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            color = COALESCE($3, color),
            icon = COALESCE($4, icon)
        WHERE list_id = $5
        RETURNING *
        `,
        [name, description, color, icon, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "List not found",
            })
        }

        res.json({
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

// DELETE list category
router.delete("/:id", async (req, res) => {
    try{
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM list
            WHERE list_id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                succuss: false,
                message: "List not found",
            });
        }

        res.json({
            success: true,
            message: "List deleted",
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