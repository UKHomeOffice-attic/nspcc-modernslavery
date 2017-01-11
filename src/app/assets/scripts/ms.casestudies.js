'use strict';
/* global jQuery: false */

var MS = window.MS || {};

(function($) {

	var CaseStudies = (function() {
		
		// detect IE6-IE8  http://stackoverflow.com/questions/8890460/how-to-detect-ie7-and-ie8-using-jquery-support
		var isOldIE = !$.support.leadingWhitespace;

		var $cycle;

		/**
		 * Go to a case study index (id)
		 * @param  {int} id case study index
		 * @return {null}
		 */
		function routeHandler(id) {
			id = parseInt(id);
			var gotoIndex = 0;

			// is this a valid index?
			if (isValidSlideIndex(id-1)) {
				gotoIndex = id-1;       		
			} else {
				gotoIndex = 0;
			}

			$cycle.cycle('goto', gotoIndex );

			// Wait a little bit for font sizing to render
			// Otherwise the point we scroll to is a bit off.
			setTimeout(function() { 
				MS.Util.scrollTo( $('#case-studies-anchor') );
			}, 100);

		}

		/**
		 * Update router to reflect current cycle slide
		 * 
		 * @return {null}
		 */
		function cycleAfter(event, optionHash, $outgoingSlide, $incomingSlide, forwardFlag) {
			var slideIndex = $cycle.children().index($incomingSlide);
			//router.navigate('case-study/' + slideIndex);
			MS.router.navigate('case-study/' + slideIndex);
		}

		/**
		 * Is the slide index valid?
		 * 
		 * @param  {int}  zeroBasedIndex 	slide index
		 * @return {Boolean}
		 */
		function isValidSlideIndex(zeroBasedIndex) {
			var totalSlides = $cycle.children().length;

			return zeroBasedIndex >= 0 && zeroBasedIndex < totalSlides;
		}

		/**
		 * DOM ready
		 * 
		 * @return {null}
		 */
		function init() {
			$cycle = $('.case-studies-cycle');

			// if there is no .case-studies-cycle, quit.
			if (!$cycle.length) {
				return false;
			}

			// bind cycle after event (to update router)
			$cycle.on('cycle-after', cycleAfter);

			// initialize cycle
			$cycle.cycle({
				fx: isOldIE ? 'fade' : 'fade',
				speed: isOldIE ? 1 : 300,
				//manualSpeed: 1,
				paused: true,

				slides: '.case-study',
				pager: '.case-studies-pager',
				next: '.case-studies-next',
				prev: '.case-studies-prev'
			});
		}

		return {
			init: init,
			routeHandler: routeHandler
		};

	})();

	MS.CaseStudies = CaseStudies;

	window.MS = MS;

	CaseStudies.init();

})(jQuery);
