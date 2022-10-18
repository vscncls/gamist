FROM node:14-alpine AS builder

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

ARG REACT_APP_API_URL

RUN pnpm run build

# ===
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*

COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
