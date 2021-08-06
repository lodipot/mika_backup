/*	イベント編成で、入れ替え編成の要素から、自鯖に問い合わせる処理などを組み込む
	manifest.jsonではdocument_endのタイミングで呼ばれるので
	first_load.js と干渉せず、完全に独立している
*/
var idolUnit = {};

idolUnit.mob = null;

idolUnit.setBtnElm = null;
idolUnit.setUnitBtnElm = null;

idolUnit.analyzeElm = null;

idolUnit.unitObj = {};

idolUnit.requestMemoryObj = {};


/** 対象の要素を解析。本スクリプトの末尾で実行 */
idolUnit.process = function(){
	
	return;
	//入れ替え編成の要素を監視
	var _watchMask0Elm = document.querySelector("#ibox_mask0");	//ibox_mask0(アイバラ)→ibox_mask(ドリフ)
	if(_watchMask0Elm){
			//▼深度1 @ bodyに#readyを検知するための監視をつける
		idolUnit.mob = new MutationObserver(idolUnit.targetObserver);
		idolUnit.mob.observe(_watchMask0Elm , {childList : true } );
	}else{
		console.log("#ibox_mask0 の取得に失敗");
	}

	var _watchMaskElm = document.querySelector("#ibox_mask");	//ibox_mask0(アイバラ)→ibox_mask(ドリフ)
	if(_watchMaskElm){
			//▼深度1 @ bodyに#readyを検知するための監視をつける
		idolUnit.mob = new MutationObserver(idolUnit.targetObserver);
		idolUnit.mob.observe(_watchMaskElm , {childList : true } );
	}else{
		console.log("#ibox_mask の取得に失敗");
	}

};


/** オブサーバー挙動 */
idolUnit.targetObserver = function(data1 , data2){
//	console.log(data1.length , data1);
	if(data1.length == 1){
		idolUnit.setPanelElm(data1[0].target);
	}
	idolUnit.mob.disconnect();	//のっけから監視を解除
	
};


/** オブサーバで変更を検知したときに呼ばれる。disconnect済みなので、このメソッドが複数呼ばれることは無い */
idolUnit.setPanelElm = function(_Node){
	
	idolUnit.analyzeElm = _Node;
//	console.log(idolUnit.analyzeElm);
	
	//要素を作成して配置
	var _setBaseElm = document.createElement("div");
	idolUnit.setBtnElm = document.createElement("a");
	idolUnit.setBtnElm.className = "btn_normal_line_2";
	idolUnit.setBtnElm.style.display = "inline-block";
	idolUnit.setBtnElm.textContent = "リスト化";
	//クリックしたら解析するハンドラ
	idolUnit.setBtnElm.addEventListener("click",idolUnit.analyze ,false);
	
	//POST用フォーム	
	//idolUnit.setUnitBtnElm = idolUnit.hashAnalyzeNode();
	
	_setBaseElm.appendChild(idolUnit.setBtnElm);
	//_setBaseElm.appendChild(idolUnit.setUnitBtnElm);
	_setBaseElm.style.width = "100%";
	_setBaseElm.style.height = "50px";
	_setBaseElm.style.textAlign = "center";
	
	//いつのまにか要素名変わっていたので対応
	var _markElm = idolUnit.analyzeElm.querySelector(".area-popup_wrap");
	if(_markElm){
		_markElm.appendChild(_setBaseElm);
	}else {
		console.error("_markElmの取得に失敗");
	}
	
};


/** 簡易出力用のPOSTフォームを作成して返す */
idolUnit.hashAnalyzeNode = function(){
	
	let _imageElms = idolUnit.analyzeElm.getElementsByTagName("img");
	if(_imageElms.length > 0){
		
		
		let _tempForm = document.createElement("form");
	//	_tempForm.action = "http://php.test/idolunit/";
		_tempForm.action = "http://mkt.packetroom.net/idolunit/";
		_tempForm.method = "post";
		_tempForm.target = "_blank";
		_tempForm.title = "このユニットのメンバーを、簡易シミュレーションサイトへ書き出します\n人気度や序列の編集、特技影響の可視化も行えます";
		_tempForm.style.display = "inline-block";
		let _unitNameInputNode = document.createElement("input");
		_unitNameInputNode.name = "unitname";
		_unitNameInputNode.type = "hidden";
		_unitNameInputNode.value = "イベント編成からのコピー";
		_tempForm.appendChild(_unitNameInputNode);

		let _labelNode = document.createElement("label");
		_labelNode.className = "btn_decision_line_2";

		let _submitNode = document.createElement("input");
		_submitNode.type = "submit";
		_submitNode.value = "シミュレーション";
		_labelNode.appendChild(_submitNode);

		_tempForm.appendChild(_labelNode);

		let _hashArr = [];
		for(var n=0; n<_imageElms.length; n++){
			var _matchArr = _imageElms[n].src.match(/([0-9a-f]{32}).jpg/);	//32のハッシュ画像
			if(_matchArr){
				_hashArr.push(_matchArr[1]);
				//inputをformに入れる
				var _tempInputElm = document.createElement("input");
				_tempInputElm.type = "hidden";
				_tempInputElm.name = _matchArr[1];
				_tempForm.appendChild(_tempInputElm);
			}
		}
	//	console.log(_hashArr);
		document.body.appendChild(_tempForm);
		return _tempForm;
	}else{
		console.error("missing imgs");
	}
	
};


