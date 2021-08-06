//女子寮一覧のレイアウトを変更するだけ


/** 女子寮の入寮,呼び出し 画面で呼び出される */
var idolStorageLayout = {	};

//ノード確保
idolStorageLayout.nodeObj = {
	topStorageInfoNode:null		//第〇女子寮　人数と所属アイドル数を格納しているノード
	,typeFilterAreaNode:null	//All Cu Co Pa のフィルタ
	,selectFromNode:null		//ソートセレクトの form 要素
	,premiumFromNode:null		//Pサインの form 要素
	,linkPopPushLinkNode:null	//入寮または呼び出しの相互ハイパーリンク
	//
//	,imageLabelPopPushNode:null	//呼び出すアイドル or 入寮させるアイドル のラベル領域
	,listTypeBtnAreaNode:null	//一覧表示⇔詳細表示 の青ボタン2つを格納している領域
//	,idolSelectedInfoNode:null	// n人選択中 の表示領域

};

/** レイアウト変更に伴う処理は、ほぼ MKTCSS に任せている */
idolStorageLayout.process = function(){
	
	saveOption("layout_storage_pop_push_check" , true);	//毎回ON
	
	if(!getOption("layout_storage_pop_push_check") || urlCheck("trainer_card_storage") || urlCheck("card_storage%2Fsearch_top") || urlCheck("card_storage%2Frename")){
		//機能OFF or トレーナールーム or 女子寮検索結果 or 名前変更 ならこの処理は行わない		
		return;
	}
	
	idolStorageLayout.submitBtnNameChange();	//ボタン名変更処理
	
	try{
		if(idolStorageLayout.collectNode()){	//ノード収集
			if(idolStorageLayout.collectInfo()){	//情報収集
				if(idolStorageLayout.headerChange()){	//実変更作業
					if(idolStorageLayout.headerChange_B()){
						return true;
					}
				}
			}
		}
	//	saveOption("layout_storage_pop_push_check" , false);
		
	}catch(e){
		console.warn(e);
		saveOption("layout_storage_pop_push_check" , false);
		console.error("レイアウト変更処理で例外が発生しました layout_storage_pop_push_check は無効となります");
	}
};


