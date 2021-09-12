import bcrypt from "bcrypt";

export class User {
  private _id: string;
  private _email: string;
  private _username: string;
  private _password: string;

  private constructor(id: string, email: string, username: string, password: string) {
    this._id = id;
    this._email = email;
    this._username = username;
    this._password = password;
  }

  public static async ofPlainTextPassword(
    id: string,
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new User(id, email, username, hashedPassword);
  }

  public static ofHashedPassword(id: string, email: string, username: string, password: string): User {
    return new User(id, email, username, password);
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

  public password(): string {
    return this._password;
  }

  public passwordMatches(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this._password);
  }
}
