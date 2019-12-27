const nodemailer = require("nodemailer");
const { resolve } = require("path");
const nodemailerhbs = require("nodemailer-express-handlebars");
const exphbs = require("express-handlebars");
const mailConfig = require("../config/mail");

class Mail {
  constructor() {
    const { auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: auth.user ? auth : null
    });

    this.configureTemplate();
  }

  configureTemplate() {
    const viewPath = resolve(__dirname, "..", "views", "emails");

    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, "layouts"),
          partialsDir: resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs"
        }),
        viewPath,
        extName: ".hbs"
      })
    );
  }

  sendMail(message) {
    // return this.transporter.sendMail({ ...mailConfig.default, ...message });
    return this.transporter.sendMail({ ...message });
  }
}

module.exports = new Mail();
