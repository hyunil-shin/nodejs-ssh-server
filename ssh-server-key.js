var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;
var shell = require('shelljs');

var ssh2 = require('ssh2');
var utils = ssh2.utils;

var sshPort = process.argv[2]

var allowedUser = Buffer.from(process.argv[3]);
var allowedPubKey = utils.parseKey(fs.readFileSync(process.argv[4]));


new ssh2.Server({
  hostKeys: [fs.readFileSync('host.key')]
}, function(client) {
  console.log('Client connected!');

  client.on('authentication', function(ctx) {
    
    var user = Buffer.from(ctx.username);
    if (user.length !== allowedUser.length
        || !crypto.timingSafeEqual(user, allowedUser)) {
      console.log("rejected")
      return ctx.reject();
    }

  if (ctx.method == "publickey") {
    //console.log(ctx)
    var allowedPubSSHKey = allowedPubKey.getPublicSSH();
    if (ctx.key.algo !== allowedPubKey.type
            || ctx.key.data.length !== allowedPubSSHKey.length
            || !crypto.timingSafeEqual(ctx.key.data, allowedPubSSHKey)
            || (ctx.signature && allowedPubKey.verify(ctx.blob, ctx.signature) !== true)) {
          return ctx.reject();
    }
  }else {
    // workaround
    // - java ssh client의 host key verification 시 여기에 도달하는 것 같다.
    // - ctx.reject() 로는 안되고 'publickey'를 추가하니 잘 된다.
    return ctx.reject(["publickey"]);
  }


    ctx.accept();
  }).on('ready', function() {
    console.log('Client authenticated!');

    client.on('session', function(accept, reject) {
      var session = accept();
      session.once('exec', function(accept, reject, info) {
        console.log('Client wants to execute: ' + inspect(info.command));
        var stream = accept();
        shell.exec(info.command, function(code, stdout, stderr) {          
          stream.write(stdout);
          stream.stderr.write(stderr);
          stream.exit(0);
          stream.end();
        })
      });
    });
  }).on('error', function() {
    // 에러 처리하지 않으면 프로세스가 죽는다.
    console.log('error');
  }).on('end', function() {
    console.log('Client disconnected');
  });
}).listen(sshPort, '0.0.0.0', function() {
  console.log('Listening on port ' + this.address().port);
});
