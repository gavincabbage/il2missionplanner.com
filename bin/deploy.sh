#!/bin/bash

REPO="gavincabbage/bos-mission-planner"
BETA_BRANCH="develop"
PROD_BRANCH="master"
SRC="static/"
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

function build {
    log "Starting build"
    bower install
    npm run-script lint
    log "Build successful"
}

function deploy_prod {
    log "Starting prod deployment"
    cp -R "${SRC}" "${DIST}"
    log "Ready for automatic deployment to S3"
}

function deploy_beta {
    log "Starting beta deployment"
    cd ..
    cp -R "bos-mission-planner/${SRC}" "${DIST}"
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

    build

    # Do not deploy any PRs or code from other repos
    if [[ "${TRAVIS_REPO_SLUG}" != "${REPO}" ]] || \
       [[ "${TRAVIS_PULL_REQUEST}" != "false" ]] || \
       ([[ "${TRAVIS_BRANCH}" != "${PROD_BRANCH}" ]] && \
        [[ "${TRAVIS_BRANCH}" != "${BETA_BRANCH}" ]])
    then
        abort "0" "No deploy necessary - exiting happily"
    fi

    # Deploy depending on branch
    if [[ "${TRAVIS_BRANCH}" == "${PROD_BRANCH}" ]]
    then
        log "Deploying branch:${PROD_BRANCH} to production"
        deploy_prod
    elif [[ "${TRAVIS_BRANCH}" == "${BETA_BRANCH}" ]]
    then
        log "Deploying branch:${BETA_BRANCH} to beta"
        deploy_beta
    fi

    abort "0" "Finished deployment successfully!"
}

preamble
main
