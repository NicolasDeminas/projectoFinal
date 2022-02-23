const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const TEST_MAIL = process.env.MAIL;

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: "xrymbqrzakbiqpwd",
  },
});

module.exports = transporter;
