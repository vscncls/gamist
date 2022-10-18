import dotenv from "dotenv";
import { preapareServer } from "../fastifyServer";

dotenv.config();

const port = parseInt(process.env.PORT || "0") || 8080;
const main = async () => {
  (await preapareServer()).listen({ port });
};

main();
