#!/bin/bash

REPO="gavincabbage/il2missionplanner.com"
DEV_BRANCH="develop"
BETA_BRANCH="beta"
PROD_BRANCH="master"
SRC="src/"
DIST="dist/"
GIT_NAME="Gavin Cabbage"
GIT_EMAIL="gavincabbage@gmail.com"
GIT_COMMIT_MSG="deploying to gh-pages"
BASENAME=`basename "${0}"`

function preamble {
    set -o errexit
    set -o errtrace
    set -o nounset
    set -o pipefail
}

function log { # usage: log <message>
    echo "[${BASENAME}] ${1}"
}

function abort { # usage: abort <code> <message>
    log "${2}: exit ${1}"
    exit "${1}"
}

function deploy_dev {
    log "Starting dev deployment"
    cd "${DIST}"
    log "Initializing git repo"
    git init
    git config user.name "${GIT_NAME}"
    git config user.email "${GIT_EMAIL}"
    git add .
    git commit --quiet -m "${GIT_COMMIT_MSG}"
    log "Pushing to gh-pages"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
}

function main {

    bower install
    npm run lint && npm test

    # Do not deploy any PRs or code from other repos
    if [[ "${TRAVIS_REPO_SLUG}" != "${REPO}" ]] || \
       [[ "${TRAVIS_PULL_REQUEST}" != "false" ]] || \
       ([[ "${TRAVIS_BRANCH}" != "${PROD_BRANCH}" ]] && \
        [[ "${TRAVIS_BRANCH}" != "${BETA_BRANCH}" ]] && \
        [[ "${TRAVIS_BRANCH}" != "${DEV_BRANCH}" ]])
    then
        abort "0" "No deploy necessary - exiting happily"
    fi

    npm run dist

    # Deploy dev branch - beta and prod deployments are handled by travis
    if [[ "${TRAVIS_BRANCH}" == "${DEV_BRANCH}" ]]
    then
        log "Deploying branch:${BETA_BRANCH} to beta"
        deploy_dev
    fi

    abort "0" "Finished deployment successfully!"
}

preamble
main
