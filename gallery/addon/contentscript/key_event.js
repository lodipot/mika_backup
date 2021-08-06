//
var keyEvent = {};

keyEvent.process = function(){
	var _convObj = null
	try{
		_loadData = getOption("user_key_obj");
		//console.log(typeof(_loadData));
		_convObj = JSON.parse(_loadData);
	}catch(e){
		//console.log(e);
		_convObj = _loadData;
	}
	if(_convObj){
		this.defineObj = _convObj;
//		console.log(_convObj);
		window.addEventListener("keydown" , this.keydown , false);
	}
	
};


keyEvent.keydown = function(e){

	if((e.target.nodeName == "INPUT" && e.target.type == "text") || e.target.type == "textarea"){
		return;
	}
	
	var _value = keyEvent.defineObj[e.key];
//	console.log(_value);
	if(_value){
		//特殊設定
		if(_value.indexOf("@") == 0){
			if(_value == "@reload"){
				location.reload();
				window.removeEventListener("keydown" , keyEvent.keydown , false);
			}else if(_value == "@prev"){
				keyEvent.prevPage();
			}else if(_value == "@next"){
				keyEvent.nextPage();
			}else if(_value == "@test"){
				//テスト用
				var _testTime = new Date();
				requestTimer("fescombo" , _testTime.getTime() + 1000);
				window.removeEventListener("keydown" , keyEvent.keydown , false);
			}
		}
		else if(_value.length > 7){
			location.href = _value;
			//	window.removeEventListener("keydown" , keyEvent.keydown , false);
		}
	}
};

/*前のページの要素を得て、クリック*/
keyEvent.prevPage = function(){
	var targetElm = document.getElementsByClassName("btn_pager_back");
	if(targetElm.length){
		targetElm[0].click();
	}
	else {
		//なければ旧仕様を探る
		var _imageElms = document.querySelectorAll("a.a_link > img");
		if(_imageElms.length > 0){
			for(var n=0; n<_imageElms.length; n++){
				if(_imageElms[n].src.indexOf("icon_back_on.jpg") != -1){
					_imageElms[n].parentNode.click();
					break;
				}
			}
		}
		else{
			//クローゼット取り出し
			_imageElms = document.querySelectorAll("input[type='image'][name='prev']");
			for(var n=0; n<_imageElms.length; n++){
				if(_imageElms[n].src.indexOf("icon_back_on.jpg") != -1){
					_imageElms[n].click();
					break;
				}
			}
		}
	}
	
};

/*次のページの要素を得て、クリック*/
keyEvent.nextPage = function(){
	var targetElm = document.getElementsByClassName("btn_pager_next");
	if(targetElm.length){
		targetElm[0].click();
	}
	else {
		//なければ旧仕様を探る
		var _imageElms = document.querySelectorAll("a.a_link > img");
		if(_imageElms.length > 0){
			for(var n=0; n<_imageElms.length; n++){
				if(_imageElms[n].src.indexOf("icon_next_on.jpg") != -1){
					_imageElms[n].parentNode.click();
					break;
				}
			}
		}
		else{
			//クローゼット取り出し
			_imageElms = document.querySelectorAll("input[type='image'][name='next']");
			for(var n=0; n<_imageElms.length; n++){
				if(_imageElms[n].src.indexOf("icon_next_on.jpg") != -1){
					_imageElms[n].click();
					break;
				}
			}
		}
		
	}
};

