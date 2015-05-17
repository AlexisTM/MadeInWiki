'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication','$rootScope', 'ThemeService',
	function($scope, $http, $location, Users, Authentication, $rootScope, ThemeService) {
		$scope.user = Authentication.user;

    $scope.themes = ThemeService.themes;
    $scope.theme = Authentication.user.theme;

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
          ThemeService.loadTheme(response.theme);
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);
