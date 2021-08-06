//画像拡大機能
//ふるごむさん(https://github.com/furugomu)の発想をベースに作成


class ImageZoomClass{
	constructor(){

		this.hash = "";	//リスナで呼び出される毎に書き換わる
		this.name = "";	//ajaxで得た名前が格納される
		this.card_id = 0;	//外部サイト用
		this.getType = "";	//恒常等の情報
		this.toggleHashObj = {};	//特訓前後のハッシュを確保

		this.imageNode = new Image();
	}

	/** 元々の画像のsrc(URL)からハッシュ文字列だけを抜き出して返す */
	getHashFromSrc(_imgSrc){
		let _matchArr = _imgSrc.match(/(image_sp%2F)(card.*%2F)([0-9a-f]+)/);
		if(_matchArr && _matchArr.length > 3){
			return _matchArr[3];
		}
	}
	/** 引数のハッシュとタイプから利用したいイメージURLを返す*/
	getImageURL(_type , _imgHash){
		if(!_type || !_imgHash){
			console.error("typeかhashが未指定です");
		}
		let _defObj = {
			nfns:"card%2Fl_noframe%2F"  //枠無サイン無
			,fns:"card%2Fl%2F"    		//枠有サイン無
			,fs:"card_sign_b%2Fl%2F"    //枠有サインプレミアム
			,fsp:"card_sign_p%2Fl%2F"    //枠有サインあり
			,icon:"card%2Fxs%2F"		//アイコンサイズ
			,long:"card%2Fls%2F"			//短冊
		};
		let _retURL = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2F"+_defObj[_type]+_imgHash+".jpg";	
		return _retURL;
	};

	/** 引数を元に、mtkの設定に応じたサイズに調整して、幅を返す */
	imgSizeChange(_baseWidth){	
		let _zoomSetting = getOption("imagezoom_check");
		let _retWidthVal = 0;
		if(_zoomSetting == 1){
			let _imagesizeVal = getOption("imagezoom_value");
			_retWidthVal = (_baseWidth * _imagesizeVal / 100);	//拡大率に従う
		}else if(_zoomSetting == 2){
			_retWidthVal = _baseWidth;	//常に原寸
		}else if(_zoomSetting == 3){
			_retWidthVal = "100%";	//幅に従う
		}
		//原寸or拡大率に従う場合は、位置を強制的に補正
		if(_zoomSetting == 1 || _zoomSetting == 2){
			let fixLeftPos = -((_retWidthVal-window.innerWidth) / 2);
	//		this.nodes.imageElm.setAttribute("style","position:absolute;left:"+fixLeftPos+"px;");
	//		console.log("_retWidthVal:"+_retWidthVal+" / innerWidth:"+window.innerWidth);
			_retWidthVal += "px";
		}
		return _retWidthVal;
	};

	/** メイン処理
	 * 
	 */
	nodeSetup(){

		let _baseElm = document.createElement("div");	//基本生成
		let _imageBaseElm = document.createElement("div");//imgを載せる
		_baseElm.className = "mkt_image_zoom_area";

		//カード画像クリックで閉じる操作
		_imageBaseElm.addEventListener("click",(e)=>{
			_baseElm.parentNode.removeChild(_baseElm);
		},false);

		
		_imageBaseElm.appendChild(this.imageNode);
		_baseElm.appendChild( this.createImageChangePanelNode() );
		_baseElm.appendChild(_imageBaseElm);
		_baseElm.appendChild( this.createSeachPanelNode() );
		_baseElm.appendChild( this.createIdolInfoNode() );

		
		//サイズ調整 + 初回イメージ表示
		this.imageNode.style.width = this.imgSizeChange(640);
		this.imageNode.style.minHeight = "250px";
		this.imageNode.src = this.getImageURL("fns" , this.hash);
	
		this.getIdolDataFromServer();	//鯖に接続してあれやこれや

		//ベース領域クリックで、自身を閉じる操作。ただしクラス名が親の時のみ
		_baseElm.addEventListener("click",(e)=>{
			if(e.target.className == "mkt_image_zoom_area"){
				e.target.parentNode.removeChild(e.target);
			}
		},false);


		document.body.appendChild( _baseElm );
	}


