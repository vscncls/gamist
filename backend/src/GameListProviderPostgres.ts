import { DatabasePool, sql } from "slonik";
import { GameListProvider } from "./GameListProvider";
import { GamePlayedStatus } from "./GamePlayedStatus";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";

type gameListDb = {
  user_id: string;
  game_id: string;
  status: keyof typeof GamePlayedStatus;
};

export class GameListProviderPostgres implements GameListProvider {
  private db: DatabasePool;
  public constructor() {
    this.db = new PostgresConnectionPoolSingleton().getInstance();
  }
  public async addPlayingStatus(gameId: string, userId: string, status: GamePlayedStatus): Promise<void> {
    await this.db.query(sql`
      INSERT INTO game_list(user_id, game_id, status)
      VALUES (${userId}, ${gameId}, ${status.toString()})
      ON CONFLICT ON CONSTRAINT game_list_user_id_game_id_key
      DO
        UPDATE SET status = ${status.toString()}
    `);
  }

  public async getByGameIdAndUserId(gameId: string, userId: string): Promise<GamePlayedStatus | null> {
    const result = await this.db.maybeOne<gameListDb>(sql`
      SELECT *
      FROM game_list
      WHERE
        user_id = ${userId} AND
        game_id = ${gameId}
    `);

    return result ? GamePlayedStatus[result.status] : null;
  }
}
