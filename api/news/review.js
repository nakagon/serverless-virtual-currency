'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.review = (event, context, callback) => {
  let like_count = 0, dislike_count = 0;
  if (event.pathParameters.type == "like") {
    like_count = 1
  } else if(event.pathParameters.type == "dislike") {
    dislike_count = 1
  } else {
  }

  const params = {
  TableName: process.env.DYNAMODB_TABLE,
  Key: {
      id: event.pathParameters.id,
  },
  UpdateExpression: 'set #like = #like + :like, #dislike = #dislike + :dislike',
  ExpressionAttributeNames: {
      '#like'    : 'like',
      '#dislike' : 'dislike',
    },
  ExpressionAttributeValues: {
      ':like'    : like_count,
      ':dislike' : dislike_count
  },
  ReturnValues: 'ALL_NEW',
  };
  console.log(params)

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
        body: JSON.stringify({"message": "ok"}),
    };
    callback(null, response);
  });
}