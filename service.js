#!/usr/bin/env node

console.info('Babyflix service started ' + new Date())

require('dotenv').load();

var cron = require('cron');
var routes = require('./routes');
var _ = require('lodash');
var Promise=require('bluebird')


var processKaltura= function (currUserid) {
    routes.kaltura.initialize(function () {
         routes.kaltura.listMedia(currUserid).then(function (media) {
             routes.stupeflix.createVideo(media).then(function (response) {
                                console.log(response);
             }).catch(function (error) {
                 console.error('Error creating video for user');
             })
         }).catch(function () {
             console.error('Error getting media for user');
         });
    });
}

var cronJob = cron.job("0 * * * * *", function(){
    console.info('cron job starting ' + new Date());
    routes.babyflix.getPendingJobs().then(function(users){
        users.forEach(function(user){
            console.log(user);
            routes.babyflix.updateJobComplete(user);
        })
    }).finally(function(){
        console.info('cron job stopping ' + new Date());
    });

});

cronJob.start();

