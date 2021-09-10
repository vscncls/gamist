import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});

export { server as fastifyServer };
