import { DatabasePoolType, sql } from "slonik";
import { Game } from "./Game";
import { GameProvider } from "./GameProvider";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";

export class GameProviderPostgres implements GameProvider {
  private db: DatabasePoolType;
  public constructor() {
    this.db = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async saveBatch(games: Game[]): Promise<void> {
    await this.db.query(sql`
      INSERT INTO games("name", "cover_url")
      SELECT * FROM ${sql.unnest(
        games.map((game) => [game.name(), game.coverUrl()]),
        ["text", "text"]
      )}
    `);
  }
}
