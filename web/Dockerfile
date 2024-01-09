FROM node:20.10.0-alpine3.17

RUN apk add --no-cache openssl1.1-compat 

RUN corepack enable \ 
  && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json .

RUN pnpm i --silent

COPY . .

EXPOSE 5173

CMD [ "pnpm", "dev" ]