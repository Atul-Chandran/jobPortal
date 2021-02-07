const moment = require('moment');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const dbDetails = require('../Config/config');
const dbConfigDetails = dbDetails.configDetails.databaseDetails;
const collectionName = "users";
const userJobCollectionName = "user_job";

function saveUserDetails(request,response){
    requestMessage = request.body;
    response.setHeader('Content-Type', 'application/json');

    // If details in the request body has been passed
    if(requestMessage){

        userName = requestMessage.name;
        userEmail = requestMessage.email;
        latitude = requestMessage.latitude;
        longitude = requestMessage.longitude;
        location = requestMessage.location;
        otpVerified = 0;
        timeStamp = new Date;

        date = timeStamp.getDate();
        month = timeStamp.getMonth() + 1;
        year = timeStamp.getFullYear();
        hours = timeStamp.getHours();
        minutes = timeStamp.getMinutes();
        seconds = timeStamp.getSeconds();

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;

            var dbo = db.db(dbConfigDetails.dbName);
            dbo.collection(collectionName).insertOne(
                {
                    name: userName,
                    email: userEmail,
                    latitude: latitude,
                    longitude: longitude,
                    otpVerified: 0,
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
            message: "Invalid data format",   
        };

        response.json(noDataResponse);
    }
};

function updateProfile(request,response){
    const requestMessage = request.body;
    if(requestMessage){
        employerName = requestMessage.name;
        employerEmail = requestMessage.email;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                "_id": new ObjectId(request.params.id)
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
                var checkCondition = { "_id": new ObjectId(request.params.id) };
                let updatedValues = {'$set': {}};

                if(requestMessage.name){
                    updatedValues = {
                        $set: {
                            name: requestMessage.name,
                            modified: moment().format()
                        }
                    }
                }

                if(requestMessage.email){
                    updatedValues['$set']['email'] = requestMessage.email
                }

                dbo.collection(collectionName).updateOne(checkCondition, updatedValues, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                response.json({
                    message: "User details updated successfully",
                    data: {}
                });
              }
              else{
                response.json({
                    status: 400,
                    message: "Error while updating details", 
                });
              }

              db.close();
            });
        });
    }
}

function fetchLocationByEmail(request,response){
    const requestParameters = request.params;
    if(requestParameters){

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {email: requestParameters.email}
            dbo.collection(collectionName).find(
                query,
                {
                    projection: {
                        "_id": 0,
                        "latitude": 1,
                        "longitude": 1
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
                response.json({
                    status: 200,
                    message: "Location details fetched successfully",
                    data: result
                });
            });
        });
    }    
}

function fetchNameFromEmail(request,response){
    var email = request.params.email;
    MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbConfigDetails.dbName);
        var query = {
            "email": email
        };
        dbo.collection(collectionName).find(
            query,
            {
                projection: {
                    "_id": 1,
                    "name": 1
                }
            }
        ).toArray(async function(err, result) {
            response.json({
                status: 200,
                message: "User name fetched successfully",
                data: result
            })
        });
    });
}

function updateEmail(request,response){
    const requestMessage = request.body;
    if(requestMessage){
        currentEmail = requestMessage.currentEmail;
        newEmail = requestMessage.newEmail;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                "userEmail": currentEmail
            };
            dbo.collection(userJobCollectionName).find(
                query,
                {
                    projection: {
                        "_id": 1,
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if(result.length > 0){
                let updatedValues = {'$set': {
                        userEmail: newEmail,
                        modified: moment().format()
                    }
                };

                dbo.collection(userJobCollectionName).updateOne(query, updatedValues, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                response.json({
                    status: 200,
                    message: "User job details updated successfully",
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

exports.userDetails = {
    saveUserDetails,
    updateProfile,
    fetchLocationByEmail,
    fetchNameFromEmail,
    updateEmail
};