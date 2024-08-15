#!/bin/bash

docker buildx build -t onionkim/redditlike-back .

# docker buildx build --platform=amd64,arm64 -t onionkim/redditlike-back:${TAG} . --push