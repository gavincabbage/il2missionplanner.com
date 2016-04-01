#!/bin/bash

# usage: local_deploy.sh <gitub_password>

env TRAVIS_REPO_SLUG=gavincabbage/il2missionplanner.com \
        TRAVIS_BRANCH=develop \
        TRAVIS_PULL_REQUEST=false \
        GH_TOKEN=gavincabbage:"${1}" \
        GH_REF=github.com/gavincabbage/il2missionplanner.com ./bin/deploy.sh
