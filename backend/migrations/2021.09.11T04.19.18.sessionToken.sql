CREATE TABLE IF NOT EXISTS session_tokens (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id)
);
