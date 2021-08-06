//カスタムメニューを組み込むためだけのスクリプト
//呼び出し元は first_load.js > mainFunction(); 冒頭

var cMenu = {};

//公式ノードと作成したカスタムメニューノードの格納先
cMenu.nodeObj = {
	official:{
		area_menu_header_6btn:null	// .area_menu_header > .area_menu_header_6btn
		,area_menu_header:null//	.area_menu_header
		,event_header:null	//	header.event_header
		,head_menu:null	//ぷちヘッダ
		,top_container:null	//#TOP
	}
	,
	custom:{	//階層イメージ
		base:null
			,rowA:null
			,rowB:null
			,sub:null
		,petitInject:null	//ぷちメニュー移植用
	}
};

//
/**
 * カスタムメニューを付与するための足掛かり処理。ノードをプロパティに確保等行う。
 * 何度も呼ばれて、確実にメニューを操作するためのノードを集める意図がある。
 */
cMenu.fastSetUp = function(){
	if(location.href.indexOf("event_fashion%2Fbattle_confirm%3F") != -1){
		console.warn("ぷちコレ演出系により、メニューを生成しません");
		return;
	}
	
	//▼公式6btn取得済みなら(なので)非表示を修正
	if(this.nodeObj.official.area_menu_header_6btn){
		const _6btn = this.nodeObj.official.area_menu_header_6btn;
		//新お仕事演出ではデフォで非表示なので、これを弄る
		if(_6btn.style.display == "none"){
			_6btn.style.display = "block";
		}
		//イベントページではイベバナー領域が最初に出てくるので、これをデフォで通常メニュー表示にさせたい
		{
			const _eventLogoAreaNode = _6btn.querySelector(".event_logo-area");
			if(_eventLogoAreaNode){
				_eventLogoAreaNode.style.display = "none";
				//更に。ul > li > a の一部表示が none になっているのでblockに変更
				const _li_aNodes = _6btn.querySelectorAll("li > a[class^='head_menu_']");
				[..._li_aNodes].find((_node , _index) =>{
					if(1 <= _index && _index <= 4){
						_node.style.display = "block";
					}
				});
			}
		}

		//▼まだカスタムメニューノードが作られていない場合、6btnが得られたこのタイミングでカスタムメニューを仕込む
		if(!this.nodeObj.custom.base){

			// 独自クラスでカスタムメニュー生成
			const _customMenuInstance = new CustomMenuGeneratorClass();
			if(_customMenuInstance.generateMenuNode()){
				// 作成したノードを確保している
				let _customMenuNode = _customMenuInstance.getBaseNode();
				let _customSubMenuNode = _customMenuInstance.getSubMenuNode();
				cMenu.nodeObj.custom.base = _customMenuNode;
				cMenu.nodeObj.custom.sub = _customSubMenuNode;
				//公式ノードにカスタムノードを突っ込む
				this.nodeObj.official.area_menu_header_6btn.appendChild( _customMenuNode );
				//公式メニューにミニアイコン付与
				this.setMiniLinkIcon();
			}


		}
	}
	
	//▼area_menu_headerを得ていない場合
	if(!this.nodeObj.official.area_menu_header){
		var _areaMenuHeader = document.querySelector(".area_menu_header");
		if(_areaMenuHeader){
			this.nodeObj.official.area_menu_header = _areaMenuHeader;
		}
	}

	//▼event_headerを得ていない場合
	if(!this.nodeObj.official.event_header){
		var _eventHeader = document.querySelector(".event_header");
		if(_eventHeader){
			this.nodeObj.official.event_header = _eventHeader;
		}
	}

	//▼ぷちメニュー取得済みなら終了
	if(this.nodeObj.custom.petitInject){
		return;
	}else{
		//原則ぷち以外ならはじくが、受け入れURLは例外とする
		if(urlCheck("idolmaster%2Fpetit_cg") !=true){
			var _enableArr = [
				"idolmaster%2Fdeck%2Fdeck_edit_top%3Ftype%3D2"	//ぷちデレラLIVEバトル構成
				,"%2Fpetit_deck_index"	//ぷちデレライベント編成
			];
			var _returnFlag = true;
			for(var _t=0; _t<_enableArr.length; _t++){
				if(location.href.indexOf(_enableArr[_t]) != -1){
					console.log("受入処理");
					_returnFlag = false;
					break;
				}
			}
			if(_returnFlag){
				return;
			}
		}
		
		
		//ぷち例外URLを定義
		var _exceptionArr = [
			"petit_cg%2Fpetit_cheer"//他Pさんのぷちデレラ訪問画面
			,"petit_cg%2Flike_list"	//いいね履歴
			,"petit_exchange_list%2Faccessory_exchange"		//ぷちデレラ>ぷち衣装引き換えチケット
			,"petit_exchange_list%2Fmoney"		//ぷちデレラ>ぷちマニー交換
		];
		
		for(var _n=0; _n<_exceptionArr.length; _n++){
			if(location.href.indexOf(_exceptionArr[_n]) != -1){
				//console.log("petitがURLに含まれていますが、例外ページにより処理を中断します");
				return;
			}
		}
		
		//コンテナを探り、見つかればマージン(ぷちヘッダ移植先)要素を格納
		var _containerNode = document.querySelector("#top");
		if(_containerNode){
			var _setMarginElm = document.createElement("div");
			_setMarginElm.style.height = "55px";	//マージン
			_containerNode.parentNode.insertBefore(_setMarginElm , _containerNode);
			cMenu.nodeObj.custom.petitInject = _setMarginElm;
	//		console.log("ぷちヘッダ格納先設置に成功");
		}else{
			console.log("ぷちヘッダ格納先設置に失敗" , document.readyState);
		}
	}

};

