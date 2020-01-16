# nodejs-ssh-server

https://github.com/mscdex/ssh2


## how to use
as root
```
#!/bin/bash

curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install -y nodejs
mkdir /ssh-server
cd /ssh-server
curl https://raw.githubusercontent.com/hyunil-shin/nodejs-ssh-server/master/install.sh -o install.sh
chmod +x ./install.sh
node ./ssh-server.js
```
