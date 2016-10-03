'use strict'


var mongoose = require('mongoose');
var User = mongoose.model('User');
var xss = require('xss');
var sms = require('../service/sms');
var uuid = require('uuid'); //生成token

exports.signup = function *(next){

  var phoneNumber = xss(this.request.body.phoneNumber.trim()); //post请求
  // var phoneNumber = this.query.phoneNumber;  get请求
  var user = yield User.findOne({
    phoneNumber:phoneNumber
  }).exec();

  //生成验证码和手机短信
  var verifyCode = sms.getCode();


  if (!user){

    var accessToken = uuid.v4();

    user = new User({
      phoneNumber: xss(phoneNumber),
      verifyCode:verifyCode,
      accessToken:accessToken,
      nickname:'小海酱',
      avatar:'http://obsinesgs.bkt.clouddn.com/57b3c83118b0f'
    })
  }
  else{
    user.verifyCode = verifyCode
  }

  try {
    console.log(user);
    user = yield user.save();
  }catch (e){
    this.body = {
      success:false
    };

    return next
  }

  var msg = '您的注册验证码是: ' + verifyCode;



  try {
    sms.send(user.phoneNumber,msg)
  }
  catch (e){
    this.body = {
      success:false,
      err:'短信服务异常'
    };

    return next
  }

  this.body = {
    success: true
  }
};

exports.verify = function *(next){

  var verifyCode = this.request.body.verifyCode;
  var phoneNumber = this.request.body.phoneNumber;

  if (!verifyCode || !phoneNumber){
    this.body = {
      success:false,
      err:'验证没通过'
    };

    return next
  }

  var user = yield User.findOne({
    phoneNumber:phoneNumber,
    verifyCode:verifyCode
  }).exec();

  if (user){
    user.verified = true;
    user = yield user.save();

    this.body = {
      success: true,
      data:{
        nickname:user.nickname,
        accessToken:user.accessToken,
        avatar:user.avatar,
        _id:user._id

      }
    }

  }else{
    this.body = {
      success:false,
      err:'验证没通过'
    };
  }

  this.body = {
    success: true,
    data:{
      nickname:user.nickname,
      accessToken:user.accessToken,
      avatar:user.avatar,
      _id:user._id

    }
  }
};

exports.update = function *(next){

  var body  =this.request.body;
  var user = this.session.user;
  var filelds = 'avatar,gender,age,nickname,breed'.split(',');

  filelds.forEach(function (field) {
    if (body[field]){
      user[field] = xss(body[field].trim());
    }
  });

  user = yield user.save();

  this.body = {
    success: true,
    data:{
      nickname:user.nickname,
      accessToken:user.accessToken,
      avatar:user.avatar,
      age:user.age,
      breed:user.breed,
      gender:user.gender,
      _id:user._id
    }
  }
};