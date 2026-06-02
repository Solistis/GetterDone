CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE item (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    details TEXT,
    kind TEXT NOT NULL DEFAULT 'task'
        CHECK (kind IN ('assignment','chore','timer','errand','place','task','note')),

    urgency TEXT NOT NULL DEFAULT 'flexible'
        CHECK (urgency IN ('must_do','flexible')),

    due_at TIMESTAMPTZ,

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','completed','snoozed')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);