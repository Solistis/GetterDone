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
        const { title, details, kind, urgency, due_at, list_id } = req.body  || {};
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const result = await pool.query(
            `
            INSERT INTO item (
                title, 
                details,
                kind,
                urgency,
                due_at,
                list_id
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                title,
                details || null,
                kind || "task",
                urgency || "flexible",
                due_at || null,
                list_id || null,
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

// GET one item by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `
            SELECT *
            FROM item
            WHERE item_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                succes: false,
                message: "Item no found",
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

// UPDATE item
router.put("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const { title, details, kind, urgency, due_at, status, list_id } = req.body;

        const result = await pool.query(
            `
            UPDATE item
            SET
                title = COALESCE($1, title),
                details = COALESCE($2, details),
                kind = COALESCE($3, kind),
                urgency = COALESCE($4, urgency),
                due_at = COALESCE($5, due_at),
                status = COALESCE($6, status),
                list_id = COALESCE($7, list_id)
            WHERE item_id = $8
            RETURNING *
            `,
            [title, details, kind, urgency, due_at, status, list_id, id]
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

module.exports = router;