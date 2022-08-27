# Docker

A lot of useful commands:

[How To Remove Docker Images, Containers, and Volumes | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)

## Commands

```bash
docker ps #shows every container running
-a # to show all, even paused

docker volume ls #shows every volume
docker volume rm <volume_id> # deletes one volume
docker volume prune # deletes unnecessary volumes

docker image ls #shows every image built
docker image rm <image_id or image_name> -f #(force command)  #removes built image
docker rmi $(docker images -a -q) # remove all images

docker build -t <name_of_image> . #builds a container based on Dockerfile
docker run [FLAGS] <name_of_image_to_run> #runs container based on image

# FLAGS FOR DOCKER RUN
-d # lets the container run and the terminal free
-p <port_mac>:<port_container> #redirects traffic from outside container to the container port
--name <new_container_name> #for naming the new container
-v <path_pc>:<path_container> #helps to sort of hotreload between files of container and pc. it needs to have the whole path, since root/origin.
# Replace <path_pc> with "$(pwd)".
# Replace <path_container> with "/app:ro". "ro" is for "read only" permission.
-v /app/node_modules #it will prevent the bind to sinc node_modules, so you cand delete it outside containers.
--env PORT=4000 # it lets you define env variables. If you change the PORT, dont forget to change also "<port_container>" value.
--env-file ./.env # it replaces the above option with the .env file.

docker logs [OPTIONS] CONTAINER # shows log of the container
-f #keep following the logs

docker inspect <container_name> # details about the container (IP_ADDRESS, etc...)

docker rm <container_name> -f #removes a container
-fv #deletes the volumes associated to

docker exec -it <container_name> bash #how to access command line in the container. not sure why bash there

# command in use
docker run -d --env-file ./.env -p 3000:4000 -v $(pwd):/app:ro -v /app/node_modules --name node-app node-app-image
```

## Example of Dockerfile

```docker
FROM node:16.13.2
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --only=production; \
      fi

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
```

## Example of .dockignore

```docker
node_modules
Dockerfile
.dockerignore
.git
.gitignore
docker-compose*
```

## Docker Compose comands

```bash
docker-compose up [FLAGS]
-d # does not attach the terminal to the container
-f # specifies a file

docker-compose down [FLAGS]
-v # will delete anonimous volumes
--build # will force build, because docker-compose does not verify image changes
-f # specifies a file
```

## docker-compose.yml example

```yaml
version: "3" # version of docker-compose
services: # we want to list all services here
  node-app: # name of the server
    build: . #from where we`re getting the Dockerfile
    ports: # all port redirects
      - "3000:3000"
    environment: # environment variables. note that this is being overridden by the other files
      - PORT=3000

  mongo: # second server
    image: mongo # in the case we`re going to use a built image from docker hub
    environment: # these are some envs that the mongo image needs
      - MONGO_INITDB_ROOT_USERNAME=mongousername
      - MONGO_INITDB_ROOT_PASSWORD=mongopassword
```

## How we handle two envs with docker-compose:

1. Create docker-compose.prod.yml and docker-compose.dev.yml
2. Create one Dockerfile and one docker-compose.yml. The main docker-compose file will handle the configs that are shared between envs, so we don`t need to duplicate them. Specials configs for each env will be in each .prod or .dev.

```yaml
#docker-compose.yml
version: "3" # version of docker-compose
services: # we want to list all services here
  node-app: # name of the server
    build: . #from where we`re getting the Dockerfile
    ports: # all port redirects
      - "3000:3000"
    environment: # environment variables. note that this is being overridden by the other files
      - PORT=3000

  mongo: # second server
    image: mongo # in the case we`re going to use a built image from docker hub
    environment: # these are some envs that the mongo image needs
      - MONGO_INITDB_ROOT_USERNAME=mongousername
      - MONGO_INITDB_ROOT_PASSWORD=mongopassword

#docker-compose.dev.yml
version: "3"
services:
  node-app:
    build:
      context: .
      args: # args for Dockerfile
        NODE_ENV: development
    volumes:
      - ./:/app:ro # the bind between mac and container folders
      - /app/node_modules # the hack for not overcopy node_modules
    environment: # this is like a .env
      - NODE_ENV=development
    command: npm run dev

#docker-compose.prod.yml
version: "3"
services:
  node-app:
    build:
      context: .
      args:
        NODE_ENV: production
    environment:
      - NODE_ENV=production
    command: node index.js

# Dockerfile
FROM node:16.13.2
WORKDIR /app
COPY package.json .

ARG NODE_ENV # getting from the args in docker-compose.yml
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --only=production; \
      fi

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
```

```bash
# COMMAND TO RUN ALL THIS
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d [CONTAINER NAMES]
# OR
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
-f # for specify the file
# THE ORDER MATTERS, the second file will override possible configs from the first file.
# replace up with down -v to stop everything
[CONTAINER NAMES] # if you want to start only some container with their dependencies
--no-deps # use it not to respect the dependencies
--build # redo the build
```

## Network

docker/docker-compose creates network so containers can communicate to one another.

```bash
docker network ls # to see all networks
```

The name of the service in the docker-compose file can base used as a dns. For example:

```bash
localhost:3000 or 123.0.0.20:3000
could be replaced with
mongo:3000
if mongo is the name of the service
```

### Order of execution in docker-compose:

We should use “depends_on” to tell docker-compose to execute the dependencies before the dependent. But it will not check to see if the execution has completed. It will only start the dependencies first.

## Mongo

```bash
# Access mongo cli
mongo -u "mongousername" -p "mongopassword"
# Access mongo cli directly
docker exec -it <mongo_container_name> mongo -u "<username>" -p "<password>"

show dbs
use mydb # changes (or creates) to database named "mydb"

# insert entry
db.<table_name>.insert({<json object>})
```
