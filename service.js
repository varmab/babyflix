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


var cronJob = cron.job("0 * * * * *", function(){
    console.info('cron job starting ' + new Date());
    console.info('cron job stopping ' + new Date());
});

cronJob.start();

