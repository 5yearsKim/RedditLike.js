#!/bin/bash

echo 'Updating database schema..'
pnpm mlatest

echo 'running pm2 process..'
pm2-runtime start scripts/ecosystem.config.js