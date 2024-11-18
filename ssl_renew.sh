#!/bin/bash

COMPOSE="/bin/docker-compose --ansi never"
DOCKER="/bin/docker"

cd /root/kiezbot/
$COMPOSE run certbot renew --dry-run && $COMPOSE kill -s SIGHUP webserver
$DOCKER system prune -af