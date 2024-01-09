FROM node:20.10.0-alpine3.17

RUN apk add --no-cache openssl1.1-compat 

RUN corepack enable \ 
  && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json .

COPY prisma ./prisma

RUN pnpm i --silent \
  && pnpm db:gen

COPY . .

CMD [ "pnpm", "dev" ]