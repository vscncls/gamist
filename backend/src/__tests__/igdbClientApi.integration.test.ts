import { IgdbApiClient } from "../IgdbApi";

describe("Igdb Client Api", () => {
  it("is able to fetch games from the api", async () => {
    const igdbClient = new IgdbApiClient();

    const games = await igdbClient.getGames();

    expect(games).toBeInstanceOf(Array);
    expect(games.length).toBeGreaterThan(0);
  });
});
