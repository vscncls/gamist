export class User {
  private _id: string;
  private _email: string;
  private _username: string;

  public constructor(id: string, email: string, username: string) {
    this._id = id;
    this._email = email;
    this._username = username;
  }

  public id(): string {
    return this._id;
  }

  public username(): string {
    return this._username;
  }

  public email(): string {
    return this._email;
  }
}
