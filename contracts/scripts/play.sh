#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050";

export WORLD_ADDRESS=$(cat ./manifest.json | jq -r '.world.address')

echo $WORLD_ADDRESS

sozo execute --world $WORLD_ADDRESS dojo_starter-rugged play_game --wait