/**
 * スクロールが始まったら要素を absolute > fixed に変更する
 */
cMenu.scrollSetup = function(){
	
	if(!getOption("menu_follow_mode_check")){
		return;
	}
	if(cMenu.nodeObj.custom.base && document.body){
		const _targetNode = cMenu.nodeObj.custom.base;
		//const _targetNode = cMenu.nodeObj.official.area_menu_header;
		const _px = 58;	//58 or 93
		document.addEventListener("scroll",function(e){
			const _scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(_scrollTop > _px){
				_targetNode.style.position = "fixed";
				_targetNode.style.top = "0px";
			}else{
				_targetNode.style.position = "absolute";
				_targetNode.style.top = _px + "px";
			}

		},false);
	}

};

//女子寮の番号をbackgroundに保存する
//入寮も呼び出しも不可能な場合は、取得できない可能性がある
cMenu.collectStorageNumber = function(){
	var _titleSubBlue = document.querySelectorAll(".title_sub_blue");
	/**
	 * _storageObj = {
	 * 		1:{
	 * 			num:5,
	 * 			name:"特技上げ用(特訓前)"
	 * 		}
	 * }
	 */

	var _storageObj = {};
//	console.log("_titleSubBlue" , _titleSubBlue.length);
	for(var n=0; n<_titleSubBlue.length; n++){
		var _nextTableElm = _titleSubBlue[n].nextElementSibling;
		if(_nextTableElm && _nextTableElm.nodeName == "TABLE"){
			//例外ワリと無視
			try{
				var _nameLabelElm = _nextTableElm.querySelector("tr>td+td>div>div");
				if(_nameLabelElm){
				//	console.log(_nameLabelElm);
					var _nameLabel = _nameLabelElm.textContent;
					var _matchArr = _titleSubBlue[n].textContent.match(/第([0-9]{1,2})女子寮/);
					var _storageIndex = parseInt(_matchArr[1],10);
					var _storageLinkNum = -1;
					var _storageName = _nameLabel;
					if(_storageIndex > 0){
						//リンクから管理番号を得る
						var _linkElm = _nextTableElm.nextElementSibling.querySelector("a.btn_normal_line_2");
						if(_linkElm && _linkElm.href){
							_matchArr = _linkElm.href.match(/index%2F[0-9]{1,}%2F[0-9]{1,}%2F[0-9]{1,}%2F[0-9]{1,}%2F([0-9]{1,})%2F[0-9]{1,}%3F/);
						//	console.log(_matchArr);
							if(_matchArr){
								_storageLinkNum = parseInt(_matchArr[1],10);
						//		console.log("第" , _storageIndex , "女子寮ストレージ番号" , _storageLinkNum);
							}
						}
					}
				}else{
					console.warn("missing _nameLabelElm");
				}
			
				if(_storageIndex > 0 && _storageLinkNum > 0 && _storageName){
					_storageObj[_storageIndex] = { num:_storageLinkNum , name:_storageName };
				}
			}catch(e){
				
				console.error(e);
			}
		}else{
			break;
		}
	}	
	//console.log(_storageObj);
	saveOption("storage_index_object" , _storageObj);

};


/** ぷちでれらのページか判断するプロパティ*/
cMenu.petit = (location.href.indexOf("idolmaster%2Fpetit_cg")!=-1?true:false);