	/** 画像切替に関する操作ノードをまとめたパネルノードを作成して返す
	 * */
	createImageChangePanelNode(){

		let _parentNode = document.createElement("div");
		_parentNode.className = "mkt_image_zoom_change_area";

		//フレーム
		let _changeFrame = document.createElement("div");
		_changeFrame.className = "change_noframe";
		_changeFrame.textContent = "フレーム切替";

		//短冊
		let _changeTan = document.createElement("div");
		_changeTan.textContent = "短冊";

		//アイコン
		let _changeIcon = document.createElement("div");
		_changeIcon.textContent = "icon";

		//通常サイン
		let _changeSign = document.createElement("div");
		_changeSign.textContent = "sign";

		//特訓前後は別で書き換えるので、プロパティ化
		this._cardChangeNode = document.createElement("div");
		let _cardChangeElm = this._cardChangeNode
		_cardChangeElm.textContent = "特訓前後";
		_cardChangeElm.className = "change_card";

		//イベントハンドラ。
		//クリックされたら、応じたimageSrcを取得してきて、
		//それを保持しているイメージノードの.srcに与える事で、画像の切り替えを実現している
		_changeTan.addEventListener("click",(e)=>{	//短冊
			this.imageNode.src = this.getImageURL("long" , this.hash);
			this.imageNode.style.width = this.imgSizeChange(120);
		},true);
		_changeIcon.addEventListener("click",(e)=>{	//アイコン
			this.imageNode.src = this.getImageURL("icon" , this.hash);
			this.imageNode.style.width = this.imgSizeChange(130);
		},true);
		_changeSign.addEventListener("click",(e)=>{	//サイン

			this.imageNode.src = this.getImageURL(this.premium?"fsp":"fs" , this.hash);
			this.imageNode.style.width = this.imgSizeChange(640);
		},true);
		_changeFrame.addEventListener("click",(e)=>{	//フレーム切替
			//トグル的なアレ
			_changeFrame.dataset.frame = (_changeFrame.dataset.frame==1?0:1);
			this.imageNode.src = this.getImageURL((_changeFrame.dataset.frame==1?"nfns":"fns") , this.hash);
			this.imageNode.style.width = this.imgSizeChange(640);
		},true);

		_parentNode.appendChild(_changeTan);
		_parentNode.appendChild(_changeIcon);
		_parentNode.appendChild(_changeFrame);
		_parentNode.appendChild(_changeSign);
		_parentNode.appendChild(_cardChangeElm);

		//特訓前後トグル
		_cardChangeElm.addEventListener("click",(e)=>{
			if(this.name.length > 1){
				if(this.name.indexOf("+") != -1){
					this.name = this.name.replace("+" , "");
				}else{
					this.name += "+";
				}
			//	console.log(this.name);
				this.getIdolDataFromName(this.name);	//アイドル名完全一致検索	
			}else{
				console.warn("this.name が不正なので、特訓前後の検索ができません");
			}
		},true);

		return _parentNode;
	}

