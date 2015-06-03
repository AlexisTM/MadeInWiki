'use strict';

module.exports = {
	client: {
		lib: {
			css: [
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/angular-load/angular-load.min.js',
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
        'public/lib/markdown-it-abbr/dist/markdown-it-abbr.min.js'
			]
		},
    themes: [
      'public/themes/require/glyphicons.css',
      'public/themes/flatly.min.css'
    ],
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
