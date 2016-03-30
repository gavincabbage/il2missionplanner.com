#!/bin/bash

set -e

if [ "${TRAVIS_REPO_SLUG}" != "gavincabbage/bos-mission-planner" ] || \
   [ "${TRAVIS_PULL_REQUEST}" != "false" ] || \
   [ "${TRAVIS_BRANCH}" != "develop" ]
then
    echo "Not develop, aborting deploy happily"
    exit 0

    if [ "${TRAVIS_BRANCH}" == "master" ]
    then
        cp -R static/ dist/
    fi
fi

echo "New code merged to master, deploying to gh-pages"
pwd
bower install
cd ..
pwd
cp -R bos-mission-planner/static/ dist/

cd dist
git init
git config user.name "Gavin Cabbage"
git config user.email "gavincabbage@gmail.com"
git add .
git commit -m "deploying bos-mission-planner to gh-pages"

echo "Finished configuring repo, pushing..."

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

echo "Deployed to gh-pages successfully!"
