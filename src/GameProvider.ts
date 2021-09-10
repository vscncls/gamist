import { Game } from "./Game";

export interface GameProvider {
  saveBatch(games: Game[]): Promise<void>;
}
