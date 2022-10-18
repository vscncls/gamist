import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { RegisterUserCommand } from "../RegisterUserCommand";
import { UserProviderPostgres } from "../UserProviderPostgres";

describe("/singin", () => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await pool.query(sql`DELETE FROM session_tokens; DELETE FROM users;`);
  });

  it("returns a valid sessionToken", async () => {
    const userProvider = new UserProviderPostgres();
    const registerUserCommand = new RegisterUserCommand(userProvider);
    await registerUserCommand.execute({
      id: "6b278640-67ba-49b0-b20a-b5063a3ae657",
      username: "vscncls",
      email: "lucas@vscncls.xyz",
      password: "senha",
    });

    const response = await fastifyServer.inject({
      method: "POST",
      url: "/singin",
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({
        email: "lucas@vscncls.xyz",
        password: "senha",
      }),
    });

    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("sessionToken");
    expect(body.sessionToken!.length).toBeGreaterThan(0);
    expect(response.statusCode).toEqual(200);
  });
});
