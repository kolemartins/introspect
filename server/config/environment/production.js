'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mongodb://localhost/introspect'
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
