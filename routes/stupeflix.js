/**
 * Created by varmabhupatiraju on 1/12/15.
 */

require('dotenv').load();
var Promise=require('bluebird');
var rp = require('request-promise');

exports.createVideo= function(media){
    var deferred = Promise.pending();


    var headers = {"Authorization": "Secret 5AXTPQVY7VGB5BU3WSAZJAR4PU"};
    var task = {
        "tasks": {
            "task_name": "video.create",
            "definition": "<movie service='craftsman-1.0'><body><stack><effect type='none'><video filename='http://s3.amazonaws.com/stupeflix-assets/apiusecase/footage.mov' duration='5.0'/></effect>" +
            "<effect type='none'><text type='zone' height='0.15' right='0.0' bottom='0.0'>Hello World </text></effect><overlay height='0.20' right='0.0' top='0.0'><image filename='http://s3.amazonaws.com/stupeflix-assets/apiusecase/logo_stupeflix.png'/></overlay></stack>" +
            "<transition type='crossfade' duration='0.5'/><effect type='none'><video filename='http://s3.amazonaws.com/stupeflix-assets/apiusecase/branding-postroll.mp4'/></effect></body></movie>"
        }
    };

    var options = {
        uri : 'https://dragon.stupeflix.com/v2/create',
        method : 'POST',
        body: task,
        headers: headers,
        json: true
    };

    rp(options)
        .then(function(response){
            console.log(response.statusCode);
            /**var options = {
                uri : 'https://dragon.stupeflix.com/v2/status',
                qs: { tasks: taskCreation[0]["key"] },
                headers: headers,
                json: true
            };
            **/
            deferred.resolve(response);
        })
        .catch(function(error){
            deferred.reject(error);
        });
/**
    request.post({
        url: "https://dragon.stupeflix.com/v2/create",
        body: task,
        headers: headers,
        json: true
    }, function (error, httpObj, taskCreation) {
        if (!error && httpObj.statusCode == 200) {
            request.get({
                url: "https://dragon.stupeflix.com/v2/status",
                qs: { tasks: taskCreation[0]["key"] },
                headers: headers,
                json: true
            }, function(error, httpObj, taskStatusAndResult) {
                if (!error && httpObj.statusCode == 200) {
                    // taskStatusAndResult[0]["status"] contains either "queued", "executing", "success", or "error"
                }
            })
        }
    });

**/

    return deferred.promise;
}

exports.createTestVideo= function(media){

    var taskHeaderDefinition="<movie service='craftsman-1.0'><body><stack>";
    var taskFooterDefinition="<effect type='none'><text type='zone' height='0.15' right='0.0' bottom='0.0'>Demo Video</text></effect><overlay height='0.20' right='0.0' top='0.0'><image filename='http://s3.amazonaws.com/stupeflix-assets/apiusecase/logo_stupeflix.png'/></overlay></stack>" +
        "<transition type='crossfade' duration='0.5'/><effect type='none'><video filename='http://s3.amazonaws.com/stupeflix-assets/apiusecase/branding-postroll.mp4'/></effect></body></movie>";
    var taskItemDefinition="";


    if(media.length>0) {

        media.forEach(function (item) {
            if (item.name.indexOf('still') > -1) {
                taskItemDefinition = taskItemDefinition + "<effect type='none'><image filename='" + item.downloadUrl + "'/></effect>";
            }
            else {
                taskItemDefinition = taskItemDefinition + "<effect type='none'><video filename='" + item.downloadUrl + "'/></effect>";
            }

        })

        var taskDefintion=taskHeaderDefinition + taskItemDefinition + taskFooterDefinition;

        console.log(taskDefintion);

        /**
        var deferred = Promise.pending();
        var secret = "Secret " + process.env.STUPEFLIX_SECRET

         var headers = {"Authorization": secret};
         var task = {
            "tasks": {
                "task_name": "video.create",
                 "definition": taskDefintion

             }
        };

         var options = {
            uri : 'https://dragon.stupeflix.com/v2/create',
            method : 'POST',
            body: task,
            headers: headers,
            json: true
        };

         rp(options)
         .then(function(response){
            deferred.resolve(response);
        })
         .catch(function(error){
            deferred.reject(error);
        });
         **/

    }

      return deferred.promise;

}

