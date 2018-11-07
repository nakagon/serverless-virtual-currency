'use strict';
const FeedParser = require('feedparser');  
const request    = require('request');  
const uuid       = require('uuid');
const dotenv       = require('dotenv');
const twitter       = require('twitter');

const dynamodb = require('../libs/dynamodb');


// console.log(dynamodb);
module.exports.run = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const header_text = `
仮想通貨のニュースが更新されました！\n
`
  const footer_text = `
#ビットコイン #BTC #bitcoin #仮想通貨 #ICO #XEM #ETC #XRP  
`
  dotenv.config();
  
  var client = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  // client.post('statuses/update',
  //   {status: 'Hello world (このツイートはテストです)'},
  //   function(error, tweet, response) {
  //   if (!error) {
  //       console.log(tweet)
  //   }
  // })
  

  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'code = :code',
    IndexName: "GcodepublishAtIndex1",
    
    ExpressionAttributeValues: {
      ':code': "currency",
    },
    ScanIndexForward: false,
    Limit: 1, // optional (limit the number of items to evaluate)
  };

  // fetch all todos from the database
  dynamodb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the news.'));
      return;
    }
    let latest_id = result.Items[0].id || 0;
    
    if (latest_id == 0) { 
      return;
    }
    
    let data = result.Items[0];    
    let params = {
      TableName: process.env.DYNAMODB_SOCIAL_POST_TABLE,
      KeyConditionExpression: 'id = :id',      
      ExpressionAttributeValues: {
        ':id': latest_id,
      },
      Limit: 1, 
    }
    dynamodb.query(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t fetch the news.'));
        return;
      }
      if (result.Count === 0 || latest_id !== result.Items[0].id) {
      // if (true) {
        let text = header_text + data.title + "... 他\n" + process.env.SERVICE_URL + "/newsDetail/" + latest_id + "\n" +footer_text;
        console.log(text)
        client.post('statuses/update',
          {status: text},
          function(error, tweet, response) {
          if (!error) {
              console.log(tweet)
          }
          let create_params = {
            TableName: process.env.DYNAMODB_SOCIAL_POST_TABLE,
            Item: {
              id:        latest_id,
              type:      'twitter',
              checked:   true,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          };
          console.log(create_params)
          dynamodb.put(create_params, (error) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(new Error('Couldn\'t create the item.'));
              return;
            }
          });
        })
      }
    });
  });

  // let params = {
  //   TableName: process.env.DYNAMODB_SITE_MASTER_TABLE,
  // };
  const response = {
    statusCode: 200,
    // body: JSON.stringify(result.Items),
  };
  callback(null, response);
};
