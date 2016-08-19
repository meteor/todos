"use strict";
var fs = require('fs');
var exec = require('child_process').exec;
var processes = [];

/**
 * Helper function to start a process and listen for
 * specific stdout console output and invoke a callback.
 * This is used in this case to listen when the normal dev
 * app started its mongoDb, so we can reuse that for the test app.
 */
module.exports = {
  start: function(opts, callback) {
    var proc = exec(
       opts.command,
       opts.options
    );
    if (opts.waitForMessage) {
      proc.stdout.on('data', function waitForMessage(data) {
        if (data.toString().match(opts.waitForMessage)) {
          if (callback) {
            callback();
          }
        }
      });
    }
    if (!opts.silent) {
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
    }
    if (opts.logFile) {
      var logStream = fs.createWriteStream(opts.logFile, {flags: 'a'});
      proc.stdout.pipe(logStream);
      proc.stderr.pipe(logStream);
    }
    proc.on('close', function(code) {
      console.log(opts.name, 'exited with code ' + code);
      for (var i = 0; i < processes.length; i += 1) {
        processes[i].kill();
      }
      process.exit(code);
    });
    processes.push(proc);
  }
};