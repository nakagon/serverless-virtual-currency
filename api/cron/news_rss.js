'use strict';
const FeedParser = require('feedparser');  
const request    = require('request');  
const uuid       = require('uuid');
const dynamodb = require('../libs/dynamodb');
// console.log(dynamodb);
module.exports.run = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_SITE_MASTER_TABLE,
  };


  // fetch all todos from the database
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the todos.'));
      return;
    }
    
    result.Items.forEach(function(site){
      // console.log(site)
      let items = [];
      let blog_data = [];
      let item;
      let req = request(site.xml_url);  
      let feedparser = new FeedParser({});

      req.on('response', function (res) {  
        this.pipe(feedparser);
      });
      
      feedparser.on('meta', function(meta) {  
        console.log('==== %s ====', meta.title);
      });
      
      feedparser.on('readable', function() {  
        while(item = this.read()) {
          items.push(item);
        }
      });
      
      feedparser.on('end', function() {  
        // show titles  const timestamp = new Date().getTime();
        items.forEach(function(item) {
          // console.log(item);
          let image = "null";
          if (item.meta.image.url != undefined) {
            image = item.meta.image.url;
          } else if (item.enclosures != undefined) {
            if (item.enclosures[0] != undefined){
              image = item.enclosures[0].url;              
            }
          }
          let publishAt = new Date(item.date).getTime();
          if (publishAt > new Date().getTime()) {
            publishAt = new Date().getTime();
          }
          blog_data.push({
            code        : "currency",
            category    : "1",
            site_id     : site.id,            
            site_name   : site.name,
            id          : uuid.v1(),
            title       : item.title,
            description : item.description,
            url         : item.link,
            base_url    : site.base_url,
            categories  : item.categories,
            image       : (image == '') ? "null" : image,
            total_score : 0,
            score       : 0,
            week_score  : 0,
            month_score : 0,
            like        : 0,
            dislike     : 0,
            comments    : 0,
            publishAt   : publishAt,
            createdAt   : new Date().getTime(),
            updatedAt   : new Date().getTime()
          })
        });

        let params = {
          TableName: process.env.DYNAMODB_TABLE,
          IndexName: "GsiteIdpublishAtIndex1",
          KeyConditionExpression: 'site_id = :site_id',
          ExpressionAttributeValues: {
            ':site_id': site.id,
          },
          ScanIndexForward: false,
          limit: 1
        };
      
        // fetch all todos from the database
        dynamodb.query(params, (error, result) => {
          // handle potential errors
          if (error) {
            console.error(error);
            callback(new Error('Couldn\'t fetch the todos.'));
            return;
          }
          let latestPubAt = 0;
          let latestTitle = "";
          if (result.Count != 0 ) {
            // console.log(result.Items[0].publishAt,site.name);
            latestPubAt = result.Items[0].publishAt;
            latestTitle = result.Items[0].title;
          }
          let data = []
          // console.log(blog_data);
          blog_data.forEach(function(blog, index) {
            // console.log(site.name + ": " + blog.publishAt )
            if ( blog.publishAt > latestPubAt && blog.title != latestTitle) {
              // console.log(blog.publishAt, "push")
              data.push({
                PutRequest: {
                  Item: blog
                }
              });
            }
          });
          if (data.length == 0 ) {
            // console.log(site.name, "return")
            return;
          }
          var tablename = process.env.DYNAMODB_TABLE
          let params = {
            RequestItems: { 
            }
          };

          for (let i = 0; i<Math.ceil(data.length/25); i++) {
            params["RequestItems"][tablename]= data.slice(i, i+25);
            
            dynamodb.batchWrite(params, (error) => {
              // handle potential errors
              if (error) {
                console.error(error);
                callback(new Error('Couldn\'t create the todo item.'));
                return;
              }
            });  
          }
          

        });

        
      });
    })
    const response = {
      statusCode: 200,
      // body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
