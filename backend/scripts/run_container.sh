#!/bin/bash

docker run --env-file ./.env \
  -d \
  -p 5000:5000 \
  -p 5100:5100 \
  -p 5500:5500 \
  --name nonimos-back \
  --add-host=host.docker.internal:host-gateway \
  onionkim/nonimos-back