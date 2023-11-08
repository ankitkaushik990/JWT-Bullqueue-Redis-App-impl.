FROM node:latest as node-image

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start-dev"]
