import { GamePlayedStatus } from "./GamePlayedStatus";

export interface GameListProvider {
  getByGameIdAndUserId(gameId: string, userId: string): Promise<GamePlayedStatus | null>;
  addPlayingStatus(gameId: string, userId: string, status: GamePlayedStatus): Promise<void>;
}
