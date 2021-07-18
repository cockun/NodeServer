FROM node:14-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm install -g ts-node

RUN npm install typescript -g

RUN npm install

RUN npm run build

# RUN npm rebuild bcrypt --build-from-source
CMD ["npm","start"]