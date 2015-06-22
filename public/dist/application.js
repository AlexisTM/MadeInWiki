'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'micd';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('components');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('suppliers');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Articles',
			state: 'articles',
			type: 'dropdown',
			isPublic: true
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'List Articles',
			state: 'articles.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'Create Articles',
			state: 'articles.create',
      isPublic: false
		});
	}
]);


'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('articles', {
			abstract: true,
			url: '/articles',
			template: '<ui-view/>'
		}).
		state('articles.list', {
			url: '',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('articles.create', {
			url: '/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('articles.view', {
			url: '/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('articles.edit', {
			url: '/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);

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

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('api/articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Categories module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Add the categories dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Categories',
			state: 'categories',
			type: 'dropdown',
			isPublic: false,
      roles: ['admin', 'writer']
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'categories', {
			title: 'List Categories',
			state: 'categories.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'categories', {
			title: 'Create Categories',
			state: 'categories.create'
		});
	}
]);

'use strict';

// Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('categories', {
			abstract: true,
			url: '/categories',
			template: '<ui-view/>'
		}).
		state('categories.list', {
			url: '',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('categories.create', {
			url: '/create',
			templateUrl: 'modules/categories/views/create-category.client.view.html'
		}).
		state('categories.view', {
			url: '/:categoryId',
			templateUrl: 'modules/categories/views/view-category.client.view.html'
		}).
		state('categories.edit', {
			url: '/:categoryId/edit',
			templateUrl: 'modules/categories/views/edit-category.client.view.html'
		});
	}
]);

'use strict';
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var category = new Categories({
				name: this.name,
				description: this.description
			});

			category.$save(function(response) {
				$location.path('categories/' + response._id);

				$scope.name = '';
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(category) {
			if (category) {
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories[i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.categories = Categories.query();

		};

		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			});
		};
	}
]);

'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('api/categories/:categoryId', {
			categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', {
			title: 'Chat',
			state: 'chat',
      isPublic: false
		});
	}
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('chat', {
			url: '/chat',
			templateUrl: 'modules/chat/views/chat.client.view.html'
		});
	}
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', 'Socket',
    function($scope, Socket) {
    	// Create a messages array
        $scope.messages = [];
        
        // Add an event listener to the 'chatMessage' event
        Socket.on('chatMessage', function(message) {
            $scope.messages.unshift(message);
        });
        
        // Create a controller method for sending messages
        $scope.sendMessage = function() {
        	// Create a new message object
            var message = {
                text: this.messageText
            };
            
            // Emit a 'chatMessage' message event
            Socket.emit('chatMessage', message);
            
            // Clear the message text
            this.messageText = '';
        };

        // Remove the event listener when the controller instance is destroyed
        $scope.$on('$destroy', function() {
            Socket.removeListener('chatMessage');
        });

    }
]); 

'use strict';

// Configuring the Components module
angular.module('components').run(['Menus',
	function(Menus) {
		// Add the components dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Components',
			state: 'components',
			type: 'dropdown',
      isPublic: false,
      roles: ['admin', 'writer']
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'components', {
			title: 'List Components',
			state: 'components.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'components', {
			title: 'Create Components',
			state: 'components.create'
		});
	}
]);

'use strict';

// Setting up route
angular.module('components').config(['$stateProvider',
	function($stateProvider) {
		// Components state routing
		$stateProvider.
		state('components', {
			abstract: true,
			url: '/components',
			template: '<ui-view/>'
		}).
		state('components.list', {
			url: '',
			templateUrl: 'modules/components/views/list-components.client.view.html'
		}).
		state('components.create', {
			url: '/create',
			templateUrl: 'modules/components/views/create-component.client.view.html'
		}).
		state('components.view', {
			url: '/:componentId',
			templateUrl: 'modules/components/views/view-component.client.view.html'
		}).
		state('components.edit', {
			url: '/:componentId/edit',
			templateUrl: 'modules/components/views/edit-component.client.view.html'
		});
	}
]);