/** 公式メニューを探し、小さいリンクアイコンを作成,配置　目印ノードの検索成否を含め、処理が成功すれば true */
cMenu.setMiniLinkIcon = function(){

	let _officialMenuNode = null;
	//イベント画面
	if(location.href.indexOf("idolmaster%2Fevent") != -1){
		//イベント用のヘッダを得る(jsのタイミングにより、ここが得られない可能性がある？)
		_officialMenuNode = document.querySelector(".event_header");
		if(_officialMenuNode){

		}else{
			console.log("特殊形式:_officialMenuNode再検索");
			_officialMenuNode = document.querySelector("nav");
		}
		if(!_officialMenuNode){
			console.log("_officialMenuNodeが得られませんでした");
		}

	}else{	//その他すべてのページ
		_officialMenuNode = document.querySelector("nav");
	}

	if(!_officialMenuNode){
		console.log("_officialMenuNodeの取得に失敗");
		return;
	}

	//▼Top,ガチャ,特訓
	const _liTopNodes = _officialMenuNode.querySelectorAll("li");
//	console.log(liTopElms);
	if(_liTopNodes.length >= 4){
		//▼ ミニリンクアイコン用クラスを用いる
		const _miniIconInstance = new MiniLinkIconNodeClass();

		if(_liTopNodes[0]){	//TOP
			_liTopNodes[0].appendChild( _miniIconInstance.generateTopLink() );
		}
		if(_liTopNodes[2] && cMenu.petit == false){	//ローカルガチャ
			_liTopNodes[2].appendChild( _miniIconInstance.generateLocalGachaLink());
		}
		if(_liTopNodes[3] && cMenu.petit == false){	//特訓
			_liTopNodes[3].appendChild( _miniIconInstance.generateCardUnionLink() );
		}
		if(_liTopNodes[4] && cMenu.petit == false){	//トレード登録
			_liTopNodes[4].appendChild( _miniIconInstance.generateFreeTradeExhibitLink() );
		}
		return true;
	}
};



//	呼び出し元 mainFunction() 一連のメソッドを使ってカスタムメニューの生成や配置を行う
cMenu.process = function(){

	//ぷちコレの演出系ページだと省く
	if(location.href.indexOf("event_fashion%2Fbattle_confirm%3F") != -1){
		console.log("ぷちコレ一部ページにより、一切のカスタムメニュー処理を行いません");
		return;
	}
	
	// common_override.css の CSS操作で height をいじった公式メニュー領域
	if(this.nodeObj.official.area_menu_header_6btn){
		
	}else{
		console.log(".area_menu_header_6btn が見つかりません #head_menu の検索に移ります");
		/*	ぷちデレラでは div#head_menu がメニュー領域として独立。ただしabsoluteで位置が固定されている
			大きな管理コンテナの上にマージンノードを作成し、そこに div#head_menu を移動。absoluteも解除して調整
			管理コンテナ
			ぷちTOP	#main_screen
		*/
		if(cMenu.nodeObj.custom.petitInject){
			let _officialPetitMenu = document.querySelector("#head_menu");
			if(_officialPetitMenu){
				_officialPetitMenu.style.position = "initial";	//absoluteを解除
				cMenu.nodeObj.custom.petitInject.appendChild(_officialPetitMenu);	//早期に挿入させた移植先要素へ移動

				// 独自クラスでカスタムメニュー生成
				const _customMenuInstance = new CustomMenuGeneratorClass();
				if(_customMenuInstance.generateMenuNode()){
					// 作成したノードを確保している
					let _customMenuNode = _customMenuInstance.getBaseNode();
					let _customSubMenuNode = _customMenuInstance.getSubMenuNode();
					cMenu.nodeObj.custom.base = _customMenuNode;
					cMenu.nodeObj.custom.sub = _customSubMenuNode;
					
					//公式メニューにミニアイコン付与
					this.setMiniLinkIcon();

					// 公式ノードの代わりに、ぷちメニュー配下に挿入
					_officialPetitMenu.appendChild( _customMenuNode );
				}
				
				
			}else{
				console.error("#head_menuが見つかりません");
			}
		}


	}

};



/**
 * カスタムメニューを生成するクラス。
 * 定義もここのメソッド内。
 */
class CustomMenuGeneratorClass{

	constructor(){

		/** カスタムメニューの全体基礎ノード */
		this._baseNode = null;
		/** カスタムメニューのサブメニュー展開組み込み用ノード */
		this._subMenuAreaNode = null;
		/** URLの未定義したオブジェクトの格納場所。コンストラクタ上での作成は非推奨
		 * 中身は this._getUrlOnlyDefineObject() によって作られる
		 * */
		this._urlDefineObject = {};
		/**
		 * カスタムメニューのサブ展開メニューに関する定義を格納するオブジェクト。コンストラクタ上での作成は非推奨
		 * 中身は this._genSubMenuDefineObj() によって作られる。
		 */
		this._subMenuGenDefineObject = {};
	}

	/**
	 * 作成したカスタムメニューの全体基礎ノードを返す
	 */
	getBaseNode(){
		return this._baseNode;
	}

