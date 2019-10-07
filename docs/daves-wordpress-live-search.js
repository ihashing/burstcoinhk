/**
 * Copyright (c) 2014 Dave Ross <dave@csixty4.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

///////////////////////
// LiveSearch
///////////////////////

var LiveSearch = {
	searchBoxes : '',
	activeRequests : [],
	callbacks : [],

	addCallback : function(eventName, callback) {
		if(this.callbacks[eventName] === undefined) {
			this.callbacks[eventName] = [];
		}

		return this.callbacks[eventName].push(callback);
	},

	invokeCallbacks : function(eventName, params) {
		var callbackIndex;
		if(this.callbacks[eventName] !== undefined) {
			for(callbackIndex in this.callbacks[eventName]) {
				params = this.callbacks[eventName][callbackIndex](params);
			}
		}
	}
};

/**
 * Initialization for the live search plugin.
 * Sets up the key handler and creates the search results list.
 */
LiveSearch.init = function() {

	// jQuery("body").append('<ul class="search_results dwls_search_results"></ul>');
	// this.resultsElement = jQuery('ul').filter('.dwls_search_results');

	// Add the keypress handler
	// Using keyup because keypress doesn't recognize the backspace key
	// and that's kind of important.
	LiveSearch.searchBoxes = jQuery("input").filter("[name='s']").not('.no-livesearch');
	LiveSearch.searchBoxes.keyup(LiveSearch.handleKeypress);
	LiveSearch.searchBoxes.focus(LiveSearch.hideResults);

	if(!LiveSearch.searchBoxes.outerHeight) {
		alert(DavesWordPressLiveSearchConfig.outdatedJQuery);
	}

	// Prevent browsers from doing autocomplete on the search field
	LiveSearch.searchBoxes.parents('form').attr('autocomplete', 'off');
	LiveSearch.searchBoxes.each( function() {
		this.autocomplete = 'off';
	} );

	// Hide the search results when the search box loses focus
	jQuery("html").click(LiveSearch.hideResults);
	LiveSearch.searchBoxes.click(function(e) {e.stopPropagation();});

	LiveSearch.compiledResultTemplate = _.template(DavesWordPressLiveSearchConfig.resultTemplate);

	jQuery(window).resize(function() {
		LiveSearch.positionResults(this);
	});

}

LiveSearch.positionResults = function() {

	var topOffset;
	var searchBox = jQuery('input:focus').first();
	var resultsElement = jQuery('#dwls_search_results');

	if(resultsElement && searchBox.length > 0) {

		// Position the ul right under the search box
		var searchBoxPosition = searchBox.offset(),
		getStyle = (searchBox.closest('.style-light').length) ? 'style-light' : 'style-dark',
		getBgStyle = (searchBox.closest('.style-light').length) ? 'style-light-bg' : 'style-dark-bg';
		resultsElement.addClass(getBgStyle);
		resultsElement.wrap( "<div id='uncode-search-result' class='"+getStyle+"'></div>" );
		searchBoxPosition.left += parseInt(DavesWordPressLiveSearchConfig.xOffset, 10);
		searchBoxPosition.top  += searchBox.outerHeight(false) + parseInt(DavesWordPressLiveSearchConfig.yOffset, 10);
		searchBoxPosition.top -= parseInt(jQuery('html').css('margin-top'), 10);
		searchBoxPosition.top -= parseInt(jQuery('html').css('padding-top'), 10);
		resultsElement.css('left', searchBoxPosition.left);
		resultsElement.css('top', searchBoxPosition.top);
		resultsElement.css('width', jQuery('.search-container-inner').width());
		resultsElement.css('display', 'block');

		// switch(DavesWordPressLiveSearchConfig.resultsDirection)
		// {
		// 	case 'up':
		// 		topOffset = searchBoxPosition.top - resultsElement.height();
		// 		break;
		// 	case 'down':
		// 		topOffset = searchBoxPosition.top + LiveSearch.searchBoxes.outerHeight();
		// 		break;
		// 	default:
		// 		topOffset = searchBoxPosition.top + LiveSearch.searchBoxes.outerHeight();
		// }

		resultsElement.css('top', topOffset + 'px');

	}
};

/**
 * Process the search results that came back from the AJAX call
 */
LiveSearch.handleAJAXResults = function(e) {

	var renderedResult = '';
    LiveSearch.activeRequests.pop();

    if(e) {
        resultsSearchTerm = e.searchTerms;
        if(resultsSearchTerm != jQuery('input:focus').first().val()) {

                if(LiveSearch.activeRequests.length === 0) {
                        LiveSearch.removeIndicator();
                }

                return;
        }

        var resultsShownFor = jQuery('#dwls_search_results').children("input[name=query]").val();
        if(resultsShownFor !== "" && resultsSearchTerm == resultsShownFor)
        {
                if(LiveSearch.activeRequests.length === 0) {
                        LiveSearch.removeIndicator();
                }

                return;
        }

        // var searchResultsList = jQuery("ul").filter(".dwls_search_results");
        // searchResultsList.empty();
        // searchResultsList.append('');

        if(e.results.length === 0) {
                // Hide the search results, no results to show
                LiveSearch.hideResults();
        }
        else {
                // Render the result template
                renderedResult = LiveSearch.compiledResultTemplate({
					'searchResults': e.results,
					'e': e,
					'resultsSearchTerm': resultsSearchTerm
                });


				// if(searchResult.show_more !== undefined && searchResult.show_more && DavesWordPressLiveSearchConfig.showMoreResultsLink == "true") {
    //                 // "more" link
    //                 renderedResult += '<div class="clearfix search_footer"><a href="' + DavesWordPressLiveSearchConfig.blogURL + '/?s=' + resultsSearchTerm + '">' + DavesWordPressLiveSearchConfig.viewMoreText + '</a></div>';
				// }
				var existingResultsElement = jQuery('#dwls_search_results');
				if(existingResultsElement.length > 0) {
					jQuery('#dwls_search_results').replaceWith(renderedResult);
				}
				else {
					jQuery('body').append(renderedResult);
				}
				LiveSearch.positionResults();

                // I'm not comfortable changing the HTML for the results list yet
                // so I'm using this click handler to make clicking the result li act the
                // same as clicking the title link
                jQuery('#dwls_search_results').bind('click.dwls', function() {
                   window.location.href = jQuery(this).find('a.daves-wordpress-live-search_title').attr('href');
                });
        }

        if(LiveSearch.activeRequests.length === 0) {
                LiveSearch.removeIndicator();
        }
    }
};

