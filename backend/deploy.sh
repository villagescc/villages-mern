#!/bin/bash

# Change to the project directory
cd /home/mike/villages-mern-git/backend

rm -R node_modules
source ~/.nvm/nvm.sh
nvm use 14.15.3
npm i

pm2 stop index
pm2 delete index 2>/dev/null || true
pm2 start index.js