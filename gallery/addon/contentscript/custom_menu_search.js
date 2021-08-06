//検索用フォーム
//呼び出し元は custom_menu.js
//インスタンス化は、このjsの一番下らへん

/**
 * カスタムメニューの検索ページを構築する(使えるようにさせる)為に用意したクラス
 */
class CustomMenuSearchClass{

	constructor(){
		this.baseNode = null;
		this.baseInputNode = null;
		
		this.rareSelectNode = null;
		this.attrSelectNode = null;
		this.costSelectNode = null;

		this.maxHistoryNum = 20;
		this.historyNode = null;
		this.historyDataArray = [];
	}

	/**
	 * 操作の基礎となるノードをセットしておく。
	 * このノードは、読み込まれたhtmlが組み込まれることが期待される
	 * @param {*} _baseNode 
	 */
	setBaseNode(_baseNode){
		this.baseNode = _baseNode;
	}

	/**
	 * ノード作ってくれる。
	 */
	setUp(){

		this.baseInputNode = this.baseNode.querySelector(".cms_base_input");
		this.attrSelectNode = this.baseNode.querySelector("select[name='attr']");		
		this.rareSelectNode =  this.baseNode.querySelector("select[name='rare']");
		this.costSelectNode = this.baseNode.querySelector("select[name='cost']");
		
		this.historyNode = this.baseNode.querySelector("#cms_idollist_area");

		//selectを変更したら、色を変えるだけの処理を付与
		this.attrSelectNode.addEventListener("change",e=>{	this._eventHandlerChangeValueColor(e.target , e.target.value);	},false);	
		this.rareSelectNode.addEventListener("change",e=>{	this._eventHandlerChangeValueColor(e.target , e.target.value);	},false);
		this.costSelectNode.addEventListener("change",e=>{	this._eventHandlerChangeValueColor(e.target , e.target.value);	},false);

		//そのままEnter押しても検索できるようにする
		this.baseInputNode.addEventListener("keydown",e=>{
			if(e.key == "Enter"){
				let _formElm = this._createFreetradeForm();
				document.body.appendChild(_formElm);
				this._historyDataPushFromFormData.apply(this);
				_formElm.submit();
			}
		},false);


		//アルバム
		this._addButtonDefineData(".mkt_cms_album_btn" , getFilePath("./image/menu/album.png") , this._createAlbumForm );

		//ギャラリー
		this._addButtonDefineData(".mkt_cms_gallery_btn" , getFilePath("./image/menu/gallery.png") , this._createGalleryForm );

		//贈り物
		this._addButtonDefineData(".mkt_cms_present_btn" , getFilePath("./image/menu/present.png") , this._createPresentForm );

		//女子寮検索処理
		this._addButtonDefineData(".mkt_cms_storage_btn" , getFilePath("./image/menu/storage.png") , this._createStorageForm );

		//フリトレ検索処理	これだけノード作ったのを確保する。( first_load.js にて、フリトレの公式要素をhook )
		this.freeTradeBtnNode = this._addButtonDefineData(".mkt_cms_freetrade_btn" , getFilePath("./image/menu/freetrade.png") , this._createFreetradeForm );

		this._createNameIndex();	//アイドル索引(index)タブ生成

		this.historyListSetup();	//履歴再現

		//履歴再構築用リスナを登録
		let _historyIndexLabelElm = this.baseNode.querySelector(".cms_history_index");
		_historyIndexLabelElm.addEventListener("click", this.historyListSetup.bind( this ) ,false);
		
		
		//履歴まとめて消去リスナを登録
		let _historyAllRemoveElm = this.baseNode.querySelector(".cms_history_allremove");
		_historyAllRemoveElm.addEventListener("click", this.eventHistoryDataAllRemove.bind( this ) ,false);

		
		let _serverFlagNode = this.baseNode.querySelector(".cms_server_flag");
		if(_serverFlagNode){
			//鯖判定
			let _serverFlag = this._isFreeTradeServerType();
			_serverFlagNode.style.color = _serverFlag?"#FFAA88":"#88AAFF";
			_serverFlagNode.textContent = _serverFlag?"同鯖":"逆鯖";
				
		}
		
		this.createSiteLink();		//外部リンク構築
		this.baseInputNode.focus();	//フォーカスを与える

	}


