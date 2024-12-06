FROM node:20-buster

ADD . /usr/src/node/server/

WORKDIR /usr/src/node/server/

CMD [ "sh", "-c", "./node_modules/.bin/dotenv -- yarn start" ]
