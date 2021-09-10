import { sql } from "slonik";
import { Game } from "../Game";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

describe("Game Provider - Postgres", () => {
  const db = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(() => {
    db.query(sql`DELETE FROM games;`);
  });

  it("saves games", async () => {
    const gameProvider = new GameProviderPostgres();
    const games = [new Game("game 1", "https://cover/url"), new Game("game 2", "https://cover/url")];

    await gameProvider.saveBatch(games);

    const result = await db.query(sql`SELECT * FROM games`);
    expect(result.rows.length).toEqual(2);
  });
});
