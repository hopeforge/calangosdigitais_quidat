require('dotenv').config();

module.exports = {
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  default: {
    from: 'Equipe GRAACC <noreply.graacc@graacc.org.br>'
  }
};
