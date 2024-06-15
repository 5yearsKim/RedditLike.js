#!/bin/bash

docker run --env-file ./._env.local \
  -d \
  -p 3010:3010 \
  --name redditlike-front \
  --add-host=host.docker.internal:host-gateway \
  onionkim/redditlike-front