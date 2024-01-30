var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

// Or
/* GET pictures listing. */
router.get('/', function(req, res, next) {
  /*
  We need to set the pictures variable before we pass it to the views. 
    To do so:
      Read the names of all the files in the pictures folder with 
      the readdirfiles method in both router files:
  */
  const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
  res.render('pictures', { pictures: pictures});
});


router.post('/', function(req, res, next) {
  const file = req.files.file;
  fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
  res.end();
});

module.exports = router;