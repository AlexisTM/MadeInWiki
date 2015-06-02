'use strict';
//Menu service used for managing  menus
angular.module('core').service('AuthService', 'Authentication', [
    function(Authentication) {
        this.isAuthorized = function(roles) {
          console.log(roles);
          console.log(Authentication.user);
            if (!Authentication.user) return false;
            if (!Authentication.user.roles) return false;
            roles.forEach(function(role) {
                if ( !! ~Authentication.user.roles.indexOf(role)) return true;
            });
            return false;
        };
    }
]);
