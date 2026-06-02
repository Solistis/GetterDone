CREATE TABLE list (
    list_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    description TEXT,

    color TEXT,

    icon TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE item
ADD COLUMN list_id UUID
REFERENCES list(list_id)
ON DELETE SET NULL;