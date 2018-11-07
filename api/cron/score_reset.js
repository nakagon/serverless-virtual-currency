'use strict';
const FeedParser = require('feedparser');  
const request    = require('request');  
const uuid       = require('uuid');
const dynamodb = require('../libs/dynamodb');
// console.log(dynamodb);

var Reset = (table, type) => {
    let params = {
        TableName: table,
        IndexName: "GcodeScoreIndex1",
        KeyConditionExpression: 'code = :code and score > :score',
        ExpressionAttributeValues: {
          ':code': 'currency',
          ':score' : 0,
        },
        ScanIndexForward: false
      };
    
      // fetch all todos from the database
      dynamodb.query(params, (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        result.Items.forEach(function(item){
            let params = {
                TableName: table,
                Key: {
                    id: item.id,
                },
                UpdateExpression: 'set #score = :i',
                ExpressionAttributeNames: {'#score': type},
                ExpressionAttributeValues: {':i': 0},
                ReturnValues: 'ALL_NEW',
            };
            dynamodb.update(params, (error, result) => {
                // handle potential errors
                if (error) {
                  console.error(error);
                  return;
                }
            });
            
        })
    
      });
}

module.exports.daily = (event, context, callback) => {
  Reset(process.env.DYNAMODB_TABLE, 'score');
  const response = {
    statusCode: 200,
    // body: JSON.stringify(result.Items),
  };
  callback(null, response);
};

module.exports.weekly = (event, context, callback) => {
    Reset(process.env.DYNAMODB_TABLE, 'week');
    const response = {
      statusCode: 200,
      // body: JSON.stringify(result.Items),
    };
    callback(null, response);
  };