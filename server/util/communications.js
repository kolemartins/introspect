'use strict';
import config from '../config/environment';
import renderer from './email/renderer';
import Inquiry from '../api/inquiry/inquiry.model';
import Topic from '../api/topic/topic.model';
import User from '../api/user/user.model';
import q from 'q';

const SEND_EMAILS = config.email.send;
const SEND_TEXTS = config.twilio.send;
const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;

var twillio = require('twilio');
var twillioClient = twillio(accountSid, authToken);

var BitlyAPI = require("node-bitlyapi");
var Bitly = new BitlyAPI({
  client_id: "simple",
  client_secret: "simple"
});
Bitly.setAccessToken(config.bitly.accessToken);

var nodemailer = require('nodemailer');
console.log('Initializing communications module...');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: config.email.provider,
  auth: {
    user: config.email.providerUser,
    pass: config.email.providerToken
  }
});

module.exports = function() {
  return {
    sendEmail: function(mailOptions){
      //debugger;
      //console.log('In sendEmail --> ' + JSON.stringify(mailOptions));
      if(SEND_EMAILS){  //ability to turn off email notifications
        mailOptions.from = 'Notification System <notifsystem@test.com>';
        renderer.render(mailOptions).then(function(email){
          //console.log('******** EMAIL --> ' + JSON.stringify(email) + ' ***********');
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              console.log('ERROR in sendMail --> ' + JSON.stringify(error));
              return null;
            }else{
              //console.log('Message sent: ' + info.response);
              return mailOptions;  // for some reason entity never seems to return from here to the create 'then' chain even though it clearly executes - scope issue?
            }
          });
        });
      }
      return mailOptions;
    },
    sendText: function(message) {
      //console.log('Inside sendText(msg) --> ' + JSON.stringify(message));
      if(SEND_TEXTS){
        var url = message.url || 'http://localhost:9000';
        console.log('url --> ' + url);
        // create a shortened URL and send the SMS message
        //var url = 'http://www.simplicityjs.com/response/';
        Bitly.shorten({longUrl: url}, function (err, results) {
          if (err) {
            console.log('error in bitly --> ' + err);
          }
          console.log("bitly results --> " + JSON.stringify(results));
          message.body += ' Please review inquiry at ' + JSON.parse(results).data.url;

          twillioClient.messages.create(message, function (err, call) {
            if (err) {
              console.log("error occurred: " + err.message);
            } else {
              //console.log('notification has been sent --> ' + call.sid);
            }
          })

        });
      }
      return;
    },
    sendVoice: function(message) {
      if(SEND_TEXTS){
        twillioClient.calls.create(message, function (err, call) {
          if (err) {
            console.log("error occurred: " + err.message);
          } else {
            //console.log('notification has been sent --> ' + call.sid);
          }
        });
      }
      return;
    },
    getContactInfo: function(inquiryId, initiator) {  // initiator = person either initiating the inquiry or a person responding to the inquiry (depending on context)
      // get initiator of inquiry
      console.log('getContactInfo invoked. inquiryId[' + inquiryId + '] initiator[' + initiator + ']');
      var defer = q.defer();
      Inquiry.findOne({ _id: inquiryId }, function(err, inquiry){
        if(err){
          console.log('Error in getContactInfo --> ' + JSON.stringify(err));
          return defer.reject(err);
        }
        if(initiator === inquiry.requestedBy){  // this is the initiator of the inquiry; send to appropriate person or group's primary contact
          if(inquiry.person){  // a specific person has been assigned to this inquiry; send it to this person
            // lookup this person and return
            User.findOne({ email: inquiry.person }, function(err, user){
              if(err){
                console.log('Error in getContactInfo --> ' + JSON.stringify(err));
                return defer.reject(err);
              }
              return defer.resolve(user);
            })
          } else {  // send it to the primary contact of the topic
            Topic.findOne({ _id: inquiry.topic }, function(err, topic){
              if(err){
                console.log('Error in getContactInfo --> ' + JSON.stringify(err));
                return defer.reject(err);
              }
              User.findOne({ email: topic.primaryContact }, function(err, user){
                if(err){
                  console.log('Error in getContactInfo --> ' + JSON.stringify(err));
                  return defer.reject(err);
                }
                return defer.resolve(user);
              })
            })
          }
        } else { // this is someone responding to the initiator of the inquiry
          User.findOne({ email: initiator }, function(err, user){
            if(err){
              console.log('Error in getContactInfo --> ' + JSON.stringify(err));
              return defer.reject(err);
            }
            return defer.resolve(user);
          })
        }
      })
      return defer.promise;
    }
  }
}