	/**
	 * 作成したカスタムメニューのサブメニュー展開組み込み用ノードを返す
	 */
	getSubMenuNode(){
		return this._subMenuAreaNode;
	}

	/**
	 * キー名とURLをペアにした定義オブジェクトを動的に作成して返す。
	 */
	_getUrlOnlyDefineObject(){

		// ここのキー名は generateMenuNode() メソッド内のキーと対応させるため互いに合わせる(同じにする)必要がある
		let _defObj = {
			"item":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fitem%2F"
			,"present":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F%3Fview_auth_type%3D1%26cache%3D1"
			//% 2Findexがないと、deck_edit.jsの一部処理が面倒になる
			//,"idol":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_list%2Findex"
			// (詳細に変更)
			,"idol":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_list%2Fdetail"
			,"idol_menu":""
			//女子寮
			,"storage":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2F"
			//編成
			,"deck":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck"
			//トレード
			,"trade":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Ftrade_response%2Ftrade_list_advance"
			,"production_menu":""
			,"profile_menu":""
			,"event": getOption("event_url")
			,"event_deck": getOption("event_deckeditlink_value")
			,"petit_menu":""
			,"game_menu":""
			,"work_menu":""
			,"search_menu":""
			,"info_menu":""
			,"dojo": getOption("dojo_url")
			,"blank":""
		};

		return _defObj;
	}

	/**
	 * 完成されたカスタムメニューを生成する。冷害など起きなければ true を返す。
	 * getOption() が正常に使え、且つ値を返せる状態でないと、失敗する
	 */
	generateMenuNode(){

		// このタイミングでURL定義オブジェクトを動的に作成
		this._urlDefineObject = this._getUrlOnlyDefineObject();
		// このタイミングでサブ展開メニュー定義オブジェクトを動的に作成
		this._subMenuGenDefineObject = this._genSubMenuDefineObj();

		const _baseNode = document.createElement("div");
		_baseNode.id = "custom-menu";
		this._baseNode = _baseNode;

		//サブ関数に処理させて一段目二段目を生成
		_baseNode.appendChild(
			this._generateSingleMenuNode(
				[
					"present",
					"trade",
					"petit_menu",
					"event_deck",
					"event",
					"dojo",
					"idol",
					"storage",
					"deck"
				]
			)
		);
		_baseNode.appendChild(
			this._generateSingleMenuNode(
				[
					"work_menu",
					"item",
					"search_menu",
					"info_menu",
					"production_menu",
					"profile_menu",
					"user_menu",
					"storage_menu",
					"game_menu"
				]
			)
		);

		//サブメニュー専用領域
		const _subMenuAreaNode = document.createElement("div");
		_subMenuAreaNode.id = "custom-menu-sub";
		this._subMenuAreaNode = _subMenuAreaNode;

		_baseNode.style.position = "absolute";	//relative→absolute;
		_baseNode.style.top = "58px";
		_baseNode.style.zIndex = 220;	//イベント時のarea_menu_headerが210なのでそれ以上
		_baseNode.appendChild(_subMenuAreaNode);

		return true;
	}


