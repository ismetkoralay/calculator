FROM node:16.13.1-slim as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install && npm install typescript -g
COPY . ./
RUN tsc

FROM node:16.13.1-slim as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app ./
RUN npm install
RUN find . -name "*.ts" | xargs rm
USER 1000
EXPOSE 3000
CMD ["node", "./build/index.js"]
