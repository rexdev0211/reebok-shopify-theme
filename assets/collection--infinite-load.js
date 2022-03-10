ajaxifyCollection = function(settings){
	//code borrowed from https://github.com/Elkfox/Ajaxify
	var linkParent = '.pagination-wrapper'; // Class of pagination container
	var parentContainer = '[data-infinite="true"]'; // All of the content selector used to detect scroll bottom distance
	var endlessScrollContainer = '[data-infinite="true"]'; // Selector for endless scroll pages
	var endlessOffset = 600; // Offset the distance from the bottom of the page
	var ajaxinateContainer = '.Ajaxinate'; // ID Selector for ajax pagination pages
	var ajaxinateLink = '.pagination__item--next-page'; // Class Selector for ajax pagination links
	var fade = 'fast'; // fade speed
    var textChange = 'Loading'; // Text whilst loading content
    var loader = '.loading-spinner--wrapper';

	var linkElem;
	var contentContainer;
	var pageNumber;
	var pageType;
	var action;
	var moreURL;
	var moreURLCheck;
	var currentPage;

	var maxPages = $(linkParent).data('pages');

	var loadedLastPage = false;

	$.loadMore = function() {
		if(settings['isSearch'] == true && moreURL !== undefined) {
			moreURLCheck = moreURL.substring(moreURL.lastIndexOf("?page=")+1,moreURL.lastIndexOf("&q="));
			moreURLCheck = moreURLCheck.split("page=");
			currentPage = moreURLCheck[1];
		}
		else if (settings['isSearch'] != true && moreURL !== undefined) {
			moreURLCheck = moreURL.split("page=");
			currentPage = moreURLCheck[1];
		}
		else {
			currentPage = null;
		}

	   if (currentPage != null && moreURL.length && currentPage <= maxPages && loadedLastPage == false){
           $(linkParent).hide();
           
           $(loader).show();

		 $.ajax({
		   type: 'GET',
		   dataType: 'html',
		   url: moreURL,
		   success: function(data) {
			if(currentPage == maxPages) {
				loadedLastPage = true;
			}
			
            // console.log(data);

			//$(loader).css("position", "absolute");

			var filteredData = $(data).find(contentContainer);

			var filteredDataProducts = filteredData[0].innerHTML;

			var newProdHtml = $(filteredDataProducts);

			$(contentContainer).append(newProdHtml).hide().fadeIn(fade);

            var newProducts = newProdHtml;
            
            moreURL = $(data).find(".pagination .pagination-next").attr('href');

            $(".pagination").html($(data).find(".pagination").html());

			if(settings['hideDuplicates']) {
				// collectionGetVariations(settings, newProducts);
			}

			collectionGetVariations(settings, newProducts);
            
            // SPR.registerCallbacks();
            // SPR.initRatingHandler();
            // SPR.initDomEls();
            // SPR.loadProducts();
            // SPR.loadBadges();

             $(linkParent).hide();
             
			 $(loader).hide();
			 if (pageType == 'endlessScroll') {
			   $.endlessScroll();
			 }
		   },
    		timeout:15000,
			error: function(jqXHR, textStatus, errorThrown) {
				$(loader).hide();
		        if(textStatus === "timeout") {
					$(linkElem).text("Load more");
					$(linkElem).css('opacity', 1);
		        }
		    }
		 });
	   }
	 };


	 $.endlessScroll = function() {
	  action = 'scroll load resize';
	  $(window).on( action, function() {
		contentContainer = endlessScrollContainer;
        moreURL = $(linkElem).last().attr('href');

		pageType = 'endlessScroll';
		$(linkElem).text(textChange);

		var bottom;
		var docTop;

		if ($(contentContainer+':last-of-type '+linkElem).length || $(contentContainer).length == 1){
			if($(contentContainer).length == 1) {
				moreURL = $(linkElem).last().attr('href');
			}
			else {
				moreURL = $(linkElem).last().attr('href');
			}
		  bottom = $( parentContainer ).outerHeight();
		  docTop = ($(document).scrollTop() + $(window).height() + endlessOffset);

		  if( docTop > bottom ) {
			$(window).off(action);
			  $.loadMore();
		  }
		}
	  });
	};

	if ( $( endlessScrollContainer ).length ) {
      linkElem = linkParent + ' ' + ajaxinateLink;
	  $(linkParent).hide();
	  $.endlessScroll();
	}
};