	/** 指定したクエリの要素に、イメージを与え、最終的にsubmit()する仮想ノードも与える。
	 * 簡単に言えば、処理を横着したメソッド	。 setUp() メソッドから呼ばれる
	 * @param {*} _selector 
	 * @param {*} _imagePath 
	 * @param {*} _createSubmitNodeMethod 
	 */
	_addButtonDefineData(_selector , _imagePath , _createSubmitNodeMethod){
		let _targetNode = this.baseNode.querySelector(_selector);
		_targetNode.src = _imagePath;
		_targetNode.addEventListener("click" , e=>{
			let _node = _createSubmitNodeMethod.apply(this);	//apply
			document.body.appendChild( _node );
			this._historyDataPushFromFormData.apply(this);
			_node.submit();
		} , false);

		return _targetNode;
	}

	/** 索引クリックで出したリスト領域消去 */
	_clearHistoryNode(){
		while(this.historyNode.firstChild){
			this.historyNode.removeChild(this.historyNode.firstChild);
		}
	}

	/** アイドル索引(インデックス)ラベルを、グローバルに格納しているオブジェクトを元に生成 */
	_createNameIndex(){
		
		let _tabsElm = this.baseNode.querySelector("#tabs");
		let _IdolNameIndexListObj = allIdolListObj;	// グローバル定義オブジェクト

		for(var _x in _IdolNameIndexListObj){
			let _categoryParentElm = document.createElement("div");
			_categoryParentElm.className = "cms_name_index_parent";
			if(1){
				_categoryParentElm.textContent = _x;
				_categoryParentElm.addEventListener("click", this._eventHandlerClickNameIndex.bind(this) , false);
				_tabsElm.appendChild(_categoryParentElm);
			}

		}
	}

	/** _eventHandlerClickNameIndex() から呼ばれる */
	_eventHandlerClickNameLabel(e){
		//console.log( e , this );
		this.baseInputNode.value = e.target.textContent;	//基礎Inputに適用
		//テンプレ索引からのアイドル名適用なので、属性などはリセット
		this.attrSelectNode.querySelector("option[value='']").selected = "selected";
		this.costSelectNode.querySelector("option[value='']").selected = "selected";
		this.rareSelectNode.querySelector("option[value='']").selected = "selected";
		
		this._eventHandlerChangeValueColor(this.attrSelectNode , null);
		this._eventHandlerChangeValueColor(this.costSelectNode , null);
		this._eventHandlerChangeValueColor(this.rareSelectNode , null);
		
		this.baseInputNode.focus();					//即座にフォーカスを与える事で、そのままキーボードで打ち込めるようにする
	}

	/**
	 * 索引(インデックス)クリックに応じて、グローバル allIdolListObj を参照して、アイドル名一覧を要素に書き出す
	 * アイドル名要素にイベント貼る処理も行う
	 * @param {*} e 
	 */
	_eventHandlerClickNameIndex(e){
		this._clearHistoryNode();	//出力前に一度中身を消す
		let _IdolNameIndexListObj = allIdolListObj;	// グローバル定義オブジェクト
		let _indexStr = e.target.textContent;
		//	console.log(_indexStr);
		if(_indexStr){
			
			let _classArr = ["","cu","co","pa"];
			if(true){
				for(var _ss in _IdolNameIndexListObj[_indexStr]){
					let _indexObj = _IdolNameIndexListObj[_indexStr][_ss];
					//親ラベル作成
					let _singleIndexAreaElm = document.createElement("div");
					_singleIndexAreaElm.style.width = "63px";
					_singleIndexAreaElm.style.verticalAlign = "top";
					_singleIndexAreaElm.style.display = "inline-block";
					let _singleIndexNameLabel = document.createElement("div");
					_singleIndexNameLabel.textContent = _ss;
					_singleIndexAreaElm.appendChild(_singleIndexNameLabel);
					for(var _t in _indexObj){
						//個々の名前ラベル作成
					//	console.log(_t);
						let _nameElm = document.createElement("div");	/* 親(音,ラベル親(ラベル1,ラベル2..)) */
						_nameElm.className = "cms_idol_label "+_classArr[_indexObj[_t]];	//cucopa色付け
						_nameElm.textContent = _t;
						//▼クリックでinput欄に名前差し替え
						_nameElm.addEventListener("click", this._eventHandlerClickNameLabel.bind(this) ,false);
						_singleIndexAreaElm.appendChild(_nameElm);
					}
					this.historyNode.appendChild(_singleIndexAreaElm);
					
				}
			}
			

		}
	}


