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