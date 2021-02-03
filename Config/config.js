var nodemailer = require('nodemailer');

const environmentDetails = {
    hostName: 'localhost',
    port: 3000
}

const databaseDetails = {
    dbName: "jobPortal",
    mongoDBUrl : "mongodb://localhost:27017/"
}

const otpExpiryTime = 20;

const mailDetails = {
    transporter : nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'maravillosoaccion@gmail.com',
          pass: 'impresionantecelebraciones'
        }
    })
}

exports.configDetails = {
    environmentDetails: environmentDetails,
    databaseDetails: databaseDetails,
    otpExpiryTime,
    mailDetails
}