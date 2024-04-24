FROM node:20-alpine AS base

RUN npm i -g pnpm &&\
    pnpm i dos2unix &&\
    apk update && apk add bash

FROM base As dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

WORKDIR /app/client
COPY ./client/package.json ./client/pnpm-lock.yaml ./
RUN pnpm install


FROM base As build

ARG APP_ENV

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN find ./script -type f -print0 | xargs -0 dos2unix &&\
    /bin/bash ./script/prisma.sh generate &&\
    /bin/bash ./script/load-config.bash $APP_ENV &&\
    pnpm build &&\
    pnpm prune --prod
    
WORKDIR /app/client
COPY ./client .
COPY --from=dependencies /app/client/node_modules ./node_modules
RUN pnpm build


FROM base As deploy

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env .env
COPY --from=build /app/client/public ./client/public
COPY --from=build /app/client/.env ./client/.env
COPY --from=build /app/client/.next/standalone ./client/
COPY --from=build /app/client/.next/static ./client/.next/static
CMD ["pnpm", "start:prod", "node", "server.js"]