	/** 各種検索ボタンに相当するノードをまとめたパネルノードを作成して返す
	 */
	createSeachPanelNode(){

		const _parentNode = document.createElement("div");
		_parentNode.className = "mkt_image_zoom_search_area";

	
		const _marketPriceBtn = document.createElement("div");
		_marketPriceBtn.textContent = "相場";
		_marketPriceBtn.style.color = "#999";	//使えないようなのでとりあえずグレー化
		_marketPriceBtn.addEventListener("click",(e)=>{	this.handlSearchJump("price");	},true);
		
		const _albumBtn = document.createElement("div");
		_albumBtn.textContent = "アルバム";
		_albumBtn.addEventListener("click",(e)=>{	this.handlSearchJump("album");	},true);

		const _galleryBtn = document.createElement("div");
		_galleryBtn.textContent = "ギャラリー";
		_galleryBtn.addEventListener("click",(e)=>{	this.handlSearchJump("gallery");	},true);

		const _presentBtn = document.createElement("div");
		_presentBtn.textContent = "贈り物";
		_presentBtn.addEventListener("click",(e)=>{	this.handlSearchJump("present");	},true);

		const _cardStorageBtn = document.createElement("div");
		_cardStorageBtn.textContent = "女子寮";
		_cardStorageBtn.addEventListener("click",(e)=>{	this.handlSearchJump("storage");	},true);

		const _freeTradeHistoryBtn = document.createElement("div");
		_freeTradeHistoryBtn.textContent = "履歴";
		_freeTradeHistoryBtn.addEventListener("click",(e)=>{	this.handlSearchJump("history");	},true);

		const _freeTradeBtn = document.createElement("div");
		_freeTradeBtn.textContent = "フリトレ";
		_freeTradeBtn.addEventListener("click",(e)=>{	this.handlSearchJump("trade");	},true);

		_parentNode.appendChild(_freeTradeHistoryBtn);
		_parentNode.appendChild(_freeTradeBtn);
		_parentNode.appendChild(_marketPriceBtn);
		_parentNode.appendChild(_albumBtn);
		_parentNode.appendChild(_galleryBtn);
		_parentNode.appendChild(_presentBtn);
		_parentNode.appendChild(_cardStorageBtn);

		return _parentNode;
	}

	/** アイドルの情報に関する各種ノードをまとめた親領域を作成して返す
	 */
	createIdolInfoNode(){

		let _parentNode = document.createElement("div");
		_parentNode.className= "mkt_image_zoom_info_area";

		this._idolInfoParentNode = document.createElement("div");
		this._idolGetTypeNode = document.createElement("span");
		this._idolGetTypeImageNode = new Image();
		this._idolGetEventNode = document.createElement("span");
		this._idolGetEventLinkNode = document.createElement("a");
		this._idolInfoNode = document.createElement("span");

		//デザインなど
		this._idolGetEventLinkNode.style.padding = "2px 3px";
		this._idolGetEventLinkNode.style.margin = "0px 3px";
		this._idolGetEventLinkNode.style.webkitBorderRadius = "5px";
		this._idolGetEventLinkNode.style.border = "1px solid #A0A0A0";
		this._idolGetEventLinkNode.style.display = "none";
		this._idolGetEventLinkNode.textContent = "Event";
		this._idolGetTypeNode.style.margin = "0px 4px";
		this._idolGetTypeImageNode.style.width = "16px";

		this._idolGetTypeNode.appendChild(this._idolGetTypeImageNode);
		this._idolGetEventNode.appendChild(this._idolGetEventLinkNode);
		this._idolInfoParentNode.appendChild(this._idolGetTypeNode);
		this._idolInfoParentNode.appendChild(this._idolGetEventNode);
		this._idolInfoParentNode.appendChild(this._idolInfoNode);

		//スキル , 中の人情報 
		this._idolSkillInfoParentNode = document.createElement("div");
		this._idolVoiceActorElm = document.createElement("div");
		this._idolSkillInfoParentNode.className = "mkt_skill_area";
		this._idolVoiceActorElm.className = "mkt_voice_actor_area";
		_parentNode.appendChild(this._idolInfoParentNode);
		_parentNode.appendChild(this._idolSkillInfoParentNode);
		_parentNode.appendChild(this._idolVoiceActorElm);

		return _parentNode;
	}


