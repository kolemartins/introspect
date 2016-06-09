'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
      return users;
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function (user) {
      // send the confirmation code
      req.user = user;
      genConfirmCode(req, res, next);
      var token = jwt.sign({_id: user._id}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token});
    })
    .catch(validationError(res));
  // send confirmation code
}

/**
 * Update a user
 */
function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function confirm(req, res, next) {
  User.findOne({email: req.body.email}, '-salt -password').exec()
    .then(user => {
      console.log('user: ' + JSON.stringify(user));
      if (!user) {
        return res.status(401).end();
      }
      if(user.confirmCode === req.body.code){
        user.confirmed = true;
        user.save();
        return res.status(200).end();
      } else {
        return res.status(444).end();
      }
    })
    .catch(err => next(err));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;
  // -salt -password instructs findOne to not return  salt and/or password
  return User.findOne({_id: userId}, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        res.status(401).end();
        return null;
      }
      res.json(user);
      return null;
    })
    .catch(err => next(err));
}

var getRandom = function () {
  var min = 10000;
  var max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function newCode(req, res, next) {
  genConfirmCode(req, res, next);
  res.status(204).end();
}

var genConfirmCode = function(req, res, next) {
  console.log('generating confirmation code for: ' + JSON.stringify(req.body));
  var randomNum = getRandom();
  // defaulting to personal text for test purposes
  var destination = config.twilio.defaultDestination;
  // Twilio Credentials
  var accountSid = config.twilio.accountSid;
  var authToken =  config.twilio.authToken;

  //require the Twilio module and create a REST client
  var client = require('twilio')(accountSid, authToken);

  client.messages.create({
    to: destination,
    from: config.twilio.twilioPhone,
    body: 'Your confirmation code is: ' + randomNum
  }, function (err, call) {
    if (err) {
      console.log("error occurred: " + err.message);
    } else {
      console.log(call.sid);
      // lookup the user document using the user id and update the confirmation code with the randomly generated number
      User.findOne({ email: req.body.email}, '-salt -password').exec()
        .then(user => {
          user.confirmed = false;
          user.codeSent = true;
          user.confirmCode = randomNum;
          return user.save()
            .then(() => {
              //res.status(204).end();
              next();
            })
            .catch(handleError(res));
        })
    }
  })
};

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
