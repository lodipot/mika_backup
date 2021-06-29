$('.card_rotate').on("click", function(e){
	var $wrapper = $( e.currentTarget );
	var $current_target = $wrapper.find(".js_current");
	$wrapper.css("pointer-events", "none");
	$current_target.addClass("rotate_disappear");
	if( $current_target.attr("twinkle") ){
		get_mask().addClass("rotate_disappear");
	}
	/* card closed */
	$current_target.one("webkitAnimationEnd", function(e) {
		var $next_target = $current_target.next();
		if($next_target.hasClass("rotate_img") == false) {
			$next_target = $wrapper.find(".rotate_img").eq(0);
		}
		get_mask().removeClass("rotate_disappear").hide();
		if( $next_target.attr("twinkle") ){
			get_mask().addClass("rotate_appear").show();
		}
		$current_target.removeClass("rotate_disappear js_current").hide();
		$next_target.addClass("rotate_appear js_current").show();
		/* card opened */
		$next_target.one("webkitAnimationEnd", function(e) {
			$next_target.removeClass("rotate_appear");
			get_mask().removeClass("rotate_appear");
			$wrapper.css("pointer-events", "auto");
		})
	})
	function get_mask($target) {
		return $wrapper.find(".mask011, .mask010, .mask01");
	}
});