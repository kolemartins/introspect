var express = require('express');
var apiRouter = express.Router();

var mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'michael.stanley@gmail.com',
    pass: 'pmauxlmdnsqntctk'
  }
});


apiRouter.get('/sendcode/:user', function(req, res, next) {
  var custid = req.params.custid;
  var notifid = req.params.notifid;
  var randomNum = getRandom();

  // lookup the document using the notification id and update the confirmation code with the randomly generated number
  var condition = { "notification._id" : mongoose.Types.ObjectId(notifid)};
  var update = { "notification.$.confirmCode" : randomNum, "notification.$.codeSent" : true};
  req.models.Customer.findOneAndUpdate(condition, {"$set" : update}, function(err, affected){
    //console.log("confirmation code send response: " + JSON.stringify(affected));
    if(err) console.log("Error saving the confirmation code: " + JSON.stringify(err));
    console.log(affected.notification);

    for(var notif in affected.notification){
      var notification = affected.notification[notif];
      console.log("in notification loop: " + JSON.stringify(notification));
      if(notification._id == notifid){
        var destination = '';
        // defaulting to personal email / text for test purposes
        if(notification.type === 'text') {
          destination = '512-694-4632';
          // Twilio Credentials
          var accountSid = 'ACf56f87c3292dc0d264ad39acd2bbe231';
          var authToken = '738e1414102da6ab6c062484cc2ab8a0';

          //require the Twilio module and create a REST client
          var client = require('twilio')(accountSid, authToken);

          client.messages.create({
            to: destination,
            from: "+12409496910",
            body: 'Your confirmation code is: ' + randomNum
          }, function(err, call) {
            if(err){
              console.log("error occurred: " + err.message);
            }else{
              console.log(call.sid);
            }
          });
        } else if(notification.type === 'voice'){
          destination = '512-694-4632';
          // Twilio Credentials
          var accountSid = 'ACf56f87c3292dc0d264ad39acd2bbe231';
          var authToken = '738e1414102da6ab6c062484cc2ab8a0';

          //require the Twilio module and create a REST client
          var client = require('twilio')(accountSid, authToken);
          client.calls.create({
            to: "512-694-4632",
            from: "+12409496910",
            url: "http://www.simplicityjs.com:3000/api/account/confirm/callout/" + randomNum,
            method: "GET",
            fallbackMethod: "GET",
            statusCallbackMethod: "GET",
            record: "false"
          }, function(err, call) {
            if(err){
              console.log("error occurred: " + err.message);
            }else{
              console.log(call.sid);
            }
          });

        } else {
          destination = 'michael.stanley@pnmresources.com';
          // send email to customer
          var mailOptions = {
            from: 'Notification System <notifsystem@test.com>',
            to: destination,
            subject: 'IMPORTANT: Notification Confirmation Code',
            text: 'Your confirmation code is: ' + randomNum,
            html: "<div style='color: #404040; font-family: Tahoma, Arial; border: 1px solid #909090; padding: 10px 10px 10px 10px;'>Your confirmation code for your " + notification.type + " notification is: <font color='navy'<b>" + randomNum + "</b></div>"
          };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              console.log(error);
            }else{
              console.log('Message sent: ' + info.response);
            }
          });
        }

        break;
      }
    };
    res.send("email sent");
  });
});

apiRouter.get('/customer/confirm/:notifid/:code', function(req, res, next) {
  var notifId = req.params.notifid;
  var code = req.params.code;
  var condition = { "notification._id" : mongoose.Types.ObjectId(notifId), "notification.confirmCode" : code};
  var update = { "notification.$.confirmed" : true};
  req.models.Customer.findOneAndUpdate(condition, {"$set" : update}, function(err, result){
    if(err) return next(err);
    res.send(result);
    //res.send({ match : result.nModified > 0 });
  });
});


apiRouter.post('/customer', function(req, res, next) {
  console.dir("new customer: " + JSON.stringify(req.body));
  req.models.Customer.create(req.body, function(error, statusResponse){
    if(error) return next(error);
    res.send(statusResponse);
  });
});

apiRouter.put('/customer/:id', function(req, res, next){
  req.models.Customer.update({ _id: req.params.id }, req.body, {upsert: true}, function(error, statusResponse){
    if(error) return next(error);
    res.send(statusResponse);
  });
});

apiRouter.delete('/customer/:id', function(req, res, next){
  req.models.Customer.remove({ _id: req.params.id }, function(error, statusResponse){
    if(error) return next(error);
    res.send(statusResponse);
  });
});

// account services
apiRouter.get('/account', function(req, res, next) {
  req.models.Account.list(function(error, accountResponse) {
    if (error) return next(error);
    res.send(accountResponse);
  });
});

apiRouter.get('/account/:id', function(req, res, next) {
  req.models.Account.findById(req.params.id,function(error, accountResponse) {
    if (error) return next(error);
    res.send(accountResponse);
  });
});

apiRouter.get('/account/validate/:acctno/:zip', function(req, res, next) {
  req.models.Account.find({"acctNo" : req.params.acctno, "zip" : req.params.zip},function(error, accountResponse) {
    if (error) return next(error);
    res.send(accountResponse);
  });
});

apiRouter.get('/account/confirm/callout/:code',function(req, res, next){
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="en-US">Your confirmation number is ' + req.params.code.split('').join(' ') + '.</Say></Response>');
});

var getRandom = function(){
  var min = 10000;
  var max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = apiRouter;