'use strict';
angular.module('components').controller('ComponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Components',
	function($scope, $stateParams, $location, Authentication, Components) {
		$scope.authentication = Authentication;

		$scope.create = function() {
      this.categories = [null];
			var component = new Components({
				name: this.name,
				reference: this.reference,
        description: this.description,
        categories: this.categories
			});
			component.$save(function(response) {
				$location.path('components/' + response._id);

				$scope.name = '';
				$scope.reference = '';
        $scope.description = '';
        $scope.categories = [null];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(component) {
			if (component) {
				component.$remove();

				for (var i in $scope.components) {
					if ($scope.components[i] === component) {
						$scope.components.splice(i, 1);
					}
				}
			} else {
				$scope.component.$remove(function() {
					$location.path('components');
				});
			}
		};

		$scope.update = function() {
			var component = $scope.component;
      if(component.suppliers === [])
        component.suppliers = [null];
      if(component.categories === [])
        component.categories = [null];
      if(component.images === [])
        component.images = [null];

			component.$update(function() {
				$location.path('components/' + component._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.components = Components.query();

		};

		$scope.findOne = function() {
			$scope.component = Components.get({
				componentId: $stateParams.componentId
			});
		};
	}
]);

'use strict';

//Components service used for communicating with the components REST endpoints
angular.module('components').factory('Components', ['$resource',
	function($resource) {
		return $resource('api/components/:componentId', {
			componentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

'use strict';

angular.module( 'core' ).controller( 'HeaderController', [ '$scope', '$state', 'Authentication', 'Menus', 'ThemeService',
 function ( $scope, $state, Authentication, Menus, ThemeService ) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    // Get the topbar menu
    $scope.menu = Menus.getMenu( 'topbar' );

    ThemeService.loadTheme(Authentication.user.theme);

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on( '$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    } );
 }
 ] );

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision 
        var shouldRender = function(user) {
            if (user !== '' || user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, options) {
            options = options || {};

            // Create the new menu
            this.menus[menuId] = {
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                	this.addSubMenuItem(menuId, options.link, options.items[i]);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, parentItemState, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state|| '',
                        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }
            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar', {
            isPublic: true
        });
    }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
    function(Authentication, $state, $timeout) {
    	// Connect to the Socket.io server only when authenticated
        if (Authentication.user) {
            this.socket = io();
        } else {
            $state.go('home');
        }

        // Wrap the Socket.io 'on' method
        this.on = function(eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function(data) {
                    $timeout(function() {
                        callback(data);
                    });
                });
            }
        };

        // Wrap the Socket.io 'emit' method
        this.emit = function(eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        // Wrap the Socket.io 'removeListener' method
        this.removeListener = function(eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);

'use strict';

angular.module( 'core' )
  .service( 'ThemeService', [ 'Authentication', '$rootScope', '$document', '$q', '$timeout',
      function (Authentication, $rootScope, $document, $q, $timeout ) {

      var defaultTheme = 'flatly';
      var defaultPath = 'themes/';
      var defaultExtension = '.min.css';
      var defaultIgnore = 'require';
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


      this.themes = themes;

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


      var theme = defaultTheme;
      if ( Authentication.user !== undefined )
        theme = Authentication.user.theme;

      

      var currentTheme = defaultTheme;

      var disableThemes = function (name) {
        var links = [];
        links = document.getElementsByTagName( 'link' );
        for ( var i = links.length - 1; i >= 0; i-- ) {
          if ( links[ i ].href.indexOf( defaultPath ) > -1 ){
            if( (links[ i ].href.indexOf( defaultPath + name ) === -1) && (links[ i ].href.indexOf( defaultPath + defaultIgnore ) === -1))
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
          if ( links[ i ].href.indexOf( defaultPath + name ) > -1 )
            links[ i ].disabled = false;
          currentTheme = name;
        }
      };

      var loadTheme = function ( name ) {
        if ( themes.indexOf( name ) === -1 ) // Theme do not exist
          return false;
        if ( name === currentTheme ) // Theme is already the current theme
          return console.log('Current theme');

        loadCSS( defaultPath + name + defaultExtension ).then( function ( ) {
          disableThemes(name);
          currentTheme = name;
        } ).
        catch ( function () {
          loadTheme( defaultTheme );
        } );
      };

      this.loadTheme = loadTheme;

      loadTheme( theme );

      $rootScope.$on( 'themeChange', function (e, theme) {
        loadTheme( Authentication.user.theme );
      } );

    } ] );


'use strict';

// Configuring the Suppliers module
angular.module('suppliers').run(['Menus',
	function(Menus) {
		// Add the suppliers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Suppliers',
			state: 'suppliers',
			type: 'dropdown',
      isPublic: false
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'suppliers', {
			title: 'List Suppliers',
			state: 'suppliers.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'suppliers', {
			title: 'Create Suppliers',
			state: 'suppliers.create'
		});
	}
]);

'use strict';

// Setting up route
angular.module('suppliers').config(['$stateProvider',
	function($stateProvider) {
		// Suppliers state routing
		$stateProvider.
		state('suppliers', {
			abstract: true,
			url: '/suppliers',
			template: '<ui-view/>'
		}).
		state('suppliers.list', {
			url: '',
			templateUrl: 'modules/suppliers/views/list-suppliers.client.view.html'
		}).
		state('suppliers.create', {
			url: '/create',
			templateUrl: 'modules/suppliers/views/create-supplier.client.view.html'
		}).
		state('suppliers.view', {
			url: '/:supplierId',
			templateUrl: 'modules/suppliers/views/view-supplier.client.view.html'
		}).
		state('suppliers.edit', {
			url: '/:supplierId/edit',
			templateUrl: 'modules/suppliers/views/edit-supplier.client.view.html'
		});
	}
]);

'use strict';
angular.module('suppliers').controller('SuppliersController', ['$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Suppliers',
	function($scope, $stateParams, $sce, $location, Authentication, Suppliers) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var supplier = new Suppliers({
				name: this.name,
        country: this.country,
        city: this.country,
        address: this.address,
        postcode: this.postcode,
        website: this.website,
        mail: this.mail,
        description: this.description
			});
			supplier.$save(function(response) {
				$location.path('suppliers/' + response._id);

        $scope.name = '';
        $scope.country = '';
        $scope.city = '';
        $scope.address = '';
        $scope.postcode = '';
        $scope.website = '';
        $scope.mail = '';
        $scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(supplier) {
			if (supplier) {
				supplier.$remove();

				for (var i in $scope.suppliers) {
					if ($scope.suppliers[i] === supplier) {
						$scope.suppliers.splice(i, 1);
					}
				}
			} else {
				$scope.supplier.$remove(function() {
					$location.path('suppliers');
				});
			}
		};

		$scope.update = function() {
			var supplier = $scope.supplier;
      
			supplier.$update(function() {
				$location.path('suppliers/' + supplier._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.suppliers = Suppliers.query();

		};

		$scope.findOne = function() {
			$scope.supplier = Suppliers.get({
				supplierId: $stateParams.supplierId
			});
		};
	}
]);

'use strict';

//Suppliers service used for communicating with the suppliers REST endpoints
angular.module('suppliers').factory('Suppliers', ['$resource',
	function($resource) {
		return $resource('api/suppliers/:supplierId', {
			supplierId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
				return {
					responseError: function (rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('settings', {
				abstract: true,
				url: '/settings',
				templateUrl: 'modules/users/views/settings/settings.client.view.html'
			}).
			state('settings.profile', {
				url: '/profile',
				templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
			}).
			state('settings.password', {
				url: '/password',
				templateUrl: 'modules/users/views/settings/change-password.client.view.html'
			}).
			state('settings.accounts', {
				url: '/accounts',
				templateUrl: 'modules/users/views/settings/manage-social-accounts.client.view.html'
			}).
			state('settings.picture', {
				url: '/picture',
				templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
			}).
			state('authentication', {
				abstract: true,
				url: '/authentication',
				templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
			}).
			state('authentication.signup', {
				url: '/signup',
				templateUrl: 'modules/users/views/authentication/signup.client.view.html'
			}).
			state('authentication.signin', {
				url: '/signin',
				templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			}).
			state('password', {
				abstract: true,
				url: '/password',
				template: '<ui-view/>'
			}).
			state('password.forgot', {
				url: '/forgot',
				templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
			}).
			state('password.reset', {
				abstract: true,
				url: '/reset',
				template: '<ui-view/>'
			}).
			state('password.reset.invalid', {
				url: '/invalid',
				templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
			}).
			state('password.reset.success', {
				url: '/success',
				templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
			}).
			state('password.reset.form', {
				url: '/:token',
				templateUrl: 'modules/users/views/password/reset-password.client.view.html'
			});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope',
	function($scope, $http, $location, Authentication, $rootScope) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
        $rootScope.$emit('themeChange');
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
        $rootScope.$emit('themeChange');
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
	function ($scope, $timeout, $window, Authentication, FileUploader) {
		$scope.user = Authentication.user;
		$scope.imageURL = $scope.user.profileImageURL;

		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: 'api/users/picture'
		});

		// Set file uploader image filter
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.success = true;

			// Populate user object
			$scope.user = Authentication.user = response;

			// Clear upload buttons
			$scope.cancelUpload();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.cancelUpload();

			// Show error message
			$scope.error = response.message;
		};

		// Change user profile picture
		$scope.uploadProfilePicture = function () {
			// Clear messages
			$scope.success = $scope.error = null;

			// Start upload
			$scope.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.cancelUpload = function () {
			$scope.uploader.clearQueue();
			$scope.imageURL = $scope.user.profileImageURL;
		};
	}
]);

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

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
	function($window) {
		var auth = {
			user: $window.user
		};

		return auth;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
