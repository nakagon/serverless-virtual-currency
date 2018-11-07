'use strict';

const dynamodb = require('../libs/dynamodb');
const uuid = require('uuid');
const queryParser = require('../libs/queryParser');

module.exports.put = (event, context, callback) => {
  const data = queryParser.parse(event.body);
  const timestamp = new Date().getTime();
  let latast_no = 1;
  if (typeof data.comment !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the todo item.'));
    return;
  }

  let params = {
    TableName: process.env.DYNAMODB_COMMENT_TABLE,
    KeyConditionExpression: 'article_id = :article_id',
    IndexName: "GarticleCreatedAtIndex1",    
    ExpressionAttributeValues: {
      ':article_id': data.article_id,
    },
    ScanIndexForward: false,    
    Limit: 1, 
  }



  dynamodb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the news.'));
      return;
    }
    if (result.Count != 0) {
      latast_no = result.Items[0].no;
    }

    let params = {
      TableName: process.env.DYNAMODB_COMMENT_TABLE,
      Item: {
        article_id: data.article_id,
        id:         uuid.v1(),
        no:         latast_no + 1,
        comment:    data.comment,
        like:       0,      
        dislike:    0,
        createdAt:  timestamp,
        updatedAt:  timestamp
      }
      
    };

    dynamodb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the todo item.'));
        return;
      }

      let article_params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: data.article_id,
        },
        UpdateExpression: 'set #comments = #comments + :i',
        ExpressionAttributeNames: {
          '#comments': 'comments'
        },
        ExpressionAttributeValues: {
          ':i'    : 1
        },
        ReturnValues: 'ALL_NEW',
      }

      dynamodb.update(article_params, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(new Error('Couldn\'t fetch the news item.'));
          return;
        }
      });
      
      // console.log(event);
      const response = {
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",        
          "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: JSON.stringify(result),
      };
      callback(null, response);
    });
  });
}