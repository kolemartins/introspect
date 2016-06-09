'use strict';
import config from '../config/environment';
import renderer from './email/renderer';

const SEND_EMAILS = config.email.send;
const SEND_TEXTS = config.twilio.send;

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
        var accountSid = config.twilio.accountSid;
        var authToken = config.twilio.authToken;

        // create a shortened URL and send the SMS message
        //var url = 'http://www.simplicityjs.com/response/';
        var BitlyAPI = require("node-bitlyapi");
        var Bitly = new BitlyAPI({
          client_id: "simple",
          client_secret: "simple"
        });
        Bitly.setAccessToken(config.bitly.accessToken);
        Bitly.shorten({longUrl: url}, function (err, results) {
          if (err) {
            console.log('error in bitly --> ' + err);
          }
          console.log("bitly results --> " + JSON.stringify(results));
          message.body += ' Please review inquiry at ' + JSON.parse(results).data.url;
          var client = require('twilio')(accountSid, authToken);
          client.messages.create(message, function (err, call) {
            if (err) {
              console.log("error occurred: " + err.message);
            } else {
              //console.log('notification has been sent --> ' + call.sid);
            }
          })

        });
      }
      return;
    }
  }
}

