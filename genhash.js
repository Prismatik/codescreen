var crypto = require('crypto');

var createHash = function(secret) {
	var cipher = crypto.createCipher('blowfish', secret);
	return(cipher.final('hex'));
};

console.log(process.argv[2], process.argv[3]);
console.log(createHash(process.argv[2]+process.argv[3]));
