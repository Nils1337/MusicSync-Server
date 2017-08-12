# build from node image
FROM node:8

WORKDIR /app

#RUN npm install -g nodemon
#RUN npm install sqlite3 --build-from-source

# install dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy source code
COPY . .

#expose access port
EXPOSE 80
# EXPOSE 5858

#start app
CMD ["npm", "start"]
