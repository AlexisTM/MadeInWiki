'use strict';
//Menu service used for managing  menus
angular.module('core').service('AuthService', ['Authentication',
    function(Authentication) {
        this.isAuthorized = function(roles) {
            if (!Authentication.user) return false;
            if (!Authentication.user.roles) return false;
            for (var i = roles.length - 1; i >= 0; i--) {
              if (Authentication.user.roles.indexOf(roles[i]) > -1) return true;
            }
            return false;
        };
    }
]);
