const http = require('http');
const app = require('express')();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const employeeController = require('./Controller/employerDetails.controller').employerDetails;
const userController = require('./Controller/userDetails.controller').userDetails;
const userJobController = require('./Controller/userJobDetails.controller');
const otpController = require('./Controller/otpDetails.controller').otpDetails;
const jobController = require('./Controller/jobs.controller').jobDetails;

// Employer details
app.post('/saveEmployerDetails',employeeController.saveEmployerDetails);
app.post('/profileEmployerUpdate/id/:id',employeeController.updateProfile);

// User details
app.post('/saveUserDetails',userController.saveUserDetails);
app.post('/profileUserUpdate/id/:id',userController.updateProfile);

// Otp details
app.post('/createOtp',otpController.otpEmployerCreator);
app.post('/otpValidityCheck',otpController.otpValidityChecker);

// Job details
app.post('/addJob',jobController.saveJob);
app.post('/expiringJob',jobController.expiringJob);
app.post('/saveUserJobDetails',userJobController.saveUserJobDetails);

app.get('/fetchJobs/email/:email',jobController.fetchJobsPostedByEmployer)

const server = http.createServer(app);

server.listen(3000, "localhost", () => {
  console.log(`Server running at http://localhost:3000/`);
});