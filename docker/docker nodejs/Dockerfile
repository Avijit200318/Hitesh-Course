#install node
FROM node:22-alpine

#set the working directory inside the container
WORKDIR /app

#copy all package.json file
COPY package*.json ./

#install all the dependencies
RUN npm install

#copy all the files in the working directory
COPY . .

# add enviromental variable
ENV PORT=3000

CMD ["npm", "run", "start"]