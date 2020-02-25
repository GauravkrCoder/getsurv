var fs = require('fs');
var blbird = require('bluebird');
var bdParser = require('body-parser');
var express = require('express');
var path = require('path');
var schdleroute = express();
var option = { promiseLib: blbird }
var pgp = require('pg-promise')(option);

schdleroute.use(bdParser.urlencoded({ extended: true }))
schdleroute.use(bdParser.json());
schdleroute.use(express.static(path.join(__dirname, "Pictures")))
var constring = "postgres://postgres:root@localhost:5432/cricketdb";

schdleroute.get('/', (req, res, next) => {
    var mydb = pgp(constring);
    mydb.any('Select * from tblschedule').then((data) => {
        res.send(data);
    })
    pgp.end()
});

schdleroute.post('/addschedule',(req,res,next)=>{
    dt=req.body.date;
    vn=req.body.venue;
    mtdet=req.body.matchdetails;
    var mydb=pgp(constring);
    mydb.none('Insert into tblschedule(date,venue,matchdetails) values($1,$2,$3)',[dt,vn,mtdet]).then((data)=>{
        res.send({"Message":"Schedule Added..."})
    })
    pgp.end();
})

module.exports=schdleroute