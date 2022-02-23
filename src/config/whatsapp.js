const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

const accountSID = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const client = twilio(accountSID, authToken);

module.exports = client;
