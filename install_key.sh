#!/bin/bash

wget --no-check-certificate https://raw.githubusercontent.com/hyunil-shin/nodejs-ssh-server/master/ssh-server-key.js
cat ssh-server.js
npm install fs crypto util shelljs ssh2 --save
ssh-keygen -t rsa -b 2048 -f ./host.key -q -N ""
