#!/bin/bash

docker buildx build -t onionkim/redditlike-front .

# docker buildx build --platform=amd64,arm64 -t onionkim/redditlike-front:${TAG} . --push