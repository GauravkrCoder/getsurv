var fs = require('fs');
var blbird = require('bluebird');
var bdParser = require('body-parser');
var express = require('express');
var path = require('path');
var router = express();
var option = { promiseLib: blbird }
var pgp = require('pg-promise')(option);

router.use(bdParser.urlencoded({ extended: true }))
router.use(bdParser.json());
router.use(express.static(path.join(__dirname, "Pictures")))
var constring = "postgres://postgres:root@localhost:5432/cricketdb";

router.put('/:playerid', (req, res, next) => {
    var dt = new Date();
    var fn = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() + '-' + dt.getHours() + '-' + dt.getMinutes() + '-' + dt.getMilliseconds() + '.png';

    fs.writeFile(
        path.join(__dirname, 'Pictures/' + fn),
        req.body.playerimage,
        'base64',
        (err) => {

        });
    pid = req.body.playerid;
    pic = 'http://localhost:3600/' + fn;
    pname = req.body.playername;
    dob = req.body.born;
    ag = req.body.age;
    cntry = req.body.nationalside;
    bat = req.body.battingstyle;
    ball = req.body.bowlingstyle;
    tmatch = req.body.totalmatches;
    tscore = req.body.totalscore;
    var mydb=pgp(constring)
    mydb.none('Update tblPlayers set playerimage=$1,playername=$2,born=$3,age=$4,nationalside=$5,battingstyle=$6,bowlingstyle=$7,totalmatches=$8,totalscore=$9 where playerid=$10',
        [pic, pname, dob, ag, cntry, bat, ball, tmatch, tscore, pid]).then((data) => {
            res.send({ "Message": "Updated Successfully" });
        })
    pgp.end();

})

module.exports=router