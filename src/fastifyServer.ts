import fastify from "fastify";
import { LoggerSingleton } from "./LoggerSingleton";
import { RegisterUserCommand } from "./RegisterUserCommand";
import { UserProviderPostgres } from "./UserProviderPostgres";
import dotenv from "dotenv";
import { GetUserSessionTokenQuery } from "./GetUserSessionTokenQuery";
import { SessionTokenProviderPostgres } from "./SessionTokenProviderPostgres";

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
const sessionTokenProvider = new SessionTokenProviderPostgres();
const registerUserCommand = new RegisterUserCommand(userProvider);
const getSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, sessionTokenProvider);

server.post<SingupRequest>("/singup", { schema: { body: { $ref: "singup" } } }, async (req, res) => {
  await registerUserCommand.execute(req.body);
  res.code(202).send("");
});

server.post<SinginRequest>("/singin", { schema: { body: { $ref: "singin" } } }, async (req, res) => {
  const sessionToken = await getSessionTokenQuery.execute(req.body);
  res.code(200).send({ sessionToken: sessionToken.asString() });
});

export { server as fastifyServer };