	/**
	 * 一段分のメニューノード(ul)を作成して返す。この内部でクリックイベント(サブメニュー表示)や、URL付与等を行っている
	 * 引数は判別用の文字列を格納した配列
	 * @param {*} _menuLineDefArr 
	 */
	_generateSingleMenuNode(_menuLineDefArr){
		
		const _ulNode = document.createElement("div");
		_ulNode.className = "mkt_custommenu_row";	//外部css依存

		const _subDefObj = this._subMenuGenDefineObject;

		// 配列を回しながら、その文字列に応じた処理を行う
		_menuLineDefArr.forEach((_value , _index) =>{

			const _typeStr = _value;
			const _liNode = document.createElement("div");
			const _linkNode = document.createElement("a");
			
			// img,image要素にしていないのは、2014/07/19に JQueryに書き換えられることが発覚した為。
			// 現在は a の background-url という仕様にしている
			_linkNode.setAttribute("style","background:url("+(chrome.extension.getURL("image/menu/"+_typeStr+".png"))+");background-size:cover;background-position:center center;");
			
			_liNode.className ="mkt_custommenu_col";
			_linkNode.className = "mkt_custommenu_link";
			
			_liNode.appendChild(_linkNode);
			_ulNode.appendChild(_liNode);
			
			//▼最終出力 ただし35~39のURLは新しいタブで開くかどうかの影響を受けるので target を仕込む
			if(_typeStr == "profile_menu"){	//プロフ
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName( "profile_menu" );
				},false);
			}
			else if(_typeStr == "game_menu"){	//ゲーセン
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName( "game_menu" );
				},false);
			}
			else if(_typeStr == "work_menu"){	//▼仕事一覧
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setPath(getFilePath("./menu/work.html"));
	
				_linkNode.addEventListener('click',	e=>{
					_subMenuInstance.generateMenuForPagePath();
				}, false );
			}
			else if(_typeStr == "search_menu"){	//検索
				
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setPath(getFilePath("./menu/search.html"));
				//内部で実行する関数を渡す
				_subMenuInstance.setExecuteFunction(()=>{
					//custom_menu_search.js
					customMenuSearchInstance.setBaseNode( _subMenuInstance._pageNode );
					customMenuSearchInstance.setUp();
				});
	
				_linkNode.addEventListener('click',	e=>{
					_subMenuInstance.generateMenuForPagePath();
				}, false );
	
			}
			else if(_typeStr == "info_menu"){	//インフォ
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setPath(getFilePath("./menu/info.html"));
				_linkNode.addEventListener('click',	e=>{
					_subMenuInstance.generateMenuForPagePath();
				}, false );
			}
			else if(_typeStr == "storage_menu"){	//女子寮サブメニュー
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName("storage_menu");
				},false);
			}
			else if(_typeStr == "production_menu"){	//プロダクション
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName("production_menu");
				},false);
			}
			else if(_typeStr == "petit_menu"){	//ぷち
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName("petit_menu");
				},false);
			}
			else if(_typeStr == "user_menu"){	//ユーザーメニュー
				const _subMenuInstance = new CustomSubMenuClass();
				_subMenuInstance.setMenuDefineObject( _subDefObj );
				_linkNode.addEventListener("click",e=>{
					_subMenuInstance.generateMenuFromTypeName("user_menu");
				},false);
			}
			// 直接URLを与える。URL参照先はクラス内プロパティ。
			else {
				_linkNode.href = this._urlDefineObject[_typeStr];
			}

		});

		return _ulNode;
	}


	/**
	 * 静的定義 + 動的に生成した、カスタムメニュー用のオブジェクト配列を返す。
	 * このメソッドが呼ばれるとき、必ず getOption() が使えるようになっていなければならない。
	 * ここで作成した定義は CustomSubMenuClass でのみ使われることを想定している
	 */
	_genSubMenuDefineObj(){

		const _chatLimit = 7;
		const _chatBaseLink = "http://sp.mbga.jp/_chat_widget_game?widgetId=&pluginsType=mbga-game-chat&limit="+_chatLimit+"&showInformation=false&showHeader=true&showLink=true&stream=true&theme=light"
			+"&talkId="+getOption("production_chat_id")+"&widgetMode=message_list&useStream=true"
			+"&styleSheet=http%3A%2F%2Fsp.pf-img-a.mbga.jp%2F12008305%2F%3Fguid%3DON%26url%3Dhttp%253A%252F%252F125.6.169.35%252Fidolmaster%252Fcss%252Frich%252Fchat.css&isShellApp=false&iframeId=0";
	
		/**
		 * カスタムメニューの中でも、リンクではなく、クリックすると複数段のサブメニューを出すタイプの
		 * 細かい定義オブジェクト
		 */
		let _cmSubDefObj = {

			"game_menu":{
				position:[6,7,7]
				,menu:[
					[
						{name:"ヘルプ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fhelp"}
						,{name:"景品",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fexchange_prize"}
						,{name:"TOP",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2F"}
					]
					,[	
						{name:"🎲 S",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fdice_de_survival"}
						,{name:"花札",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fhanafuda"}
					]
					,[	
						{name:"🎲 2",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fdice_de_2"}
						,{name:"太鼓",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgame_center%2Fdrum_master_title"}
					]
				]
			}
			,"petit_menu":{
				position:[0,0,0]
				,menu:[
					[	{name:"shop",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg"}
						,{name:"ガチャ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fgacha_info"}
						,{name:"TOP",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg"}
						,{name:"ﾚｯｽﾝ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%3Fview_page%3D2"}
						,{name:"ボード",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Ftech_board%2F"}
						,{name:"プロフ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%3Fview_page%3D4"}
						,{name:"いいね",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Flike_list"}
					]
					,[	{name:"養成所",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fpetit_exchange_list%2Fmedal"}
						,{name:"編成",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fdeck_edit_top"}
						,{name:"ぷち",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fidol_list"}
						,{name:"衣装",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Faccessory_list"}
						,{name:"衣装凸",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Funion%2F0"}
					]
					,[	{size:2,name:"衣装設定",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fequipment_edit_top%2F1001"}
						,{name:"預入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fstorage_accessory_list%2F0%2F1"}
						,{name:"取出",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Fstorage_accessory_list%2F1%2F0"}
					]
				]
			}
			,"production_menu":{
				position:[2,3]
				,menu:[
					[
					
						{name:"ｽﾀﾝﾌﾟ",url:"http://sp.mbga.jp/_chat_app?u=/stampManager"}
						,{name:"ﾁｬｯﾄ",url:_chatBaseLink}
						,{name:"プロ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fknights%2F"}
						,{name:"ﾄﾚｰﾄﾞ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Ftrade_response%2Ftrade_list_advance"}
					]
					,[	
						{name:"PRA",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fp_ranking_award%2Franking_for_production%3Fl_frm%3Dp_ranking_award_1"}
						,{name:"ﾌﾟﾛﾒﾝ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fknights%2Fknights_member%3F"}
					]
				]
			}
			,"profile_menu":{
				position:[4,4]
				,menu:[
					[	{name:"PRA",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fp_ranking_award"}
						,{name:"プロフ",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fresults"}
						,{name:"凸",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattle_log%2Fbattle_log_list"}
					]
					,[
						{name:"交換",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fexchange%2Fmedal_list%2F999999%2F2"}
						,{name:"応援",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcheer%2Fcheers_list%2F0%2F"+getOption("myid")+"%3F"}
					]
				]
			}
			//女子寮定義オブジェクトは後付けされる
			,"storage_menu":{
				position:[3,3,6,6,6,6,6,6,6,6,6,6,6,6]
				,menu:[
					[
						{name:"ﾄﾚ:入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Ftrainer_card_storage%2Fpush_index"}
						,{name:"ﾄﾚ:呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Ftrainer_card_storage%2Fpop_index"}
						,{name:"女子寮",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2F"}
					//	,{name:"1：入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F"+2}
					//	,{name:"1：呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F"+2}
					]
					
					,[
						{size:2,name:"レアメダル化",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fexchange%2Fmaterial_list%2F999999"}
						,{name:"移籍",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_sale%2Findex%3F"}
						//{name:"2：入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F"}
						//,{name:"2：呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F"}
					]/*
					,[	{name:"3：入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F"+3}
						,{name:"3：呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F"+3}
					]
					,[	{name:"4：入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F"+4}
						,{name:"4：呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F"+4}
					]
					,[	{name:"5：入",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F"+5}
						,{name:"5：呼",url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F"+5}
					]
					*/
				]
			}
			
	/*		,"user_menu":{	//backgroundで定義、すぐ下の処理でこのオブジェクトへ編入される
				position:[4,4]
				,menu:[
					[	{name:"36",url:getOption("36")}
						,{name:"37",url:getOption("37")}
						,{name:"38",url:getOption("38")}
						,{name:"39",url:getOption("39")}
					]
				]
			}*/
		};

		// ユーザーメニューを動的定義
		{
			const _userMenuObj = getOption("user_menu");
			if(_userMenuObj){
				try{
					if(typeof(_userMenuObj) == "string"){	//localStorageから呼んだとなれば、string
						_cmSubDefObj["user_menu"] = JSON.parse(_userMenuObj);
					}if(typeof(_userMenuObj) == "object"){	
						_cmSubDefObj["user_menu"] = _userMenuObj;
					}
				}catch(e){
					console.error(e);
				}
			}
		}


		// 女子寮メニューを動的定義
		{
			const _storageObj = getOption("storage_index_object");
			if(_storageObj){
				let _storageMenuArray = _cmSubDefObj["storage_menu"]["menu"];
				//console.log(_storageMenuArray , _storageObj);
				try{
					let _addCount = 0;	//段をずらす数(カスタマイズ用)
					const _urlPushBase = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpush_index%2F0%2F0%2F0%2F0%2F";
					const _urlPopBase = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_storage%2Fpop_index%2F0%2F0%2F0%2F0%2F";
					const _nbspStr = String.fromCharCode(160);
					//ループで定義を作成しつつ、引数の配列を直に編集
					Object.keys(_storageObj).forEach((_key , _index) =>{
						const _valueObj = _storageObj[_key];
						const _linkNum = _valueObj["num"];
						const _storageName = _valueObj["name"] || "";
						const _storageIndexNum = _key;
						//console.log(_key , _index , _storageIndexNum , _valueObj);
						const _pushDefObj = {
							"name":("入 : "+_storageIndexNum),
							"url":_urlPushBase + _linkNum
						};
						const _popDefObj = {
							"size":2,
							"style_object":{"text-align":"left"},
							"name":(_nbspStr + _storageName),
							"url":_urlPopBase + _linkNum
						};
						//そのキー名のオブジェクトとして、既に何らかのメニューが定義されていた場合は既存配列に追加挿入
						if(typeof(_storageMenuArray[_index]) == "object"){
							_storageMenuArray[_index].push(_pushDefObj);
							_storageMenuArray[_index].push(_popDefObj);
						}
						//定義されていない場合は、メニューオブジェクトを上書き挿入
						else{
							_storageMenuArray[_index] = [
								_pushDefObj ,
								_popDefObj
							];
						}
					});
				}catch(e){
					console.error(e);
				}
			}

		}


		return _cmSubDefObj;
	}


}


/**
 * 公式メニュー付与用途の、小さいリンクアイコンを作成するだけのクラス。
 * 今のところ cMenu.setMiniLinkIcon(); で使われる
 */
class MiniLinkIconNodeClass{

	constructor(){
		this._defineObjArr = [
			{	//トップページ
				url:"http://sp.pf.mbga.jp/12008305/?guid=ON",
				imgLocalPath:"./image/icon_s/top.gif"
			},
			{	//ローカルガチャ
				url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgacha%2Findex%2F2%3F",
				imgLocalPath:"./image/icon_s/local.gif"
			},
			{	//特訓
				url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_union%3F",
				imgLocalPath:"./image/icon_s/union.gif"
			},
			{	//出品
				url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fexhibit_top%3F",
				imgLocalPath:"./image/icon_s/trade.png"
			},

		];
	}
	/**
	 * 引数は、定義プロパティ配列から引き出したいオブジェクトの添え字番号
	 * @param {*} _arrayIndexNum 
	 */
	_genNodeTemplate(_arrayIndexNum){
		const _defObj = this._defineObjArr[_arrayIndexNum];
		const _url = _defObj["url"];
		const _imgFullPath = getFilePath(_defObj["imgLocalPath"]);	//ローカルパスをフルパスに変換
		const _linkNode = document.createElement("a");
		_linkNode.href = _url;		
		const _iconSize =  "16px;";
		_linkNode.setAttribute("style","background:url("+_imgFullPath+") no-repeat;position:absolute;top:0px;width:"+_iconSize+"height:"+_iconSize);
		return _linkNode;
	}

	/**
	 * トップページ
	 */
	generateTopLink(){
		return this._genNodeTemplate(0);
	}
	/**
	 * ローカルガチャ
	 */
	generateLocalGachaLink(){
		return this._genNodeTemplate(1);
	}
	/**
	 * 特訓
	 */
	generateCardUnionLink(){
		return this._genNodeTemplate(2);
	}
	/**
	 * フリトレ出品
	 */
	generateFreeTradeExhibitLink(){
		return this._genNodeTemplate(3);
	}

}


/**
 * サブメニューを生成するだけのクラス。
 * li系ノードを作るタイプと、html読み込みタイプの2つに対応している。
 * CustomMenuGeneratorClass._generateSingleMenuNode() から頻繁に使われる
 */
class CustomSubMenuClass{

	constructor(){
		/**
		 * 読み込むhtmlの相対パス
		 */
		this._filePath;
		/**
		 * 自身のノードを保持。再び同じものが呼ばれたとき、比較をして消すかどうか判断するため。
		 */
		this._pageNode = null;
		/**
		 * 展開用メニューの定義オブジェクトが setMenuDefineObject() を用いてここに割り当てられる。
		 */
		this._defineObject = null;
	}

	/**
	 * "./menu/info.html" 等を渡しておく
	 * @param {*} _pagePath 
	 */
	setPath(_pagePath){
		this._filePath = _pagePath;
	}

	/**
	 * 内部検索用に、サブメニューエリアのノードをここにセットして(紐づけて)おく。
	 * "#custom-menu-sub" になると思う、多分。
	 * @param {*} _areaNode 
	 */
	setSubMenuAreaNode(_areaNode){
		this._subMenuAreaNode = _areaNode;
	}

	/**
	 * 外部で作成された、サブメニュー展開用の定義オブジェクトをセット
	 * @param {*} _defObj 
	 */
	setMenuDefineObject(_defObj){
		this._defineObject = _defObj;
	}

	/**
	 * 配置用ノードから、生成したサブメニューを全て除去
	 */
	_clearSubMenuNode(){
		let _node = this._subMenuAreaNode;
		if(_node && _node.childNodes.length > 0){
			while(_node.firstChild){
				_node.removeChild(_node.firstChild);
			}
		}
	}

	/**
	 * メニュー生成のタイミングで、実行させておきたい関数をセットする
	 * @param {*} _setFunction 
	 */
	setExecuteFunction(_setFunction){
		this._executeFunction = _setFunction;
	}

	/**
	 * htmlページを表示させるタイプのノードを作成する。
	 * 引数には、読み込むhtmlページの相対パスが入ることが期待される。
	 * 動的に作成・配置されるので、ノードを返す訳では無い。
	 * @param {*} _pagePath 
	 */
	generateMenuForPagePath(){

		//このタイミングで引っ張ってこないと多分ダメ...
		this._subMenuAreaNode = document.getElementById("custom-menu-sub");
		let _areaNode = this._subMenuAreaNode;

		//保持ノードが既に存在し、それがセット中のノードと同一なら削除して終了
		if(this._pageNode && _areaNode.firstChild == this._pageNode){
			this._clearSubMenuNode();
			return;
		}

		//単純に、子ノードが(1つでも)配置済みであったのなら、先に全消ししておく
		if(_areaNode.childNodes.length > 0){
			this._clearSubMenuNode();
		}

		let _baseNode = document.createElement("div");
		let _style = _baseNode.style;
		_style.backgroundColor = "rgba(29, 29, 29 , 0.95)";	//基礎背景
		_style.opacity = 0.97;
		_style.zIndex = 100;
		_style.width = "320px";
		_style.position = "absolute";
		_style.textAlign = "center";
		
		fetch(this._filePath,{cache:"no-cache"}).then(_res=>{
			return _res.text();
		}).then(_txt =>{
			_baseNode.innerHTML = _txt;
			this._pageNode = _baseNode;	//保持
			_areaNode.appendChild(_baseNode);
			// 配置直後、関数が用意されている場合に実行する。
			if(typeof this._executeFunction === "function"){
				this._executeFunction();
			}

		});
	}


	/**
	 * タイプ名からメニューを生成する。
	 * 動的に作成・配置されるので、ノードを返す訳では無い。
	 * @param {*} _typeName 
	 */
	generateMenuFromTypeName(_typeName){
		// 動的に取得しないとダメ。
		let _areaNode = document.getElementById("custom-menu-sub");
		this.setSubMenuAreaNode(_areaNode);

		//保持ノードが既に存在し、それがセット中のノードと同一なら削除して終了
		if(this._pageNode && _areaNode.firstChild == this._pageNode){
			this._clearSubMenuNode();
			return;
		}

		//単純に、子ノードが(1つでも)配置済みであったのなら、先に全消ししておく
		if(_areaNode.childNodes.length > 0){
			this._clearSubMenuNode();
		}


		const _baseNode = document.createElement("div");
		//外部依存。グローバルの定義オブジェクトから該当箇所を取り出して使用
		const _defObj = this._defineObject;
		const _menuArr = _defObj[_typeName]["menu"];
		const _posArr = _defObj[_typeName]["position"];
		//console.log(this._defineObject , _typeName , _menuArr.length);
		//col作成
		for(var n=0; n<_menuArr.length; n++){
			const _columnElm = document.createElement("div");
			_columnElm.className = "mkt_submenu_column";
				_columnElm.style.position = "absolute";
				_columnElm.style.top = (34+(n*22))+"px";
			//console.log(n , _posArr[n]);
			if(_posArr[n] > 0){
				_columnElm.style.left = (_posArr[n] * 35)+"px";
			}
			const _colmunObj = _menuArr[n];
			//row作成
			for(var t in _colmunObj){
				const _rowObj = _colmunObj[t];
				const _rowNode = document.createElement("a");
				_rowNode.className = "row";	//★仮
				_rowNode.textContent = _rowObj.name;
				// @ が先頭に含まれる場合、別メソッドでユーザー定義から取り出す
				if(_rowObj.url.indexOf("@") == 0){
					_rowNode.href = this._getURLfromShortKey(_rowObj.url);
				}
				// .handler のキーがオブジェクトに存在した場合
				else if(_rowObj.handler){
					//console.log(_rowObj.handler);
				}else{
					_rowNode.href = _rowObj.url;
				}
				_rowNode.style.width = ((_rowObj.size || 1) * 33 + ((_rowObj.size || 0) * 1))+"px";	//35px+ボーダー分
				// 追加スタイルオブジェクトが定義されていたら、そのスタイルを追加
				if(typeof(_rowObj["style_object"]) === "object"){
					const _styleObj = _rowObj["style_object"];
					Object.keys(_styleObj).forEach(_key=>{
						_rowNode.style[_key] = _styleObj[_key];
						//console.log(_rowNode.style[_key] , _styleObj[_key]);
					});
				}
				_columnElm.appendChild(_rowNode);
			}
			_baseNode.appendChild(_columnElm);
		}
		//プロパティにノード確保後、最終配置
		this._pageNode = _baseNode;
		_areaNode.appendChild( this._pageNode );

	}

	//	@～～　の形式からURLを得る	backgroundの"user_url_obj"を参照。失敗すれば空白が返る
	_getURLfromShortKey(_shortKey){
		
		const _userObj = getOption("user_url_obj");
		if(typeof(_userObj) == "object"){
			return _userObj[_shortKey] || "";
		}
		return "";
	};

}


