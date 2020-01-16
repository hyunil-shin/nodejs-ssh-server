# nodejs-ssh-server

https://github.com/mscdex/ssh2

## 주의
* authenticate 없이 로그인 가능

## how to use
as root
```
#!/bin/bash

mkdir /ssh-server
cd /ssh-server
wget https://nodejs.org/dist/latest-v10.x/node-v10.18.1-linux-x64.tar.xz
tar xf node-v10.18.1-linux-x64.tar.xz

curl https://raw.githubusercontent.com/hyunil-shin/nodejs-ssh-server/master/install.sh -o install.sh
export PATH=./node-v10.18.1-linux-x64/bin/:$PATH
chmod +x ./install.sh
./install.sh
node ./ssh-server.js
```

### 참고
* yum install 은 시간이 오래 걸려서 사용하지 않는다.
```
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install -y nodejs
```

* centos 7.5와 node-v13 은 호환되지 않는다.
```
wget https://nodejs.org/dist/v13.6.0/node-v13.6.0-linux-x64.tar.xz
```
