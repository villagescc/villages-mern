#!/bin/bash

# Change to the project directory
cd /home/mike/villages-mern-git/backend

npm i --legacy-peer-deps

pm2 stop index
pm2 delete index 2>/dev/null || true
pm2 start index