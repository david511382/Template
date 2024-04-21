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
# RUN pnpm win2linux &&\
RUN ./script/load-config.sh $APP_ENV &&\
    pnpm prisma:g &&\
    pnpm build &&\
    pnpm prune --prod


FROM base As deploy

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env .env
CMD ["pnpm", "start:prod"]