	/** 保存しているプロパティをもとに、検索履歴一覧をエリア上に構築 */
	historyListSetup(){

		this._clearHistoryNode();	//出力前に一度中身を消す
	
		this.historyDataArray = getOption("search_history");	//backgroundから履歴取出

		let _historyArr = this.historyDataArray;

		if(!_historyArr){
			_historyArr = [	/*初期データ*/
				{	name:"高森藍子"
					,lock:1
				}
				,{	name:"五十嵐響子"	}
				,{	name:"藤原肇"	,lock:1	}
				,{	name:"鷺沢文香"	}
				,{	name:"十時愛梨"	, cost:22}
				,{	name:"ｱﾅｽﾀｼｱ"	, cost:20}
				,{	cost:23	}
			];
		}
		
		//console.log(_historyArr);
	
		_historyArr.forEach((_e , _index) =>{
			if(!_e){
				console.warn("historyData["+n+"]" , _e);
				return;
			}
			
			let _setSpanElm = document.createElement("span");
			_setSpanElm.className = "cms_history_label";
			let _lockElm = document.createElement("span");
			_lockElm.className = "cms_lock_mark";
			_lockElm.title = "履歴ロック ON⇔OFF";

			let _deleteElm = document.createElement("span");
			_deleteElm.className = "close";
			_deleteElm.textContent = "×";
			let _nameLabelElm = document.createElement("span");
			_nameLabelElm.className = "text";
			let _setStrArr = [];
			let _costOnly = true;
			//ロック情報
			if(_e.lock){
				_lockElm.classList.add("on");
			}
			if(_e.attr){
				_nameLabelElm.dataset.attr = _e.attr;
				let _setAttrArr = ["","cu","co","pa"];
				_setStrArr.push(_setAttrArr[_e.attr]);
				_costOnly = false;
			}
			if(_e.cost){
				_nameLabelElm.dataset.cost = _e.cost;
				_setStrArr.push(_e.cost);
			}
			if(_e.name){
				_nameLabelElm.dataset.name = _e.name;
				_setStrArr.push(_e.name);
				_costOnly = false;
			}
			if(_e.rare){
				_nameLabelElm.dataset.rare = _e.rare;
				let _setRareArr = ["","N","N+","R","R+","SR","SR+"];
				_setStrArr.push(_setRareArr[_e.rare]);
				_costOnly = false;
			}
			//該当履歴がコストのみなら、前後に半角スペースを入れて余白を設ける
			if(_costOnly){
				_setStrArr[0] = " " + _setStrArr[0] + " ";
				//console.log(_setStrArr);
			}
			_nameLabelElm.textContent = _setStrArr.join(":");
			//▼ロックボタン
			_lockElm.addEventListener("click", this._eventHandlerClickLock.bind(this) ,false);
			//▼履歴内容をフォーム上(select,input)に再現するイベント
			_nameLabelElm.addEventListener("click", this._eventHandlerClickHistoryLabel.bind(this) ,false);
			//▼×ボタン
			_deleteElm.addEventListener("click", this._eventHandlerClickHistoryDataRemove.bind(this) ,false);
			
			_setSpanElm.appendChild(_lockElm);
			_setSpanElm.appendChild(_nameLabelElm);
			_setSpanElm.appendChild(_deleteElm);
			
			//▼ここだけ配列を編集 @ ノード格納
			_e.node = _setSpanElm;	//ノード格納
			//▲
		//	console.log(_setSpanElm);
			this.historyNode.appendChild(_setSpanElm);
		});

		//console.log( _historyArr );
	}

	/** 再現された履歴ラベルに与えるクリックイベント
	 * datasetのプロパティ内容により、属性,レアリティ,コストも同時に再現する
	 * @param {*} e 
	 */
	_eventHandlerClickHistoryLabel(e){
	//	console.log( e , this);
		//dataseの該当値が無い場合、selected解除
		let _dataset = e.target.dataset;
		if(_dataset.attr){
			this.attrSelectNode.querySelector("option[value='"+_dataset.attr+"']").selected = "selected";
		}else{
			this.attrSelectNode.querySelector("option[value='']").selected = "selected";
		}
		if(_dataset.cost){
			this.costSelectNode.querySelector("option[value='"+_dataset.cost+"']").selected = "selected";
		}else{
			this.costSelectNode.querySelector("option[value='']").selected = "selected";
		}
		if(_dataset.rare){
			this.rareSelectNode.querySelector("option[value='"+_dataset.rare+"']").selected = "selected";
		}else{
			this.rareSelectNode.querySelector("option[value='']").selected = "selected";
		}
		
		this._eventHandlerChangeValueColor(this.attrSelectNode , _dataset.attr);
		this._eventHandlerChangeValueColor(this.costSelectNode , _dataset.cost);
		this._eventHandlerChangeValueColor(this.rareSelectNode , _dataset.rare);
		
		let _setText = (_dataset.name?_dataset.name:"");
		this.baseInputNode.value = _setText;	//基礎Inputに適用
		this.baseInputNode.focus();					//即座にフォーカスを与える事で、そのままキーボードで打ち込めるようにする
	
	}


