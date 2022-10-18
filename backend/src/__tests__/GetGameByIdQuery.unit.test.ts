import { Game } from "../Game";
import { GetGameByIdQuery } from "../GetGameByIdQuery";
import { FakeGameProvider } from "./FakeGameProvider";

describe("Fetch game by it's id", () => {
  it("works on a existing id", async () => {
    const gameProvider = new FakeGameProvider();
    gameProvider.saveBatch([new Game("213", "game name", null, null)]);
    const getGameById = new GetGameByIdQuery(gameProvider);

    const game = await getGameById.execute("213");

    expect(game).not.toBeFalsy();
    expect(game.id()).toBe("213");
  });

  it("throws when game is not found", async () => {
    const gameProvider = new FakeGameProvider();
    const getGameById = new GetGameByIdQuery(gameProvider);

    await expect(async () => await getGameById.execute("213")).rejects.toThrow(/game not found/);
  });
});