	/** カードの入手情報を切り替えるメソッド
	 * 
	 */
	changeInfoCardGetType(_cardInfo , _eventNumText = null){
	//	console.log(_cardInfo , _eventInfo);
		if(_cardInfo && _cardInfo.length > 0){
			if(_cardInfo.indexOf("恒常") != -1){
				this._idolGetTypeImageNode.src = "http://sp.pf-img-a.mbga.jp/12008305?url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui%2Ficon_gacha_ticket.jpg";
				this._idolGetTypeImageNode.title = "恒常 または SR%チケ";
			}else if(_cardInfo.indexOf("イベチケ") != -1){
				this._idolGetTypeImageNode.src = "http://sp.pf-img-a.mbga.jp/12008305?url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fgacha%2Ficon_event_gacha_ticket_093.jpg";
				this._idolGetTypeImageNode.title = "イベチケ排出";
			}
			this._idolGetTypeNode.style.display = "inline-block";
		}else{
			this._idolGetTypeNode.style.display = "none";
		}
	
		if(_eventNumText && _eventNumText.length > 0){
			//console.log( this._idolGetEventNode , _eventNumText);
			this._idolGetEventLinkNode.style.display = "inline-block";
			this._idolGetEventLinkNode.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fmemory%2Fdetail%2F" + _eventNumText;
		}else{
			this._idolGetEventLinkNode.style.display = "none";
		}
	}

	/** 検索パネルの各要素に付与されたイベントハンドラ  
	 * 引数のタイプに応じ、保持しているプロパティなどを用いて、何かしらの検索結果へ移動させる
	 * */
	handlSearchJump(_type){
		let _defineObj = {
			"history":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fhistory%2F"
			,"trade":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fsearch_top%2F0%2F"
			,"album":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Farchive%2Fview%2F"
			,"gallery":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fidol_gallery%2Fidol_detail%2F"
		};

		let _baseURL = _defineObj[_type];
		
		if(_type == "price"){
			//console.log(this.card_id);	//上位報酬はIDが取れずにそのままで、飛べないケースが多い
			if(this.card_id > 0){
				location.href = "https://imcgdb.info/trade-history-"+this.card_id+".html#graph-tab-body";	
			}else{
				return;
			}
		}
		else if(_baseURL){
			location.href = _baseURL + this.hash;
		}else{
			//POST系処理
			if(this.name.length < 2){
				console.warn("検索に必要なアイドル名が得られていません" , this.name);
				return;
			}
			let _form = document.createElement("form");
			_form.method = "POST";
			if(_type == "present"){
				_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%3Fl_frm%3DPresent_1%26rnd%3D282120589";
				_form.name = "fil";
				let _sortInput = document.createElement("input");
				_sortInput.name ="sort_type";
				_sortInput.value = 3;
				_form.appendChild(_sortInput);
			}else if(_type = "storage"){
				_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fsearch_top";
				_form.name = "name_search";
			}else{
				console.warn("引数が不正です");
				return;
			}
			let _keywordInput = document.createElement("input");
				_keywordInput.name = "keyword";
				_keywordInput.type = "text";
				_keywordInput.value = this.name;
		
			let _submit = document.createElement("input");
			_submit.type = "submit";

			_form.appendChild(_keywordInput);
			_form.appendChild(_submit);
			document.body.appendChild(_form);
			_form.submit();
		}
	};

	/** 自前APIからハッシュに関連付けられたアイドル情報を得る */
	getIdolDataFromServer(){
		if(!this.hash){
			console.warn("サーバーに接続するためのhashが得られませんでした");
			return;
		}
		let hashObj = {hash:this.hash};
	//	let _sendStr = JSON.stringify(hashObj);
		let postURL = "http://mkt.packetroom.net/idoldata/?hash="+this.hash;
		let httpObj = new XMLHttpRequest();
		httpObj.open("POST", postURL, true);
		httpObj.addEventListener("load",(e)=>{
			try{
				let _parseData = JSON.parse(e.target.responseText);
			//	console.log(_parseData);
				if(_parseData){
					this.name = _parseData.name;	//名前確保
					this.card_id = _parseData.card_id;	//カードID
					//アイドル情報及び中の人情報反映
					this.writeIdolInfo(_parseData);
					this.writeVoiceActorInfo(_parseData.name);
				}
			}catch(err){
				console.log(err);
				this._cardChangeNode.textContent = "未登録";
				this.name = "";
			}
		},false);

		httpObj.send();
		
	};

