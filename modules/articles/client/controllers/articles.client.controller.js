'use strict';
angular.module( 'articles' ).controller( 'ArticlesController', [ '$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Articles', 'Categories','AuthService',
 function ( $scope, $stateParams, $sce,$location, Authentication, Articles, Categories, AuthService) {
    $scope.authentication = Authentication;
    var authorizedRoles = ['admin', 'writer'];
    

    var md = window.markdownit()
        .use(window.markdownitEmoji)
        .use(window.markdownitAbbr)
        .use(window.markdownitDeflist)
        .use(window.markdownitFootnote)
        .use(window.markdownitMark)
        .use(window.markdownitIns)
        .use(window.markdownitSub)
        .use(window.markdownitSup)
        .use(window.markdownitContainer, 'spoiler', {
            validate: function(params) {
              return params.trim().match(/^spoiler\s+(.*)$/);
            },
            render: function (tokens, idx) {
              var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
              if (tokens[idx].nesting === 1) {
                return '<details><summary>' + m[1] + '</summary>\n';
              } else {
                return '</details>\n';
              }
            }
        });
    md.renderer.rules.emoji = function(token, idx) {
      return window.twemoji.parse(token[idx].content);
    };


    $scope.categories = Categories.query();

    $scope.create = function () {
      var article = new Articles( {
        lang: this.lang,
        title: this.title,
        abstract: this.abstract,
        langages: this.langages,
        components: [ null ],
        content: this.content,
        files: [ null ]
      } );

      article.$save( function ( response ) {
        $location.path( 'articles/' + response._id );
        $scope.title = '';
        $scope.content = '';
        $scope.lang = '';
        $scope.title = '';
        $scope.abstract = '';
        $scope.langages = [ null ];
        $scope.components = [ null ];
      }, function ( errorResponse ) {
        $scope.error = errorResponse.data.message;
      } );
    };

    $scope.remove = function ( article ) {
      if ( article ) {
        article.$remove();

        for ( var i in $scope.articles ) {
          if ( $scope.articles[ i ] === article ) {
            $scope.articles.splice( i, 1 );
          }
        }
      } else {
        $scope.article.$remove( function () {
          $location.path( 'articles' );
        } );
      }
    };

    $scope.update = function () {
      var article = $scope.article;

      article.$update( function () {
        $location.path( 'articles/' + article._id );
      }, function ( errorResponse ) {
        $scope.error = errorResponse.data.message;
      } );
    };

    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    $scope.findOne = function () {
      $scope.article = Articles.get( {
        articleId: $stateParams.articleId
      }, function () {
        $scope.article.contentRendered = $sce.trustAsHtml( md.render( $scope.article.content ) );
        $scope.authorized = AuthService.isAuthorized(authorizedRoles);
      } );
    };
 }
 ] );
