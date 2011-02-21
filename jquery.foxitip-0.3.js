/*!
 * name: foxitip
 * author: Stefan Benicke - www.opusonline.at
 * version: 0.3
 * last update: 21.02.2011
 * category: jQuery plugin
 * license: GNU GPLv3
 */
(function($) {
	
	var defaults = {
		title: true,
		text: true,
		xOffset: 9,
		yOffset: 9,
		smoothMove: 3,
		fadeSpeed: 200,
		className: 'foxitip'
	},
	window_width,
	window_height,
	scroll_top,
	scroll_left,
	mouse_top,
	mouse_left,
	tip_top,
	tip_left,
	tip_width,
	tip_height,
	timer,
	$window = $(window),
	$document = $(document),
	$tip,
	$title,
	$text,
	getSize = function(){
		window_width = Math.round($window.width());
		window_height = Math.round($window.height());
	},
	getScroll = function(){
		scroll_top = Math.round($document.scrollTop());
		scroll_left = Math.round($document.scrollLeft());
	};
	
	$window.resize(getSize).scroll(getScroll);
	
	$document.ready(function(){
		getSize();
		getScroll();
		if (!$('#foxitip').length) {
			$('body').append('<div id="foxitip"><div id="foxitip_title"></div><div id="foxitip_text"></div></div>');
		}
		$tip = $('#foxitip');
		$title = $('#foxitip_title');
		$text = $('#foxitip_text');
	});
	
	$.fn.foxitip = function(options){
		
		var options = $.extend({}, defaults, options),
		title,
		text,
		enter = function(){
			$tip.stop(true, true).addClass(options.className);
			if (title != '' && options.title) $title.html(title).show();
			else $title.hide();
			if (text != '' && options.text) $text.html(text).show();
			else $text.hide();
			tip_top = mouse_top + options.yOffset;
			tip_left = mouse_left + options.xOffset;
			tip_width = Math.round($tip.outerWidth());
			tip_height = Math.round($tip.outerHeight());
			if (tip_top > window_height + scroll_top - tip_height) {
				tip_top = mouse_top - tip_height - options.yOffset;
			}
			if (tip_left > window_width + scroll_left - tip_width) {
				tip_left = mouse_left - tip_width - options.xOffset;
			}
			$tip.css({top:tip_top, left:tip_left}).fadeIn(options.fadeSpeed);
			move();
		},
		leave = function(){
			clearTimeout(timer);
			$tip.fadeOut(options.fadeSpeed, function(){
				$tip.removeClass(options.className);
			});
		},
		update = function(event){
			mouse_top = event.pageY;
			mouse_left = event.pageX;
		},
		move = function(){
			var new_top = mouse_top + options.yOffset,
			new_left = mouse_left + options.xOffset;
			if (new_top > window_height + scroll_top - tip_height) {
				new_top = mouse_top - tip_height - options.yOffset;
			}
			if (new_left > window_width + scroll_left - tip_width) {
				new_left = mouse_left - tip_width - options.xOffset;
			}
			tip_top += Math.round((new_top - tip_top) / options.smoothMove);
			tip_left += Math.round((new_left - tip_left) / options.smoothMove);
			$tip.css({top:tip_top, left:tip_left});
			timer = setTimeout(move, 30);
		};
		
		return this.each(function(){
			
			var $me = $(this),
			mytitle = $me.html(),
			mytext = $me.attr('title') || $me.attr('href'),
			myenter = function(event){
				mouse_top = event.pageY;
				mouse_left = event.pageX;
				if (typeof options.title == 'function') title = options.title.call($me, mytitle);
				else title = mytitle;
				if (typeof options.text == 'function') text = options.text.call($me, mytext);
				else text = mytext;
				enter();
			};
			
			$me.removeAttr('title').attr('alt', '').mouseenter(myenter).mouseleave(leave).mousemove(update);
			
		});
	};
})(jQuery);
