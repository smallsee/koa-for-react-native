'use strict'

var qiniu = require('qiniu');
var config = require('../../config/config');
var sha1 = require('sha1');

qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;

//要上传的空间
var bucket = 'xiaohai-app';

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  //putPolicy.callbackUrl = 'http://your.domain.com/callback';
  //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  return putPolicy.token();
}

//生成上传 Token


exports.getQiniuToken= function(bucket,key){
  var token = uptoken(bucket,key);

  return token;
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






