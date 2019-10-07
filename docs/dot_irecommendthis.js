jQuery(document).ready(function($){

	$(document).on('click', '.uncode-dot-irecommendthis', function() {
		var link = $(this),
			linkCounter = link.find('span.likes-counter');
		if (link.hasClass('active')) return false;
		var id = $(this).attr('id');
		$.post(uncode_irecommendthis.ajaxurl, {
			action: 'uncode-irecommendthis',
			recommend_id: id
		}, function(data) {
			var counter = $(data).text();
			linkCounter.html(counter);
			link.addClass('active').attr('title', uncode_irecommendthis.i18n);
		});
		return false;
	});

});
