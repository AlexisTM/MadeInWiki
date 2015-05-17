'use strict';

angular.module( 'core' ).controller( 'HeaderController', [ '$scope', '$state', 'Authentication', 'Menus', 'angularLoad',
 function ( $scope, $state, Authentication, Menus, angularLoad ) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu( 'topbar' );


    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on( '$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    } );

    $scope.themes = [
      'bootstrap',
      'cerulean',
      'custom',
      'cyborg',
      'darkly',
      'flatly',
      'journal',
      'lumen',
      'paper',
      'readable',
      'sandstone',
      'simplex',
      'slate',
      'spacelab',
      'superhero',
      'united',
      'yeti'
    ];

    $scope.currentTheme = 'readable';
    $scope.loadedThemes = [];

    function disableTheme() {
      var links = [];
      links = document.getElementsByTagName( 'link' );
      for ( var i = links.length - 1; i >= 0; i-- ) {
        if ( links[ i ].href.indexOf( 'themes/' + $scope.currentTheme ) > -1 )
          links[ i ].disabled = true;
          $scope.loadedThemes.push($scope.currentTheme);
      }
    }

    function enableTheme(name) {
      var links = [];
      links = document.getElementsByTagName( 'link' );
      for ( var i = links.length - 1; i >= 0; i-- ) {
        if ( links[ i ].href.indexOf( 'themes/' + name ) > -1 )
          links[ i ].disabled = false;
          $scope.currentTheme = name;
      }
    }

    function loadTheme( name ) {
      if ( $scope.themes.indexOf( name ) === -1 )   // Theme do not exist
        return false;
      if( name === $scope.currentTheme )            // Theme is already the current theme
        return false;
      if( $scope.loadedThemes.indexOf(name) > -1) // Theme is already loaded 
        return enableTheme(name);
        
      angularLoad.loadCSS( 'lib/themes/' + name + '.min.css' ).then( function ( el ) {
        if(name !== $scope.currentTheme) {
          disableTheme();
          $scope.currentTheme = name;
        }
      } ).catch ( function () {
        loadTheme('readable');
      } );
    }
    loadTheme('yeti');
 }
 ] );
