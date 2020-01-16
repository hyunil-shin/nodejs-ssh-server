#!/bin/bash


npm install fs crypto util shelljs ssh2 --save
ssh-keygen -t rsa -b 2048 -f ./host.key
