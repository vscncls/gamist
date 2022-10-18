import { DatabasePool, sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";
import { User } from "./User";
import { UserProvider } from "./UserProvider";

type DbUser = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export class UserProviderPostgres implements UserProvider {
  private pool: DatabasePool;

  constructor() {
    this.pool = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async createNewUser(user: User): Promise<void> {
    await this.pool.query(sql`
        INSERT INTO users(id, username, email, password) VALUES (
          ${user.id()},
          ${user.username()},
          ${user.email()},
          ${user.password()}
        );
    `);
  }

  public async getById(id: string): Promise<User> {
    const savedUser = await this.pool.one<DbUser>(sql`
        SELECT id, username, email, password
        FROM users
        WHERE
          id = ${id}
    `);

    return User.ofHashedPassword(id, savedUser.email, savedUser.username, savedUser.password);
  }

  public async getByEmailOrUsername(email: string | null, username: string | null): Promise<User | null> {
    const savedUser = await this.pool.maybeOne<DbUser>(sql`
        SELECT id, username, email, password
        FROM users
        WHERE
          email = ${email} OR
          username = ${username}
    `);

    return savedUser
      ? User.ofHashedPassword(savedUser.id, savedUser.email, savedUser.username, savedUser.password)
      : null;
  }
}
