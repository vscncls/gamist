import { GameProviderPostgres } from "../GameProviderPostgres";
import { IgdbApiClient } from "../IgdbApi";
import { LoggerSingleton } from "../LoggerSingleton";
import dotenv from "dotenv";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

dotenv.config();

(async () => {
  await new PostgresConnectionPoolSingleton().prepare();
  const logger = new LoggerSingleton().getInstance();
  const igdbApi = new IgdbApiClient();
  logger.info("Fetching games from Igdb Api");
  const qty = 500;
  for (let page = 1; page < 10; page++) {
    const games = await igdbApi.getGames(qty, qty * page);
    logger.info(`Recieved ${games.length} games from igdb api`);
    const gameProvider = new GameProviderPostgres();
    logger.info("Saving games in postgres db");
    await gameProvider.saveBatch(games);
  }
  logger.info("done 🚀");
})();
