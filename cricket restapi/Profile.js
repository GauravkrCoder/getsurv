var fs = require('fs');
var blbird = require('bluebird');
var bdParser = require('body-parser');
var express = require('express');
var path = require('path');
var prflroute = express();
var option = { promiseLib: blbird }
var pgp = require('pg-promise')(option);

prflroute.use(bdParser.urlencoded({ extended: true }))
prflroute.use(bdParser.json());
var constring = "postgres://postgres:root@localhost:5432/cricketdb";

prflroute.get('/:id', (req, res, next) => {
    i=parseInt(req.params.id)
    var mydb = pgp(constring);
    mydb.any('Select * from tblUser',i).then((data) => {
        res.send(data);
    })
    pgp.end()
});

module.exports=prflroute