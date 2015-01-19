#!/usr/bin/env node

console.info('Babyflix service started ' + new Date())

require('dotenv').load();

var cron = require('cron');
var routes = require('./routes');
var _ = require('lodash');
var Promise=require('bluebird')

var mediaEntry=function(name,url,userid)
{
    this.name=name;
    this.url=url;
    this.userid=userid;
}

var mediaEntries=[];
var users=[];

/**
var populateMedia=function(err,res){
    if(res != null) {
        res.forEach(function (item) {
            mediaEntries.push(new mediaEntry(item.name, item.downloadUrl, item.userId));
        });
    }
}

var populateUser=function(err,res){
    res.forEach(function(item)
    {
            users.push(item);
            if(item.id != null) {

                routes.kaltura.listMedia(item.id).then(getMedia).fail(function(){
                    console.error()
                });

            }


    });
}

var getMedia=function(result){

    console.log(result);
    routes.kaltura.listMedia(populateMedia);
}

var getUsers=function(){
    routes.kaltura.listUser(populateUser);
}
 **/

routes.kaltura.initialize(function(){
    routes.kaltura.listUser().then(function(users){
        users.forEach(function(user) {
            console.log(user);
            if(user.id != null) {
                console.log(user.name);
                routes.kaltura.listMedia(user.id).then(function(media){
                    routes.stupeflix.createTestVideo(media).then(function(response){
                       console.log(response);
                    }).catch(function(error){
                        console.log(error);
                    })
                }).catch(function(){
                    console.error('Error');
                });
            }
        });

    }).catch(function(){
        console.error('Error');
    });
});

/**
var createTest=function(media) {
    routes.stupeflix.createTestVideo(media).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    })
}

createTest(mediaEntries[0]);
 **/


/**
var cronJob = cron.job("0 * * * * *", function(){
    console.info('cron job starting ' + new Date());
    console.info('send grid username '+ process.env.SENDGRID_USERNAME);
    console.info('send grid password '+ process.env.SENDGRID_PASSWORD);
    console.info('cron job stopping ' + new Date());
});

cronJob.start();
**/
