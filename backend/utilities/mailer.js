const sgMail = require("@sendgrid/mail");
require('dotenv').config();

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (toEmail, subject, text, html) => {
  const msg = {
    to: toEmail,
    from: 'your@example.com', // your verified sender email address
    subject,
    text,
    html,
  };

  return sgMail.send(msg);
};

module.exports = { sendEmail };
