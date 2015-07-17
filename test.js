var test = require('tape');
var tapSpec = require('tap-spec');
var request = require('request');

require('child_process').exec('node index.js');

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout)

test('genCreds', function(t) {
  t.plan(5);
  request('http://localhost:7000/genCreds', function(err, res, body) {
    t.equal(res.statusCode, 401, 'Should demand credentials');
  });
  request('http://foo:bar@localhost:7000/genCreds', function(err, res, body) {
    t.equal(res.statusCode, 403, 'Should reject bad credentials');
  });
  request('http://admin:9fcef447f848fda1@localhost:7000/genCreds', function(err, res, body) {
    t.equal(res.statusCode, 403, 'Should reject invalid admin credentials');
  });
  request('http://foo:9fcef447f848fda1@localhost:7000/genCreds', function(err, res, body) {
    t.equal(res.statusCode, 404, 'Should not respond to valid non-admin credentials');
  });
  request('http://admin:b84f06c31dda856f@localhost:7000/genCreds', function(err, res, body) {
    t.equal(res.statusCode, 200, 'Should accept valid admin credentials');
  });
});
