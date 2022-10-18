import { sql } from "slonik";
import { Game } from "../Game";
import { GameListProviderPostgres } from "../GameListProviderPostgres";
import { GamePlayedStatus } from "../GamePlayedStatus";
import { GameProviderPostgres } from "../GameProviderPostgres";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { User } from "../User";
import { UserProviderPostgres } from "../UserProviderPostgres";

describe("Game list provider - Postgres", () => {
  const db = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await db.query(sql`DELETE FROM game_list; DELETE FROM games; DELETE FROM users;`);
  });

  it("saves new playing status", async () => {
    const gameListProvider = new GameListProviderPostgres();
    const gameProvider = new GameProviderPostgres();
    const userProvider = new UserProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
    ]);
    await userProvider.createNewUser(
      await User.ofPlainTextPassword("247fff9a-4220-4085-bc38-4776debdff68", "lucas@vscncls.xyz", "vscncls", "senha")
    );

    await gameListProvider.addPlayingStatus(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68",
      GamePlayedStatus.PLANNING
    );

    const status = await gameListProvider.getByGameIdAndUserId(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68"
    );

    expect(status).toEqual(GamePlayedStatus.PLANNING);
  });

  it("overrides old playing status", async () => {
    const gameListProvider = new GameListProviderPostgres();
    const gameProvider = new GameProviderPostgres();
    const userProvider = new UserProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
    ]);
    await userProvider.createNewUser(
      await User.ofPlainTextPassword("247fff9a-4220-4085-bc38-4776debdff68", "lucas@vscncls.xyz", "vscncls", "senha")
    );

    await gameListProvider.addPlayingStatus(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68",
      GamePlayedStatus.PLANNING
    );
    await gameListProvider.addPlayingStatus(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68",
      GamePlayedStatus.PLAYING
    );

    const status = await gameListProvider.getByGameIdAndUserId(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68"
    );

    expect(status).toEqual(GamePlayedStatus.PLAYING);
  });

  it("fetches playing status", async () => {
    const gameListProvider = new GameListProviderPostgres();
    const gameProvider = new GameProviderPostgres();
    const userProvider = new UserProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
    ]);
    await userProvider.createNewUser(
      await User.ofPlainTextPassword("247fff9a-4220-4085-bc38-4776debdff68", "lucas@vscncls.xyz", "vscncls", "senha")
    );

    await gameListProvider.addPlayingStatus(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68",
      GamePlayedStatus.PLAYING
    );

    const status = await gameListProvider.getByGameIdAndUserId(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68"
    );

    expect(status).toEqual(GamePlayedStatus.PLAYING);
  });

  it("fetches null if not saved", async () => {
    const gameListProvider = new GameListProviderPostgres();
    const gameProvider = new GameProviderPostgres();
    const userProvider = new UserProviderPostgres();
    await gameProvider.saveBatch([
      new Game("b350bbe9-503b-46fb-8e5a-fcd4bdbab258", "game 1", "https://cover/url", "summary"),
    ]);
    await userProvider.createNewUser(
      await User.ofPlainTextPassword("247fff9a-4220-4085-bc38-4776debdff68", "lucas@vscncls.xyz", "vscncls", "senha")
    );

    const status = await gameListProvider.getByGameIdAndUserId(
      "b350bbe9-503b-46fb-8e5a-fcd4bdbab258",
      "247fff9a-4220-4085-bc38-4776debdff68"
    );

    expect(status).toBeNull();
  });
});
