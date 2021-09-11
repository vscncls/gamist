import { v4 as uuidv4 } from "uuid";
import { User } from "./User";

export class SessionToken {
  private token: string;
  private _userId: string;

  private constructor(token: string, userId: string) {
    this.token = token;
    this._userId = userId;
  }

  public static newToken(user: User): SessionToken {
    return new SessionToken(uuidv4(), user.id());
  }

  public static of(token: string, userId: string): SessionToken {
    return new SessionToken(token, userId);
  }

  public asString(): string {
    return this.token;
  }

  public userId(): string {
    return this._userId;
  }
}
