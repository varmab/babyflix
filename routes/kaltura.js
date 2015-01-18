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