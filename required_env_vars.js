module.exports = [
  {
    var: 'CODESCREEN_SECRET',
    default: 'lolhai'
  },
  {
    var: 'PORT',
    default: 7000
  },
  {
    var: 'DOMAIN',
    default: 'localhost'
  },
  {
    var: 'NODEMAILER_SERVICE',
    default: 'Gmail'
  },
  {
    var: 'EMAIL_FROM',
    default: 'codescreen@'+process.env.DOMAIN
  }
];
