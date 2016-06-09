
var q = require('q');

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var templateUrgentInquiryDir = path.join(__dirname, 'urgentInquiry');
var newUrgentInquiry = new EmailTemplate(templateUrgentInquiryDir);

var templateUrgentResponseDir = path.join(__dirname, 'urgentResponse');
var newUrgentResponse = new EmailTemplate(templateUrgentResponseDir);

var templateResponseDir = path.join(__dirname, 'response');
var response = new EmailTemplate(templateResponseDir);

var templateFileUploadDir = path.join(__dirname, 'fileUpload');
var fileUpload = new EmailTemplate(templateFileUploadDir);

// directs response name (note.type) to the appropriate email template
var emailTemplates = {
  UrgentInquiry: newUrgentInquiry,
  UrgentResponse: newUrgentResponse,
  Response: response,
  FileUpload: fileUpload
}

module.exports = {
  render: function(mailOptions) {
    var defer = q.defer();
    //debugger;
    //console.log('In email renderer render method. --> ' + JSON.stringify(mailOptions));
    // add inquiry id to the subject line for tracking purposes
    var id = ' {' + mailOptions.inquiryId + '}';
    mailOptions.subject += id;
    if(!emailTemplates[mailOptions.type]) {
      return defer.reject('invalid mail option type --> ' + mailOptions.type);
    }

    emailTemplates[mailOptions.type].render(mailOptions, function (err, result) {
      //console.log('data available to email template --> ' + JSON.stringify(mailOptions));
      if(err){
        console.log('Error in email render: ' + JSON.stringify(err));
        return defer.reject(err);
      }
      //console.log('RENDER METHOD RESULT: ' + JSON.stringify(result));
      mailOptions.text = result.text;
      mailOptions.html = result.html;
      return defer.resolve(mailOptions);
      //return mailOptions;
    })

    return defer.promise;
    //return mailOptions;
  }
};



