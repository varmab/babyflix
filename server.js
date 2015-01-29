var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var errorHandler= require('errorhandler');
var okay        = require('okay');
var routes      = require('./routes');
var mysql       = require('mysql');

require('dotenv').load();

var app=express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',function(req,res){
    res.send('Babyflix API Server');
})

app.get('/batch',function(req,res,next){

    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    var sqlFindJob = "select * from babyflix_jobs where userid=? and batch=?";
    var sqlNewJob = "insert into babyflix_jobs (userid, batch) values (?,?)";
    connection.connect(function(err){});
    var query = connection.query(sqlFindJob, [req.query.userid,req.query.batch], function(err, results) {
        if(err) throw err;

        if(results.length==0) {
            var query = connection.query(sqlNewJob, [req.query.userid,req.query.batch], function(err, results) {
                if(err) throw err;
                console.log("added user");
                var user_id = results.insertId;
                connection.end();
                res.send(user_id);
            });
        }
        else
        {
            res.send('Already exists');
        }
    });

})

app.use(errorHandler)

var server=require('http').createServer(app).listen(3000)

