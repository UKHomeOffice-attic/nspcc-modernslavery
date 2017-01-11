'use strict';
/* global FB: true */
/* global jQuery: false */
/* global ga: false */

(function($) {

	var MS = window.MS || {};

	MS.Util = {

		/**
		 * Scroll to a $target on the page. Will offset fixed header
		 * 
		 * @param  {[type]} $target [description]
		 * @param  {[type]} animate [description]
		 * @return {[type]}         [description]
		 */
		scrollTo: function( $target, animate ) {

			if (typeof animate === 'undefined') {
				animate = true;
			}

			// make sure we were paseed a jQuery object
			// and that the object exists on the page.
			if (!$target.length) {
				return false;
			}

			var $headerPrimary = $('.header-primary'),
				top = $target.position().top,

				// make sure to check if header is fixed or not and offset the scroll position.
				headerHeight = $headerPrimary.css('position') === 'fixed' ? $headerPrimary.outerHeight() : 0;
			
			if (animate) {
				$('html, body').animate({
					scrollTop: (top - headerHeight)
				}, {
					duration: 800,
					easing: 'easeOutExpo'
				});				
			} else {
				$('html, body').css({
					scrollTop: (top - headerHeight)
				});
			}
		},

		/**
		 * Share a link through Facebook, Twitter or email
		 * 
		 * @return {[type]} [description]
		 */
		share: function(provider, url, text) {
			provider = provider.toLowerCase();

			switch (provider) {
				/**
				 * Share Facebook
				 */
				case 'facebook':
				case 'fb':

					if (FB && FB.ui) {
						FB.ui({
							method: 'share',
							href: url
						});

						if (typeof ga === 'function') {
							ga('send', 'social', 'facebook', 'share', url);
						}
					}

				break;

				/**
				 * Share Twitter
				 */
				case 'twitter':
				case 'tw':
					var msg = encodeURIComponent(text);  
					url = encodeURIComponent(url);  
					var link = 'https://twitter.com/intent/tweet?text=' + msg + '&url=' + url; 

				    var width  = 575,
				        height = 400,
				        left   = (screen.width  - width)  / 2,
				        top    = (screen.height - height) / 2,

				        opts   = 'status=1' +
				                 ',width='  + width  +
				                 ',height=' + height +
				                 ',top='    + top    +
				                 ',left='   + left;

				    window.open(link, 'twitter', opts);

				    if (typeof ga === 'function') {
				    	ga('send', 'social', 'twitter', 'tweet', link);
					}

				break;

			}

		}


	};

	window.MS = MS;

	$(document).ready(function() {

		/**
		 * Trigger page scroll on .scroll-to elements
		 * 
		 * @return null
		 */
		$('.scroll-to').on('click', function() {

			var $this = $(this),
				target = $this.attr('href'),
				$target = $(target);

			MS.Util.scrollTo( $target );

			return false;
		});

		/**
		 * Add event handlers for custom share buttons
		 * 
		 * @return null
		 */
		$('body').on('click', '.share-button', function(event) {
			var $this = $(this),

				provider,

				shareDescription = $this.attr('data-share-description') || '',
				mainUrl = $this.attr('href');

			if ($this.hasClass('share-fb')) {
				// Facebook
				provider = 'fb';
			} else if ($this.hasClass('share-tw')) {
				// Twitter
				provider = 'tw';
			}

			// make sure provider name exists
			if (!provider) {
				return false;
			}

			// share it
			MS.Util.share(provider, mainUrl, shareDescription);

			return false;

		});

	});

	/**
	 * Google Analytics
	 */
	/* jshint ignore:start */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53216634-1', 'auto');
  ga('send', 'pageview');
	/* jshint ignore:end */


})(jQuery);