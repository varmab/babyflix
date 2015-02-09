#!/usr/bin/env node

console.info('Babyflix service started ' + new Date())

require('dotenv').load();

var cron = require('cron');
var routes = require('./routes');
var _ = require('lodash');
var Promise=require('bluebird')



var processKaltura= function (currUserid) {
    routes.kaltura.initialize(function () {
         routes.babyflix.getUserDetails(currUserid).then(function(userInfo) {
             routes.kaltura.listMedia(currUserid).then(function (media) {
                 routes.stupeflix.createTestVideo(media,userInfo).then(function (response) {
                     console.log(response[0].result.export);
                     routes.babyflix.downloadStupeflixVideo(response[0].result.export).then(function(filename){
                         console.log('file name loaded ' + filename);
                     }).catch(function (err) {
                         console.error('Failed to download file' + err);
                     });
                 }).catch(function (err) {
                     console.error('Error creating video for user' + err);
                 });
             }).catch(function (err) {
                 console.error('Error getting media for user' + err);
             });
         }).catch(function (err) {
             console.error('Error getting user info' + err);
         });
    });
}

//processKaltura(1901);

routes.kaltura.uploadMedia('main_OUTPUT.tmp.mp4')

var cronJob = cron.job("0 * * * * *", function(){
    console.info('cron job starting ' + new Date());

    /**
    routes.babyflix.getPendingJobs().then(function(users){
        users.forEach(function(user){
            console.log(user);
            routes.babyflix.updateJobComplete(user);
        })
    }).finally(function(){
        console.info('cron job stopping ' + new Date());
    });
**/

});

cronJob.start();


