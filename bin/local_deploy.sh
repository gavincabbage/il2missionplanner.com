#!/bin/bash

# usage: local_deploy.sh <gitub_password>

env TRAVIS_REPO_SLUG=gavincabbage/bos-mission-planner \
        TRAVIS_BRANCH=develop \
        TRAVIS_PULL_REQUEST=false \
        GH_TOKEN=gavincabbage:"${1}" \
        GH_REF=github.com/gavincabbage/bos-mission-planner ./bin/deploy.sh