/**
 * Keypress handler. Sets up a 0 sec. timeout which then
 * kicks off the actual query.s
 */
LiveSearch.handleKeypress = function(e) {
	var delayTime = 0;
	var term = LiveSearch.searchBoxes.val();
	setTimeout( function() {LiveSearch.runQuery(term);}, delayTime);
};

/**
 * Do the AJAX request for search results, or hide the search results
 * if the search box is empty.
 */
LiveSearch.runQuery = function(terms) {
	var searchBox = jQuery('input:focus');
	var srch = searchBox.val();
	var fieldIndex;
	var req;

	if(srch != undefined && (srch === "" || srch.length < DavesWordPressLiveSearchConfig.minCharsToSearch)) {
		// Nothing entered. Hide the autocomplete.
		LiveSearch.hideResults();
		LiveSearch.removeIndicator();
	}
	else {
		// Do an autocomplete lookup
		LiveSearch.displayIndicator();

		// Clear out the old requests in the queue
		while(LiveSearch.activeRequests.length > 0)
		{
			req = LiveSearch.activeRequests.pop();
			req.abort();
		}

		// Marshall the parameters into an object
		var parameters = {};
                var fields = searchBox.parents('form').find('input:not(:submit),select,textarea');
                for(fieldIndex in fields) {
                    if(fields.hasOwnProperty(fieldIndex) && /* test for integer */ fieldIndex % 1 === 0) {
                        var field = jQuery(fields[fieldIndex]);
                        parameters[field.attr('name')] = field.val();
                    }
                }

		// For wp_ajax
		parameters.action = "dwls_search";

        // Do the AJAX call
		req = jQuery.get( DavesWordPressLiveSearchConfig.ajaxURL, parameters, LiveSearch.handleAJAXResults, "json");
		req.fail = LiveSearch.ajaxFailHandler;

		// Add this request to the queue
		LiveSearch.activeRequests.push(req);
	}
};

LiveSearch.ajaxFailHandler = function(data) {

	console.log("Dave's WordPress Live Search: There was an error retrieving or parsing search results");
	console.log("The data returned was:");
	console.log(data);

};

LiveSearch.hideResults = function() {
	var visibleResults = jQuery("#uncode-search-result");

	if(visibleResults.length > 0) {
		LiveSearch.invokeCallbacks('BeforeHideResults');
		switch(DavesWordPressLiveSearchConfig.resultsDirection)
		{
			case 'up':
              visibleResults.fadeOut('normal', function() {
				visibleResults.remove();
				LiveSearch.invokeCallbacks('AfterHideResults');
              });
              break;
			case 'down':
              visibleResults.slideUp('normal', function() {
				visibleResults.remove();
				LiveSearch.invokeCallbacks('AfterHideResults');
              });
              break;
			default:
              visibleResults.slideUp('normal', function() {
				visibleResults.remove();
				LiveSearch.invokeCallbacks('AfterHideResults');
              });
		}
	}
};

/**
 * Display the "spinning wheel" AJAX activity indicator
 */
LiveSearch.displayIndicator = function() {

	if(jQuery(".search_results_activity_indicator").length === 0) {
		var searchBox = jQuery('.uncode-live-search input');
		var searchBoxPosition = searchBox.offset();
		jQuery('.uncode-live-search i').css('opacity',0);
		if (searchBoxPosition != undefined) {
			var getStyle = (searchBox.closest('.style-light').length) ? 'style-light' : 'style-dark';
			jQuery("body").append('<span id="search_results_activity_indicator" class="search_results_activity_indicator '+getStyle+'" />');

			jQuery(".search_results_activity_indicator").css('position', 'absolute').css('z-index', 9999);

			var getAdminBar = parseInt(jQuery('html').css('margin-top'), 10);
			getAdminBar += parseInt(jQuery('html').css('padding-top'), 10);
			var indicatorY = (searchBoxPosition.top + ((searchBox.outerHeight() - searchBox.innerHeight()) / 2) + 12 - getAdminBar + 'px');

			jQuery(".search_results_activity_indicator").css('top', indicatorY);

			var indicatorX = (searchBoxPosition.left + searchBox.outerWidth() - (jQuery(".search_results_activity_indicator").width())) - 20 + 'px';

			jQuery(".search_results_activity_indicator").css('left', indicatorX);
		}

	}

};

/**
 * Hide the "spinning wheel" AJAX activity indicator
 */
LiveSearch.removeIndicator = function() {
	jQuery('.uncode-live-search i').css('opacity',1);
	jQuery(".search_results_activity_indicator").remove();
};

///////////////////
// Initialization
///////////////////

jQuery(function() {
	LiveSearch.init();
});