/** 解析をクリックしたときに呼ばれる */
idolUnit.analyze = function(){
	//自分自身のリスナをremove
	idolUnit.setBtnElm.removeEventListener("click",idolUnit.analyze ,false);
	idolUnit.setBtnElm.textContent = "通信中...";
	
	var _imageElms = idolUnit.analyzeElm.getElementsByTagName("img");
	if(_imageElms.length > 0){
		
		var _hashArr = [];
		for(var n=0; n<_imageElms.length; n++){
		//	console.log(_imageElms[n].src);
			var _matchArr = _imageElms[n].src.match(/([0-9a-f]{32}).jpg/);	//32のハッシュ画像
			if(_matchArr){
				_hashArr.push(_matchArr[1]);
		//		console.log(_matchArr[1].length);
			}
		
		}
	//	console.log(_hashArr);
		//リクエスト記憶用添え字を与える
		for(var n=0; n<_hashArr.length; n++){
			idolUnit.requestMemoryObj[n] = true;
		}
		
		console.log(idolUnit.requestMemoryObj);
	//	var _idolObjArr = [];
		for(var n=0; n<_hashArr.length; n++){
			idolUnit.getIdolDataSaveObj(n , _hashArr[n]);
		}
		
	}else{
		console.warn("img要素の取り出しに失敗");
	}
	
	
};

/** サーバーに一件ずつ問い合わせ onload内で、リクエスト記憶領域をアクセス都度 false に更新していく*/
idolUnit.getIdolDataSaveObj = function(_index , _hash){

//	var	postURL = "http://mkt.s189.xrea.com/idoldata/?hash="+_hash;
	var	postURL = "http://mkt.packetroom.net/idoldata/?hash="+_hash;
	var httpObj = new XMLHttpRequest();
	httpObj.open("POST", postURL, true);

	httpObj.onload = (function(){
//		console.log(this.responseText);
		try{
			var _parseData = JSON.parse(this.responseText);
			if(_parseData){
				//クロージャ添え字とパースオブジェクトを使って確保
				idolUnit.unitObj[_index] = _parseData;
				//リクエスト添え字を false にして、都度チェック
				idolUnit.requestMemoryObj[_index] = false;
				idolUnit.callBackRequestCheck();
			}
		}catch(e){
			console.log(e);
			//失敗しても都度チェック
			idolUnit.requestMemoryObj[_index] = false;
			idolUnit.callBackRequestCheck();
		}

	});
	httpObj.send();
};

/** いわゆるコールバック
	ajaxのonload内で都度呼ばれ、リクエスト記憶領域オブジェクトのフラグが全てfalseか確認する */
idolUnit.callBackRequestCheck = function(){
	//全てfalseなら処理が終了している。よって、一つでもtrueなら returnで弾く
	for(var t in idolUnit.requestMemoryObj){
//		console.log(t , idolUnit.requestMemoryObj[t]);
		if(idolUnit.requestMemoryObj[t] == true){
			return;
		}
	}
	//▼すべての処理が終了したら、要素を準備
	console.log("complete!!");
	console.log(idolUnit.unitObj);
	
	var _setIdolListStr = "";
	var _Len = Object.keys(idolUnit.unitObj).length;
	for(var t in idolUnit.unitObj){
		_setIdolListStr += idolUnit.unitObj[t].name;
		if(_Len-1 > t){
			_setIdolListStr += "\n";
		}
	//	console.log(t , _Len);
	}
//	console.log(_setIdolListStr);
	idolUnit.setBtnElm.textContent = "コピー";

	//▼クリップボードイベント
	idolUnit.setBtnElm.addEventListener('click' , function(){
		ClipBoardCopy(_setIdolListStr);
		BackgroundNotification("clipboardcopy" , _Len);
		
	},false);

};

idolUnit.process();

