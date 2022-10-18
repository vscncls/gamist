import { DatabasePool, sql } from "slonik";
import { Game } from "./Game";
import { GameProvider } from "./GameProvider";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";

type gameDb = {
  id: string;
  name: string;
  cover_url: string;
  summary: string;
};

export class GameProviderPostgres implements GameProvider {
  private db: DatabasePool;
  public constructor() {
    this.db = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async saveBatch(games: Game[]): Promise<void> {
    await this.db.query(sql`
      INSERT INTO games("id", "name", "cover_url", "summary")
      SELECT * FROM ${sql.unnest(
        games.map((game) => [game.id(), game.name(), game.coverUrl(), game.summary()]),
        ["uuid", "text", "text", "text"]
      )}
    `);
  }

  public async getById(id: string): Promise<Game | null> {
    const result = await this.db.maybeOne<gameDb>(sql`
      SELECT *
      FROM games
      WHERE id = ${id}
    `);

    return result ? new Game(result.id, result.name, result.cover_url, result.summary) : null;
  }

  public async getAll(): Promise<Game[]> {
    const result = await this.db.query<gameDb>(sql`
      SELECT *
      FROM games
    `);

    return result.rows.map((gameDb) => new Game(gameDb.id, gameDb.name, gameDb.cover_url, gameDb.summary));
  }
}
