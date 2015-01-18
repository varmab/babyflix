var FS = require('fs');
var KalturaConstants = require('./KalturaTypes.js');
var Kaltura = require('./KalturaClient.js');

var KalturaClient = null;
var Session = null;

exports.initialize = function(secrets, callback) {
    //secrets.partner_id = +secrets.partner_id;
    var config = new Kaltura.KalturaConfiguration(1820941);
    KalturaClient = new Kaltura.KalturaClient(config);
    KalturaClient.session.start(function(session) {
            KalturaClient.setKs(session);
            Session = session;
            console.log(Session)
            callback();
        }, 'ecfe29cebffd81118386f363500ba4d5', 'varma@redbuscorp.com', KalturaConstants.KalturaSessionType.ADMIN,
        '1820941', '10000000');
}

exports.initialized = function() { return KalturaClient !== null }