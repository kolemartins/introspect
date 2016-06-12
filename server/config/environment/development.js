'use strict';

import path from 'path';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/introspect-dev'
  },

  // Seed database on startup
  seedDB: true,
  //UPLOAD_DIR: path.join(__dirname, 'secured') // ends up in the 'config directory
  UPLOAD_DIR: '/home/simplicityjs/node/introspect/server/secured/',
  //UPLOAD_DIR: 'C:/projects/full-stack/introspect/server/secured/',

  //Twilio info
  twilio: {
    send: true,
    useDefault: false,
    defaultDestination: '512-694-4632',
    accountSid: 'ACf56f87c3292dc0d264ad39acd2bbe231',
    authToken: '738e1414102da6ab6c062484cc2ab8a0',
    twilioPhone: "+12409496910"
  },
  // Email info
  email: {
    send: true,
    defaultDestination: 'michael.stanley@gmail.com',
    provider: 'gmail',
    providerUser: 'michael.stanley@gmail.com',
    providerToken: 'pmauxlmdnsqntctk',
    emailLinkHost: 'http://www.simplicityjs.com'
  },
  bitly: {
    accessToken: '9ffc97bac69645602b493cccce7a9bd5084eea4c'
  }
};
