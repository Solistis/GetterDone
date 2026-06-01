const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
            FROM item
            ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            items: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json ({
            success: false,
            error: error.message,
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const { title, details, kind, urgency, due_at } = req.body;

        const result = await pool.query(
            `
            INSERT INTO item (
                title, 
                details,
                kind,
                urgency,
                due_at
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                title,
                details || null,
                kind || "task",
                urgency || "flexible",
                due_at || null,
            ]
        );

        res.status(201).json({
            success: true,
            item: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});


router.patch("/:id/complete", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE item
            SET status = 'completed'
            WHERE item_id = $1
            RETURNING *
            `, 
            [id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        res.json({
            success: true,
            item: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// GET active items
router.get("/active", async (req, res) => {
    try {
    const result = await pool.query(
        `
        SELECT *
        FROM item
        WHERE status = 'active'
        ORDER BY created_at DESC
        `
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

// GET completed items
router.get("/completed", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM item
            WHERE status = 'completed'
            ORDER BY created_at DESC
            `
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

// GET must-do items
router.get("/must-do", async (req, res) => {
    try {
    const result = await pool.query(
        `
        SELECT *
        FROM item
        WHERE urgency = 'must_do'
        AND status = 'active'
        ORDER BY due_at ASC NULLS LAST, created_at DESC
        `
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

// GET overdue items
router.get("/overdue", async (req, res) => {
    try {
        const result = await pool.query(
            `
        SELECT *
            FROM item
            WHERE due_at IS NOT NULL
            AND due_at < NOW()
            AND status = 'active'
            ORDER BY due_at ASC
            `
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

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
                DELETE FROM item
                WHERE item_id = $1
                RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        res.json({
            success: true,
            message: "Item deleted",
            item: result.rows[0],
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