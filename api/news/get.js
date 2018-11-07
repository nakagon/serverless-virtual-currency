'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.get = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: 'set #score = #score + :i, #total = #total + :i, #week = #week + :i, #month = #month + :i',
    ExpressionAttributeNames: {
      '#score': 'score',
      '#total': 'total_score',
      '#week' : 'week_score',
      '#month': 'month_score',
    },
    ExpressionAttributeValues: {
      ':i'    : 1

    },
    ReturnValues: 'ALL_NEW',
  };
  
  // fetch todo from the database
  dynamodb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the news item.'));
      return;
    }

    result.Item = result.Attributes;
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
