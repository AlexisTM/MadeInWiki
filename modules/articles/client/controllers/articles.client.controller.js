'use strict';
angular.module( 'articles' ).controller( 'ArticlesController', [ '$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Articles', 'Categories','AuthService',
 function ( $scope, $stateParams, $sce,$location, Authentication, Articles, Categories, AuthService) {
    $scope.authentication = Authentication;
    var authorizedRoles = ['admin', 'writer'];

    var validateName = function(name){
      return function(params){
        var m = params.trim();
        m = m.trim().split(' ')[0];
        return m === name;
      };
    };

    var md = window.markdownit({
          highlight: function (str, lang) {
            if (lang && window.hljs.getLanguage(lang)) {
              try {
                return window.hljs.highlight(lang, str).value;
              } catch (__) {}
            }
            try {
              return window.hljs.highlightAuto(str).value;
            } catch (__) {
            }
            return ''; // use external default escaping
          },
          linkify: true,
          typographer: true
        })
        .use(window.markdownitEmoji)
        .use(window.markdownitAbbr)
        .use(window.markdownitDeflist)
        .use(window.markdownitFootnote)
        .use(window.markdownitMark)
        .use(window.markdownitIns)
        .use(window.markdownitSub)
        .use(window.markdownitSup)
        .use(window.markdownitContainer, 'spoiler', {
            validate: new validateName('spoiler'),
            render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
              var m = tokens[idx].info.trim();
              var index = m.indexOf(' ');
              if(index === -1) 
                m = 'spoiler';
              else 
                m = m.slice(index).trim();
              return '<details><summary>' + m + '</summary>\n';
            } else {
              return '</details>\n';
            }
          }
        })
        .use(window.markdownitContainer, 'css', {
            validate: function(params){
              var m = params.trim();
              m = m.trim().split(' ')[0];
              return m !== name;
            },
            render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
              var m = tokens[idx].info.trim();
              return '<div class="alert alert-'+m+'">\n';
            } else {
              return '</div>\n';
            }
          }
        });

    md.renderer.rules.emoji = function(token, idx) {
      return window.twemoji.parse(token[idx].content);
    };

    md.renderer.rules.footnote_ref = function (tokens, idx) {
      var n = Number(tokens[idx].meta.id + 1).toString();
      var id = 'fnref' + n;
      var uri = window.location.pathname;
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }
      return '<sup class="footnote-ref"><a href="' + uri + '#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
    };

    md.renderer.rules.footnote_anchor = function(tokens, idx) {
      var n = Number(tokens[idx].meta.id + 1).toString();
      var id = 'fnref' + n;
      var uri = window.location.pathname;
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }
      return ' <a href="' + uri + '#' + id + '" class="footnote-backref">\u21a9</a>'; /* ↩ */
    };

    md.renderer.rules.table_open = function() {
      return '<table class="table">';
    };

    console.log(md.renderer.rules);

    $scope.categories = Categories.query();

    $scope.create = function () {
      var article = new Articles( {
        lang: this.lang,
        title: this.title,
        abstract: this.abstract,
        langages: this.langages,
        components: [ null ],
        content: this.content,
        files: null
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
