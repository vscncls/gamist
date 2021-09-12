import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { User } from "../User";
import { UserProviderPostgres } from "../UserProviderPostgres";

describe("User Provider - Postgres", () => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await pool.query(sql`DELETE FROM users`);
  });

  it("saves a new user in db", async () => {
    const userProvider = new UserProviderPostgres();
    const user = await User.ofPlainTextPassword(
      "247fff9a-4220-4085-bc38-4776debdff68",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );

    await userProvider.createNewUser(user);

    const users = await pool.query(sql`SELECT * FROM users`);
    expect(users.rowCount).toBe(1);
  });

  it("gets user by id", async () => {
    const userProvider = new UserProviderPostgres();
    const user = await User.ofPlainTextPassword(
      "247fff9a-4220-4085-bc38-4776debdff68",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );
    await userProvider.createNewUser(user);

    const dbUser = await userProvider.getById(user.id());

    expect(user).toEqual(dbUser);
  });

  it("gets user by username", async () => {
    const userProvider = new UserProviderPostgres();
    const user = await User.ofPlainTextPassword(
      "247fff9a-4220-4085-bc38-4776debdff68",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );
    await userProvider.createNewUser(user);

    const dbUser = await userProvider.getByEmailOrUsername(null, user.username());

    expect(user).toEqual(dbUser);
  });

  it("gets user by email", async () => {
    const userProvider = new UserProviderPostgres();
    const user = await User.ofPlainTextPassword(
      "247fff9a-4220-4085-bc38-4776debdff68",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha"
    );
    await userProvider.createNewUser(user);

    const dbUser = await userProvider.getByEmailOrUsername(user.email(), null);

    expect(user).toEqual(dbUser);
  });
});
