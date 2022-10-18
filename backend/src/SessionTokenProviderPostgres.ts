import { DatabasePool, sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";
import { SessionToken } from "./SessionToken";
import { SessionTokenProvider } from "./SessionTokenProvider";

type SessionTokenDb = {
  id: string;
  user_id: string;
};

export class SessionTokenProviderPostgres implements SessionTokenProvider {
  private db: DatabasePool;
  public constructor() {
    this.db = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async insertToken(token: SessionToken): Promise<void> {
    await this.db.query(sql`
      INSERT INTO session_tokens (id, user_id)
      VALUES (${token.asString()}, ${token.userId()});
    `);
  }

  public async fetchTokenByValue(tokenValue: string): Promise<SessionToken | null> {
    const result = await this.db.maybeOne<SessionTokenDb>(sql`
      SELECT *
      FROM session_tokens
      WHERE id = ${tokenValue}
    `);

    return result ? SessionToken.of(result.id, result.user_id) : null;
  }
}
