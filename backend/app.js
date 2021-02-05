const http = require('http');
const express = require('express');
const app = require('express')();
var multer = require('multer')
var cors = require('cors');
const path = require("path") 

let bodyParser = require('body-parser');


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './resume');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});

var upload = multer({ storage: storage }).single('file')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const employeeController = require('./Controller/employerDetails.controller').employerDetails;
const userController = require('./Controller/userDetails.controller').userDetails;
const userJobController = require('./Controller/userJobDetails.controller').userJobDetails;
const otpController = require('./Controller/otpDetails.controller').otpDetails;
const jobController = require('./Controller/jobs.controller').jobDetails;

// Employer details
app.post('/saveEmployerDetails',employeeController.saveEmployerDetails);
app.post('/profileEmployerUpdate/id/:id',employeeController.updateProfile);

// User details
app.post('/saveUserDetails',userController.saveUserDetails);
app.post('/profileUserUpdate/id/:id',userController.updateProfile);
app.post('/updateEmailJobs',userController.updateEmail);

// Otp details
app.post('/createOtp',otpController.otpEmployerCreator);
app.post('/createEmployeeOtp',otpController.otpEmployeeCreator);
app.post('/otpValidityCheck',otpController.otpValidityChecker);

// Job details
app.post('/addJob',jobController.saveJob);
app.post('/expiringJob',jobController.expiringJob);
app.post('/saveUserJobDetails',userJobController.saveUserJobDetails);

app.post('/updateStatus',userJobController.updateJobStatus);

app.post('/upload',function(req, res) {
     
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)

  })

});

app.get('/fetchJobs/email/:email',jobController.fetchJobsPostedByEmployer)
app.get('/fetchNearbyJobs/latitude/:latitude/longitude/:longitude',jobController.fetchNearbyJobs);
app.get('/fetchLocation/email/:email',userController.fetchLocationByEmail);
app.get('/fetchAppliedJobs',userJobController.getJobsAppliedByEmail);
app.get('/fetchEmployerName/email/:email',employeeController.fetchNameFromEmail);
app.get('/fetchUserName/email/:email',userController.fetchNameFromEmail);

const server = http.createServer(app);

server.listen(3002, "localhost", () => {
  console.log(`Server running at http://localhost:3002/`);
});