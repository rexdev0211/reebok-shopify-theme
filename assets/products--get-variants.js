var uniqueProdNamesArray = [];

collectionGetVariations = function(settings = {}, filteredDataProducts) {
	var variantPrice = [];
	var variantCompareAtPrice = [];

	var prodsWithVariants = [];

	var newlyLoadedProdsWithVariants = [];

	var newlyLoadedProdsHtml;

	var productSelector = ".product-item";
	var swatchSelectedClass = "color-swatch--selected";
	var priceContainerClass = "price";
	var priceContainerSelector = "." + priceContainerClass;
	var variantPriceContainerClass = "variant-prices";
	var variantPriceContainerSelector = "." + variantPriceContainerClass;

	var pageProducts = $(productSelector);

	var filteredDuplicateProducts = [];

	var lowestPrice;
	var highestPrice;
	var highestCompareAtPrice;

	var allPrices = [];
	var allCompareAtPrices = [];

	var variantsPriceRanges = false;
	var variantsSamePrices = false;

	var htmlOutput = '';

	var percentOff;

	// var htmlSaleLabel = '<p class="product-sale-tag">' +  + '</p>';

	var currentProductPrice = '';
	var currentProductCompareAtPrice = '';

	var limitVariantSwatches = settings['limitSwatches'] ? settings['limitSwatches'] : 0;


	if (filteredDataProducts) {
		pageProducts = $(filteredDataProducts).filter(productSelector);
	}


	function checkArrValueSameness(array){
		return !array.some(function(value, index, array){
			return value !== array[0];
		});
	}


	function checkIfSale(mainProd) {
		lowestPrice = 0;
		highestPrice = 0;
		highestCompareAtPrice = 0;

		allPrices = [];
		allCompareAtPrices = [];

		variantsPriceRanges = false;
		variantsSamePrices = false;

		htmlOutput = '';

		percentOff = 0;

		currentProductPrice = $(mainProd).eq(0).find('.product-price').data('price');
		currentProductCompareAtPrice = $(mainProd).eq(0).find('.product-price').data('compare-at-price');

		allPrices.push(currentProductPrice);

		if(currentProductCompareAtPrice > 0) {
			allCompareAtPrices.push(currentProductCompareAtPrice);
		}

		$(mainProd).eq(0).find('.variant-price').each(function(){
			if($(this).data('variant-price') > 0){
				allPrices.push($(this).data('variant-price'));
			}
		});


		$(mainProd).eq(0).find('.variant-compare-at-price').each(function(){
			if($(this).data('variant-compare-at-price') > 0) {
				allCompareAtPrices.push($(this).data('variant-compare-at-price'));
			}
		});

		if(allPrices.length > 0) {
			lowestPrice = Math.min.apply(Math, allPrices);

			highestPrice = Math.max.apply(Math, allPrices);
		}

		if(allCompareAtPrices.length > 0){
			highestCompareAtPrice = Math.max.apply(Math, allCompareAtPrices);
		}


		if (highestCompareAtPrice > 0) {
			var largestPrice;

			var arePricesTheSame = checkArrValueSameness(allPrices);

			if(arePricesTheSame === true) {
				percentOff = Math.round((currentProductCompareAtPrice - currentProductPrice) * 100 / currentProductCompareAtPrice);

				htmlOutput = "<p><s>"+Trend.Currency.formatMoney(currentProductCompareAtPrice)+"</s></p><p>"+Trend.Currency.formatMoney(currentProductPrice)+"</p>";
		 
				$(mainProd).eq(0).find(".product-price").html(htmlOutput);
             
			}
			else {
				percentOff = Math.round((highestCompareAtPrice - lowestPrice) * 100 / highestCompareAtPrice);

				htmlOutput = "<p><s>"+Trend.Currency.formatMoney(highestCompareAtPrice)+"</s></p><p>"+Trend.Currency.formatMoney(lowestPrice)+"</p>";

				$(mainProd).eq(0).find(".product-price").html(htmlOutput);
              
			}
		}
	}

	function checkForDuplicates(){
		$(pageProducts).each(function(){

			var addProdName = $(this).find(".card-wrapper").length > 0 &&  $(this).find(".card-wrapper").data('prodName') ? $(this).find(".card-wrapper").data('prodName') : $(this).data("prodName");

			if(uniqueProdNamesArray.indexOf(addProdName) > -1) {
				$(this).remove();
				// $(this).closest("li").remove();
			}
			else {
				uniqueProdNamesArray.push(addProdName);
				filteredDuplicateProducts.push(this);
			}
		});
	}

	function getColorSwatch(p, currentMainProduct, currentMainProductName) {
		var hex = '';

		for(var tag = 0; tag < p.tags.length; tag++) {
			if(p.tags[tag].indexOf("#") > -1) {
				hex = p.tags[tag];
				break;
			}
		}

		if(hex !== '') {
			var colorUrl = window.location.pathname + "products/" + p.handle;

			if($(".template-product").length > 0 || $(".template-search".length > 0)) {
				colorUrl = "products/" + p.handle;
			} 

			var collectionUrl = $(currentMainProduct).data("collection");
			var swatchSize = $(currentMainProduct).data("swatchSize");

			let swatchCode = `
			<div data-swatch-variant-price="${p.price}" data-swatch-variant-compare-at-price="${p.compare_at_price}"  data-swatch-prod-name="${p.handle}" class="color-swatch__wrapper color-swatch--${swatchSize ? swatchSize : 'small'}"  data-swatch-is-variant="true" data-color-url="${colorUrl}">
				<a href="${collectionUrl ? collectionUrl + '/' : ''}${colorUrl}" class="color-swatch color-swatch-${p.handle}">
					<span class="sr-only">${p.title.trim()}</span>
					<img src="${Trend.Images.getSizedImageUrl(p.media[0].src, 'x40')}" loading="lazy" />
				</a>
			</div>\n\r
			`;

			$(currentMainProduct).find(".color-swatches .color-swatches__swatch-wrapper").append(swatchCode);
		}

	}

	function getPrices(p, currentMainProduct, currentMainProductName){
		$(currentMainProduct).find(".variant-prices").append("<div data-prod-for-price='" + p.handle + "' class='variant-price' data-variant-price="+p.price+" data-variant-compare-at-price="+p.compare_at_price+"> </div>");
	}

	function getFeaturedImage(p, currentMainProduct) {

		var firstImage = '';
		var secondImage = '';
		var hasSecondImage = '';

		if(p.media.length > 0) {
			if(p.media[0] != null) {
				firstImage = "<img data-variant='"+p.handle+"' loading='lazy' src='"+ Trend.Images.getSizedImageUrl(p.media[0].src, '500x') +"' class='motion-reduce card__media--variant card__media--bottom card__media--variant-bottom' alt='"+(p.media[0].alt ? p.featured_image.alt : "")+"' width='"+p.media[0].width+"' height='"+p.media[0].height+"' />"
			}

			if(p.media.length > 1) {
				hasSecondImage = 'image-hover';
				secondImage = "<img data-variant='"+p.handle+"' loading='lazy' src='" + Trend.Images.getSizedImageUrl(p.media[1].src, '500x') + "' class='motion-reduce card__media--variant card__media--top card__media--variant-top' alt='"+(p.media[1].alt ? p.media[1].alt : "")+"' width='"+p.media[1].width+"' height='"+p.media[1].height+"' />";
			}
		}

		let imageHtml = `${firstImage}${secondImage ? secondImage : ''}`;
		$(currentMainProduct).find(".card__media .media").append(imageHtml);

	}

	function areSwatchesWithinLimit(currentMainProduct) {
		var swatchContainer = currentMainProduct.find(".color-swatches__swatch-wrapper");
		var currentProductSwatchCount = swatchContainer.find(".color-swatch").length;
		var currentProductPlusSwatch = swatchContainer.find(".additional-swatch-count");

		if(limitVariantSwatches && limitVariantSwatches > 0) {
			if(currentProductSwatchCount >= limitVariantSwatches) {
				if(!currentProductPlusSwatch || currentProductPlusSwatch.length === 0 ) {
					var plusLink = currentMainProduct.find(".card__link").prop("href");
					if(plusLink) {
						swatchContainer.append(`<a href="${plusLink}" class="full-unstyled-link inline-block additional-swatch-count"><span>+</span></a>`);
					}
				} 
				return false;
			} else {
				return true
			}
		} else {
			return true;
		}

	}

	function ajaxGetInfo(productColorHandlesArray, currentMainProduct, currentMainProductName, index) {
		var colorHandleName = '';

		if(!productColorHandlesArray) {
			return false;
		}

		jQuery.getJSON('/products/'+productColorHandlesArray+'.js', function(p) {
			if(p.available == true) {
				var showSwatch = areSwatchesWithinLimit(currentMainProduct);
				
				if(showSwatch) {
					colorHandleName = productColorHandlesArray;

					if(settings['showSwatches']) {
						getColorSwatch(p, currentMainProduct, currentMainProductName);
					}
	
					getFeaturedImage(p, currentMainProduct, currentMainProductName);
	
					getPrices(p, currentMainProduct, currentMainProductName);
				}

				// if($(currentMainProduct).find(".additional-swatch-count").length > 0) {
				// 	let swatchCount = (currentMainProduct).find(".additional-swatch-count").data("count");
				// 	$(currentMainProduct).find(".additional-swatch-count").data("count", swatchCount + 1);
				// }
				
				var indexCount = parseInt(index) + 1;

				prodsWithVariants.push(currentMainProductName);

				return true;
			}
		});
	}


	function getVariantInfo() {
		if(filteredDuplicateProducts.length > 0){
			pageProducts = filteredDuplicateProducts;
		}


		$(pageProducts).each(function(){

			var currentMainProductName = $(this).children().data('prodName');

			var productInfo = $(this).children().data('productInfo');
			var currentMainProduct = $(this).children();

			var productColorHandles = $(this).children('.card-wrapper').data('productOtherColorHandles');
			// var currentMainProdPrice = $(this).children().find(".product-price").data('prod-price');
			// var currentMainProdCompareAtPrice = $(this).children().find(".product-price").data('compare-at-price');
			
			if(productColorHandles) {
				if(Array.isArray(productColorHandles)) {
					productColorHandlesArray = [...productColorHandles];
				} else {
					productColorHandlesArray = $.trim(productColorHandles).split(" ");
				}
				
			}
			else {
				productColorHandlesArray = [];
			}

			variantHandles = [];

			if(productColorHandlesArray.length > 0) {
				for(var i = 0; i < productColorHandlesArray.length; i++) {

					if(productInfo !== productColorHandlesArray[i]) {
						ajaxGetInfo(productColorHandlesArray[i], currentMainProduct, currentMainProductName, i);
					}

				}

			}

		})
	}

	function swapProductContentWithVariant(event, swatch, setMain = false) {
		var isClick = event && event.type === 'click' ? true : false;
		var isMouseOut = event && event.type === 'mouseout' ? true : false;

		var swatchInfo = swatch.parent();

		var parentProduct = swatchInfo.closest(productSelector).find(".card-wrapper");
		var parentProductName = parentProduct.data('productInfo')
		var swatchName = swatchInfo.data("swatchProdName");

		var findImage = '[data-variant="'+swatchName+'"]';
		var nameMatchWithMain = parentProductName === swatchName;
		var isVariant = setMain || nameMatchWithMain ? false : swatchInfo.data('swatchIsVariant');

		
		var colorUrl = setMain || nameMatchWithMain ? parentProductName : swatchInfo.data("colorUrl");
		var collectionUrl = parentProduct.data("collection");
		var variantUrl = `${collectionUrl ? collectionUrl + '/' : ''}${colorUrl.indexOf('products') > -1 ? '' : 'products/'}${colorUrl}`;
		var swatchColor = swatchInfo.data("swatchProdName");


		var swatchPrice = swatchInfo.data('swatchVariantPrice');
		var swatchCompareAtPrice = swatchInfo.data('swatchVariantCompareAtPrice');

		parentProduct.find(".color-swatch__wrapper").not(this).removeClass(swatchSelectedClass);
		$(swatch).parent().addClass(swatchSelectedClass);

		parentProduct.find("a").each(function() {
			$(this).prop("href", variantUrl);
		})

		parentProduct.find(".card__media .card__media--variant").removeClass('card__media--variant-active');

		parentProduct.find(findImage).addClass("card__media--variant-active");

		parentProduct.find(".card__badge [data-badge-main]").hide();

		if(!isVariant) {
			parentProduct.find(".card__badge [data-badge-variant]").html(null);
			parentProduct.find(".card__badge [data-badge-main]").show();
			parentProduct.find(".card__price").removeClass('hide');
			parentProduct.find(".card__price--variant").addClass('hide');
			parentProduct.find('.card__media .media').remove('card__media--variants');
		} else  {
			parentProduct.find(".card__price").addClass('hide');
			parentProduct.find(".card__price--variant").removeClass('hide');

			parentProduct.find('.card__media .media').addClass('card__media--variants');

			if(swatchPrice < swatchCompareAtPrice && parentProduct.find(".badge--sale").length === 0) {
				parentProduct.find(".card__badge [data-badge-variant]").html(generateBadgeSale(swatchPrice, swatchCompareAtPrice));
			} else if(swatchPrice >= swatchCompareAtPrice && parentProduct.find(".badge--sale").length > 0) {
				parentProduct.find(".card__badge [data-badge-variant] .badge--sale").remove();
			} else if (swatchPrice < swatchCompareAtPrice && parentProduct.find(".badge--sale").length > 0) {
				parentProduct.find(".card__badge [data-badge-variant]").html(generateBadgeSale(swatchPrice, swatchCompareAtPrice));
			}

			updateVariantPrices(parentProduct, swatchPrice, swatchCompareAtPrice)
		}

		if(isClick) {
			parentProduct.find(".color-swatch__wrapper").removeClass('color-swatch--main');
			swatch.addClass('color-swatch--main');
		}
	}


	function update() {
		setTimeout(function() {
			for(var j = 0; j < prodsWithVariants.length; j++) {
				checkIfSale($('[data-prod-name="'+prodsWithVariants[j]+'"]'));
			}
			
			$(".color-swatches").not(".product-color-swatches").find(".color-swatch")
			.unbind("mouseenter")
			.mouseenter(function(e) {
				swapProductContentWithVariant(e, $(this));
			});

			$(".card--product").unbind("mouseleave").mouseleave(function(e) {
				swapProductContentWithVariant(e, $(this), true)
			});
		}, 100)

		setTimeout(function() {
			$(".color-swatches").not(".product-color-swatches").each(function() {
				if($(this).find(".color-swatch__wrapper").length > 1) {
					$(this).removeClass('hide');
					var swatchContainer = $(this).find('.color-swatches__swatch-wrapper');

					if(!swatchContainer.hasClass("slick-initialized")) {
						var numOfSwatches = swatchContainer.find(".color-swatch__wrapper").length;
						var count = swatchContainer.closest(productSelector).find(".card-product__color-counter").removeClass('sr-only');
						count.find("[data-color-counter-number]").text(numOfSwatches);
						count.find("[data-color-counter-label]").text('colours');
	
						count.show();
						
						//SWATCH SLIDER
						if(numOfSwatches > 1) {
							setTimeout(function() {
								// swatchContainer.slick({
								// 	slidesToShow: 6,
								// 	arrows: true,
								// 	speed: 300
								// })
							}, 100);
						}
					}
				} else {
					$(this).remove();
				}
			})
		}, 1000);
	
		
	}

	function filterImagesForSwatch(color, currentProd) {
		var slickContainer = $(currentProd).closest(productSelector).find(".product-image-slick");
		$(slickContainer).slick('slickUnfilter');
		$(slickContainer).slick('slickFilter','[data-image-color="' + color + '"]');
	}

	function updateVariantPrices(currentProd, price, compareAt) {
		var onSale = compareAt && price < compareAt ? true : false;

		var saleClasses = 'price--on-sale';

		var variantPriceContainer = $(currentProd).find('.card__price--variant');

		if(onSale) {
			variantPriceContainer.find(".price").addClass(saleClasses);
		} else {
			variantPriceContainer.find(".price").removeClass(saleClasses);
		}

		variantPriceContainer.find('.price__regular .price-item--regular').text(Trend.Currency.formatMoney(price));
		variantPriceContainer.find('.price__sale .price-item--regular').text(Trend.Currency.formatMoney(compareAt));
		variantPriceContainer.find('.price__sale .price-item--sale').text(Trend.Currency.formatMoney(price));
		
	}

	function generateBadgeSale(price, compareAtPrice) {
		let percentOff = Math.round((compareAtPrice - price) * 100 / compareAtPrice);
		return `
			<div>
              <span class="badge badge--top-left badge--sale color-sale" aria-hidden="true">−${percentOff}%</span>
              <span class="sr-only">Sale</span>
            </div>
		`
	}

	
	$(document).ajaxStop(function () {
		update();
	});

	update();

	if(settings['hideDuplicates']) {
		checkForDuplicates();
	}

	getVariantInfo();
};
