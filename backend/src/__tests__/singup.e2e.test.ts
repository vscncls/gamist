import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";

describe("/singup", () => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  afterEach(async () => {
    await pool.query(sql`DELETE FROM users`);
  });

  it("registers a new user", async () => {
    const response = await fastifyServer.inject({
      method: "POST",
      url: "/singup",
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({
        id: "6b278640-67ba-49b0-b20a-b5063a3ae657",
        username: "vscncls",
        email: "lucas@vscncls.xyz",
        password: "senha",
      }),
    });

    expect(response.body).toEqual("");
    expect(response.statusCode).toEqual(202);
  });
});
