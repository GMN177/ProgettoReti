# pull the Node.js Docker image
FROM node:alpine

RUN apk add --no-cache bash

##RUN apk add --update --no-cache tzdata

#ENV TZ Europe/rome

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# our app is running on port 3003 within the container, so need to expose it
EXPOSE 3003

# the command that starts our app
#CMD ["npm", "run", "start"]
#CMD ["./wait-for-it.sh", "rabbitmq:15672", "--", "npm", "run", "start"]