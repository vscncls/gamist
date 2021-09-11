import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";
import { RegisterUserCommand } from "./RegisterUserCommand";
import { UserProviderPostgres } from "./UserProviderPostgres";
import dotenv from "dotenv";
import { GetUserSessionTokenQuery } from "./GetUserSessionTokenQuery";
import { SessionTokenProviderPostgres } from "./SessionTokenProviderPostgres";
import { GetGameByIdQuery } from "./GetGameByIdQuery";
import { GameProviderPostgres } from "./GameProviderPostgres";

dotenv.config();

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});

type SingupRequest = {
  Body: {
    id: string;
    username: string;
    email: string;
    password: string;
  };
};

type SinginRequest = {
  Body: {
    email: string;
    password: string;
  };
};

type GetGameByIdRequest = {
  Params: {
    id: string;
  };
};

server.addSchema({
  $id: "singup",
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    username: { type: "string" },
    email: { type: "string", format: "email" },
    password: { stpe: "string", minLength: 5 },
  },
  required: ["id", "username", "email", "password"],
});

server.addSchema({
  $id: "singin",
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { stpe: "string" },
  },
  required: ["email", "password"],
});

const userProvider = new UserProviderPostgres();
const gameProvider = new GameProviderPostgres();
const sessionTokenProvider = new SessionTokenProviderPostgres();

const registerUserCommand = new RegisterUserCommand(userProvider);
const getSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, sessionTokenProvider);
const getGameByIdQuery = new GetGameByIdQuery(gameProvider);

server.post<SingupRequest>("/singup", { schema: { body: { $ref: "singup" } } }, async (req, res) => {
  await registerUserCommand.execute(req.body);
  res.code(202).send("");
});

server.post<SinginRequest>("/singin", { schema: { body: { $ref: "singin" } } }, async (req, res) => {
  const sessionToken = await getSessionTokenQuery.execute(req.body);
  res.code(200).send({ sessionToken: sessionToken.asString() });
});

server.get<GetGameByIdRequest>("/game/:id", async (req, res) => {
  const game = await getGameByIdQuery.execute(req.params.id);
  res.code(200).send({ id: game.id(), name: game.name(), coverUrl: game.coverUrl() });
});

export { server as fastifyServer };
