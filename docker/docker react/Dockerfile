FROM node:22-alpine

WORKDIR /app
# mention working dicretory

COPY package*.json ./
#copy all the package...json files inside the current directory

RUN npm install
#install all the packages

COPY . .
#copy all the codes to our current directory. first '.' represent the current directory and the second one represent the inside the docker directory

EXPOSE 5173
# we want to open this port for our project

CMD ["npm", "run", "dev"]
# this is container runtime command to run our project. When the container run then run this command

