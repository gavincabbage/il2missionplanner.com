#!/bin/bash

set -e

if [ "${TRAVIS_REPO_SLUG}" != "gavincabbage/bos-mission-planner" ] || \
   [ "${TRAVIS_PULL_REQUEST}" != "false" ] || \
   [ "${TRAVIS_BRANCH}" != "master" ]
then
    echo "Not master, aborting deploy happily"
    exit 0
fi

echo 456prevhereintherepo
pwd

cd ..

echo 123abczyx
pwd
ls
#
# exit 0

# rm -rf dist
# mkdir dist

# complile step
# will probably need to do bower install here
cp -R bos-mission-planner/static/ dist/

cd dist
git init

echo HERE A

git config user.name "Travis CI"
git config user.email "gavincabbage@gmail.com"

echo HERE B

git add .
git commit -m "deploying bos-mission-planner to gh-pages"

echo HERE C

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

echo HERE D
