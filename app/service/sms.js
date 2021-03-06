'use strict'

var https = require('https');
var querystring = require('querystring');
var Promise = require('bluebird');
var speakeasy = require('speakeasy');

exports.getCode = function(){
  var code = speakeasy.totp({
    secret:'xiaohaiisnice',
    digits:4
  })

  return code
};

exports.send = function(phoneNumber,msg){
  return new Promise(function(resolve,reject){
    if (!phoneNumber){
      return reject(new Error('手机号为空了!'))
    }

    var postData = {
      mobile: phoneNumber,
      message:msg + '【小海说】'
    };

    var content = querystring.stringify(postData);

    var options = {
      host:'sms-api.luosimao.com',
      path:'/v1/send.json',
      method:'POST',
      auth:'api:key-99ebc75be305718b0e66c5a37ce6f1fc',
      agent:false,
      rejectUnauthorized : false,
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' :content.length
      }
    };

    var str = ''

    var req = https.request(options,function(res){

      if (res.statusCode === 404){
        return reject(new Error('短信服务器没有响应!'))
      }

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        str += chunk
      });
      res.on('end',function(){
        var data

        try{
          data = JSON.parse(str)
        }
        catch (e){
          reject(e)
        }

        if (data.error === 0){
          resolve(data)
        }else{
          var errorMap = {
            '-10':'验证信息失败	检查api key是否和各种中心内的一致，调用传入是否正确',
            '-11':'用户接口被禁用	滥发违规内容，验证码被刷等，请联系客服解除',
            '-20':'短信余额不足	进入个人中心购买充值',
            '-30':'短信内容为空	检查调用传入参数：message',
            '-31':'短信内容存在敏感词	接口会同时返回  hit 属性提供敏感词说明，请修改短信内容，更换词语',
            '-32':'短信内容缺少签名信息	短信内容末尾增加签名信息eg.【公司名称】',
            '-33':'短信过长，超过300字（含签名）	调整短信内容或拆分为多条进行发送',
            '-34':'签名不可用	在后台 短信->签名管理下进行添加签名',
            '-40':'错误的手机号	检查手机号是否正确',
            '-41':'号码在黑名单中	号码因频繁发送或其他原因暂停发送，请联系客服确认',
            '-42':'验证码类短信发送频率过快	前台增加60秒获取限制',
            '-50':'请求发送IP不在白名单内	查看触发短信IP白名单的设置',
          }

          return reject(new Error(errorMap[data.error]))
        }
        console.log('over');
      });
    });

    req.write(content);
    req.end();
  })
};

