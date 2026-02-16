FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js db.json ./

ARG FRONTEND_URL
ARG API_PORT
ARG NODE_ENV

EXPOSE ${API_PORT}

ENV NODE_ENV=${NODE_ENV}
ENV API_PORT=${API_PORT}
ENV FRONTEND_URL=${FRONTEND_URL}

CMD ["node", "server.js"]
