import { Game } from "../Game";
import { GameProvider } from "../GameProvider";

export class FakeGameProvider implements GameProvider {
  private games: Game[];
  constructor() {
    this.games = [];
  }

  saveBatch(games: Game[]): Promise<void> {
    this.games.push(...games);
    return Promise.resolve();
  }

  getById(id: string): Promise<Game | null> {
    return Promise.resolve(this.games.find((game) => game.id() === id) || null);
  }

  getAll(): Promise<Game[]> {
    return Promise.resolve([...this.games]);
  }
}
