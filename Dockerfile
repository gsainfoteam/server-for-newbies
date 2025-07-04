# create a bun base image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install bun globally
FROM base AS installer
COPY ./package.json ./bun.lock ./

FROM installer AS prod
RUN bun install --production

FROM installer AS builder
COPY . .
RUN bun install && bun run build


# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prod /usr/src/app/node_modules ./node_modules
COPY --from=builder ./usr/src/app/.env ./.env
COPY --from=builder ./usr/src/app/dist ./dist
COPY --from=builder ./usr/src/app/package.json ./package.json

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start:prod" ]