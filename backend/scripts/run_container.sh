#!/bin/bash

docker run --env-file ./.env \
  -d \
  -p 3030:3030 \
  -p 3031:3031\
  --name redditlike-back \
  --add-host=host.docker.internal:host-gateway \
  onionkim/redditlike-back