import dotenv from "dotenv";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { LoggerSingleton } from "./LoggerSingleton";
import { RegisterUserCommand } from "./RegisterUserCommand";
import { UserProviderPostgres } from "./UserProviderPostgres";
import { GetUserSessionTokenQuery } from "./GetUserSessionTokenQuery";
import { SessionTokenProviderPostgres } from "./SessionTokenProviderPostgres";
import { GetGameByIdQuery } from "./GetGameByIdQuery";
import { GameProviderPostgres } from "./GameProviderPostgres";
import { GameListProviderPostgres } from "./GameListProviderPostgres";
import { GamePlayedStatus } from "./GamePlayedStatus";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";

dotenv.config();

const logger = new LoggerSingleton().getInstance();
const server = fastify({
  logger,
});
server.register(fastifyCors, {
  origin: true,
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

type SetGameStatus = {
  Headers: {
    authorization: string;
  };
  Body: {
    status: string;
  };
  Params: {
    gameId: string;
  };
};

server.addSchema({
  $id: "singup",
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    username: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 5 },
  },
  required: ["id", "username", "email", "password"],
});

server.addSchema({
  $id: "singin",
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
});

server.addSchema({
  $id: "addGameToList",
  type: "object",
  properties: {
    status: { type: "string", pattern: "^(PLANNING|PLAYING|COMPLETED)$" },
  },
  required: ["status"],
});

// make this nicer
const preapareServer = async () => {
  await new PostgresConnectionPoolSingleton().prepare();
  const userProvider = new UserProviderPostgres();
  const gameProvider = new GameProviderPostgres();
  const sessionTokenProvider = new SessionTokenProviderPostgres();
  const gameListProvider = new GameListProviderPostgres();

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

    const token = req.headers.authorization?.split(" ")[1];
    let status: GamePlayedStatus | null = null;
    if (token) {
      const sessionToken = await sessionTokenProvider.fetchTokenByValue(token);
      if (sessionToken) {
        status = await gameListProvider.getByGameIdAndUserId(req.params.id, sessionToken.userId());
      }
    }

    res.code(200).send({
      id: game.id(),
      name: game.name(),
      coverUrl: game.coverUrl(),
      summary: game.summary(),
      watchingStatus: status,
    });
  });

  server.get<GetGameByIdRequest>("/games", async (_, res) => {
    const games = await gameProvider.getAll();
    res
      .code(200)
      .send({ games: games.map((game) => ({ id: game.id(), name: game.name(), coverUrl: game.coverUrl() })) });
  });

  server.put<SetGameStatus>("/game-list/:gameId", { schema: { body: { $ref: "addGameToList" } } }, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const sessionToken = await sessionTokenProvider.fetchTokenByValue(token);
    if (!sessionToken) {
      throw new Error("invalid login");
    }
    const status = GamePlayedStatus[req.body.status as keyof typeof GamePlayedStatus];
    await gameListProvider.addPlayingStatus(req.params.gameId, sessionToken.userId(), status);
    res.code(202).send("");
  });

  server.get("/health", (_req, res) => {
    res.code(200).send("");
  });

  return server;
};

export { preapareServer };
