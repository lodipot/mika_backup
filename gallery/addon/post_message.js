// mkt:imcgと連携する用。 window.open() で呼ばれた時、親に対してウィンドウの位置を送る
window.onbeforeunload = function(e) {

	let _sendObj = {
		status:"unload",
		name:"memo_skill_lv_html",	//background.js および custom_menu_search.js 共通
		left:window.screenLeft,
		top:window.screenTop,
	//	width:window.innerWidth,
	//	height:window.innerHeight,
		width:window.outerWidth,
		height:window.outerHeight,
	//	message:"window onbeforeunload...",
	}
	window.opener.postMessage(_sendObj ,"*");
};