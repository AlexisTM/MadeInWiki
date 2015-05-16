'use strict';

module.exports = {
	app: {
		title: 'Made In China.doc',
		description: 'The missing doc of the Chineses Electronics components',
		keywords: 'MEANJS, China, Chine, Doc, documentation, Made in china, Made in china doc, Electronics, Electronic, components',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'UA-63063320-1'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
