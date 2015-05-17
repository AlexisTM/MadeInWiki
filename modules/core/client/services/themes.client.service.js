'use strict';

angular.module( 'core' )
  .service( 'ThemeService', [ 'Authentication', '$rootScope', '$document', '$q', '$timeout' ,
      function (Authentication, $rootScope, $document, $q, $timeout ) {

      var loadScript = function (src) {
        var deferred = $q.defer();
        var script = $document[0].createElement('script');
        script.onload = script.onreadystatechange = function (e) {
          $timeout(function () {
            deferred.resolve(e);
          });
        };
        script.onerror = function (e) {
          $timeout(function () {
            deferred.reject(e);
          });
        };
        script.src = src;
        $document[0].body.appendChild(script);
        return deferred.promise;
      };

      var loadCSS = function (href) {
        var deferred = $q.defer();
        var style = $document[0].createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = href;
        style.onload = style.onreadystatechange = function (e) {
          $timeout(function () {
            deferred.resolve(e);
          });
        };
        style.onerror = function (e) {
          $timeout(function () {
            deferred.reject(e);
          });
        };
        $document[0].head.appendChild(style);
        return deferred.promise;
      };

      var defaultTheme = 'flatly';

      var theme = defaultTheme;
      if ( Authentication.user !== undefined )
        theme = Authentication.user.theme;

      this.themes = [
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

      var themes = [
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

      var currentTheme = defaultTheme;

      var disableThemes = function (name) {
        var links = [];
        links = document.getElementsByTagName( 'link' );
        for ( var i = links.length - 1; i >= 0; i-- ) {
          if ( links[ i ].href.indexOf( 'themes/' ) > -1 ){
            if( links[ i ].href.indexOf( 'themes/' + name ) === -1 )
              links[ i ].disabled = true;
            else 
              links[ i ].disabled = false;
          }
        }
      };

      var enableTheme = function ( name ) {
        var links = [];
        links = document.getElementsByTagName( 'link' );
        for ( var i = links.length - 1; i >= 0; i-- ) {
          if ( links[ i ].href.indexOf( 'themes/' + name ) > -1 )
            links[ i ].disabled = false;
          currentTheme = name;
        }
      };

      this.loadTheme = function ( name ) {
        if ( themes.indexOf( name ) === -1 ) // Theme do not exist
          return false;
        if ( name === currentTheme ) // Theme is already the current theme
          return console.log('Current theme');

        loadCSS( 'lib/themes/' + name + '.min.css' ).then( function ( ) {
          disableThemes(name);
          currentTheme = name;
        } ).
        catch ( function () {
          loadTheme( defaultTheme );
        } );
      };

      var loadTheme = function ( name ) {
        if ( themes.indexOf( name ) === -1 ) // Theme do not exist
          return false;
        if ( name === currentTheme ) // Theme is already the current theme
          return console.log('Current theme');

        loadCSS( 'lib/themes/' + name + '.min.css' ).then( function ( ) {
          disableThemes(name);
          currentTheme = name;
        } ).
        catch ( function () {
          loadTheme( defaultTheme );
        } );
      };

      loadTheme( theme );

      $rootScope.$on( 'themeChange', function (e, theme) {
        loadTheme( Authentication.user.theme );
      } );

    } ] );

