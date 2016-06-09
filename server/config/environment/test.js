'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/introspect-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  UPLOAD_DIR: '/home/simplicityjs/node/introspect/server/secured',
  //Twilio info
  twilio: {
    defaultDestination: '512-694-4632',
    accountSid: 'ACf56f87c3292dc0d264ad39acd2bbe231',
    authToken: '738e1414102da6ab6c062484cc2ab8a0',
    twilioPhone: "+12409496910"
  }
};
