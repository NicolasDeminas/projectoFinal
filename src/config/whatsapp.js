const twilio = require("twilio");

const accountSID = "ACc212e539d6e34724834e1e5b8456bacf";
const authToken = "d36fa8281efbd49b4f938d7e835eb775";

const client = twilio(accountSID, authToken);

module.exports = client;