	/** 検索履歴のロックボタンクリックで呼ばれる */
	_eventHandlerClickLock(e){
		//console.log( e , this );
		
		this.historyDataArray.forEach(_elm => {

			let _targetNode = _elm.node.firstChild;
			if(e.target == _targetNode){
				var _lockFlag = _elm.lock;
				if(!_lockFlag){	//未ロック→ロック
					//console.log(_elm , "ロック状態にしました");
					_elm.lock = 1;
					e.target.classList.add("on");
				}else{	//ロック済み→ロック解除
					//console.log(_elm , "ロック解除");
					delete _elm.lock;
					e.target.classList.remove("on");
				}
				this._updateHistoryData();	//background更新して抜ける
				return;
			}

		});

	}


	/** 履歴の xボタンに付与されるイベント。 e.target から、辿って、紐づいている保持履歴データを検出して削除 */
	_eventHandlerClickHistoryDataRemove(e){

		this.historyDataArray.forEach((_elm , _index) => {

			//非ロックかつ、同じ箇所を示すノードを見つけたらノードと、それを含むオブジェクトを消去
			if(!_elm.lock &&e.target.parentNode.isSameNode(_elm.node)){
				this.historyNode.removeChild(_elm.node);
			//	console.log("履歴オブジェクト消去" , _elm);
				this.historyDataArray.splice(_index , 1);
				return;
			}

		});

		this._updateHistoryData();	//更新
	}

	//履歴の基本消去機能。ロックがかかっているもの以外はすべて削除
	eventHistoryDataAllRemove(e){

		let _historyData = this.historyDataArray;
		let _len = _historyData.length;
		for(var t=_len-1; t>=0; t--){
			//ロックがかかっていないもの
			if(!_historyData[t].lock){
				this.historyNode.removeChild(_historyData[t].node);
				_historyData.splice(t , 1);
			}
		}
		this._updateHistoryData();	//更新
	}



	/** 履歴データをbackgroundに保存する (但し保存しているノードを消してから) */
	_updateHistoryData(){
		// delete 演算子を使っているので、オブジェクトをディープコピーしている
		// これを省くと、 node が削除され、エラい事になる;;
		let _tempObj = JSON.parse(JSON.stringify(this.historyDataArray));
		//let _tempObj = this.historyDataArray;
		_tempObj.forEach(_elm => {
			_elm.node = null;
			delete _elm.node;
		});
		//console.log( _tempObj );
		saveOption("search_history", _tempObj);	//backgroundへ全情報を上書き
	}

	/**
	 * 履歴データを格納
	 */
	_historyDataPushFromFormData(){
		let _setObj = {};
		//取り出し。undifindとか""も想定
		let _nameVal = this.baseInputNode.value;
		let _attrVal = this.attrSelectNode.value || undefined;
		let _costVal = this.costSelectNode.value || undefined;
		let _rareVal = this.rareSelectNode.value || undefined;
		//フラグあれば名前以外も保存
		_setObj.name = _nameVal;
		_setObj.attr = _attrVal;
		_setObj.rare=_rareVal;
		_setObj.cost=_costVal;
		//console.log(_nameVal , _attrVal , _rareVal , _costVal);

		//名前か3種詳細のいずれか最低1つのkeyが存在することが保存の第一前提

		let	_saveFlag = true;
		let _historyData = this.historyDataArray;
		_historyData.forEach(_elm => {
			//	console.log(x ,  _elm);
			//履歴に同一名が存在していれば保存しない方針
			if(_nameVal == _elm.name){
		//		console.warn(_nameVal , _elm.name , "同一名のキャラ名履歴が存在します","属性確認" , _attrVal , _elm.attr);
				if(_attrVal == _elm.attr){
		//			console.log("属性値一致/コスト確認" , _costVal , _elm.cost);
					if(_costVal == _elm.cost){
		//				console.log("コスト値一致" , _costVal , _elm.cost);
						if(_rareVal == _elm.rare){
		//					console.log("レア値相違" , _rareVal , _elm.rare);
							console.log("全一致履歴確認 / 保存中断" , _elm);
							_saveFlag = false;	//保存取りやめ
							return;
						}
					}
				}
			}
		});

		//console.log(_saveFlag , _nameVal , _attrVal , _costVal , _rareVal);
		if(!_nameVal && !_attrVal && !_costVal && !_rareVal){
		//	console.log("すべて未記入なので、セーブフラグを落とします");
			_saveFlag = false;
		}
		
		if(_saveFlag){
			
			/*	ここで最大保持件数を超過しないようにしたい
			*/
			if(this.maxHistoryNum > this.historyDataArray.length){
				
			}else{
				
				let _overFlow = true;
				//履歴超過により、古い履歴を1件削除します
				_historyData.forEach((_elm , _index)=> {
					if(!_elm.lock){
						_historyData.splice(_index , 1);	//ロックが掛かっていないものを1件削除
						_overFlow = false;
						return;
					}
				});

				if(_overFlow){
					alert("検索履歴が上限"+this.maxHistoryNum+"を超過しているため、古い履歴を削除しようとしましたが、\n全ての履歴にロックが掛かっているため失敗しました");
					return;
				}
			}
		
			_historyData.push(_setObj);
			this._updateHistoryData();
		}
		
	}

