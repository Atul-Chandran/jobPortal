const moment = require('moment');

const mailService = require('../Service/sendMail.service');

const MongoClient = require('mongodb').MongoClient;
const configurationDetails = require('../Config/config').configDetails;
const dbConfigDetails = configurationDetails.databaseDetails;

const otpCollectionName = "otp";
const employerCollectionName = "employers";
const userCollection = "users";

function otpEmployerCreator(request,response){
    var requestMessage = request.body;

    if(requestMessage.emailId){
        var otpExpiration = moment().add(configurationDetails.otpExpiryTime,'minutes').unix();
        var otp = Math.floor((Math.random() * 10000));

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                email: requestMessage.emailId
            }
            dbo.collection(employerCollectionName).find(
                query,
                {
                    projection: {
                        "_id": 1,
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if (result.length > 0){
                MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(dbConfigDetails.dbName);

                    dbo.collection(otpCollectionName).insertOne(
                        {
                            otpNumber: otp,
                            requesterEmail: requestMessage.emailId,
                            otpExpiryTime: otpExpiration,
                            created: moment().format(),
                            modified: moment().format()
                        }, 
                        function(err, res) {
                        if (err) {
                            response.json({
                                "status": 400,
                                "message": "Error while generating Otp",
                                "data": {}
                            });
                        }
                        else{
                            mailService.sendMail(requestMessage.emailId,"Otp is " + otp + ". This OTP is valid for 20 minutes.");
        
                            response.json({
                                "status": 200,
                                "message": "Otp Generated successfully",
                                "data": {
                                    "otp": otp,
                                    "otpExpiryTime": otpExpiration
                                }
                            });
                        }
                        db.close();
                    });
                });
              }
              else{
                response.json({
                    "status": 400,
                    "message": "User does not exist",
                    "data": {}
                });
              }
              db.close();
            });
        });
    
    }
    else{
        response.json({
            "message": "Email cannot be blank",
            "data": {}
        });
    }

}

function otpEmployeeCreator(request,response){
    var requestMessage = request.body;

    if(requestMessage.emailId){
        var otpExpiration = moment().add(configurationDetails.otpExpiryTime,'minutes').unix();
        var otp = Math.floor((Math.random() * 10000));

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                email: requestMessage.emailId
            }
            dbo.collection(userCollection).find(
                query,
                {
                    projection: {
                        "_id": 1,
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if (result.length > 0){
                MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(dbConfigDetails.dbName);

                    dbo.collection(otpCollectionName).insertOne(
                        {
                            otpNumber: otp,
                            requesterEmail: requestMessage.emailId,
                            otpExpiryTime: otpExpiration,
                            created: moment().format(),
                            modified: moment().format()
                        }, 
                        function(err, res) {
                        if (err) {
                            response.json({
                                "status": 400,
                                "message": "Error while generating Otp",
                                "data": {}
                            });
                        }
                        else{
                            mailService.sendMail(requestMessage.emailId,"Otp is " + otp + ". This OTP is valid for 3 minutes.");
        
                            response.json({
                                "status": 200,
                                "message": "Otp Generated successfully",
                                "data": {
                                    "otp": otp,
                                    "otpExpiryTime": otpExpiration
                                }
                            });
                        }
                        db.close();
                    });
                });
              }
              else{
                response.json({
                    "status": 400,
                    "message": "User does not exist",
                    "data": {}
                });
              }
              db.close();
            });
        });
    
    }
    else{
        response.json({
            "message": "Email cannot be blank",
            "data": {}
        });
    }

}

function otpUserCreator(request,response){
    var requestMessage = request.body;

    if(requestMessage.emailId){
        var otpExpiration = moment().add(configurationDetails.otpExpiryTime,'minutes').unix();
        var otp = Math.floor((Math.random() * 10000));

        MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbConfigDetails.dbName);
            var query = {
                email: requestMessage.emailId
            }
            dbo.collection(userCollection).find(
                query,
                {
                    projection: {
                        "_id": 1,
                    }
                }
            ).toArray(async function(err, result) {
              if (err) throw err;
              if (result.length > 0){
                MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(dbConfigDetails.dbName);

                    dbo.collection(otpCollectionName).insertOne(
                        {
                            otpNumber: otp,
                            requesterEmail: requestMessage.emailId,
                            otpExpiryTime: otpExpiration,
                            created: moment().format(),
                            modified: moment().format()
                        }, 
                        function(err, res) {
                        if (err) {
                            response.json({
                                "message": "Error while generating Otp",
                                "data": {}
                            });
                        }
                        else{
                            mailService.sendMail(requestMessage.emailId,"Otp is " + otp);
        
                            response.json({
                                "message": "Otp Generated successfully",
                                "data": {
                                    "otp": otp,
                                    "otpExpiryTime": otpExpiration
                                }
                            });
                        }
                        db.close();
                    });
                });
              }
              else{
                response.json({
                    "message": "User does not exist",
                    "data": {}
                });
              }
              db.close();
            });
        });
    
    }
    else{
        response.json({
            "message": "Email cannot be blank",
            "data": {}
        });
    }

}

function otpValidityChecker(request,response){
    try{
        var convertedOtp = parseInt(request.body.otp);
        if(!convertedOtp){
            response.json({
                message: "Otp must be in numerals",
                data: {}
            })
        }
        else{
            var query = {
                otpNumber : convertedOtp,
                requesterEmail: request.body.email,
                otpExpiryTime : {$gte: moment().unix()}
            };
    
            MongoClient.connect(dbConfigDetails.mongoDBUrl, function(err, db) {
                if (err) throw err;
                var dbo = db.db(dbConfigDetails.dbName);
                dbo.collection(otpCollectionName).find(
                    query,
                    {
                        projection: {
                            "_id": 0,
                            "requesterEmail": 1
                        }
                    }
                ).toArray(async function(err, result) {
                  if (err) throw err;
                  if(result.length > 0){
                    var checkCondition = { email: request.body.email };
                    var updatedValues = {
                        $set: {
                            otpVerified: 1,
                            modified: moment().format()
                        }
                    };
                    dbo.collection(employerCollectionName).updateOne(checkCondition, updatedValues, function(err, res) {
                        if (err) throw err;
                        db.close();
                    });
                    response.json({
                        status: 200,
                        message: "Otp given is valid.",
                        data: {
                            isValid: 1
                        }
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
    catch(err){
        response.json({
            message: "Error while fetching Otp details",
            data: {}
        })
    }

}

exports.otpDetails = {
    otpEmployerCreator,
    otpEmployeeCreator,
    otpUserCreator,
    otpValidityChecker
};