// Generated by CoffeeScript 1.9.3
var apps, comparator, del, exec, fs, log, request;

request = require('request-json');

log = require('printit')({
  prefix: 'market'
});

exec = require('child_process').exec;

fs = require('fs');

del = require('del');

apps = [];

comparator = function(a, b) {
  if (a.comment === 'official application' && b.comment !== 'official application') {
    return -1;
  } else if (a.comment !== 'official application' && b.comment === 'official application') {
    return 1;
  } else if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else {
    return 0;
  }
};

module.exports.download = function(callback) {
  var branch, command, url;
  if (apps.length > 0) {
    return callback(null, apps);
  } else {
    if (process.env.MARKET != null) {
      url = "https://gitlab.cozycloud.cc/zoe/cozy-registry.git";
      branch = process.env.MARKET;
    } else {
      url = "https://github.com/cozy-labs/cozy-registry.git";
      branch = "master";
    }
    command = ("git clone " + url + " market && ") + "cd market && " + ("git checkout " + branch);
    return del('./market', function(err) {
      if (err != null) {
        log.error("[Error] delete market : " + err);
      }
      return exec(command, {}, function(err, stdout, stderr) {
        if (err != null) {
          log.error("[Error] Clone market: " + err);
        }
        if (err != null) {
          return callback(err);
        }
        return fs.readdir('./market/apps', function(err, files) {
          var file, i, len;
          if (err != null) {
            log.error("[Error] Read market: " + err);
          }
          if (err != null) {
            return callback(err);
          }
          for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            try {
              apps.push(require("../../../market/apps/" + file));
            } catch (_error) {
              apps.push(require("../../market/apps/" + file));
            }
          }
          apps.sort(comparator);
          return callback(err, apps);
        });
      });
    });
  }
};

module.exports.getApp = function(app) {
  try {
    return [null, require("../../../market/apps/" + app)];
  } catch (_error) {
    try {
      return [null, require("../../market/apps/" + app)];
    } catch (_error) {
      return ['not found', null];
    }
  }
};
