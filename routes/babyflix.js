require('dotenv').load();

var Promise    = require('bluebird');
var mysql      = require('mysql');
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;


exports.downloadStupeflixVideo=function(file_url){
    var deferred = Promise.pending();

    // App variables
    var DOWNLOAD_DIR = './downloads/';

    // We will be downloading the files to a directory, so make sure it's there
    // This step is not required if you have manually created the directory
    var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
    var child = exec(mkdir, function(err, stdout, stderr) {
        if (err) return deferred.reject(err);
        else download_file_httpget(file_url);
    });

    // Function to download file using HTTP.get
    var download_file_httpget = function(file_url) {
        var options = {
            host: url.parse(file_url).host,
            port: 80,
            path: url.parse(file_url).pathname
        };

        var file_name = url.parse(file_url).pathname.split('/').pop();
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

        http.get(options, function(res) {
            res.on('data', function(data) {
                file.write(data);
            }).on('end', function() {
                file.end();
                deferred.resolve(DOWNLOAD_DIR + file_name);
            });
        });
    };

    return deferred.promise;
}

exports.getUserDetails= function(userid){
    var deferred = Promise.pending();

    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    var sql="SELECT first_name,last_name,baby_name FROM pb_contact WHERE groups='Profile' AND uid=" + userid;

    connection.query(sql, function(err, rows, fields) {
        if (err) return deferred.reject(err);

        var row=rows[0];

        var userInfo=
        {
            first_name: row.first_name,
            last_name: row.last_name,
            baby_name: row.baby_name
        }

        deferred.resolve(userInfo);
        connection.end();
    });

    return deferred.promise;
}

exports.getPendingJobs= function(){
    var deferred = Promise.pending();
    var jobs=[];

    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    connection.query("SELECT distinct userid FROM babyflix_jobs WHERE jobstatus=0", function(err, rows, fields) {
        if (err) return deferred.reject(err);

        rows.forEach(function(row){
            jobs.push(row.userid);
        });

        deferred.resolve(jobs);
        connection.end();
    });

    return deferred.promise;
}

exports.getUserInfo= function(userId){
    var deferred = Promise.pending();
    var jobs=[];

    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    connection.query("SELECT * FROM babyflix_jobs WHERE jobstatus=0", function(err, rows, fields) {
        if (err) return deferred.reject(err);

        rows.forEach(function(row){
            jobs.push(row.userid);
        });

        deferred.resolve(jobs);
        connection.end();
    });

    return deferred.promise;
}


exports.updateJobComplete= function(userid){

    var connection = mysql.createConnection({
        host     : process.env.BABYFLIX_MYSQLHOST,
        user     : process.env.BABYFLIX_MYSQLUSER,
        password : process.env.BABYFLIX_MYSQLPWD,
        database : process.env.BABYFLIX_MYSQLDB
    });

    connection.connect();

    connection.query("UPDATE babyflix_jobs SET jobstatus=1 WHERE userid=" + userid, function(err, rows, fields) {
        if (err) console.log('Error ' + err);
        connection.end();
    });

}
