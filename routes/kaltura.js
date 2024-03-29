require('dotenv').load();

var Promise=require('bluebird');
var KalturaConstants = require('../kaltura/KalturaTypes.js');
var Kaltura = require('../kaltura/KalturaClient.js');

var KalturaClient = null;
var Session = null;

var pager = new Kaltura.objects.KalturaFilterPager();
pager.pageSize=10000;
pager.pageIndex=1;

exports.initialize = function(callback) {
    var config = new Kaltura.KalturaConfiguration(parseInt(process.env.KALTURA_PARTNERID));
    KalturaClient = new Kaltura.KalturaClient(config);
    KalturaClient.session.start(function(session) {
            KalturaClient.setKs(session);
            Session = session;
            callback();
        }, process.env.KALTURA_ADMINSECRET, process.env.KALTURA_USERID, KalturaConstants.KalturaSessionType.ADMIN,
        parseInt(process.env.KALTURA_PARTNERID), '10000000');
}

exports.listMedia = function(userid) {
    var deferred = Promise.pending();

    var filter = new Kaltura.objects.KalturaMediaEntryFilter();
    if(userid != undefined) {
        filter.userIdEqual = userid;
    }
    filter.nameMultiLikeOr="hd_still_1,hd_still_2,hd_still_2-1,hd_still_3,hd_still_3-1," +
    "hd_still_4,hd_still_4-2,hd_still_4-3,hd_still_4-4," +
    "hd_still_5,hd_still_6,hd_still_6-1,hd_still_7,hd_still_7-1," +
    "hd_ultrasound_15_s_1,hd_ultrasound_15_s_2,hd_ultrasound_15_s_3,hd_ultrasound_25_s_4";

    KalturaClient.media.listAction(function(results) {
        if (results.objectType === 'KalturaAPIException') {
            return deferred.reject(results);
        }
        deferred.resolve(results.objects);

    }, filter, pager);

    return deferred.promise;
}

exports.listUser = function() {
    var deferred = Promise.pending();
    KalturaClient.user.listAction(function(results) {
        if (results.objectType === 'KalturaAPIException') {
            return deferred.reject(results);
        }
        deferred.resolve(results.objects);
    }, null, pager);
    return deferred.promise;
}

exports.uploadMedia = function(videoFile) {
    var deferred = Promise.pending();

    var fs = require("fs");

    var DOWNLOAD_DIR = './downloads/';
    var fileWithPath=DOWNLOAD_DIR+videoFile;

    fs.exists(fileWithPath, function(exists) {
        if (exists) {
            fs.stat(fileWithPath, function(error, stats) {
                fs.open(fileWithPath, "r", function(error, fd) {
                    var buffer = new Buffer(stats.size);

                    fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                        var data = buffer.toString("utf8", 0, buffer.length);

                        var uploadToken = null;
                        KalturaClient.uploadToken.add(function(){
                            console.log('ddd')
                        }, uploadToken);

                        console.log(result);

                        fs.close(fd);
                    });
                });
            });
        }
    });

    /**
    KalturaClient.media.addMediaEntry(function(results) {
        if (results.objectType === 'KalturaAPIException') {
            return deferred.reject(results);
        }
        deferred.resolve(results.objects);
    }, null, pager);*/

    return deferred.promise;
}