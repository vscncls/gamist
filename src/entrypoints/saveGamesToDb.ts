import { GameProviderPostgres } from "../GameProviderPostgres";
import { IgdbApiClient } from "../IgdbApi";
import { LoggerSingleton } from "../LoggerSingleton";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const logger = new LoggerSingleton().getInstance();
  const igdbApi = new IgdbApiClient();
  logger.info("Fetching games from Igdb Api");
  const games = await igdbApi.getGames();
  logger.info(`Recieved ${games.length} games from igdb api`);
  const gameProvider = new GameProviderPostgres();
  logger.info("Saving games in postgres db");
  await gameProvider.saveBatch(games);
  logger.info("done 🚀");
})();
