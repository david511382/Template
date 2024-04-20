FROM node:20-alpine AS base

RUN npm i -g pnpm &&\
    npm i -g dos2unix


FROM base As dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install


FROM base As build

ARG APP_ENV

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm dos2unix &&\
    ./script/load-config.sh $APP_ENV
# ./script/load-config.sh $APP_ENV &&\
# pnpm prisma:g &&\
# pnpm build &&\
# pnpm prune --prod



FROM base As clientDependencies

WORKDIR /app
COPY ./client/package.json ./client/pnpm-lock.yaml ./
RUN pnpm install


FROM base As clientBuild

ARG APP_ENV

WORKDIR /app
COPY ./client .
COPY --from=clientDependencies /app/node_modules ./node_modules
RUN ./script/load-config.sh $APP_ENV &&\
    pnpm build &&\
    ls



FROM base As clientDeploy

WORKDIR /app
COPY --from=clientBuild /app/.env .env
COPY --from=clientBuild /app/dist .


FROM base As deploy

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env .env
COPY --from=clientDeploy /app ./client
CMD ["pnpm", "start:prod"]