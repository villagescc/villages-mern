#!/bin/bash

# Change to the project directory
cd /home/mike/villages-mern-git/villages-mern

mkdir test

# Fetch the latest changes from the remote repository
git fetch origin

# Reset the working directory to the latest commit on the release branch
git reset --hard origin/release-branch

cd frontend

npm i

npm run build