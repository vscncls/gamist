CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
);
