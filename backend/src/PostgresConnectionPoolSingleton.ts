import { exit } from "process";
import { createPool, DatabasePool, TypeParser } from "slonik";

const UTCTimestampParser: TypeParser = {
  name: "timestamp",
  parse: (value) => new Date(`${value} UTC`),
};

export class PostgresConnectionPoolSingleton {
  private static instance: DatabasePool;

  public async prepare() {
    PostgresConnectionPoolSingleton.instance = await createPool(process.env.POSTGRES_URI || "", {
      typeParsers: [UTCTimestampParser],
    });
  }

  public getInstance(): DatabasePool {
    if (!PostgresConnectionPoolSingleton.instance) {
      console.error("Make sure to call *preapre* before using *PostgresConnectionPoolSingleton*");
      exit(1);
    }

    return PostgresConnectionPoolSingleton.instance;
  }
}
