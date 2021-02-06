FROM node:14.15.4-alpine3.10

RUN mkdir /usr/src/app
COPY . /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install yarn dependencies
RUN yarn install

# Bundle app source
COPY . .

# New
EXPOSE 8082
CMD [ "node", "index.js" ]
