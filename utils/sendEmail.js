const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "Geooooo Bilal",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is text format",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Han bhai Chal gya SES Feature",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "bilalkhokhar228@gmail.com",
    "bilal@bizzy.store"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
