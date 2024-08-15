#!/bin/sh


# Run database migrations
echo "Running migrations..."
knex --knexfile ./dist/knexfile.js migrate:latest


# Start the application
echo "Starting the application..."
node ./dist/main.js &
node ./dist/socket_main.js &

# Wait for all background processes to finish
wait
