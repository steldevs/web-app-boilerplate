FROM node:latest as build-stage

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run-script build

FROM nginx:latest
COPY --from=build-stage /usr/src/app/build/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]