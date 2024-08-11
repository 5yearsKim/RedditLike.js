#!/bin/bash

docker run\
  -d \
  -p 3010:3010 \
  --name redditlike-front \
  --add-host=host.docker.internal:host-gateway \
  onionkim/redditlike-front