idolStorageLayout.infoObj = {};
//入寮呼び出しフィルタレイアウトノード
idolStorageLayout.collectNode = function(){
	
	var _node = this.nodeObj;
	_node.topStorageInfoNode = document.querySelector("#top>header>div>div");
	if(_node.topStorageInfoNode){
		_node.typeFilterAreaNode = document.querySelector(".tab_attr_4");
		if(_node.typeFilterAreaNode){
			_node.premiumFromNode = document.querySelector(".selectArea_more_contents>form");	//プレミアムサインフォーム
			if(_node.premiumFromNode){
				_node.selectFromNode = document.querySelector("div.selectArea.type_02.m-Btm12>form");	//ソートフォーム
				if(_node.selectFromNode){
					_node.linkPopPushLinkNode = _node.selectFromNode.parentNode.nextElementSibling;	//入寮⇔呼出切替
					if(_node.linkPopPushLinkNode){
						_node.listTypeBtnAreaNode = document.querySelector("#top>section>div.tab_common-middle.m-Btm8");	//一覧⇔詳細
						if(_node.listTypeBtnAreaNode){
							return true;	
						}else{
							//入寮させるアイドルが0の場合、このノードが取れないケースがある
							console.log(_node.listTypeBtnAreaNode , "ノードコレクト失敗");
						//	return true;
						}
					}
				}	
			}
		}
	}

	console.log(_node , "ノードコレクトのいずれかに失敗しています");

};
/** collectNode() で集めた nodeObj から情報をセットする */
idolStorageLayout.collectInfo = function(){

	var _node = this.nodeObj;
	var _info = this.infoObj;
	var _tempStr = _node.topStorageInfoNode.textContent;
	_info.storageNum = parseInt(_tempStr.match(/第([0-9]{1,2})女子寮/)[1] , 10);
	_info.storageIdolNow = parseInt(_tempStr.match(/女子寮 ([0-9]{1,})\//)[1] , 10);
	_info.storageIdolMax = parseInt(_tempStr.match(/\/([0-9]{1,})人/)[1] , 10);
	_info.idolNow = parseInt(_tempStr.match(/: ([0-9]{1,})/)[1] , 10);
	_info.idolMax = parseInt(_tempStr.match(/ \/ ([0-9]{1,})人/)[1] , 10);
//	console.log(_info);

	return true;
};
/** 寮および所属人数 , 属性フィルタアイコン , プレミアムサイン , フィルタform要素の構築 */
idolStorageLayout.headerChange = function(){
	var _node = this.nodeObj;
	var _info = this.infoObj;
	
	var _setBaseElm = document.createElement("div");
	_setBaseElm.style.height = "52px";
	
	var _areaA = document.createElement("div");
		var _storageNode = document.createElement("span");
		_storageNode.textContent = "第 "+_info.storageNum+" : ";
		var _storageIdolNowNode = document.createElement("span");
		_storageIdolNowNode.className = (_info.storageIdolNow<_info.storageIdolMax)?"yellow":"red";
		_storageIdolNowNode.textContent = _info.storageIdolNow;
		var _storageIdolMaxNode = document.createElement("span");
		_storageIdolMaxNode.textContent = " / "+_info.storageIdolMax;
	
		var _idolNode = document.createElement("span");
		_idolNode.textContent = " 所属 : ";
		_idolNode.className = "blue";
		var _idolNowNode = document.createElement("span");
		_idolNowNode.textContent = _info.idolNow;
		_idolNowNode.className = (_info.idolNow<_info.idolMax)?"yellow":"red";
		var _idolMaxNode = document.createElement("span");
		_idolMaxNode.textContent = " / "+_info.idolMax;
	
		_areaA.appendChild(_storageNode);	
		_areaA.appendChild(_storageIdolNowNode);	
		_areaA.appendChild(_storageIdolMaxNode);	
		_areaA.appendChild(_idolNode);	
		_areaA.appendChild(_idolNowNode);	
		_areaA.appendChild(_idolMaxNode);
		
	_setBaseElm.appendChild(_areaA);
	//▼属性フィルタ関係の処理
	var _areaB =  document.createElement("div");
	
	_areaB.style.display = "inline-block";
	_areaB.style.verticalAlign = "middle";
		var _filterBtnElms = _node.typeFilterAreaNode.querySelectorAll("[class^='tab_attr']");
		var _bgImageDefObj = {
			"all":[[-22,-74],[-22,-148]]	
			,"cu":[[-17,-185],[-17,-111]]	
			,"co":[[-17,-259],[-17,-222]]	
			,"pa":[[-15,0],[-15,-37]]
		};
	//	console.log(_filterBtnElms);
		for(var _n=0; _n<_filterBtnElms.length; _n++){
			_filterBtnElms[_n].style.width = "30px";
			for(var _c in _bgImageDefObj){
				if(_filterBtnElms[_n].className.includes(_c)){
				//	console.log(_c , "match!");
					var _pxArr = _bgImageDefObj[_c][0];
					//クラス名に _selected が含まれていれば、別の座標配列を参照
					if(_filterBtnElms[_n].classList.contains("_selected")){
						_pxArr = _bgImageDefObj[_c][1];
					}
					_filterBtnElms[_n].style.backgroundPosition = _pxArr[0]+"px "+_pxArr[1]+"px";
				}
			}
		}


	
	//▼オリジナルform要素を改造
	_node.selectFromNode.style.display = "inline-block";	//横並び可
	_node.selectFromNode.style.marginBottom = "0px";		//15pxあるので縮める
	var _sortSelectElm = _node.selectFromNode.querySelector("select");
	_sortSelectElm.style.fontSize = "14px";
	_sortSelectElm.style.height = "32px";
	//▼selectのチェンジイベントで送信させるよう登録
	_sortSelectElm.addEventListener("change",function(){
		console.log("change");
		_node.selectFromNode.submit();
	},false);
		

	//セレクト系ノードから、プレミアムサインのチェックを取り出して作成。
	//画像クリックで、プレミアムサインチェックを切り替える性質
	var _checkBox = _node.premiumFromNode.querySelector("input[name='premium']");
	var _setPreSignImage = new Image();
	_setPreSignImage.style.width = "28px";
	_setPreSignImage.style.marginLeft = "0px";
	_setPreSignImage.style.verticalAlign = "middle";
	_setPreSignImage.style.cursor = "pointer";
	_setPreSignImage.title = "クリックで、「プレミアムサインのみ」\nに該当するチェックを切り替え、即座に設定を送信します";
	_setPreSignImage.style.opacity = _checkBox.checked?1:0.4;
	_setPreSignImage.src = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fitem%2Fl%2F90.jpg%3Fv%3D20170222083655";
	_setPreSignImage.addEventListener("click",function(e){
		if(_checkBox.checked){
			_checkBox.checked = null;
			e.target.style.opacity = 0.4;
		}else{
			_checkBox.checked = "checked";
			e.target.style.opacity = 1;
		}
		_node.premiumFromNode.submit();	//送信
	},false);
	_node.premiumFromNode.parentNode.parentNode.style.display = "none";	//オリジナルプレサインノードは非表示に
	
	var _areaC = document.createElement("div");
	_areaC.style.display = "inline-block";
	_areaC.appendChild(_setPreSignImage);
	
	//横幅をいじる
	_node.selectFromNode.querySelector("div.area-btn-common").style.width="100px";
	//更に、不要な項目をセレクタで選んで逐一非表示
	_node.selectFromNode.querySelector("label.btn_decision_sub_line_3").style.display="none";
	
	_areaC.appendChild(_node.selectFromNode);	//オリジナルノード移動
	
	_areaB.appendChild(_node.typeFilterAreaNode);
	
	_setBaseElm.appendChild(_areaB);
	_setBaseElm.appendChild(_areaC);

	//最終配置
	var _tempTargetElm = document.querySelector("#top>header");
	_tempTargetElm.insertBefore(_setBaseElm , _tempTargetElm.firstChild);
	
	return true;
	
};


/** 入寮or呼び出し切り替え用の nextLink と "呼び出すアイドル" のラベル系 title_img_gray 等の操作*/
idolStorageLayout.headerChange_B = function(){

	var _node = this.nodeObj;
	if(!_node.linkPopPushLinkNode){
		console.warn("nextLink系ノードが見つかりませんでした");
		return;
	}
//	console.log(_node.linkPopPushLinkNode);
	
	var _setNextLinkElm = document.createElement("a");
	_setNextLinkElm.href = _node.linkPopPushLinkNode.href;
	
	var _setLiElm = document.createElement("li");
	_setLiElm.className = "nextLink";
	_setLiElm.style.width = "40px";
	_setLiElm.style.height = "29px";
	_setLiElm.style.lineHeight = "29px";
	_setLiElm.style.marginLeft = "5px";
	_setLiElm.textContent = (_node.linkPopPushLinkNode.textContent.indexOf("入寮")!=-1)?"入寮":"呼戻";
	
	_setNextLinkElm.appendChild(_setLiElm);
	
	//一覧⇔詳細　のノードをレイアウトはCSS insertで編集
	
	
	
	_node.listTypeBtnAreaNode.appendChild(_setNextLinkElm);
	
	return true;
};

//入寮or呼び戻しボタンのラベルを、backgroundに保存されている女子寮の名前に変更する
idolStorageLayout.submitBtnNameChange = function(){
	var _mArr = location.href.match(/[push|pop]_index%2F[0-9]{1,}%2F[0-9]{1,}%2F[0-9]{1,}%2F[0-9]{1,}%2F([0-9]{1,})/);
	if(_mArr){
		var _targetElm = document.querySelector("section > form[name='sell_form'] > label > div");
		if(_targetElm){
			var _storageNum = parseInt(_mArr[1] , 10);
			var _storageObj = getOption("storage_index_object");	//
			if(typeof(_storageObj) == "object" && _storageNum > 0){
			//	console.log(_mArr , _storageObj, _storageObj[_storageNum]);
				for(var n in _storageObj){
				//	console.log(_storageObj[n] , n);
					if(_storageObj[n].num == _storageNum){
						var _storageLabel = _storageObj[n].name;
						if(_storageLabel){
							_targetElm.textContent = "第"+n+((_targetElm.textContent.indexOf('入寮させる')!=-1)?"入寮":"呼出")+"："+_storageLabel;
						//	_targetElm.style.width = "235px";
						}
					}
				}
				return;

			}else{
				console.log("fail getOption or parseInt");
			}
		}else{
			console.log("missing form input btn");
		}
	}else{
		console.log("reg unMatch");
	}
	
};

