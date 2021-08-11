FROM node:14
WORKDIR /usr/src/app
COPY package*.json
RUN npm install
COPY . .
EXPOSE 2002
CMD [ "node", "server/start.js" ]
