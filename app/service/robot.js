'use strict'

var qiniu = require('qiniu');
var config = require('../../config/config');
var sha1 = require('sha1');
var uuid = require('uuid');

qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;




exports.getQiniuToken= function(body){
  var type = body.type;
  var key = uuid.v4();
  var putPolicy;
  var options = {
    persistentNotifyUrl:config.notify
  };

  if (type === 'avatar'){
    key += '.jpeg';
    putPolicy = new qiniu.rs.PutPolicy('xiaohai-app'+":"+key);
    //putPolicy.callbackUrl = 'http://your.domain.com/callback';
    //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  }else if(type === 'video'){
    key += '.mp4';
    options.scope = 'xiaohai-video:' + key;
    options.persistentOps = 'avthumb/mp4/an/1';
    putPolicy = new qiniu.rs.PutPolicy2(options);
  }else if(type === 'audio'){
    key += '.mp4';
  }

  var token = putPolicy.token();

  return {
    key:key,
    token:token
  };
}


exports.getCloudinaryToken = function(body){


  console.log(body);
  var type = body.type;
  var timestamp = body.timestamp;
  var folder;
  var tags;

  if (type === 'avatar') {
    folder = 'avatar';
    tags = 'app,avatar';
  } else if (type === 'video') {
    folder = 'video';
    tags = 'app,video';
  } else if (type === 'audio') {
    folder = 'audio';
    tags = 'app,audio';
  }

  var signature = 'folder=' + folder + '&tags=' + tags +
    '&timestamp=' + timestamp + config.cloudinary.api_secret;

  signature = sha1(signature);
}






