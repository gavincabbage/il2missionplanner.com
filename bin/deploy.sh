#!/bin/bash

set -e

if [ "${TRAVIS_REPO_SLUG}" != "gavincabbage/bos-mission-planner" ||
     "${TRAVIS_PULL_REQUEST}" != "false" ||
     "${TRAVIS_BRANCH}" != "master" ]
then
    echo "Aborting build"
    exit 1
fi

cd $HOME

echo 123abczyx
pwd
ls

exit 0

# rm -rf dist
# mkdir dist
#
# # complile step
# # will probably need to do bower install here
# cp -R static/* dist/
#
# cd dist
# git init
#
# git config user.name "Travis CI"
# git config user.email "gavincabbage@gmail.com"
#
# git add .
# git commit -m "deploying bos-mission-planner to gh-pages"
#
# git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
