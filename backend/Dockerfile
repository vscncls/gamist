FROM node:14-alpine

RUN addgroup -S app
RUN adduser -S app -G app

RUN npm install -g pnpm

WORKDIR /app
RUN chown -R app:app /app
COPY --chown=app:app package.json /app
COPY --chown=app:app pnpm-lock.yaml /app

USER app:app

RUN pnpm i

COPY --chown=app:app . /app

RUN pnpx tsc

RUN pnpm prune --production

EXPOSE 8080/tcp

ENTRYPOINT ["pnpm", "run", "server:run"]
