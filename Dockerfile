FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT 6945
EXPOSE 6945

RUN npm run build

CMD npm run dev