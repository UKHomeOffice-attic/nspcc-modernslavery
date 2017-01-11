'use strict';
/* global Backbone: false */

(function() {
	var MS = window.MS || {};

	/**
	 * Modern Slavery Site Router
	 * @return {Backbone.Router}
	 */
	var SiteRouter = Backbone.Router.extend({

		/**
		 * Default Routes
		 * @type {Object}
		 */
		routes: {
			'case-study/:id' : 'caseStudy',
			'video/:index' : 'video',
        	'home' : 'defaultRoute',
			'*other' : 'defaultRoute'
		},

		initialize: function() {


		},

		caseStudy: function(id) {
			MS.CaseStudies.routeHandler(id);
		},

		video: function(index) {
			MS.VideoPlayer.playVideoByIndex(index);		
		},

		defaultRoute: function() {
			if (MS.VideoPlayer && MS.VideoPlayer.closePlayer) {
				MS.VideoPlayer.closePlayer();
			}
			
		}
	});

	// initialize router & bind to MS
    MS.router = new SiteRouter();

    // start monitoring URL + dispatching
    Backbone.history.start();

    window.MS = MS;

})();