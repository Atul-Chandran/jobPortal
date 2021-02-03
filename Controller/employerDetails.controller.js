const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const ObjectId = require('mongodb').ObjectID;

const dbDetails = require('../Config/config');
const dbConfigDetails = dbDetails.configDetails.databaseDetails;
const collectionName = "employers"

function saveEmployerDetails(request,response){
    requestMessage = request.body;
    response.setHeader('Content-Type', 'application/json');

    // If details in the request body has been passed
    if(requestMessage){

        userName = requestMessage.name;
        userEmail = requestMessage.email;

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;

            var dbo = db.db(dbConfigDetails.dbName);
            dbo.collection(collectionName).insertOne(
                {
                    name: userName,
                    email: userEmail,
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
            message: "Tag cannot be empty",   
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
                let updatedValues;

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
                    message: "Employer details updated successfully",
                    data: {}
                });
              }
              else{
                response.json({
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

exports.employerDetails = {
    saveEmployerDetails,
    updateProfile
};