"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper


async function sendEmail(address, html) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'denis.b651test@gmail.com',
           pass: 'denis6421'
       }
   });
  // create reusable transporter object using the default SMTP transport


  // send mail with defined transport object
 await transporter.sendMail({
    from: 'foo@example.com', // sender address
    to: address, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: html // html body
  });

}




module.exports  = sendEmail