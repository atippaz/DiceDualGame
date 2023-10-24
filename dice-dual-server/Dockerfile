FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# COPY nginx.conf /etc/nginx/conf.d/nginx.conf
CMD ["npm", "start","&&","npm", "log"]
EXPOSE 9000
EXPOSE 4500