	/** 
	 * 同鯖なら true 逆サバなら false を返すメソッド
	 */
	_isFreeTradeServerType(){

		let _timeObj = new Date();
		let _nowtimenum = _timeObj.getTime();
		_nowtimenum += (1000*60*60* 9);	//GMT+9時間
		let _keika_week = Math.floor(_nowtimenum/(1000*60*60*24*7));		// 何週間経った？
		let _weekHasuuType = null;
	//	console.log(keika_week+"週間経過 : 週端数 "+(keika_week%2)+" 判定");
		if((_keika_week%2) == 0){
			_weekHasuuType = 0;
		}else{
			_weekHasuuType = 1;
		}
		
		//現在が週端数値にとって、その週の月曜05:00以前か、以降かを判別する
		let _now_timeObj = new Date();
		let _now_youbi = _now_timeObj.getDay();	//曜日格納
		let _changeFlag = false;
		//フラグ変動===============
		if(_now_youbi == 0 || _now_youbi >= 4){	
	//		console.log("日0 or 木4・金5・土6" , _weekBaseType , _changeFlag);
		}
		else if(_now_youbi == 1){
			if(_now_timeObj.getHours() >= 5){
	//			console.log("月1 / 午前5時以降" , _weekBaseType , _changeFlag);
				_changeFlag = true;
			}
			else {
	//			console.log("月1 / 午前5時以前" , _weekBaseType , _changeFlag);
			}
		}
		else{
	//		console.log("火2 水3" , _weekBaseType , _changeFlag);
			_changeFlag = true;
		}
		//=========================
		
		let _returnFlag = true;	//同鯖
	
		if(_weekHasuuType == _changeFlag){	//週タイプ1 かつ changeFlag 1 或いは 週タイプ0 かつ changeFlag 0
			_returnFlag = false;	//逆鯖
		}
		return _returnFlag;
	}

	/**
	 * フリトレ検索用。送信用の仮想formノードを作成 + 返却
	 */
	_createFreetradeForm(){
		let _form = document.createElement("form");
		_form.hidden = true;
		_form.method = "post";
		_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fsearch_top%3F";
		let _Obj = {
			keyword:this.baseInputNode.value
			,rare:this.rareSelectNode.value
			,attr:this.attrSelectNode.value
			,cost:this.costSelectNode.value
		};
		for(var n in _Obj){
			var _input = document.createElement("input");
			_input.name = n;
			_input.value = _Obj[n];
			_form.appendChild(_input);
		}
		//console.log(_Obj , _form);
		return _form;
	}

	/**
	 * アルバム検索用。送信用の仮想formノードを作成 + 返却
	 */
	_createAlbumForm(){
		let _form = document.createElement("form");
		_form.hidden = true;
		_form.method = "post";
		_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Farchive%3F";
		let _inputKeyword = document.createElement("input");
		_inputKeyword.name = "keyword";
		_inputKeyword.value = this.baseInputNode.value;
		_form.appendChild(_inputKeyword);
		return _form;
	}

	/**
	 * 送信用の仮想formノードを作成 + 返却 @ ギャラリー検索用
	 */
	_createGalleryForm(){
		let _form = document.createElement("form");
		_form.hidden = true;
		_form.method = "post";
		_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fidol_gallery%2Findex%2F0%2F0%2F2%2F0";
		
		let _Obj = {
			name:this.baseInputNode.value
			,is_search:1
		};
		for(var n in _Obj){
			let _input = document.createElement("input");
			_input.name = n;
			_input.value = _Obj[n];
			_form.appendChild(_input);
		}
		return _form;
	}