	/** 鯖からアイドル名に関連付けられたアイドル情報を得る */
	getIdolDataFromName(_fullName){
		if(!this.hash){
			console.warn("サーバーに接続するためのhashが得られませんでした");
			return;
		}
	//	console.log(_fullName,"で完全一致検索を開始" , encodeURIComponent(_fullName));
		let postURL = "http://mkt.packetroom.net/idoldata/?fullname="+encodeURIComponent(_fullName);	//完全一致 あと記号対策でエンコード
		let httpObj = new XMLHttpRequest();
		httpObj.open("POST", postURL, true);

		httpObj.addEventListener("load",(e)=>{
			//console.log(e.target.responseText);
			try{
				let _parseDataObjs = JSON.parse(e.target.responseText);
				//console.log(_parseDataObjs);
				if(_parseDataObjs){
					let _singleObj = _parseDataObjs[0];	//検索結果複数だったの忘れてた
					//ハッシュと名前をその場で変更
					//console.log(_singleObj);
					this.hash = _singleObj.hash;
					this.name = _singleObj.name;
					this.card_id = _singleObj.card_id;
					this.writeIdolInfo(_singleObj);
					//画像を弄る
					this.imageNode.src = this.getImageURL("fns" , _singleObj.hash);
					this._cardChangeNode.textContent = "特訓前後";
					return;
				}
			}catch(err){
				this._cardChangeNode.textContent = "×未登録";
				this.name = "";
			}

		},false);


		httpObj.send();
		
	};

	/**
	 * 情報表示用ノードにテキスト反映。
	 * @param {*} _idolObj 鯖から受け取ったオブジェクト
	 */
	writeIdolInfo(_idolObj){
		//console.log( _idolObj );
		const _getType = (_idolObj["get_type"]?("["+_idolObj["get_type"]+"] "):"");

		this.changeInfoCardGetType(_getType , _idolObj.event_id);

		while(this._idolSkillInfoParentNode.firstChild){
			this._idolSkillInfoParentNode.removeChild(this._idolSkillInfoParentNode.firstChild);
		}
		let _skillTextTitle = "";
		// ダブル特技対応
		[ _idolObj["s_txt"] , _idolObj["s_txt2"]].forEach(_sText=>{
			
			if(_sText && _sText.length > 2){
				_skillTextTitle += (_sText+"\n");
				const _skillDetailObjArr = skillDataConvert( [ _sText ]);
				this._idolSkillInfoParentNode.appendChild( this._createSkillColorSymbolNode(_skillDetailObjArr[0]) );
				this._idolSkillInfoParentNode.appendChild( this._createSkillAtkDefSymbolNode(_skillDetailObjArr[0]) );
				this._idolSkillInfoParentNode.appendChild( this._createSkillPowerScaleSymbolNode(_skillDetailObjArr[0]) );
				this._idolSkillInfoParentNode.appendChild( this._createSkillBackmemberSymbolNode(_skillDetailObjArr[0]) );
				const _debuffInfoNode =  this._createSkillBuffSymbolNode(_skillDetailObjArr , 0);
				//	console.log(_debuffInfoNode);
				if(_debuffInfoNode){
					this._idolSkillInfoParentNode.appendChild( _debuffInfoNode );
				}
			}
		});

	//	console.log(_idolObj);
		this._idolInfoNode.textContent = _idolObj.cost + " " +_idolObj.name+" "+_idolObj.m_atk+" "+_idolObj.m_def;
		this._idolSkillInfoParentNode.title = _skillTextTitle;
	};

