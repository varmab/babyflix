require('dotenv').load();

var Promise    = require('bluebird');
var mysql      = require('mysql');

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

    connection.query("SELECT distinct userid FROM jobs WHERE jobstatus=0", function(err, rows, fields) {
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

    connection.query("SELECT * FROM jobs WHERE jobstatus=0", function(err, rows, fields) {
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

    connection.query("UPDATE jobs SET jobstatus=1 WHERE userid=" + userid, function(err, rows, fields) {
        if (err) console.log('Error ' + err);
        connection.end();
    });

}
