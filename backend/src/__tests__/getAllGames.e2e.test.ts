import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { Game } from "../Game";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

describe("/games", () => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await pool.query(sql`DELETE FROM games`);
  });

  it("fetches all games with sucess", async () => {
    const gameProvider = new GameProviderPostgres();
    const games = [
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
      new Game("1733dd82-2e6b-49e3-9155-cc3693af6d98", "game 2", "https://cover/url", "summary"),
    ];
    await gameProvider.saveBatch(games);

    const response = await fastifyServer.inject({
      method: "GET",
      url: "/games",
    });

    const body = JSON.parse(response.body);
    expect(response.statusCode).toEqual(200);
    expect(body).toHaveProperty("games");
    expect(body.games).toHaveLength(2);
  });
});
