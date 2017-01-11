'use strict';
/* global jQuery: false */

(function($) {

	var MS = window.MS || {};

	var DuplicateFieldset = (function() {

		function init() {

			$('.ms-duplicate-fieldset').on('click', function() {
				var $this = $(this),

					// grab the first defined fieldset
					$base = $( $this.attr('data-duplicate-fieldset') ).eq(0),

					$target = $( $this.attr('data-duplicate-fieldset-append-to') ),

					$clone = $base.clone(),

					baseIndex  = $base.data('duplicate-index') || 0;

				// start a new index
				baseIndex++;

				// update index
				$base.data('duplicate-index', baseIndex);

				// reset form values
				$clone.find('[name]').each(function() {
						$(this).val('');
				});

				// append increment a number onto each [for] and [id] element
				$clone
				.find('[for]').each(function() {
					var $this = $(this),
						id = $this.attr('for');

					$this.attr('for', id + baseIndex);				
				});

				// update element IDs
				$clone.find('[id]').each(function() {
					var $this = $(this),
						id = $this.attr('id');

					$this.attr('id', id + baseIndex);				
				});

				// increment label IDs
				

				// set up new instance
				$clone
				.addClass('cloned')
				.hide();

				// add to target
				$target.append($clone);

				$clone.fadeIn('slow', function() {

					// focus first duplicated form element
					$clone.find('.pure-control-group:first input, .pure-control-group:first textarea, .pure-control-group:first select').eq(0).focus();
				});

				return false;
			});

		}

		return {
			init: init
		};

	})();

	MS.DuplicateFieldset = DuplicateFieldset;

	window.MS = MS;

	$(function() {
		DuplicateFieldset.init();
	});

})(jQuery);
