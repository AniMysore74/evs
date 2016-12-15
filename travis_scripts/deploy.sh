#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

rm -rf public
mkdir public

# config
git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

# build (CHANGE THIS)

# TODO: improve this please :P
cp index.html public/index.html
cp .travis.yml public/.travis.yml
cp README.md public/README.md
cp -R travis_scripts/ public/travis_scripts/
cp -R assets/ public/assets/
cp -R bower_components/ public/bower_components/

# deploy
cd public

git init
git add --all
git commit -a -m "Deploy to Github Pages"
git push --force --verbose "https://${GITHUB_TOKEN}@$github.com/${GITHUB_REPO}.git" master:gh-pages > /dev/null 2>&1
