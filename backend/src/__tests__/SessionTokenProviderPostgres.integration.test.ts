import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { SessionToken } from "../SessionToken";
import { SessionTokenProviderPostgres } from "../SessionTokenProviderPostgres";
import { User } from "../User";
import { UserProviderPostgres } from "../UserProviderPostgres";

describe("Session Token Provider - Postgres", () => {
  const db = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(() => {
    db.query(sql`DELETE FROM session_tokens; DELETE FROM users;`);
  });

  it("saves a new token", async () => {
    const user = await User.ofPlainTextPassword(
      "35d0148a-1ee0-47cf-9bf1-512ee783702b",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );
    const userProvider = new UserProviderPostgres();
    await userProvider.createNewUser(user);
    const sessionToken = SessionToken.newToken(user);
    const sessionTokenProvider = new SessionTokenProviderPostgres();

    await sessionTokenProvider.insertToken(sessionToken);

    const result = await db.query(sql`SELECT * FROM session_tokens`);
    expect(result.rowCount).toBe(1);
  });

  it("fetches token by its value", async () => {
    const user = await User.ofPlainTextPassword(
      "35d0148a-1ee0-47cf-9bf1-512ee783702b",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );
    const userProvider = new UserProviderPostgres();
    await userProvider.createNewUser(user);
    const sessionToken = SessionToken.newToken(user);
    const sessionTokenProvider = new SessionTokenProviderPostgres();
    await sessionTokenProvider.insertToken(sessionToken);

    const savedToken = await sessionTokenProvider.fetchTokenByValue(sessionToken.asString());

    expect(savedToken!.userId()).toEqual(user.id());
  });
});
