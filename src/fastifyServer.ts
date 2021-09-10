import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});

// server.post("/singup", (req, res) => {});

export { server as fastifyServer };