	/** カード名を精査して中の人を得る (voice_actor.js)
	 * 
	 * @param {*} _cardName 
	 */
	writeVoiceActorInfo(_cardName){
		if(!typeof(voiceActor) == "Object"){
			console.error("voiceActor オブジェクトが定義されていません");	
		}
		_cardName = _cardName.replace("+","");
		_cardName = _cardName.replace(/[^\]]+]/,"");
	//	console.log(_cardName);
		if(_cardName){
			let _pureName = _cardName;
			let _actorObj = voiceActor.Obj[_pureName];
	//		console.log(_pureName , _actorObj);
			if(_actorObj){
				let _putText = "CV. "+_actorObj.actor;
				if(_actorObj.actor_kana){
					_putText += " ("+_actorObj.actor_kana+")";
				}
				if(_actorObj["date"]){
					_putText += " @ since " + _actorObj["date"];
				}
				//if(_actorObj.date){	_putText += " "+_actorObj.date+" 実装";}
				this._idolVoiceActorElm.textContent = _putText;
			}
		}

	};

	/**
	 * skillDetailを引数にして、特技属性色のシンボル要素を作成して返す
	 * デバフ時は undefinde だったかも..？
	 *  */
	_createSkillColorSymbolNode(_skillDetail){
		if(!_skillDetail){	console.log("デバフ判定"); return;	}
	//	console.log(_skillDetail);
		let _baseNode = document.createElement("div");
		_baseNode.className = "skill_panel_type_icon_info";
		
		let _colorTypeCount = 0;
		if(_skillDetail.type_cu){	
			let _colorTypeElmCu = document.createElement("span");
			_colorTypeElmCu.style.backgroundColor = "#FF6090";
			_colorTypeElmCu.className = "panel_type_color_icon";
			_colorTypeCount++;
			_baseNode.appendChild(_colorTypeElmCu);
		}
		if(_skillDetail.type_co){
			let _colorTypeElmCo = document.createElement("span");
			_colorTypeElmCo.style.backgroundColor = "#5599FF";
			_colorTypeElmCo.className = "panel_type_color_icon";
			_colorTypeCount++;
			_baseNode.appendChild(_colorTypeElmCo);
		}
		if(_skillDetail.type_pa){
			let _colorTypeElmPa = document.createElement("span");
			_colorTypeElmPa.style.backgroundColor = "orange";
			_colorTypeElmPa.className = "panel_type_color_icon";
			_colorTypeCount++;
			_baseNode.appendChild(_colorTypeElmPa);
		}
		
		if(_skillDetail.type_my){
			let _colorTypeElmSelf = document.createElement("span");
			_colorTypeElmSelf.style.backgroundColor = "#EEEEEE";
			_colorTypeElmSelf.className = "panel_type_color_icon";
			_colorTypeCount++;
			_baseNode.appendChild(_colorTypeElmSelf);
		}
		
		let _sizeArr = [ 0 , 13 , 12 , 10];
	//	console.log(_colorTypeCount);
		//要素数に応じて縦幅を調節
	//	var _iconHeight = 25 / (_colorTypeCount);
		for(var t=0; t<_baseNode.childNodes.length; t++){
		//	console.log(_parentElm.childNodes[t]);
			_baseNode.childNodes[t].style.width = _sizeArr[_colorTypeCount]+"px";
			_baseNode.childNodes[t].style.height = _sizeArr[_colorTypeCount]+"px";
		}
		return _baseNode;
	}

	/** 攻守表現(検索結果専用)
	 * ダブル特技アイドルは未実装なので、スキルインデックスを考慮しない構成にしている
	 *  */
	_createSkillAtkDefSymbolNode(_skillDetail){
		if(!_skillDetail){
			return;
		}
		let _parentElm = document.createElement("span");
		let _typeElm = document.createElement("span");
		_parentElm.className = "skill_panel_atk_def_label";
		if(_skillDetail.atk && _skillDetail.def){
			_typeElm.textContent = "両";
			_typeElm.className = "type_balance";
		}
		else if(_skillDetail.atk){
			_typeElm.textContent = "攻";
			_typeElm.className = "type_atk";
		}
		else if(_skillDetail.def){
			_typeElm.textContent = "守";
			_typeElm.className = "type_def";	
		}
		_parentElm.appendChild(_typeElm);
		return _parentElm;
	}


	/** 
	 * 発動スキルの規模 (大,極大,絶大とか) のシンボルを作成
	 * 旧引数：_idolData , _skillIndex
	 * @param {*} _skillDetail 
	 * @param {*} _activeScaleIndex 
	 * @param {*} _eventHandler class_unit_node.js で渡されるイベント
	 *  */
	_createSkillPowerScaleSymbolNode(_skillDetail , _activeScaleIndex , _eventHandler){
	//	console.log(_skillDetail,_activeScaleIndex , _eventHandler);
		if(!_skillDetail){	console.warn("skillDetailが不正です"); return;	}
		
		let _baseNode = document.createElement("span");
		_baseNode.className = "skill_panel_power_scale";
		
		let _defineArr = ["極小","小","中","大","特大","極大","絶大","超絶","究極"];
		let _haba = _skillDetail["skill_max"] - _skillDetail["skill_min"];

		for(var i=0; i<_haba+1; i++){
	//		console.log(_haba , _defineArr[skillDetail.skill_min + i - 1]);
			let _setSkillScaleElm = document.createElement("span");
			_setSkillScaleElm.dataset["skillIndex"] = i;	//配列の発動Index登録
			//_activeScaleIndexが0でもない値の場合は全て色を付ける
			if(_activeScaleIndex === null || _activeScaleIndex === undefined){
				_setSkillScaleElm.classList.add("on");
			}else{
				//引数の_activeMemberIndexに一致する場合、要素に色付け
				if(_activeScaleIndex == i){
					_setSkillScaleElm.classList.add("on");
				}
			}

			//幅が1以上で最初の要素(つまり、範囲特技の最小規模)の場合、フォントを小さくする
			if(_haba > 0 && i == 0){
				_setSkillScaleElm.style.fontSize = "12px";
			}
			
			let _scaleText = _defineArr[_skillDetail["skill_min"] + i -1];
			_setSkillScaleElm.textContent = _scaleText;
			
			_baseNode.appendChild(_setSkillScaleElm);
		}
		
		return _baseNode;
	}
	
	/** 発動バックメンバー数パネル	旧 createSkillBackmemberAreaElm
	 * 引数の _idolData , _skillIndex を廃止し、単体の _skillDetail だけ受け取るようにする？
	 * _skillDetail , _activeMemberIndex(0なら全色onに) , _eventHandler とか。
	 * @param {*} _skillDetail 
	 * @param {*} _activeMemberIndex 
	 * @param {*} _eventHandler 
	 *  */
	_createSkillBackmemberSymbolNode(_skillDetail , _activeMemberIndex , _eventHandler){
	//	console.log(_idolData , _skillDetail);
		if(!_skillDetail){	console.warn("skillDetailが不正です"); return;	}
		let _baseNode = document.createElement("span");
		_baseNode.className = "skill_panel_member_scale";
		let _memberLen = _skillDetail.back_val_arr.length;
		for(var i=0; i<_memberLen; i++){
			let _setMemElm = document.createElement("span");
			_setMemElm.textContent = _skillDetail.back_val_arr[i];
			_setMemElm.dataset["backmemberIndex"] = i;	//配列の発動index登録
			_setMemElm.title = "バックメンバー";
			//_activeMemberIndexが不明の場合は全て色を付ける
			if(_activeMemberIndex === null || _activeMemberIndex === undefined){
				_setMemElm.classList.add("on");
			}
			else{
				//引数の_activeMemberIndexに一致する場合、要素に色付け
				if(_activeMemberIndex == i){
					_setMemElm.classList.add("on");
				}
				//引数のハンドラ貼り付け
				_setMemElm.addEventListener("click" , _eventHandler, false);
			} 
			_baseNode.appendChild(_setMemElm);
		}
	//	console.log("発動バクメン数" , _idolData.name , _Len);
		return _baseNode;
	};
	
	/** フロントメンバーのパネル	旧 createSkillBuffAreaElm
	 * デバフを示すテキストシンボル
	 *  */
	_createSkillBuffSymbolNode(skillDetailArray , _skillIndex){
	//	console.log(skillDetailArray);
		let skillDetail = skillDetailArray[_skillIndex];
		if(!skillDetail){
			console.warn("debuff");
			return;
		}
		if(skillDetail.debuff){
			let _parentElm = document.createElement("span");
			_parentElm.className = "skill_panel_debuff_label";
			_parentElm.textContent = "DOWN";
			return _parentElm;	
		}
	}

}

