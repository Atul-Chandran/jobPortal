var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '<your-email-id>',
    pass: '<your-email-password>'
  }
});
function sendMail(emailId, emailMessage){

    var mailOptions = {
        from: '<your-email-id>',
        to: emailId,
        subject: 'Job Portal Login',
        text: emailMessage
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
      });
}

exports.sendMail = sendMail
