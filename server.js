var express = require('express')
var bodyParser= require('body-parser')
var logger= require('morgan')
var errorHandler= require('errorhandler')
var okay= require('okay')
var routes = require('./routes');
var mysql      = require('mysql');

require('dotenv').load();

var app=express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get('/',function(req,res){
    res.send('Babyflix API Server')
})

app.get('/batch',function(req,res,next){
    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    connection.query("INSERT INTO BatchLog(userid,batchnumber) VALUES(1892,'B001')", function(err, rows, fields) {
        if (err) throw err;

        console.log('row inserted');
    });

    connection.end();
})

app.use(errorHandler)

var server=require('http').createServer(app).listen(3000)

