const MongoClient = require('mongodb').MongoClient;
const dbDetails = require('../Config/config');
const dbConfigDetails = dbDetails.configDetails.databaseDetails;
const collectionName = "user_job"

function saveUserJobDetails(request,response){
    requestMessage = request.body;
    response.setHeader('Content-Type', 'application/json');

    // If details in the request body has been passed
    if(requestMessage){

        userID = requestMessage.userId;
        jobID = requestMessage.jobId;
        resume = requestMessage.resume;
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
                    userID: userID,
                    jobID: jobID,
                    resume: resume,
                    created: `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`,
                    modified: `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`
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

exports.saveUserJobDetails = saveUserJobDetails;