import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { Game } from "../Game";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

describe("/game/:id", () => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await pool.query(sql`DELETE FROM games`);
  });

  it("fetches new game with sucess", async () => {
    const gameProvider = new GameProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "a quick summary"),
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/game/b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = JSON.parse(response.body);
    expect(response.statusCode).toEqual(200);
    expect(body.id).toEqual("b350bbe9-503b-46fb-8e5a-fcd4bdbab258");
  });

  //TODO: add test for logged in user, it should return the playing status
});
