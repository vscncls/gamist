import { sql } from "slonik";
import { Game } from "../Game";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

describe("Game Provider - Postgres", () => {
  const db = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await db.query(sql`DELETE FROM games;`);
  });

  it("saves games", async () => {
    const gameProvider = new GameProviderPostgres();
    const games = [
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
      new Game("1733dd82-2e6b-49e3-9155-cc3693af6d98", "game 2", "https://cover/url", "summary"),
    ];

    await gameProvider.saveBatch(games);

    const result = await db.query(sql`SELECT * FROM games`);
    expect(result.rows.length).toEqual(2);
  });

  it("fetches games by id", async () => {
    const gameProvider = new GameProviderPostgres();
    const games = [
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
      new Game("1733dd82-2e6b-49e3-9155-cc3693af6d98", "game 2", "https://cover/url", "summary"),
    ];
    await gameProvider.saveBatch(games);

    const game = await gameProvider.getById("b350bbe9-503b-46fb-8e5a-fcd4bdbab258");

    expect(game).not.toBeFalsy();
    expect(game!.id()).toBe("b350bbe9-503b-46fb-8e5a-fcd4bdbab258");
  });

  it("fetches all games from db", async () => {
    const gameProvider = new GameProviderPostgres();
    const games = [
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
      new Game("1733dd82-2e6b-49e3-9155-cc3693af6d98", "game 2", "https://cover/url", "summary"),
    ];
    await gameProvider.saveBatch(games);

    const game = await gameProvider.getAll();

    expect(game).toHaveLength(2);
  });
});
