FROM node:10.15.3-alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm config set registry http://registry.npm.taobao.org/
RUN npm i yarn -g
RUN yarn
VOLUME [ "/usr/src/app/dist" ]
CMD [ "npm", "run", "build" ]