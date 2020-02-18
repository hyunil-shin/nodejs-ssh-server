var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;
var shell = require('shelljs');

var ssh2 = require('ssh2');
var utils = ssh2.utils;

var allowedUser = Buffer.from('foo');
var allowedPassword = Buffer.from('bar');
var allowedPubKey = "foo.bar"
var sshPort = process.argv[2]

new ssh2.Server({
  hostKeys: [fs.readFileSync('host.key')]
}, function(client) {
  console.log('Client connected!');

  client.on('authentication', function(ctx) {
    // no need to authenticate
    ctx.accept();
    return
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
