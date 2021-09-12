import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { Game } from "../Game";
import { GameListProviderPostgres } from "../GameListProviderPostgres";
import { GamePlayedStatus } from "../GamePlayedStatus";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { GetUserSessionTokenQuery } from "../GetUserSessionTokenQuery";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { SessionTokenProviderPostgres } from "../SessionTokenProviderPostgres";
import { User } from "../User";
import { UserProviderPostgres } from "../UserProviderPostgres";

describe("/game-list/:gameId", () => {
  const db = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await db.query(sql`DELETE FROM game_list; DELETE FROM session_tokens; DELETE FROM games; DELETE FROM users;`);
  });

  it("add game to planning", async () => {
    const gameListProvider = new GameListProviderPostgres();
    const gameProvider = new GameProviderPostgres();
    const userProvider = new UserProviderPostgres();
    const sessionTokenProvider = new SessionTokenProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
    ]);
    await userProvider.createNewUser(
      await User.ofPlainTextPassword("247fff9a-4220-4085-bc38-4776debdff68", "lucas@vscncls.xyz", "vscncls", "senha")
    );
    const getSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, sessionTokenProvider);
    const sessionToken = await getSessionTokenQuery.execute({ email: "lucas@vscncls.xyz", password: "senha" });

    const response = await fastifyServer.inject({
      method: "PUT",
      url: "/game-list/b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${sessionToken.asString()}`,
      },
      payload: JSON.stringify({
        status: "PLANNING",
      }),
    });

    expect(response.body).toEqual("");
    expect(response.statusCode).toEqual(202);
    const gameStatus = await gameListProvider.getByGameIdAndUserId(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68"
    );
    expect(gameStatus).toBe(GamePlayedStatus.PLANNING);
  });
});
