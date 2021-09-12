CREATE TYPE game_status AS ENUM ('PLANNING', 'PLAYING', 'COMPLETED');

CREATE TABLE IF NOT EXISTS game_list (
        user_id UUID NOT NULL REFERENCES users(id),
        game_id UUID NOT NULL REFERENCES games(id),
        status game_status NOT NULL,
        UNIQUE(user_id, game_id)
);
