const { SlonikMigrator } = require("@slonik/migrator");
const { createPool } = require("slonik");
const dotenv = require("dotenv")

dotenv.config();

(async () => {
  // in an existing slonik project, this would usually be setup in another module
  const slonik = await createPool(process.env.POSTGRES_URI);

  const migrator = new SlonikMigrator({
    migrationsPath: __dirname + "/migrations",
    migrationTableName: "migration",
    slonik,
    logger: SlonikMigrator.prettyLogger,
  });

  migrator.runAsCLI();
})();
