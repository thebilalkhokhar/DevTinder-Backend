const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  },
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
