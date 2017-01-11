'use strict';
/* global jQuery: false */
/* global Backbone: false */
/* global _: false */
/* global ga: false */

(function($) {

	var MS = window.MS || {};

	// detect IE6-IE8  http://stackoverflow.com/questions/8890460/how-to-detect-ie7-and-ie8-using-jquery-support
	var isOldIE = !$.support.leadingWhitespace;

	var VideoPlayer = (function() {

		var $curtain;

		/**
		 * Trigger a video by DOM index of .video-player
		 * @param  {int} index DOM index
		 * @return {null}
		 */
	    function playVideoByIndex(index) {
			var $videoLinks = $('.video-player'),
				$videoLink = $videoLinks.eq(index);

			// video does not exist.
			if (!$videoLink.length) {
				//closePlayer();

				return false;
			}

			/**
			 * Call loadPlayer function with the context of the .video-player link
			 * Pass null for ev parameter and false to not turn off animations
			 *
			 * If animations are not turned off, the video player will not load because it seems like
			 * jQuery.velocity has not been initialized
			 */
			loadPlayer.apply( $videoLink[0] , [null, false] );
	    }

		/**
		 * Click event handler to load player
		 * 
		 * @return {null}
		 */
		function loadPlayer(ev, animate) {

			// default parameter
			if (typeof animate === 'undefined') {
				animate = true;
			}

			var $this = $(this),
				mainUrl = $this.attr('href'),
				embedUrl = $this.attr('data-video-embed-url'),
				description = $this.attr('data-video-description'),
				shareDescription = $this.attr('data-video-share-description');

			var videoId = $('.video-player').index( $this );

			var v = new Video({
				id: videoId,
				description: description,
				embedUrl: embedUrl,
				mainUrl: mainUrl,
				shareDescription: shareDescription
			});

			var view = new VideoModal({
				model: v
			});

			view.render(animate);
			//var $el = view.$el;
			//
			return false;
		}

		function closePlayer() {
			if (VideoModalInstance && typeof VideoModalInstance.close === 'function') {
				VideoModalInstance.close();
			}
		}

		/**
		 * DOM ready
		 * 
		 * @return {null}
		 */
		function init() {
			// Set up DOM elements
			$curtain = $('<div id="ms-videoplayer--curtain" />');
			$('body').append( $curtain );
			$curtain.hide();

			// Event handlers
			$('body').on('click', '.video-player', loadPlayer);
			$curtain.on('click', closePlayer);
		}

		return {
			init: init,
			loadPlayer: loadPlayer,
			closePlayer: closePlayer,
			playVideoByIndex: playVideoByIndex
		};

	})();

	MS.VideoPlayer = VideoPlayer;

	window.MS = MS;

	//$(function() {
	MS.VideoPlayer.init();
	//});


	var Video = Backbone.Model.extend({
		defaults: {}
	});

	var VideoModalInstance = null;

	var VideoModal = Backbone.View.extend({
		template: _.template( $('#template-video-player').html() || '' ),
		tagName: 'div',
		className: 'ms-videoplayer--player',

		events: {
			'click .close' : 'close',
			'click .share-fb': 'share',
			'click .share-tw': 'share',
			'click .share-e': 'share'
		},

		initialize: function() {
			// only want one instance of VideoModal at a time.
			if (VideoModalInstance && typeof VideoModalInstance.close === 'function') {
				VideoModalInstance.close();
			}

			VideoModalInstance = this;

			// $ cache objects
			this.$body = $('body');
			this.$curtain = $('#ms-videoplayer--curtain');


			// Track video play/click
			var mainUrl = this.model.get('mainUrl');

			if (mainUrl && typeof ga === 'function') {
				ga('send', 'event', 'video', 'play', mainUrl);
			}		
		},

		render: function(animate) {

			// default parameter:
			// default parameter
			if (typeof animate === 'undefined') {
				animate = true;
			}

			var $el = this.$el;
			var thisView = this;

			$el

			// set up HTML
			.html(this.template(this.model.toJSON()))

			// hide by default
			.hide();

			// set up player positioning
			var top = $('.header-primary').outerHeight();
			$el.css({
				top: top
			});

			this.savedScrollTop = $(window).scrollTop();

			if (animate && !isOldIE) {
				this.$curtain.show().velocity('transition.shrinkIn', show);
			} else {
				this.$curtain.show();
				show();
			}
			

			function show() { //

				// add player to body
				thisView.$body
				.append( thisView.$el );

				// adjust window
				$('html, body')
				.css({
					height: top + $el.outerHeight(),
					overflow: 'scroll'
				});

				thisView.$curtain.css({
					height: top + $el.outerHeight()
				});

				$('.header-primary').removeClass('fixed');		

				$el.show();

				// Add a slight animation to the close button to highlight
				if (jQuery.velocity) {
					var $close = $el.find('.close');
					
					$close.hide();
					setTimeout(function() {
						$close.velocity('transition.bounceUpIn', 500);
					}, 300);
				}
				

				$(window).scrollTop(0);
			}

			if (MS.router) {
				MS.router.navigate('/video/' + this.model.id);
			}

			return this;
		},

		share: function(event) {

			var mainUrl = this.model.get('mainUrl'),
				shareDescription = this.model.get('shareDescription'),
				
				description = shareDescription || this.model.get('description');

			// convert the class name of the event's element to the relevant share provider name
			var provider = {
				'share-fb': 'fb',
				'share-tw': 'tw',
				'share-e': 'e'
			}[ event.target.className ] || false;

			// make sure provider name exists
			if (!provider) {
				return false;
			}

			// share it
			window.MS.Util.share(provider, mainUrl, description);

			return false;
		},

		close: function() {
			var scrollTop = this.savedScrollTop;

			// revert CSS properties
			$('html, body').css({
				'height': 'auto',
				'overflow': 'auto'
			});

			$('.header-primary').addClass('fixed');

			$('html, body').scrollTop( scrollTop );

			if (jQuery.velocity && !isOldIE) {
				this.$curtain.velocity('transition.shrinkOut', function() {
				});
			} else {
				this.$curtain.hide();
			}

			window.MS.router.navigate('home');
			
			// NOTE: we are hiding the view first because of an IE8 issue.
			// IE8 + Flash Player within the view will cause the screen to turn black if only this.remove() is called.
			// Not sure if this a rendering bug, if it's coming from somewhere else, but this seems to fix the problem.
			this.$el.hide();

			// Remove the view
			this.remove();

			VideoModalInstance = undefined;

			return false;
		}
	});


})(jQuery);