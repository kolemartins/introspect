(function(angular, undefined) {
'use strict';

angular.module('introspectApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],fileUploadUrl:'http://www.simplicityjs.com/api/file/upload/'})

;
})(angular);