	/**
	 * 贈り物検索用。送信用の仮想formノードを作成 + 返却
	 */
	_createPresentForm(){
		let _form = document.createElement("form");
		_form.hidden = true;
		_form.method = "post";
		_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%3F";
		_form.name = "fil";
		//贈り物のレアリティ範囲は特殊なので、変換する	N,NL=10/R,R+=30/SR,SR+=50/ALL=0
		let _rareVal = this.rareSelectNode.value;
		let _setRareVal = 0;
		if(_rareVal==6 || _rareVal==5){	//SR,SR+
			_setRareVal = 50;
		}else if(_rareVal==4|| _rareVal==3){
			_setRareVal = 30;
		}else if(_rareVal==2 || _rareVal==1){
			_setRareVal = 10;
		}
		let _Obj = {
			keyword:this.baseInputNode.value
			,sort_type:3
			,no_cache:1
			,cache:1
			,view_auth_type:2
			,attribute:this.attrSelectNode.value
			,filter:_setRareVal
			,cost:this.costSelectNode.value
		};
		for(var n in _Obj){
			var _input = document.createElement("input");
			_input.name = n;
			_input.value = _Obj[n];
			_form.appendChild(_input);
		}
		return _form;
	}

	/**
	 * 女子寮検索用。送信用の仮想formノードを作成 + 返却
	 */
	_createStorageForm(){
		let _form = document.createElement("form");
		_form.hidden = true;
		_form.method = "post";
		_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fsearch_top%3F";
		_form.name = "name_search";
		
		let _Obj = {
			keyword:this.baseInputNode.value
			,attribute:this.attrSelectNode.value
			,rarity:this.rareSelectNode.value
			,cost:this.costSelectNode.value
		};
		for(var n in _Obj){
			var _input = document.createElement("input");
			_input.name = n;
			_input.value = _Obj[n];
			_form.appendChild(_input);
		}
		return _form;
	}

	/**
	 * イベントハンドラ。 select要素を操作したときに呼ばれる。未指定なら色を付けず、valueが変われば色を付ける
	 * @param {*} _targetElm 
	 * @param {*} _value 
	 */
	_eventHandlerChangeValueColor(_targetElm , _value){
		//値が未指定、偽なら白に差し戻して終了
		if(!_value){
			_targetElm.style.backgroundColor = "#FFFFFF";
	//		console.log(_value);
			return;
		}
		
		let _setColor = null;
		if(this.attrSelectNode == _targetElm){	//属性の場合
			if(_value == 1){	_setColor="#FFE0E0";	}
			else if(_value == 2){	_setColor="#E0E0FF";}
			else if(_value == 3){	_setColor="#FFE0A0";}
		}
		else if(this.rareSelectNode == _targetElm){	//レアリティの場合
			_setColor="#FFE0a0";
		}
		else if(this.costSelectNode == _targetElm){	//コストの場合
			if(_value > 20 ){	_setColor="#FF9090";	}
			else if(_value > 15){	_setColor="#FFA090";}
			else if(_value > 10){	_setColor="#FFC0C0";}
			else if(_value > 1){	_setColor="#FFE0E0";}
		}
		
		if(_setColor){
			_targetElm.style.backgroundColor = _setColor;
		}else{
			_targetElm.style.backgroundColor = "";
		}
		//console.log(_targetElm , _value);
	}


	/**
	 * 外部サイト等へのリンクを作成
	 */
	createSiteLink(){
		
		let _setAreaElm = document.createElement("div");
		
	//	let _maxheight = window.screen.availHeight - 100;
		let _siteDefine = [
			{	name:"mkt_idolunit",
				label:"mkt:idolunit",
				title:"簡易ユニットシミュレーター",
				url:"http://mkt.packetroom.net/idolunit/",
				option:["scrollbars=yes"],
			},
			{	name:"mkt_skillsearch",
				label:"mkt:skillsearch",
				title:"簡易特技検索ページ",
				url:"http://mkt.packetroom.net/skillsearch/",
			},
			{	name:"default_window",
				label:"特技逆引きリスト(Spinacia)",
				url:"https://docs.google.com/spreadsheets/d/txBFEbbUbHVVo8LmLM0rMrg/htmlview?pli=1",
			},
			{	name:"memo_skill_lv_html",
				label:"特技レベル上げメモ",
				url:getFilePath("./skilllv.html"),
				option:["toolbar=no","width=430","height=360"],
				lock:["width","height"],
			}
		];


		//定義配列を回しながら、リンクのクリックイベントを作成
		_siteDefine.forEach(_elm => {
			let _setLinkElm = document.createElement("span");
			_setLinkElm.textContent = _elm["label"];
			_setLinkElm.className = "cms_site_link";
			if(_elm["title"]){
				_setLinkElm.title = _elm["title"];
			}

			_setLinkElm.addEventListener("click",e =>{

				let _window_pos_define = getOption("window_position_object");

				//▼backgroundでの設定値
				let _use_pos_data = _window_pos_define[ _elm["name"] ];
				let _tempArr = [];
				if(_use_pos_data){
					for(let _key in _use_pos_data){
						_tempArr.push(_key + "=" + _use_pos_data[_key]);
					}
				}
				//▼上記固定設定値
				if(Array.isArray(_elm["option"])){
					//console.log( _elm["option"] );
					_tempArr = _tempArr.concat( _elm["option"] );
				}

			//	console.log( _elm["name"] , _tempArr );
				let _targetURL = _elm["url"];

				// あとは background.js に任せる
				chrome.extension.sendRequest({
					status:"subwindowopen",
					url: _targetURL,
					option_str: _tempArr.join(","),
				}, function(){});

			},false);
			
			_setAreaElm.appendChild(_setLinkElm);
			_setAreaElm.appendChild(document.createElement("br"));
		});
		
		
		this.baseNode.appendChild(_setAreaElm);
		
	}

}

