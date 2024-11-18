#!/bin/bash

COMPOSE="/bin/docker-compose --ansi never"
DOCKER="/bin/docker"

cd /root/kiezbot/
$COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP nginx
$DOCKER system prune -af