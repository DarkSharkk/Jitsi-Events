FROM node:lts-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
# RUN npm install react-scripts@3.4.1 -g
# RUN npm i @vue/cli-service
COPY . .
RUN npm remove @vue/cli-plugin-eslint
RUN npm run build

FROM nginx:stable-alpine
# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./nginx/default.conf /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