/**
 * @type ImageZoomClass
 */
let _imageZoom = new ImageZoomClass();


function mainfunc_imagezoom(mainElm){
	// 無視
	const _ignoreUrls = [
		"idolmaster%2Farchive%2Findex" ,	//アルバム一覧
		"idolmaster%2Fcard_str%" ,			//レッスン画面
		"event_talk%2Fboss_index" , 		//TBSの相手アイドル？
		"event_teamtalk%2Fboss_index" , 	//TBS(チーム対抗)の相手アイドル
		"idolmaster%2Fcard_list%2Findex", 	//所属アイドルの一覧表示(20191212)
	]
	// 必ず有効
	const _respectUrls = [
		"%2Fcard_str%2Fpresent_lesson_check%2F" ,
		"%2Fcard_str%2Fcheck%2F"
	]

	if(_respectUrls.findIndex(_e=>location.href.indexOf(_e) != -1) != -1){
		//console.log("必ず有効");
	}
	else if(_ignoreUrls.findIndex(_e=>location.href.indexOf(_e) != -1) != -1){
		//console.log("無視");
		return;
	}


	if(mainElm){

		//let zoomSetting = getOption("imagezoom_check");

		let _allImageElms = document.images;


		[..._allImageElms].forEach(_node=>{
			let _imageNode = _node;
			//console.log(_imageElm.parentNode.nodeName);
			if(!_imageNode.src || _imageNode.className === 'chk_img'){
				return;
			}
			//イベントメダル新レイアウトに対応するため、一部のAタグ以外を許容させる
			if(_imageNode.parentNode.nodeName == "A" && _imageNode.parentNode.classList.contains("jsOnDesignBtn") != true){
				//console.log(_imageNode.parentNode.classList.contains("jsOnDesignBtn"));
				return;
			}

			let _imgHash = _imageZoom.getHashFromSrc(_imageNode.src);
			if(!_imgHash){
				return;
			}
			//let _isPlemium = false;
			//プレミアムはマーキングしとこう
			if(_imageNode.src.indexOf("card_sign_p") != -1){
				_imageNode.dataset.premium = 1;
				_imageNode.classList.add("mkt_premium");
			}

			//▼カードイラストはここに到達できる
			_imageNode.dataset.hash = _imgHash;	//ハンドラ参照用

			_imageNode.addEventListener('click', function(e){

				_imageZoom.hash = e.target.dataset.hash;
				_imageZoom.premium = e.target.dataset.premium;
				_imageZoom.nodeSetup();
				
			}, false);
		

		});
		
		
		//ブレイクされたアイドルの上にかぶされる効果マークの画像を除去するが、ロワイヤルでは行わない
		if(location.href.indexOf("event_royale%2Fget_encount%2F") == -1){
			let _brakeEffectImgElms = document.getElementsByClassName("strength_card_effe_img");
			[..._brakeEffectImgElms].forEach(_node=>{
				_node.style.display = "none";
			});
		}


		//imageのwidth,heightをいじるとForced reflowが発生するので、最後に再計算 (11.45ms)
		let _mktPremiumImgElms = document.getElementsByClassName("mkt_premium");
		[..._mktPremiumImgElms].forEach(_node=>{
			const _w = _node.width;
			_node.style.width = (_w - 2) + "px";
			//高さがある場合は従来の値からstyleで2削る
			if(_node.height){
				_node.style.height = (_node.style.height - 2) + "px";
			}
		});
		

	}

}

