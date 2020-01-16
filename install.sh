#!/bin/bash

curl https://raw.githubusercontent.com/hyunil-shin/nodejs-ssh-server/master/ssh-server.js -o ssh-server.js
npm install fs crypto util shelljs ssh2 --save
ssh-keygen -t rsa -b 2048 -f ./host.key
