import { Game } from "./Game";
import { GameProvider } from "./GameProvider";

export class GetGameByIdQuery {
  private gameProvider: GameProvider;
  public constructor(gameProvider: GameProvider) {
    this.gameProvider = gameProvider;
  }

  public async execute(id: string): Promise<Game> {
    const game = await this.gameProvider.getById(id);
    if (!game) {
      throw new Error("game not found");
    }

    return game;
  }
}
