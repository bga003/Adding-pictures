var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

// Or
/* GET pictures listing. */
router.get('/', async function(req, res, next) {
  /*
  First, we need to set the bucket and folder prefixes.
    The listObjects() method will return the basic info of all files in the directory of the provided prefix (in this case, the public directory). 
    We can extract the keys of each file from it and later call the s3.getObject() method for each key.
  */
 var params = {
  Bucket: process.env.CYCLIC_BUCKET_NAME,
  Delimiter: '/',
  Prefix: 'public/'
};
var allObjects = await s3.listObjects(params).promise();
var keys = allObjects?.Contents.map( x=> x.Key)
  /*
  After getting the keys, we need to ask for the details of each object. 
    We will use the Promise.all() method to wait until all promises finish, and we will save each file’s content and name:
  */
  const pictures = await Promise.all(keys.map(async (key) => {
    let my_file = await s3.getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: key,
    }).promise();
    return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split("/").pop()
    }
  }))
  res.render('pictures', { pictures: pictures});
});

router.post('/', async function(req, res, next) {
  const file = req.files.file;
  console.log(req.files);
  await s3.putObject({
    Body: file.data,
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Key: "public/" + file.name,
  }).promise()
  res.end();
});

module.exports = router;