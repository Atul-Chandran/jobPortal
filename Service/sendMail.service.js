var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'maravillosoaccion@gmail.com',
    pass: 'impresionantecelebraciones'
  }
});
function sendMail(emailId, emailMessage){

    var mailOptions = {
        from: 'maravillosoaccion@gmail.com',
        to: emailId,
        subject: 'Sending Email using Node.js',
        text: emailMessage
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

exports.sendMail = sendMail
