require('required_env')(require('./required_env_vars'));

var pushover = require('pushover');
var repos = pushover('./repos');
var http = require('http');
var url = require('url');
var _util = require('./util');

var server = http.createServer(function (req, res) {

  // Demand http basic auth
  if (!req.headers.authorization) {
    res.setHeader('WWW-Authenticate', 'Basic realm="PrismatikCodescreen"');
    res.statusCode = 401;
    return res.end();
  };

  var auth = _util.parseBasic(req.headers.authorization);

  // Ensure credentials are valid
  if (_util.createHash(process.env.CODESCREEN_SECRET+auth.username) !== auth.pass) {
    res.statusCode = 403;
    return res.end();
  }

  // Rewrite all pushes so they go to the username's repo, not the original
  if (req.url.match(/git-receive-pack/)) {
    var orig = req.url.split('/')[1];
    req.url = req.url.replace(orig, auth.username);
  };
  repos.handle(req, res);
});

repos.on('fetch', function (fetch) {
  var auth = _util.parseBasic(fetch.headers.authorization);
  _util.log('fetch', auth.username, fetch.repo);
  fetch.accept();
});

repos.on('push', function (push) {
  var auth = _util.parseBasic(push.headers.authorization);
  _util.log('push', auth.username, push.repo);
  push.accept();
});

server.listen(process.env.PORT);
