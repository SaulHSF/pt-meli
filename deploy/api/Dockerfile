FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js db.json ./

EXPOSE 3001

ENV NODE_ENV=production
ENV API_PORT=3001

CMD ["node", "server.js"]
