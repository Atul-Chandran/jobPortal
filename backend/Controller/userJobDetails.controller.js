const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const ObjectId = require('mongodb').ObjectID;

const dbDetails = require('../Config/config');
const dbConfigDetails = dbDetails.configDetails.databaseDetails;
const collectionName = "user_job";

function saveUserJobDetails(request,response){
    requestMessage = request.body;

    // If details in the request body has been passed
    if(requestMessage){

        userEmail = requestMessage.userEmail;
        jobID = requestMessage.jobId;
        jobTitle = requestMessage.jobTitle;
        jobAppliedOn = requestMessage.appliedOn;
        jobStatus = requestMessage.status;
        resume = requestMessage.resume;
        timeStamp = new Date;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;

            var dbo = db.db(dbConfigDetails.dbName);
            dbo.collection(collectionName).insertOne(
                {
                    userEmail: userEmail,
                    jobID: jobID,
                    jobTitle: jobTitle,
                    jobAppliedOn: jobAppliedOn,
                    resume: resume,
                    jobStatus: jobStatus,
                    created: moment().format(),
                    modified: moment().format()
                }, 
                function(err, res) {
                if (err) throw err;
                else{
                    response.json({
                        status: 200,
                        message: "Data succesfully added",  
                    })
                }
                db.close();
            });
        });
    }
    else{
        noDataResponse = {
            status: 400,
            message: "Tag cannot be empty",   
        };

        response.json(noDataResponse);
    }
};

function getJobsAppliedByEmail(request,response){
    const requestParameters = request.query;
    var query = {};
    MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbConfigDetails.dbName);
        if(requestParameters.email){
            query = {
                "userEmail": requestParameters.email
            };
        }
        dbo.collection(collectionName).find(
            query,
            {
                projection: {
                    "_id": 1,
                    "userEmail": 1,
                    "resume": 1,
                    "jobTitle": 1,
                    "jobAppliedOn": 1,
                    "jobStatus": 1
                }
            }
        ).toArray(async function(err, result) {
            response.json({
                status:200,
                message:"Applied jobs fetched successfully",
                data: result
            })
        });
    });
}

function updateJobStatus(request,response){
    const requestMessage = request.body;
    if(requestMessage){
        jobId = requestMessage.jobId;
        jobStatus = requestMessage.jobStatus;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                "_id": new ObjectId(jobId)
            };
            dbo.collection(collectionName).find(
                query,
                {
                    projection: {
                        "_id": 1,
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length > 0){
                var checkCondition = { "_id": new ObjectId(jobId) };
                let updatedValues = {
                    $set: {
                        jobStatus: jobStatus,
                        modified: moment().format()
                    }
                }

                dbo.collection(collectionName).updateOne(checkCondition, updatedValues, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                response.json({
                    status: 200,
                    message: "Status updated successfully",
                    data: {}
                });
              }
              else{
                response.json({
                    status: 400,
                    message: "Otp given is invalid.",
                    data: {
                        isValid: 0
                    }
                });
              }

              db.close();
            });
        });
    }
}


exports.userJobDetails = {
    saveUserJobDetails,
    getJobsAppliedByEmail,
    updateJobStatus
};