/**
 * グローバル用インスタンス
 */
let customMenuSearchInstance = new CustomMenuSearchClass();

/**
 * グローバルに用意した、アイドルを定義したJSONオブジェクト
 */
var allIdolListObj = {
	"あ":{
		"あ":{
			"相原雪乃":1
			,"赤西瑛梨華":1
			,"浅野風香":1
			,"安部菜々":1
			,"天海春香":1
			,"有浦柑奈":1
			,"安斎都":1
			,"相川千夏":2
			,"秋月律子":2
			,"浅利七海":2
			,"ｱﾅｽﾀｼｱ":2
			,"綾瀬穂乃香":2
			,"荒木比奈":2
			,"愛野渚":3
			,"相葉夕美":3
			,"赤城みりあ":3
			,"秋月涼":3
		}
		,"い":{
			"五十嵐響子":1
			,"池袋晶葉":1
			,"一ノ瀬志希":1
			,"今井加奈":1
			,"井村雪菜":1
			,"伊集院惠":2
			,"ｲｳﾞ･ｻﾝﾀｸﾛｰｽ":3
			,"市原仁奈":3
			
		},"う":{
			"氏家むつみ":2
			,"梅木音葉":2
			,"上田鈴帆":3
		},"え":{
			"江上椿":1
			,"衛藤美紗希":3
			,"海老原菜帆":3
			
		},"お":{
			"太田優":1
			,"大西由里子":1
			,"大沼くるみ":1
			,"大原みちる":1
			,"緒方智絵里":1
			,"奥山沙織":1
			,"乙倉悠貴":1
			,"大石泉":2
			,"岡崎泰葉":2
			,"及川雫":3
			,"大槻唯":3
		}
	},
	"か":{
		"か":{
			"我那覇響":1
			,"上条春菜":2
			,"神谷奈緒":2
			,"川島瑞樹":2
			,"神崎蘭子":2
			,"片桐早苗":3

		}
		,"き":{
			"菊地真":1
			,"如月千早":2
			,"岸部彩華":2
			,"木場真奈美":2
			,"桐野ｱﾔ":2
			,"桐生つかさ":2
			,"北川真尋":3
			,"喜多日菜子":3
			,"喜多見柚":3
			,"木村夏樹":3
			,"ｷｬｼｰ･ｸﾞﾗﾊﾑ":3
		}
		,"く":{
			"日下部若葉":1
			,"工藤忍":1
			,"ｸﾗﾘｽ":1
			,"栗原ﾈﾈ":1
			,"黒埼ちとせ":1
			,"黒川千秋":2
		}
		,"け":{
			"ｹｲﾄ":2
		}
		,"こ":{
			"古賀小春":1
			,"輿水幸子":1
			,"小早川紗枝":1
			,"小日向美穂":1
			,"小室千奈美":2
			,"小関麗奈":3
			,"小松伊吹":3
		}
	
	}
	,"さ":{
		"さ":{
			"西園寺琴歌":1
			,"ｻｲﾈﾘｱ":1
			,"榊原里美":1
			,"佐久間まゆ":1
			,"櫻井桃華":1
			,"鷺沢文香":2
			,"佐々木千枝":2
			,"佐城雪美":2
			,"斉藤洋子":3
			,"冴島清美":3
			,"桜井夢子":3
			,"佐藤心":3
			,"沢田麻理菜":3
			,"財前時子":3
		}
		,"し":{
			"椎名法子":1
			,"島村卯月":1
			,"白菊ほたる":1
			,"白雪千夜":1
			,"塩見周子":2
			,"四条貴音":2
			,"篠原礼":2
			,"渋谷凛":2
			,"白坂小梅":2
			,"首藤葵":3
			,"城ヶ崎美嘉":3
			,"城ヶ崎莉嘉":3
		}
		,"す":{
			"涼宮星花":1
			,"砂塚あきら":2
			,"杉坂海":3
		}
		,"せ":{
			"関裕美":1
			,"瀬名詩織":2
			,"仙崎恵磨":3
		}
		,"そ":{
			"相馬夏美":3
		}
	}
	,"た":{
		"た":{
			"高槻やよい":1
			,"高垣楓":2
			,"高橋礼子":2
			,"鷹富士茄子":2
			,"高峯のあ":2
			,"多田李衣菜":2
			,"橘ありす":2
			,"高森藍子":3
		}
		,"ち":{}
		,"つ":{			
			"月宮雅":1,
			"辻野あかり":1,
			"土屋亜子":3,
		}
		,"て":{}
		,"と":{
			"道明寺歌鈴":1
			,"東郷あい":2
			,"十時愛梨":3
		}
	}
	,"な":{
		"な":{
			"中野有香":1
			,"長富蓮実":1
			,"成宮由愛":2
			,"ﾅﾀｰﾘｱ":3
			,"並木芽衣子":3
			,"南条光":3
			,"難波笑美":3
		}
		,"に":{
			"丹羽仁美":1
			,"西川保奈美":2
			,"新田美波":2
			,"二宮飛鳥":2
			,"西島櫂":3
		}
		,"ぬ":{}
		,"ね":{}
		,"の":{
			"野々村そら":3
		}
		
	}
	,"は":{
		"は":{
			"早坂美玲":1
			,"原田美世":1
			,"服部瞳子":2
			,"速水奏":2
			,"萩原雪歩":3
			,"浜川愛結奈":3
			,"浜口あやめ":3
		},"ひ":{
			"日高愛":1
			,"兵藤ﾚﾅ":1
			,"柊志乃":2
			,"久川颯":2
			,"久川凪":3
			,"日野茜":3
			,"姫川友紀":3
		},"ふ":{
			"福山舞":1
			,"藤本里奈":1
			,"双葉杏":1
			,"藤居朋":2
			,"藤原肇":2
			,"古澤頼子":2
			,"双海亜美":3
			,"双海真美":3
		},"へ":{
			"ﾍﾚﾝ":2
		},"ほ":{
			"北条加蓮":2
			,"星井美希":3
			,"星輝子":3
			,"堀裕子":3
			,"本田未央":3
		}
		
	}
	,"ま":{
		"ま":{
			"前川みく":1
			,"松原早耶":1
			,"間中美里":1
			,"松尾千鶴":2
			,"松永涼":2
			,"松本沙理奈":2
			,"槙原志保":3
			,"松山久美子":3
			,"的場梨沙":3
			,"真鍋いつき":3
		},"み":{
			"水谷絵理":1
			,"水本ゆかり":1
			,"三村かな子":1
			,"宮本ﾌﾚﾃﾞﾘｶ":1
			,"三浦あずさ":2
			,"水木聖來":2
			,"水野翠":2
			,"三船美優":2
			,"水瀬伊織":3
			,"三好紗南":3
		},"む":{
			"棟方愛海":1
			,"村松さくら":1
			,"向井拓海":3
			,"村上巴":3
		},"め":{
			"ﾒｱﾘｰ･ｺｸﾗﾝ":3
		},"も":{
			"持田亜里沙":1
			,"桃井あずき":1
			,"望月聖":2
			,"森久保乃々":2
			,"諸星きらり":3
		}
	}
	,"や":{
		"や":{
			"楊菲菲":1
			,"柳清良":1
			,"柳瀬美由紀":1
			,"八神ﾏｷﾉ":2
			,"大和亜季":2
			,"矢口美羽":3
		}
		,"ゆ":{
			"遊佐こずえ":1
			,"結城晴":2
			,"夢見りあむ":3
			
		}
		,"よ":{
			"横山千佳":1
			,"吉岡沙紀":2
			,"依田芳乃":3
		}
		
	}
	,"ら":{
		"ら":{
			"ﾗｲﾗ":2
			
		},"り":{
			"龍崎薫":3
		}
		,"る":{}
		,"れ":{}
		,"ろ":{}
	}
	,"わ":{
		"わ":{
			"脇山珠美":2
			,"和久井留美":2
			,"若林智香":3
		}
	}
	
	/*
		,"トレーナー":{
			"ﾙｰｷｰﾄﾚｰﾅｰ"
			,"ﾄﾚｰﾅｰ"
			,"ﾍﾞﾃﾗﾝﾄﾚｰﾅｰ"
			,"ﾏｽﾀｰﾄﾚｰﾅｰ"
		}
		*/
		
};




