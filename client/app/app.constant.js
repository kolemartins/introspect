(function(angular, undefined) {
'use strict';

angular.module('introspectApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],fileUploadUrl:'http://localhost:9000/api/file/upload/'})

;
})(angular);