FROM node:14

RUN mkdir -p /opt/pgstat/node_modules && chown -R node:node /opt/pgstat

WORKDIR /opt/pgstat

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "server/app.js" ]

EXPOSE 8000