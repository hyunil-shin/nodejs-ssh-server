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
    return ctx.reject();
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
  }).on('end', function() {
    console.log('Client disconnected');
  });
}).listen(sshPort, '0.0.0.0', function() {
  console.log('Listening on port ' + this.address().port);
});
