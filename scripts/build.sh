#!/bin/bash
# Build script for all environments

if [ "$NODE_ENV" = "production" ]; then
  next build
else
  next build
fi
