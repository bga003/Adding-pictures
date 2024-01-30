var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  /*
  We need to set the pictures variable before we pass it to the views. 
    To do so:
      Read the names of all the files in the pictures folder with 
      the readdirfiles method in both router files:
  */
  const pictures = fs.readdirSync(path.join(__dirname, '../pictures/')).slice(0, 3); // On the main page, we want to display only three images, so let’s cut the pictures array into three elements using the slice() method:
  res.render('index', { pictures: pictures, title: 'Express' });
});

module.exports = router;