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
        jobLatitude = requestMessage.latitude;
        jobLongitude = requestMessage.longitude;
        jobLocality = requestMessage.locality;
        jobExpireDate = requestMessage.expireDate;
        jobCreatedBy = requestMessage.createdBy,

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;

            var dbo = db.db(dbConfigDetails.dbName);
            dbo.collection(collectionName).insertOne(
                {
                    title: jobTitle,
                    description: jobDescription,
                    latitude: jobLatitude,
                    longitude: jobLongitude,
                    expireDate: jobExpireDate,
                    createdBy: jobCreatedBy,
                    status: 1,
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
            createdBy: request.params.email,
            status: 1
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
                status: 200,
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
                var updatedValues = {
                    $set: {
                        status: 5,
                        modified: moment().format()
                    }
                };
                dbo.collection(collectionName).updateOne(query, updatedValues, function(err, res) {
                    if (err) throw err;
                    response.json({
                        status: 200,
                        message: "Status changed successfully",
                    });
                    db.close();
                });
              }
              else{
                response.json({
                    status: 400,
                    message: "Unable to change status of job",
                    data: {}
                });
              }

              db.close();
            });
        });
    }
}

function fetchNearbyJobs(request,response){
    const requestParameters = request.params;
    if(requestParameters){
        const minLatitudeLimit = parseInt(requestParameters.latitude) - 2;
        const maxLatitudeLimit = parseInt(requestParameters.latitude) + 2;

        const minLongitudeLimit = parseInt(requestParameters.longitude) - 2;
        const maxLongitudeLimit = parseInt(requestParameters.longitude) + 2;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                $and : [
                    {
                        $or: [ 
                            {
                                latitude: { $lte: maxLatitudeLimit } 
                            }, 
                            { 
                                longitude: { $lte: maxLongitudeLimit } 
                            } 
                        ] 
                    },
                    {
                        $or: [ 
                            {
                                latitude: { $gte: minLatitudeLimit } 
                            }, 
                            { 
                                longitude: { $gte: minLongitudeLimit } 
                            } 
                        ]
                    }
                ]
            }
            dbo.collection(collectionName).find(
                query,
                {
                    projection: {
                        "_id": 1,
                        "title": 1,
                        "description": 1,
                        "expireDate": 1,
                        "createdBy": 1,
                        "status": 1
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
                response.json({
                    status: 200,
                    message: "Nearby jobs fetched successfully",
                    data: result
                });
            });
        });
    }
}

exports.jobDetails = {
    saveJob,
    fetchJobsPostedByEmployer,
    expiringJob,
    fetchNearbyJobs
}