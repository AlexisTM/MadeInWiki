'use strict';

module.exports = {
	client: {
		lib: {
			css: [
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-load/angular-load.js',
        'public/lib/markdown-it/dist/markdown-it.min.js',
        'public/lib/markdown-it-emoji/dist/markdown-it-emoji.min.js',
        'public/lib/twemoji/twemoji.min.js',
        'public/lib/markdown-it-container/dist/markdown-it-container.min.js',
        'public/lib/markdown-it-deflist/dist/markdown-it-deflist.min.js',
        'public/lib/markdown-it-footnote/dist/markdown-it-footnote.min.js',
        'public/lib/markdown-it-ins/dist/markdown-it-ins.min.js',
        'public/lib/markdown-it-mark/dist/markdown-it-mark.min.js',
        'public/lib/markdown-it-sub/dist/markdown-it-sub.min.js',
        'public/lib/markdown-it-sup/dist/markdown-it-sup.min.js',
        'public/lib/markdown-it-abbr/dist/markdown-it-abbr.min.js',
        'public/dist/highlight/highlight.pack.js'
      ],
			tests: ['public/lib/angular-mocks/angular-mocks.js']
		},
    themes: [
      'public/dist/highlight/styles/sunburst.css',
      'public/themes/require/glyphicons.css',
      'public/themes/flatly.min.css'
    ],
		css: [
			'modules/*/client/css/*.css'
		],
		less: [
			'modules/*/client/less/*.less'
		],
		sass: [
			'modules/*/client/scss/*.scss'
		],
		js: [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		views: ['modules/*/client/views/**/*.html']
	},
	server: {
		allJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		models: 'modules/*/server/models/**/*.js',
		routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
		sockets: 'modules/*/server/sockets/**/*.js',
		config: 'modules/*/server/config/*.js',
		policies: 'modules/*/server/policies/*.js',
		views: 'modules/*/server/views/*.html'
	}
};
