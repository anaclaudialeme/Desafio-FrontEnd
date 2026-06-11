#!/bin/bash
# Lint and format script

eslint src --fix
prettier --write src
