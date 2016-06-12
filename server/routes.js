/**
 * Main application routes
 */

'use strict';

import express from 'express';
import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/topics', require('./api/topic'));
  app.use('/api/attachments', require('./api/attachment'));
  app.use('/api/notes', require('./api/note'));
  app.use('/api/inquiries', require('./api/inquiry'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/file', require('./api/file'));
  app.use('/api/notification', require('./api/notification'));
  app.use('/auth', require('./auth').default);

  // static files
  app.use('/public', express.static(path.join(__dirname, 'public')));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
