'use strict';

var util = require("util");
var dateFormat = require('dateformat');
var q = require('q');

import {Router} from 'express';
import config from '../../config/environment';
import Note from '../note/note.model';
import Attachment from '../attachment/attachment.model';
import * as auth from '../../auth/auth.service';
import CommMod from '../../util/communications';


var fileRouter = new Router();

fileRouter.post('/upload/:id', auth.isAuthenticated(), upload);
fileRouter.get('/download/:fileName', download);

function respondWithResult(res, statusCode) {
  //console.log('inside respond with result');
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      //console.log('responding with --> ' + JSON.stringify(entity));
      res.status(statusCode).json(entity);
      return entity;
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
    return null;
  };
}

function download(req, res) {
  //console.log("DOWNLOAD REQUEST: " + util.inspect(req));
  var file = req.params.fileName,
    path = __dirname + '/../../secured/' +  file;

  // get the short file name
  Attachment.find({ uniqueFileName: file }, (err, attachment) => {
    if(err){
      res.sendStatus(500);
      return null;
    }
    console.log('attachment.fileName ---> ' + JSON.stringify(attachment));
    res.download(path, attachment[0].fileName);
    return null;
  });
}

function upload(req, res) {
  //console.log('in upload: ' + config.UPLOAD_DIR);
  var dateString = dateFormat(new Date(), "yyyymmddHHMMss");
  var random = Math.floor(Math.random() * (2000 - 1000) + 1000);
  var _UPLOAD_DIR = config.UPLOAD_DIR;
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
  //console.log('req.files: ' + util.inspect(req.files));
  //console.log('req: ' + util.inspect(req.params));
  var file = req.files.file;
  var uniqueFileName =  dateString + "." + random + "." + req.files.file.name;
  file.mv(_UPLOAD_DIR + uniqueFileName, function(err) {
    if (err) {
      res.status(500).send(err);
      return null;
    }
    else {
      var fileInfo = {
        fileName: req.files.file.name,
        contentType: req.files.file.mimetype,
        encoding: req.files.file.encoding,
        uniqueFileName: uniqueFileName,
        inquiryId: req.params.id
      }

      // file uploaded, save a note indicating file was uploaded
      var downloadUrl = "/api/file/download/" + uniqueFileName;
      var note = new Note({
        inquiryId: req.params.id,
        type: 'DOC_UPLOAD',
        note: 'A document was uploaded.<br />File name: <a href="' + downloadUrl + '" target="_blank">' + req.files.file.name + "</a><br />Uploaded by: " + req.session.user.fname + ' ' + req.session.user.lname,
        urgent: false,
        createdBy: req.session.user.email,
        createdDate: new Date()
      });

      Note.create(note)
        .then(createAttachment(req, res, fileInfo))
        .then(sendCommunications(req))
        .then(respondWithResult(res, '201'))
        .catch(handleError(res));

      //res.setHeader('Content-Type', 'application/json');
      //res.send(JSON.stringify({ id: req.params.id, status: 'success' }));
    }
  });
}

function sendCommunications(req) {
  return function(attachment){
    //console.log('attachment --> ' + util.inspect(attachment));
    var comm = new CommMod();
    // send email
    var mailOptions = {
      to: config.email.defaultDestination,
      subject: 'File Has Been Uploaded',
      data: attachment,
      inquiryId: attachment.inquiryId,
      url: config.email.emailLinkHost + '/api/file/download/' + attachment.uniqueFileName,
      type: 'FileUpload',
      fileName: attachment.fileName,
      uploadedBy: req.session.user.email
    };
    comm.sendEmail(mailOptions);
    return attachment;
  }

}

function createAttachment(req, res, fileInfo){
  var defer = q.defer();
  //console.log('Create attachment. file info: ' + util.inspect(fileInfo));
  return function(entity) {
    if (entity) {
      var attachment = new Attachment({
        fileName: fileInfo.fileName,
        contentType: fileInfo.contentType,
        encoding: fileInfo.encoding,
        uniqueFileName: fileInfo.uniqueFileName,
        inquiryId: fileInfo.inquiryId,
        noteId: entity._id,
        uploadDate: new Date(),
        uploadedBy: req.session.user.email
      });
      Attachment.create(attachment)
        .then(function(attach){
          return defer.resolve(attach);
        })
        .catch(handleError(res));
      return defer.promise;
    }
  };
}

module.exports = fileRouter;
