var nodemailer = require('nodemailer');
var crypto = require('crypto');

var parseBasic = function(header) {
  // Split req.headers.authorization into component parts
  var authArray = new Buffer(header.split(' ')[1], 'base64').toString('ascii').split(':');
  return {
    username: authArray[0],
    pass: authArray[1]
  }
};

var createHash = function(secret) {
  var cipher = crypto.createCipher('blowfish', secret);
  return(cipher.final('hex'));
};

var createMessage = function(action, user, repo) {
  var messages = {
    fetch: 'has fetched the repo named ' + repo,
    push: 'has pushed a repo named ' + repo + '. You can get it at: https://admin:'+createHash(process.env.CODESCREEN_SECRET+'admin')+'@'+process.env.DOMAIN+':'+process.env.PORT+'/'+repo
  };

  return user+' '+messages[action]
};

if (process.env.EMAIL_USER) {
  console.log('Email alert function is on');
  var transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

var log = function(action, user, repo) {
  util_log(createMessage.apply(this, arguments));
};

var util_log = function(message) {
  var result = [new Date().toISOString(), '->', message].join('');

  console.log(result);

  if (transporter) {
    var mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Codescreen alert',
      text: result
    };
    transporter.sendMail(mailOptions, function(error){
      if(error) return console.error('Email error', error);
    });
  }
}

module.exports = {
  parseBasic: parseBasic,
  createHash: createHash,
  log: log
}

