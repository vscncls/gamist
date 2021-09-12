import { Game } from "./Game";

export interface GameProvider {
  saveBatch(games: Game[]): Promise<void>;
  getById(id: string): Promise<Game | null>;
  getAll(): Promise<readonly Game[]>;
}
