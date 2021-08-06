var idolGallery = {};



idolGallery.process = function(){
	var _tempElm = document.querySelector(".idolList");
	if(_tempElm){
		_tempElm.style.overflow = "visible";
		_tempElm.style.height = "75px";	
	}
	var _coverElm = document.querySelector("div.cover");
	if(_coverElm){
		_coverElm.style.overflow = "visible";
	}
	
	//div.idol にクリックリスナ細工
	var _idolThumbElms = document.getElementsByClassName("idol");
	for(var n=0; n<_idolThumbElms.length; n++){
		var _Elm = _idolThumbElms[n];
		_Elm.classList.add("mkt_css_marker");	//レイアウト変更用
		_Elm.addEventListener("click" , idolGallery.eventThumbClickHandle , false);
		
		var _hash = _imageZoom.getHashFromSrc(_Elm.style.backgroundImage);
		if(_hash){
		//	console.log(_hash);
			_Elm.appendChild(idolGallery.createImageZoomThumbElm(_hash));
		}
		
	}
	
	//基本要素に監視をつける
	var _idolBaseContentElm = document.getElementById("idol-base-content");
	if(_idolBaseContentElm){	
		var _moBaseContent = new MutationObserver(idolGallery.obs);
		_moBaseContent.observe(_idolBaseContentElm , {childList : true , attributes : true , attributeOldValue : true} );
	}
};

/** オブサーバー @ アイドルギャラリーのコンテンツ領域変更毎に呼ばれる */
idolGallery.obs = function(data1 , data2){
//	console.log(data1 , data2);
	idolGallery.setTradeHash();
//	this.disconnect();
};

//imazeZoom.jsを利用して サムネ作成
idolGallery.createThumbElm = function(_hash){
	if(!_hash){
		return null;
	}
	
//	var _baseURL = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fcard%2Fxs%2F";
	var _baseURL = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fcard%2Fs%2F";
//	http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fcard_sign_b%2Fs%2F775f8939d540b7b1c169ba72be9ca25e.jpg%3Fv%3D20170222083113
	var _imageElm = new Image();
	_imageElm.src = _baseURL + _hash + ".jpg%3Fv%3D20170222083237";
	_imageElm.className = "mkt_gallery_Thumb";
	
	
	
	_imageElm.dataset.hash = _hash;	//ハンドラが参照するので。
		_imageElm.addEventListener('click', function(e){

			_imageZoom.hash = e.target.dataset.hash;
			_imageZoom.premium = e.target.dataset.premium;
			_imageZoom.nodeSetup();

		}, false);
		
	_imageElm.style.verticalAlign = "middle";
	_imageElm.style.display = "inline-block";
	_imageElm.height = "65";
	
	return _imageElm;
};

//サムネクリックで呼ばれる。要素内に data-index があるので回収
//存在しない場合は、子要素(不透明レイヤ)をクリックしているので、親をたどる
idolGallery.eventThumbClickHandle =function(e){
	var _index = e.target.dataset.index;
	var _targetElm = e.target;
	if(!_index){
		_index =  e.target.parentNode.dataset.index;
		_targetElm = e.target.parentNode;
	}
	var _oldTarget = document.querySelector(".mkt_idol_thumb_active");
	if(_oldTarget){
		_oldTarget.classList.remove("mkt_idol_thumb_active");	
	}
	_targetElm.classList.add("mkt_idol_thumb_active");
};

//拡大用のボタンを
idolGallery.createImageZoomThumbElm = function(_hash){
	
	var _setElm = document.createElement("span");
	_setElm.textContent = "view";
	_setElm.className = "mkt_idol_thumb_zoom_btn";
	
	_setElm.dataset.hash = _hash;	//ハンドラが参照するので。
	_setElm.addEventListener('click', function(e){

		_imageZoom.hash = e.target.dataset.hash;
		_imageZoom.nodeSetup();

	}, false);
	
	return _setElm;
};

idolGallery.setTradeHash = function(){
	
	var _targetBtns = document.querySelectorAll("#parameter-content > a");
	var _linkStr = null;
	var _markingNode = null;
//	console.log(_targetBtns);
	for(var n=0; n<_targetBtns.length; n++){
//		console.log(_targetBtns[n]);
		if(_targetBtns[n].textContent.indexOf("フリートレード") != -1){
			//ノード確保
			_markingNode = _targetBtns[n];
			_linkStr = _targetBtns[n].href;
			break;
		}
	}
	
	var _targetElm = document.querySelector(".idolProfile.deck.m-Btm5");
	if(!_targetElm){
		console.warn("プロフィールセレクタ取得に失敗");
	}
	

	if(_linkStr && _markingNode){
		var _matchArr = _linkStr.match(/search_top%2F0%2F([0-9a-f]{32})%3F/);
		if(_matchArr){
		//	console.log(document.querySelector(".mkt_gallery_Thumb"));
			//DOM内に mkt_gallery_Thumb がなければ配置(プレミアムサイン表示回りで重複する)
			if(document.querySelector(".mkt_gallery_Thumb")){
				return;
			}
			
			var _setBaseElm = document.createElement("div");
			_setBaseElm.style.height = "65px";	//カードイメージサムネを囲う高さ

			var _setHistoryURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fhistory%2F"+_matchArr[1];
			var _historyBtn = document.createElement("a");
			_historyBtn.classList.add("grayButton140");
			_historyBtn.style.display = "inline-block";
			_historyBtn.style.margin = "8px";
			_historyBtn.style.width = "110px";
			_historyBtn.style.verticalAlign = "middle";
			_historyBtn.textContent = "フリトレ履歴";
			_historyBtn.href = _setHistoryURL;
	//		_historyBtn.target = "_blank";
			
			var _setSearchURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fsearch_top%2F0%2F"+_matchArr[1];
			var _searchBtn = document.createElement("a");
			_searchBtn.classList.add("grayButton140");
			_searchBtn.style.display = "inline-block";
			_searchBtn.style.margin = "8px";
			_searchBtn.style.verticalAlign = "middle";
			_searchBtn.style.width = "110px";

			_searchBtn.textContent = "フリトレ検索";
			_searchBtn.href = _setSearchURL;
	//		_searchBtn.target = "_blank";
			//配置
			_setBaseElm.appendChild(_historyBtn);
			_setBaseElm.appendChild(_searchBtn);
			_setBaseElm.appendChild(idolGallery.createThumbElm(_matchArr[1]));
			
			_targetElm.parentNode.insertBefore(_setBaseElm , _targetElm);
	
			
			
			
		}
	}
	
};


