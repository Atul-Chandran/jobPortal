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
