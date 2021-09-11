CREATE TABLE IF NOT EXISTS games(
        id SERIAL PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        cover_url TEXT
);
