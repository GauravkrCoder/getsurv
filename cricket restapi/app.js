var fs = require('fs');
var blbird = require('bluebird');
var bdParser = require('body-parser');
var express = require('express');
var path = require('path');
var app = express();
var route=require('./UserRestApi')
var UpdRoute=require('./UpdatePlayer')
var schdroute=require('./Schedule')
var prRoute=require('./Profile')
var option = { promiseLib: blbird }
var pgp = require('pg-promise')(option);

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

app.use(bdParser.urlencoded({limit:'10mb', extended: true }))
app.use(bdParser.json({limit:'10mb', extended: true }));
app.use(express.static(path.join(__dirname, "Pictures")))
app.use('/userlogin',route)
app.use('/update',route)
app.use('/image',UpdRoute)
app.use('/schedule',schdroute)
app.use('/myprofile',prRoute)

app.set('port', process.env.PORT || 3600);
var constring = "postgres://postgres:root@localhost:5432/cricketdb";


app.get('/ad/:username/:password', (req, res, next) => {
    var s = req.params.username;
    var d = req.params.password;
    var mydb = pgp(constring)
    mydb.any('Select username,password from tbladmin where username=$1 and password=$2', [s, d]).then((data) => {
        res.send(data);
    })
    pgp.end();
});
app.get('/ShowPlayers', (req, res, next) => {
    var mydb = pgp(constring);
    mydb.any('Select playerid,playerimage,playername,born,age,nationalside,battingstyle,bowlingstyle,totalmatches,totalscore from tblPlayers').then((data) => {
        res.send(data);
    })
    pgp.end()
});

app.get('/show/ShowPlayers/:id', (req, res, next) => {
    i = parseInt(req.params.id)
    var mydb = pgp(constring);
    mydb.any('Select * from tblPlayers where playerid=$1', i).then((data) => {
        res.send(data);
    })
    pgp.end();
});

app.post('/addplayer.com', (req, res, next) => {
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
    myDb = pgp(constring);
    myDb.none('insert into tblPlayers values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [pid, pic, pname, dob, ag, cntry, bat, ball, tmatch, tscore]).then(
            (data) => {
                res.send({ "message": "Inserted Succexexex..." })
            })
    pgp.end();
})

app.put('/updateplayer/:playerid', (req, res, next) => {
    pid = req.body.playerid;
    //pimg = req.body.playerimage;
    pname = req.body.playername;
    dob = req.body.born;
    ag = req.body.age;
    pcountry = req.body.nationalside;
    bat = req.body.battingstyle;
    ball = req.body.bowlingstyle;
    pmatch = req.body.totalmatches;
    pscore = req.body.totalscore;
    var mydb = pgp(constring);
    mydb.none('Update tblPlayers set playername=$1,born=$2,age=$3,nationalside=$4,battingstyle=$5,bowlingstyle=$6,totalmatches=$7,totalscore=$8 where playerid=$9',
        [pname, dob, ag, pcountry, bat, ball, pmatch, pscore, pid]).then((data) => {
            res.send({ "Message": "Updated Successfully" });
        })
    pgp.end();
});



app.delete('/deleteplayer/:id', (req, res, next) => {
    i = parseInt(req.params.id)
    var mydb = pgp(constring);
    mydb.none('Delete from tblPlayers where playerid=$1', i).then((data) => {
        res.send({ "Message": "Deleted..." });
    })
    pgp.end();
});

// UserRestApi

route.get('/user/login/:emailid/:password', (req, res, next) => {
    var e = req.params.emailid;
    var f = req.params.password;
    var mydb = pgp(constring)
    mydb.any('select * from tblCricketUser where emailid=$1 and password=$2', [e, f]).then((data) => {
        res.send(data)
    })
    pgp.end();
});

app.listen(app.get('port'), (err) => {
    if (err)
        console.log("Server not started");
    else
        console.log("Server Started at http://localhost:" + app.get('port'));
})
