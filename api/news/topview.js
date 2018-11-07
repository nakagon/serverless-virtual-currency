'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.topview = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'code = :code and score > :i',
    IndexName: "GcodeScoreIndex1",
    
    ExpressionAttributeValues: {
      ':code': "currency",
      ':i': 0
    },
    ScanIndexForward: false,
    Limit: 10, // optional (limit the number of items to evaluate)
  };

  //     ExclusiveStartKey add
  if (event.pathParameters) {
    params["ExclusiveStartKey"] = JSON.parse(decodeURIComponent(event.pathParameters.key));
  }
  // fetch all todos from the database
  dynamodb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the news.'));
      return;
    }

    // create a response
    const response = {
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",        
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
        "Content-Type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
