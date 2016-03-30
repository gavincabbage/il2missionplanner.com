#!/bin/bash

set -e

if [ "${TRAVIS_REPO_SLUG}" != "gavincabbage/bos-mission-planner" ] || \
   [ "${TRAVIS_PULL_REQUEST}" != "false" ] || \
   [ "${TRAVIS_BRANCH}" != "develop" ]
then
    echo "Not develop, aborting beta deploy happily"

    if [ "${TRAVIS_BRANCH}" == "master" ]
    then
        echo "Moving static to dist for master deploy"
        cp -R static/ dist/
    fi

    exit 0
fi

echo "New code merged to develop, deploying to gh-pages"
pwd
bower install
cd ..
pwd
cp -R bos-mission-planner/static/ dist/
echo "Copied successfully"

cd dist
git init
git config user.name "Gavin Cabbage"
git config user.email "gavincabbage@gmail.com"
git add .
git commit -m "deploying bos-mission-planner to gh-pages"
echo "Committed successfully"

echo "Finished configuring repo, pushing..."

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

echo "Deployed to gh-pages successfully!"
