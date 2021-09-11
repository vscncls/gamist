import { SessionToken } from "./SessionToken";

export interface SessionTokenProvider {
  insertToken(token: SessionToken): Promise<void>;
  fetchTokenByValue(tokenValue: string): Promise<SessionToken | null>;
}
