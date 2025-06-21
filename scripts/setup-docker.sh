#!/usr/bin/env bash
# Setup helper for volto-forest-policy development
set -e

PLONE_VERSION=${PLONE_VERSION:-6}
VOLTO_VERSION=${VOLTO_VERSION:-17}
ADDON_PATH=${ADDON_PATH:-volto-forest-policy}
ADDON_NAME=${ADDON_NAME:-@eeacms/volto-forest-policy}

if command -v "docker" >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    echo "Using docker compose to build containers"
    PLONE_VERSION=$PLONE_VERSION VOLTO_VERSION=$VOLTO_VERSION \
      ADDON_NAME=$ADDON_NAME ADDON_PATH=$ADDON_PATH \
      docker compose pull
    PLONE_VERSION=$PLONE_VERSION VOLTO_VERSION=$VOLTO_VERSION \
      ADDON_NAME=$ADDON_NAME ADDON_PATH=$ADDON_PATH \
      docker compose build
    echo
    echo "Run 'docker compose up' to start the stack"
  else
    echo "docker compose not available. Falling back to plain docker commands"
    docker pull eeacms/plone-backend:$PLONE_VERSION
    docker pull eeacms/frontend-builder:$VOLTO_VERSION
    docker build -t volto-forest-policy-frontend \
      --build-arg ADDON_NAME=$ADDON_NAME \
      --build-arg ADDON_PATH=$ADDON_PATH \
      --build-arg VOLTO_VERSION=$VOLTO_VERSION .
    cat <<EOM
To start backend run:
  docker run --rm -it -p 8080:8080 -e SITE=Plone eeacms/plone-backend:$PLONE_VERSION

To start frontend run:
  docker run --rm -it -p 3000:3000 -p 3001:3001 \
    -v "$(pwd)":/app/src/addons/$ADDON_PATH \
    -e RAZZLE_INTERNAL_API_PATH=http://localhost:8080/Plone \
    -e RAZZLE_DEV_PROXY_API_PATH=http://localhost:8080/Plone \
    volto-forest-policy-frontend
EOM
  fi
else
  echo "Docker is required but was not found." >&2
  exit 1
fi
