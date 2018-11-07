'use strict';
const dynamodb = require('../libs/dynamodb');
const AWS      = require('aws-sdk');
const xml2js  = require('xml2js');
const dotenv       = require('dotenv');
module.exports.run = (event, context, callback) => {
  dotenv.config();
  // ルートURL
  var baseUrl = process.env.SERVICE_URL;

  console.log(baseUrl)

  var urls      = [];
  var feed_urls = [];

  var today = new Date();
  var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  urls.push ( {
    loc: baseUrl,
    priority: 1.0,
    changefreq: "daily",
    lastmod: date
  })
  feed_urls.push({ title :process.env.SERVICE_TITLE, 
                      description : "仮想通貨の情報を全て網羅、投資のための情報収集に",
                      link:baseUrl, ttl:1800, lastBuildDate:date, pubDate:date });
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  dynamodb.scan(params, (error, result) => {
    result.Items.forEach(function(data){
      let pdate = new Date(data.createdAt);
          pdate = pdate.getFullYear() + '-' + ('0' + (pdate.getMonth() + 1)).slice(-2) + '-' + ('0' + pdate.getDate()).slice(-2);
      
      feed_urls.push({ item: { title :process.env.SERVICE_TITLE + "|" + data.title, 
        description : data.title,
        link:baseUrl + "/newsDetail/" + data.id, ttl:1800, lastBuildDate:pdate, pubDate:pdate }} )
      urls.push ( {
        loc: baseUrl + "/newsDetail/" + data.id,
        priority: 0.6,
        changefreq: "weekly",
        lastmod: pdate
      })
    });
    var sitemap_builder = new xml2js.Builder({ rootName : "urlset" });
    var sitemap_xml = sitemap_builder.buildObject({ url : urls });
    var feed_builder = new xml2js.Builder({ rootName : "channel" });
    var feed_xml = feed_builder.buildObject(feed_urls);
    sitemap_xml = sitemap_xml.replace(/<urlset>/, '<urlset xmlns="http://www.google.com/schemas/sitemap/0.9">')
    feed_xml =feed_xml.replace(/<channel>/, '<rss version="2.0">\n<channel>')
    feed_xml = feed_xml + '\n</rss>'
    let filename = "rss.xml";
    let s3      = new AWS.S3();
    let params = {
      Bucket:process.env.BUCKET_NAME,
      Key   : filename,
      Body  : feed_xml,
      ContentType: 'application/xml; charset=utf-8',
      ACL        : 'public-read'
    }
    s3.putObject(params, function(err, data){
      if (err) console.log(err);
      else console.log("success upload");
    })

    params.Key= "sitemap.xml";
    params.Body = sitemap_xml;
    s3.putObject(params, function(err, data){
      if (err) console.log(err);
      else console.log("success upload");
    })
  });



}
