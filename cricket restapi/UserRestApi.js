var fs = require('fs');
var blbird = require('bluebird');
var bdParser = require('body-parser');
var express = require('express');
var path = require('path');
var route = express();
var option = { promiseLib: blbird }
var pgp = require('pg-promise')(option);

route.use(bdParser.urlencoded({ extended: true }))
route.use(bdParser.json());
route.use(express.static(path.join(__dirname, "Pictures")))
var constring = "postgres://postgres:root@localhost:5432/cricketdb";

route.get('/:emailid/:password', (req, res, next) => {
    var s = req.params.emailid;
    var d = req.params.password;
    var mydb = pgp(constring)
    mydb.any('select * from tblUser where emailid=$1 and password=$2', [s, d]).then((data) => {
        res.send(data)
    })
    pgp.end();
});

route.post('/register', (req, res, next) => {
    uid = req.body.userid;
    fname = req.body.firstname;
    lname = req.body.lastname;
    mail = req.body.emailid;
    pwd = req.body.password;
    mob = req.body.mobileno;
    var mydb = pgp(constring);
    mydb.none('Insert into tblUser(firstname,lastname,emailid,password,mobileno) values($1,$2,$3,$4,$5)', [fname, lname, mail, pwd, mob]).then((data) => {
        res.send({ "Message": "User Inserted" });
    })
    pgp.end();
})
route.put('/:userid', (req, res, next) => {
    u = req.params.userid;
    pwd = req.body.password;
    var mydb = pgp(constring);
    mydb.none('update tblUser set password=$1 where userid=$2', [pwd, u]).then((data) => {
        res.send({ "Message": "Update Seccessfully..." });
    })
    use.end();
})
module.exports = route