const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const configurationDetails = require('../Config/config').configDetails;
const dbConfigDetails = configurationDetails.databaseDetails;

const collectionName = "jobs";

function saveJob(request,response){
    requestMessage = request.body;

    // If details in the request body has been passed
    if(requestMessage){

        jobTitle = requestMessage.title;
        jobDescription = requestMessage.description;
        jobLocality = requestMessage.locality;
        jobExpireDate = requestMessage.expireDate;
        jobCreatedBy = requestMessage.createdBy,
        jobStatus = requestMessage.status

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;

            var dbo = db.db(dbConfigDetails.dbName);
            dbo.collection(collectionName).insertOne(
                {
                    title: jobTitle,
                    description: jobDescription,
                    locality: jobLocality,
                    expireDate: jobExpireDate,
                    createdBy: jobCreatedBy,
                    status: jobStatus,
                    created: moment().format(),
                    modified: moment().format()
                }, 
                function(err, res) {
                if (err) throw err;
                else{
                    response.json({
                        status: 200,
                        message: "Job succesfully added",  
                    });
                }
                db.close();
            });
        });
    }
    else{
        noDataResponse = {
            status: 400,
            message: "Invalid job details",   
        };

        response.json(noDataResponse);
    }
}

function fetchJobsPostedByEmployer(request,response){
    MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbConfigDetails.dbName);
        var query = {
            createdBy: request.params.email
        }
        dbo.collection(collectionName).find(
            query,
            {
                projection: {
                    "_id": 1,
                    "title": 1,
                    "description": 1,
                    "status": 1
                }
            }
        ).toArray(async function(err, result) {
            response.json({
                message: "Jobs fetched successfully",
                data: result
            });
        });
    });
}

function expiringJob(request,response){
    const requestMessage = request.body;
    if(requestMessage){
        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                "_id": new ObjectId(requestMessage.jobId),
                "createdBy": requestMessage.employerEmail,
                "status": 1
            }
            dbo.collection(collectionName).find(
                query,
                {
                    projection: {
                        "_id": 1
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length > 0){
                var checkCondition = { email: request.body.email };
                var updatedValues = {
                    $set: {
                        status: 2,
                        modified: moment().format()
                    }
                };
                dbo.collection(collectionName).updateOne(checkCondition, updatedValues, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                response.json({
                    message: "Status changed successfully",
                    data: {}
                });
              }
              else{
                response.json({
                    message: "Unable to change status of job",
                    data: {}
                });
              }

              db.close();
            });
        });
    }
}

exports.jobDetails = {
    saveJob,
    fetchJobsPostedByEmployer,
    expiringJob
}