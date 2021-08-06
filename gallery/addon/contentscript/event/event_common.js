/**
 * イベント用のタイマー起動に関するクラスっぽいやつ
 */
class EventTimerClass{

	constructor(){

	}
	/**
	 * 指定時刻または残り時間等の、表記文字列を、第二引数の正規表現に応じて解析して、
	 * { 時間,分,秒 } を格納したオブジェクトを返す。
	 * パースに失敗すれば、その[時分秒]箇所は 0 とする
	 * @param {*} _targetText 
	 * @param {*} _regE 
	 */
	parseTextContentConvTimeNumObject(_targetText , _regE){
		//	_text = "あああ20:48:11";	//検証用
		//	_parseType = "limit_digital";		//検証用
		//解析タイプによって正規表現を変更
		let _retTimeObj = {
			"h":0,
			"m":0,
			"s":0,
		};
		//matchで引っ張り出す
		let _timeArr = _targetText.match( _regE );
		//引っ張り出した情報を精査
		if(_timeArr){
			if(_timeArr[2]){	//時間
				_retTimeObj["h"] = parseInt(_timeArr[2] , 10) || 0;
			}
			if(_timeArr[3]){
				_retTimeObj["m"] = parseInt(_timeArr[3] , 10) || 0;
			}
			if(_timeArr[4]){
				_retTimeObj["s"] = parseInt(_timeArr[4] , 10) || 0;
			}
		}
		return _retTimeObj;
	}

	/**
	 * { 時間,分,秒 } を格納したオブジェクトを用いて、第二引数に応じて、 setTimer で用いる値を計算して返す
	 * @param {*} _timeObj 
	 * @param {*} _reminderType 
	 */
	_getTimeValueFromTimeNumObject(_timeObj , _reminderType){

		const _nowDateObj = new Date();
		let _time_h = _timeObj["h"];
		let _time_m = _timeObj["m"];
		let _time_s = _timeObj["s"];


		//▼パターンA 残り時間からタイマー起動
		if(_reminderType == "left"){
			//現在時刻を得て、そこから n時間 h分 s秒 先の値を加える
			let _nowTimeNum = _nowDateObj.getTime();
			let _justTimeNum = _nowTimeNum + (1000 * 60 * 60 * _time_h) + (1000 * 60 * _time_m) + (1000 * _time_s);
			//console.log(_reminderType , _time_h+"時間"+_time_m+"分"+_time_s+"秒後");
			return _justTimeNum;
		}
		//▼パターンB 指定時刻に通知されるようにタイマー値を算出
		else if(_reminderType == "just"){
			//現時刻が下回っていれば、翌日0時扱いとして 24h 加算
			if(_time_h < _nowDateObj.getHours()){
				_time_h += 24;				
			}
			let _recoverTimeDateObj = new Date(_nowDateObj.getFullYear(), _nowDateObj.getMonth(), _nowDateObj.getDate() , time_h , time_m , _time_s );
			let _recoverTimeNum = _recoverTimeDateObj.getTime();

			return _recoverTimeNum;
		}else {
			console.warn("【×】MKT:leftでもjustでもありません");
		}
		
	}

	// セレクタで得たノードと、時間パース系などの定義オブジェクトテーブルを用いてアレコレする
	_subProcess(_targetNode , _timerInfoTable){

		let _timerName = _timerInfoTable["timerName"];		//backgroundに送る、起動用のタイマーネームキー
		let _saveName = _timerInfoTable["saveName"];		//saveするタイマー用文字列
		let _timerParseType = _timerInfoTable["timerType"];	//時刻,時間をパースする設定を分岐させるキー
		
		let _timeDiffSetName = _timerInfoTable["timerDiff"];	//時間差分

		let _reminderType;
		let _regE;
		if(_timerParseType == "recover_digital"){
			// 回復予想時間 xx:xx の形式
			_regE = RegExp(/([^0-9]*)?([0-9]{2})\:([0-9]{2})/);
			_reminderType = "just";
		}
		else if(_timerParseType == "limit_digital" ){
			// ○○まで残り xx:xx:xx秒 の形式
			_regE = RegExp(/([^0-9]*)?([0-9]{0,2})?\:([0-9]{2})?\:([0-9]{2})?/);
			_reminderType = "left";
		}
		else if(_timerParseType == "limit_digital_variety" ){
			//20170923バラエティ用
			// ○○まで残り xx:xx:xx秒 の形式
			_regE = RegExp(/(残り)?([0-9])\:([0-9]{2})?\:([0-9]{2})?/);
			_reminderType = "left";
		}
		else if(_timerParseType == "recover_analog" ){
			// 回復時刻	x時x分x秒 の形式
			_regE = RegExp(/([^0-9]*)?([0-9]{1,2}時?)([0-9]{1,2}分)?([0-9]{1,2}秒)?/);
			_reminderType = "just";
		}
		else if(_timerParseType == "limit_analog"){
			// ○○まで残り時間 x時間x分x秒 の形式
			_regE = RegExp(/([^0-9]*)?([0-9]{1,2}時間)?([0-9]{1,2}分)?([0-9]{1,2}秒)?/);
			_reminderType = "left";
		}
		
		//console.log(_timerParseType , _reminderType , _regE);
		if(!_reminderType || !_regE){
			console.warn("_reminderTypeや正規表現オブジェクトの設定に失敗" , _timerParseType , _reminderType , _regE);
			return;
		}
		
		// 解析対象の時間表記テキストと、対応する正規表現を投げて、パースした{h,m,s}のオブジェクトを得る
		let _parseTimeObj = this.parseTextContentConvTimeNumObject( _targetNode.textContent , _regE );

		// {h,m,s} のオブジェクトと、"その時刻"なのか"残り時間"なのかを判別する文字列を投げて、
		// 起動用 timeValue数値を、結果として得る
		let _setTimeValueNum = this._getTimeValueFromTimeNumObject( _parseTimeObj , _reminderType );

		console.log( _parseTimeObj , _setTimeValueNum);
		//console.log( "起動key" , _timerName , "saveKey" ,_saveName);

		if(_setTimeValueNum){
			// n秒前 定義が存在していれば、このタイミングで補正をかける
			if(_timeDiffSetName){
				let _timeDiffValue = getOption(_timeDiffSetName);
				if(_timeDiffValue){
					//console.log("\t_timeDiffValue定義により、発現時間 -"+_timeDiffValue+"秒");
					_setTimeValueNum -= (1000 * _timeDiffValue);
				}
			}

			requestTimer( _timerName , _setTimeValueNum);	//backgroundにタイマー起動リクエスト
			
			if(_saveName){
				//保存定義がしてあればローカルストレージに回復時刻数値を保存しておく。
				saveOption( _saveName  , _setTimeValueNum );
			}
		}

	}

	/**
	 * subfunc_setEventTableTimer()で呼ばれるメイン処理
	 */
	mainProcess(){

		//eventGlobalTableからイベントで個別テーブルを得て、そこからさらにURLテーブルを得て、URLに紐づけられたセレクタ文字列を取り出す
		const _eventTableObj = eventGlobalTable[ EVENTMODE ];
		if(!_eventTableObj){
			console.warn("そのイベントテーブルは定義されていません" , EVENTMODE);
			return;
		}
		const _urlTableObj = _eventTableObj["URL"];
		
		let _selectorTableObj;

		for(let _urlKey in _urlTableObj){
			//▼現在のURLと一致したら、利用するセレクタとタイマータイプのテーブルオブジェクトを取り出す
			if(urlCheck( _urlKey )){
		//		console.log(_urlKey + " と " + URLTable[ _urlKey ]);				//セレクタs と タイマーテーブル名
				//■検索レベル4 - セレクタと紐付けられた、タイマー起動やbackground要求に関する情報を取り出す
				//subfunc_setEventTableTimer_sub(_eventTableObj , _urlTableObj[ _urlKey ]);
				_selectorTableObj = _urlTableObj[ _urlKey ];
				break;
			}

		}

		if(!_selectorTableObj){
			return;
		}
		//console.log( _selectorTableObj );
		//上記forの結果、現在のURLにマッチしていた事により、オブジェクトテーブルを取り出せていれば処理を続行
		
		// 時間文字列を得るセレクタがkeyとなって回る。大抵の場合は最大で2回のfor
		for(let _selectorKey in _selectorTableObj){
			//	console.log( _selectorKey+" と "+_selectorTableObj[s]);
			let _targetNode = document.querySelector(_selectorKey);	
			if(_targetNode){
				let _timerInfoTypeKeyValue = _selectorTableObj[_selectorKey];	//eventTable上で検索する名前 limit あるいは recover であることが多い
				let _timerInfoTable = _eventTableObj[_timerInfoTypeKeyValue];	//タイマー起動情報テーブルを取り出す
	
				if(_timerInfoTable){
					//xxxxx(_targetNode , _timerInfoTable);	//●取得要素とタイマー起動情報テーブル
					this._subProcess(_targetNode , _timerInfoTable);
				}else {
					//故意に消されれば見つからない (フェスのコンボタイマー設定etc)
					console.error("【△】タイマー起動テーブル["+_timerInfoTypeKeyValue+"]が見つかりませんでした");
					continue;
				}
			}
			//設定済みの時刻表記セレクタが見つからない場合は、
			//そのセレクタに紐づけられた起動用タイマーを、明示的に破棄する流れとして、処理を組んでいる
			else {
				try{
					let _resetOptionName = _eventTableObj[_selectorTableObj[_selectorKey]]["saveName"];
					let _destroyTimerName = _eventTableObj[_selectorTableObj[_selectorKey]]["timerName"];
					saveOption(_resetOptionName , 0);
					requestTimer(_destroyTimerName , 0);	//0リクエスト
					console.log("セレクタで時間要素の検出に失敗。該当タイマー" , _resetOptionName , "と" , _destroyTimerName , "を0化します\n\t└"+_selectorKey);
				}catch(e){
					console.warn("【×】MKT:タイマー破棄に失敗" , e);
				}
			}
		//	console.log(getElm);
		}

	}

}



//イベントで毎回呼ばれる
var eventClass = {};

/** first_load.js mainFunction() からイベントページのIndexを条件に呼ばれる
	a 要素を取得し、hrefが編成リンクのものだと認識すれば、それを background.js 経由で localSorageに保存	*/
eventClass.saveDeckEditLink = function(){

	_linkElms = window.document.links;

	for(var i=0; i<_linkElms.length; i++){
		var tempLinkStr = _linkElms[i].href;
	//	console.log(tempLinkStr);
		if(tempLinkStr && ( tempLinkStr.indexOf('%2Fevent_deck_edit%3F') != -1 || tempLinkStr.indexOf('%2Fdeck_index') != -1)	){
			tempLinkStr = tempLinkStr.replace(/l_frm.*/,"");
	//		console.log(tempLinkStr);
			saveOption("event_deckeditlink_value" , tempLinkStr);
	//		break;
		}
	}
}

/** first_load.js mainFunction() からイベントページのBOXページを条件に呼ばれる
	いわゆるメダルBOXのカウント表示機能 */
eventClass.setBoxCount = function(){

	//チェンジリストのみ処理
	if(urlCheck("_box_reward%2Fcoin_change_list") || urlCheck("_box_reward%2Fcoin_reset_conf")){
		eventClass.setBoxCountToChangeList();
		return;
	}

	//これらのURL以外は全て弾く
	if(		urlCheck("_box_reward%2Findex%3F") == false
		&&	urlCheck("_box_reward%3Fl_frm%3DEvent") == false				//2014/08/26 ｋｗｓｍさんロワ
		&&	urlCheck("%2Fidolmaster%2Fp_match_box_reward%3F") == false		//フェスのメダルチャンス
		&&	urlCheck("_box_reward%2F%3Fbox_round%3D") == false				//2019/07/08 新レイアウトのページ切り替え後
		&&	urlCheck("_box_reward%2Fbox_result%3Fbox_round") == false		//2019/07/08 新レイアウトのメダル引いた直後の結果
		&&	urlCheck("index%2F%3Fbox_round%3D") == false					//2019/07/27 レッドブル―イエローメダル
	){
		//console.log("所定URL以外");
		return;
	}

	//	先に結果の設置先があるか調べる
	let _markerNode = document.querySelector(".area-frame_wrap")	//2019/07/09 公式レイアウト変更
		|| document.querySelector("._wrapper");	//20191027 復刻アイチャレ(青,黄,赤))
	//console.log(_markerNode);
	if(!_markerNode){
		_markerNode = document.querySelector("h2.title_img");
	}		
	if(_markerNode){

		//新イベントメダルレイアウト
		if(1){
			// 初期景品(1箱目)の数と排出割合を計算
			//	".list-box_rewards > ._list" 20191027 復刻アイチャレ(青,黄,赤)
			const _itemNodes = document.querySelectorAll(".box_reward-list > .reward_details , .list-box_rewards > ._list ");
			let _countNow = 0;
			let _countMax = 0;
			[..._itemNodes].forEach((_node , _index) => {
				const _valueNode = _node.querySelector("._value");
				if(_valueNode){
					const _valueText = _valueNode.textContent;
					//正規表現チェック
					if((/[0-9]{1,}\/[0-9]{1,}/).test(_valueText)){
						_countNow += parseInt(_valueText.match(/([0-9]{1,})\//)[0] ,10);
						//	console.log(_valueText , CountNow);
						_countMax += (parseInt(_valueText.match(/\/([0-9]{1,})/)[1] ,10));
					}
				}
			});
			//ループ後、カウント蓄積
			//console.log( `${_countNow} / ${_countMax}` );
			const _setInfoNode = this.generateBoxCountInfoNode(_countNow , _countMax);
			if(_setInfoNode){
				_markerNode.insertBefore( _setInfoNode , _markerNode.firstChild );
				return true;
			}
		}

		//	新イベメダルレイアウトで使わなくなってると思う
		if(false){

			//集計参考要素群と、結果の設置先を用意
			var _searchElms = document.querySelectorAll("table > tbody > tr > td+td > span+span");
			if(_searchElms.length > 1){
				//▼集計
				let forCount = _searchElms.length;
				let CountNow = 0;
				let CountMax = 0;
				console.log("MKT:BoxCount/要素カウント"+forCount);
				for(var n=0; n<forCount; n++){
					var tdText = _searchElms[n].parentNode.textContent;
					//正規表現チェック
					if((/[0-9]{1,} \/ [0-9]{1,}/).test(tdText)){
						CountNow += parseInt(tdText.match(/([0-9]{1,}) \//)[0] ,10);
					//	console.log(tdText , CountNow);
						CountMax += (parseInt(tdText.match(/\/ ([0-9]{1,})/)[1] ,10));
					//	console.log(tdText.match(/\/ ([0-9]{1,})[人|個]{1}/)[1]);
					//	console.log(CountNow+"/"+CountMax);
					}
				}

				let _markElm = document.querySelector(".area-frame_wrap");
				if(!_markElm){
					_markElm = document.querySelector("h2.title_img");
				}		
				if(_markElm){

				}
			}
		}

	
	}
	console.log("【×】MKT:eventClass.setBoxCount()の処理に失敗");


};

/**
 * 景品の数を通知するノードを作成
 */
eventClass.generateBoxCountInfoNode = function(_countNow , _countMax){
	
	const _percentNum = Math.round((_countNow/_countMax)*1000) / 10;	//小数点第一を残して四捨五入
	if(isNaN(_percentNum)){
		console.log("残り状態の取得に失敗:エクストラ判定です");
		return;
	}
	//▼集計結果配置
	const _setBaseNode = document.createElement("div");
	//_setBaseNode.style.width = "100%";
	_setBaseNode.style.textAlign = "center";
	_setBaseNode.style.margin = "3px";

	const _infoNode = document.createElement("div");
	_infoNode.className = "yellow";
	_infoNode.textContent = _countNow+" / "+_countMax+" ( "+(_countMax-_countNow)+"削り あと "+_percentNum+"% )";
	const _gaugeNode = document.createElement("div");
	_gaugeNode.className = "mkt_box_count_gauge";
	const _gaugeInnerNode = document.createElement("div");
	_gaugeInnerNode.style.height = "100%";
	_gaugeInnerNode.style.width = _percentNum+"%";
	_gaugeInnerNode.style.backgroundColor = "cyan";
	_gaugeNode.appendChild(_gaugeInnerNode);

	_setBaseNode.appendChild(_infoNode);
	_setBaseNode.appendChild(_gaugeNode);

	return _setBaseNode;
}

/** 景品一覧 初期景品で数を通知 */
eventClass.setBoxCountToChangeList = function(){

	var _targetElm = document.querySelector("table > tbody");
	if(_targetElm){
		var trYellowElms = _targetElm.querySelectorAll("tr > td > span.yellow");
//		console.log(trYellowElms);
		var maxCount = 0;
		for(var c=0; c<trYellowElms.length; c++){
//			console.log(trYellowElms[c]);
			var t = parseInt(trYellowElms[c].textContent , 10);
//			console.log(t);
			if(t > 0){
				maxCount += t;
			}
		}
		//for抜けでカウント溜まっているはず
		if(maxCount){
			var _setBaseElm = document.createElement("tr");
			_setBaseElm.setAttribute("style","background-color:#661100;");
			var setTdA = document.createElement("td");
			setTdA.className = "yellow";
			setTdA.style.textAlign = "center";
			setTdA.textContent = "#mkt_BoxCount (max) ";

			var setTdB = document.createElement("td");
			setTdB.className = "yellow";
			setTdB.textContent = maxCount;

			_setBaseElm.appendChild(setTdA);
			_setBaseElm.appendChild(setTdB);

		//	_targetElm.appendChild(_setBaseElm);
			_targetElm.parentNode.insertBefore(_setBaseElm , _targetElm);

			console.log(_setBaseElm);
		}

		console.log(maxCount);
	}
};



/** DOMから検出した景品排出品をオブジェクトにする。処理が進めば、終端で書き込みメソッドを実行 **/
eventClass.extraProcess = function(){
	if(!getOption("drop_data_count_check")){
		return;
	}
	/*
	var _dummyObj = {
		"あれ":10
		,"これ":5
		,"それ":3
	};
	eventClass.writeBoxDropItem("もふもふメダルチャンス" , 1234597 , _dummyObj);
	*/
	var _start = false;
	var _titleStr = "";	//イベントやメダルの箱色を識別するための、タイトル取得文字列
	//ブラバ誤登録防止用。タイムスタンプならぬ rnd 値
	var _rndVal = parseInt(location.href.match(/%26rnd%3D([0-9]+)/)[1] , 10);
	if(_rndVal){
		//タイトルノードがリザルト画面に2つない場合、エクストラとは判定しない
		//EXでない場合、"～チャンス","～を獲得しました!","～チャンス景品一覧"の3つが出る。そして"～チャンス景品一覧"はEXには出ない
		var _titleNodes = document.getElementsByClassName("title_img");
		if(_titleNodes.length > 0){
			_titleStr = _titleNodes[0].querySelector("div").textContent;
			//エクストラの排出品一覧ノード
			var _resultItemsNode = document.querySelector("#top > section > div.titleH2 + div.t-Lft");
			if(_resultItemsNode){
			//	console.log(_resultItemsNode.textContent);
				_start = true;
				for(var n=0; n<_titleNodes.length; n++){
					if(_titleNodes[n].textContent.indexOf("一覧") != -1){
						console.warn( _titleStr , "ノード数が", _titleNodes.length , "ですが" , "タイトルノードに一覧の文字列を発見");
						_start = false;
					}
				}
			}else{
				console.warn("エクストラの排出品一覧ノード取得に失敗");
			}
		}else{
			console.warn("titleNodeが1以上" , _titleNodes);
		}
	}else{
		console.warn("rnd値の取得に失敗");
	}

	if(_start == false){
		return false;
	}
	
//	console.log(_resultItemsNode);

	var _itemObj = {};
	var _cNodes = _resultItemsNode.childNodes;
	for(var n=0; n<_cNodes.length; n++){
		var _nNode = _cNodes[n];
		//<br>とテキストノードが入り交ざっているので、textの3を抽出
		if(_nNode.nodeType == 3){
			var _lineStr = _nNode.textContent.replace(/\n|\r|\s|・/g,"");	//改行系空白系・をすべて除去
			if(_lineStr){
				var _splitArr = _lineStr.split("×");
				var _name = _splitArr[0];
				var _num = parseInt(_splitArr[1] , 10);
				if(_name && _num > 0){
					_itemObj[_name] = _num;	//key,valueのペア
				}
			}
		}
	}
	
	//▼出そろう
	console.log(_titleStr , _rndVal , _itemObj);
	eventClass.writeBoxDropItem(_titleStr , _rndVal , _itemObj);
	
};

//background.jsに各種データを渡して保存してもらう
eventClass.writeBoxDropItem = function(_titleStr , _rndVal , _itemObj){
	chrome.extension.sendRequest(
		{
			status: "dropdata"
			,type:"update"
			,title: _titleStr
			,rnd: _rndVal
			,itemObj: _itemObj
		}, function(mes) {
			//コールバックで結果をDOMに表示
			let _message = mes.message || "";
			let _stockObj = mes.data || {};
			console.log(_stockObj);
			var _titleNode = document.querySelector("section + section");
			if(_titleNode){
				var _setNode = document.createElement("div");
				_setNode.className = "yellow";
				_setNode.style.textAlign = "center";
				_setNode.textContent = _message;
				_titleNode.parentNode.insertBefore(_setNode , _titleNode.nextElementSibling);
			}else{
				console.warn("_titleNodeの取得に失敗")
			}
		}
	);
};





/**
	イベントテーブルを参照して、結果的に時刻セレクタを得てタイマーを起動させる
	呼び出し元はいくつかの subfunc_イベント名_searchselector();
*/
function subfunc_setEventTableTimer(){

	let _eventTimerClass = new EventTimerClass();

	_eventTimerClass.mainProcess();

}



/**
 * バトルFlashのスキップボタン設置
 * 内部でグローバルイベントテーブルを参照している
 */
function subfunc_event_flash_jump_btn(){
	console.log("MKT:"+EVENTMODE+":subfunc_event_flash_jump_btn");
	var mainElm = document.body;

	if(mainElm == null){
		console.warn("【×】MKT:body要素を得られませんでした");
		return;
	}

//	console.log(eventGlobalTable);
//	イベントテーブル参照
	let attackPoint = 0;
	let afterBossHp = 0;
	let raidID = 0;
	let addURL;
	let hitFlag = false;	//これがtrueならボタン生成処理に入る

	for(var i in eventGlobalTable){
	//	console.log(i);
		if(i == EVENTMODE){
		//	console.log(eventGlobalTable[i]);
			try{
				attackPoint = location.href.match(eventGlobalTable[i]["URLD_attackPoint"])[1];
				afterBossHp = location.href.match(eventGlobalTable[i]["URLD_afterBossHp"])[1];
				raidID = location.href.match(eventGlobalTable[i]["URLD_raidID"])[1];
				addURL = eventGlobalTable[i]["URLD_resultURL"];
				hitFlag = true;
				// 桁区切り
				attackPoint = Number(attackPoint).toLocaleString();
				afterBossHp = Number(afterBossHp).toLocaleString();
			}catch(e){
				console.log("リザルト情報の取得に失敗 / バトルフラッシュでは無いようです" , e);
			}
			break;
		}
	}

	if(hitFlag == false){
		console.log("MKT:リザルトボタン生成処理は行いません");
		return;
	}

	//▼URL処理 201709のアイバラでは、今までと違ってURLに %3Fraid_id%3D****~ をつける必要がなくなった？(あるとエラーになる)
	if(eventGlobalTable[i]["URLD_new_type_flag"]){
		if(afterBossHp <= 0){
			addURL += ("raid_win%2F"+raidID);
		}else {
			addURL += ("raid_lose%2F"+raidID);
		}
	}else{
		if(afterBossHp <= 0){
			addURL += ("raid_win%3Fraid_id%3D"+raidID);
		}else {
			addURL += ("raid_lose%3Fraid_id%3D"+raidID);
		}
	}
	
	//▼要素作成
	const setBaseDivElm = document.createElement("div");
	setBaseDivElm.setAttribute("style","height:50px;width:100%;background-color:#1d1d1d;text-align:center;");

	//▼リンクボタンの作成と一次配置
	const LinkElm = document.createElement("a");
	LinkElm.setAttribute("href", addURL );
	//AndroidURLだとcssが読み込まれないのでstyleに
	LinkElm.setAttribute("style","text-decoration:none;width:310px;font-size:12px;color:#ffffff;padding:13px 0;margin-top:5px;display:inline-block;background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#777777), color-stop(100%,#333333));border-bottom:1px solid #444444;border-radius: 5px;-webkit-border-radius:5px;");
	LinkElm.innerText = ("ATK = "+attackPoint+" / AfterHP = "+afterBossHp);
	setBaseDivElm.appendChild(LinkElm);

	//新配置
	let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
	if(_infoAreaNode){
		_infoAreaNode.appendChild(setBaseDivElm)
	}else{
		mainElm.insertBefore(setBaseDivElm , mainElm.firstChild);
	}
	console.log("MKT:skipボタン配置完了!");
}


/**あっちのwindowに埋め込む
 * 処理に失敗すれば、引数として用意しているコールカウント数が指定回数を超えるまで、
 * settimeoutで再帰する
*/
function injectEventAnimationScriptIsInfo_IdolChallenge(_callCount){
	//	console.log("callCount" , _callCount);
		_callCount++;
		if(_callCount > 25){
			return;
		}
		let _obj = null;
		try{
			_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
//			console.log(_obj);
			var _val = "";
			let _memArr = [];
			//特定のキー名を持つ値を取り出して、特技の発動アイドル(の序列)を得る
			for(let _key in _obj){
				if(_key.indexOf("skill") === 0 && _key.match(/skill[0-9]+$/)){
				//	console.log(_key , _obj[_key]);
					_val = _obj[_key];
					/** 値が "8_0303333333_0_3" のような文字列になっており、1文字目が発動アイドルの序列
					 * 但しリーダーは 0 から..となるので、ここで得られる順番は配列添え字扱い
					 */
					if(_val && _val.length > 1){
						let _frontMemberNum =  parseInt(_val[0]) + 1;	//1文字目をパースして順番表記なので1増やす
						_memArr.push(_frontMemberNum);
					}
				}
			}
			//▼ここから仮計算
			let _sum = 0;
			let _log = "";
			for(let _key in _obj){
				if(_key.indexOf("player_attack_turn") === 0 && _key.match(/player_attack_turn[0-9]+$/)){
					let _pat = _obj[_key];
					let _ptArr = _pat.split("_");
					let _oneTurnsum = 0;
					_ptArr.map((v)=>{
						let _num = parseInt(v);
						_oneTurnsum += _num;
					//	console.log(_num , v);
					});
					_log += (_oneTurnsum + "+2000\n");	//console.log(_oneTurnsum , "+2000");
					_sum += _oneTurnsum;
				}
			}
			_log += "計:"+_sum + " +(2000*5)";
			console.log(_log);
		


			//▲ここまで仮計算
			
	
			if(_memArr.length > 0){
			//	console.log("発動", _memArr.length , "人" , ..._memArr);
				let _retStr = "特技発動：" + _memArr.length + "回 @ " + _memArr.join(",");
			//	console.log(_retStr);
				let _node = document.createElement("div");
				_node.textContent = _retStr;
				let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
				if(_infoAreaNode){
					_infoAreaNode.appendChild(_node);
				}else{
					document.body.firstChild.appendChild(_node);
				}
			//	return _resStr;
			}else{
			//	console.warn("特技発動配列が正しく得られていません。再帰処理を行います");
				setTimeout(injectEventAnimationScriptIsInfo_IdolChallenge , 50 , _callCount);	//同名の関数で再帰
			}

		}catch(e){
	//		console.error(e);
			setTimeout(injectEventAnimationScriptIsInfo_IdolChallenge , 50 , _callCount);	//同名の関数で再帰
		}


}

//上のアレのドリフ版
function injectEventAnimationScriptIsInfo_DreamLiveFestival(_callCount){
		console.log("callCount" , _callCount);
		_callCount++;
		if(_callCount > 25){
			return;
		}
		let _obj = null;
		try{
		//	_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
			_obj = window.im_cjs;
			console.log(_obj);
			var _val = "";
			const _skillObj = {};
			//特定のキー名を持つ値を取り出して、特技の発動アイドル(の序列)を得る
			for(let _key in _obj){
				if(_key.indexOf("SK") === 0 && _key.match(/SK[0-9]+$/)){
				//	console.log(_key , _obj[_key]);
					_val = _obj[_key];
					/** 値が "8_0303333333_0_3" のような文字列になっており、1文字目が発動アイドルの序列
					 * 但しリーダーは 0 から..となるので、ここで得られる順番は配列添え字扱い
					 */
					if(_val && _val.length > 1){
						let _frontMemberNum =  parseInt(_val[0]) + 1;	//1文字目をパースして順番表記なので1増やす
						_skillObj[ _frontMemberNum ] = true;	// ダブル特技が重複カウントされない様に、キーで配置。
					}
				}
			}

			//▼ここから仮計算
			let _sum = 0;
			let _log = "";
			for(let _key in _obj){
				if(_key.indexOf("A") === 0 && _key.match(/A[0-9]+$/)){
					let _val = _obj[_key];
					let _num = Math.abs(parseInt(_val));	//ミリ残し処理の場合、オブジェクトの中身がマイナスになる場合があるので、絶対値とする
				//	console.log(_num , _val);
					_log += (_num+"\n");
					_sum += _num;
				}
			}
		
			//▲ここまで仮計算
			const _skillCount = Object.keys(_skillObj).length;
			if(_skillCount > 0){
				const _memberArray = Object.keys(_skillObj);
				let _retStr = "特技：" + _skillCount + "回 [ " + _memberArray.join(",") + " ]";
				let _node = document.createElement("div");
				_node.textContent = _retStr;
				let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
				if(_infoAreaNode){
					_infoAreaNode.appendChild(_node);
				}else{
					document.body.firstChild.appendChild(_node);
				}
			}
			else{
				//console.warn("特技発動配列が正しく得られていません。再帰処理を行います");
				setTimeout(injectEventAnimationScriptIsInfo_DreamLiveFestival , 50 , _callCount);	//同名の関数で再帰
			}

		}catch(e){
			//console.error(e);
			setTimeout(injectEventAnimationScriptIsInfo_DreamLiveFestival , 50 , _callCount);	//同名の関数で再帰
		}


}

//上のアレのロワ版 (P)
function injectEventAnimationScriptIsInfo_IdolLiveRoyale_P(_callCount){
	//	console.log("callCount" , _callCount);
		_callCount++;
		if(_callCount > 25){
			return;
		}
		let _obj = null;
		try{
			_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
			let _atkSum = parseInt( _obj["self_prm_fix"] , 10);
		//	console.log(_obj);
			var _val = "";
			let _sklActionLogObj = {};
			let _sklNameLogObj = {};
			let _useSkillIdolObj = {};
			let _logObj = {};
			if(_atkSum){
				let _skillEnemyArr = [];
				let _skillMyArr = [];
			//	console.log("ロワイヤルバトル発揮値" , _atkSum);
				//特技の発動を示す特殊な数値をまずは得て、準備用オブジェクトをこさえる
				for(let _key in _obj){


					if(_key.indexOf("txt_") === 0){
						let _matchArr = _key.match(/txt_([0-9]+)_/);
						if(_matchArr && _matchArr.length == 2){
							let _num = parseInt(_matchArr[1] , 10);
							_logObj[ _num ] = {
								"team":undefined
								,"use":undefined
								,"txt":""
							};
						}
					}

				}
				
				console.log(_logObj);
				//特殊な数値に対応しているログを得て、その数値に応じて値を与える
				for(let _key in _obj){
					if(_key.indexOf("txt_") === 0){
						let _matchArr = _key.match(/txt_([0-9]+)_/);
						if(_matchArr && _matchArr.length == 2){
							let _num = parseInt(_matchArr[1] , 10);
							_logObj[ _num ]["txt"] += (_obj[_key]);
							_sklNameLogObj[ _key ] = _obj[_key];
						}
					}
					else if(_key.indexOf("use_") === 0){
						let _matchArr = _key.match(/use_([0-9]+)/);
						if(_matchArr && _matchArr.length == 2){
							let _num = parseInt(_matchArr[1] , 10);
							let _useNum = parseInt(_obj[_key] , 10);
							_logObj[ _num ]["use"] = _useNum;
							_useSkillIdolObj[ _key ] = _obj[_key];
							// 発動アイドルの所属は自分(1)か相手(2)か
							if(_key.match(/use_([0-9]+_[0-9]$)/)){
								_logObj[ _num ]["team"] = 2;
								_skillEnemyArr.push(_useNum + 1);
							}else{
								_logObj[ _num ]["team"] = 1;
								_skillMyArr.push(_useNum + 1);
							}
						}
					}
				}
				
			//	console.log(_obj);
			//	console.log(_sklActionLogObj);
			//	console.log(_sklNameLogObj);
			//	console.log(_useSkillIdolObj);
				let _atkNode = document.createElement("div");
				let _myUnitNode = document.createElement("div");
				let _enemyUnitNode = document.createElement("div");
				_atkNode.textContent = _atkSum;
				_myUnitNode.textContent = "自分:";
				_enemyUnitNode.textContent = "相手:";

				_myUnitNode.textContent += "(" +_skillMyArr.length + "):" + _skillMyArr.join(",");
				_enemyUnitNode.textContent += "(" + _skillEnemyArr.length + "):" + _skillEnemyArr.join(",");

				let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
				if(_infoAreaNode){
					_infoAreaNode.appendChild(_atkNode);
					_infoAreaNode.appendChild(_myUnitNode);
					_infoAreaNode.appendChild(_enemyUnitNode);
				}

			}else{
			//	console.warn("発揮値取得に失敗 / 再帰処理");
				setTimeout(injectEventAnimationScriptIsInfo_IdolLiveRoyale_P , 50 , _callCount);	//同名の関数で再帰
			}
		
		}catch(e){
		//	console.error(e);
			setTimeout(injectEventAnimationScriptIsInfo_IdolLiveRoyale_P , 50 , _callCount);	//同名の関数で再帰
		}


}

//上のアレのロワ版 (NPC)
function injectEventAnimationScriptIsInfo_IdolLiveRoyale_NPC(_callCount){
//	console.log("callCount" , _callCount);
	_callCount++;
	if(_callCount > 25){
		return;
	}
	let _obj = null;
	try{
		_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
	//	console.log(_obj);
		var _val = "";
		let _skillMemArr = [];
		let _skillStrArr = [];
		//特定のキー名を持つ値を取り出して、特技の発動アイドル(の序列)を得る
		for(let _key in _obj){
			if(_key.indexOf("SK") === 0 && _key.match(/SK[0-9]+$/)){
			//	console.log(_key , _obj[_key]);
				_val = _obj[_key];
				/** 値が "8_0303333333_0_3" のような文字列になっており、1文字目が発動アイドルの序列
				 * 但しリーダーは 0 から..となるので、ここで得られる順番は配列添え字扱い
				 */
				if(_val && _val.length > 1){
					let _frontMemberNum =  parseInt(_val[0]) + 1;	//1文字目をパースして順番表記なので1増やす
					_skillMemArr.push(_frontMemberNum);
				}
			}
			else if(_key.indexOf("SE") === 0 && _key.match(/SE[0-9_]+$/)){
				//発動特技の説明文。バクメンは別の行扱いなので、ちょっと加工しておく？
				let _sVal = _obj[_key];
				if(_sVal.length > 0){
					//さらにがあれば、前の配列末尾に加える
					_sVal = _sVal.replace("ｷｭｰﾄ","Cu").replace("ｸｰﾙ","Co").replace("ﾊﾟｯｼｮﾝ","Pa").replace("全ﾀｲﾌﾟ","全色").replace("ｱｯﾌﾟ","").replace("のﾌﾛﾝﾄﾒﾝﾊﾞｰの" , "");
					if(_sVal.indexOf("さらに") != -1 && _sVal.indexOf("ﾊﾞｯｸﾒﾝﾊﾞｰ") != -1){
						let _matchArr = _sVal.match(/ﾊﾞｯｸﾒﾝﾊﾞｰ上位([0-9])人/);
						if(_matchArr){
							_skillStrArr[_skillStrArr.length-1] = _skillStrArr[_skillStrArr.length-1] + " +" + _matchArr[1] + "";
						}else{
							_skillStrArr[_skillStrArr.length-1] = _skillStrArr[_skillStrArr.length-1] + _sVal;
						}
					}else{
						_skillStrArr.push(_sVal);
					}
				}
			}
		}
		//▼ここから仮計算
		let _valTurnArr = [0,0,0,0,0];	//未取得分は0埋め
		let _valTurnCount = 0;			//5回分のターン 0～4 を想定
		let _valEncore = 0;				//アンコール
		for(let _key in _obj){
			if(_key.indexOf("A") === 0 && _key.match(/A[0-9]+$/)){
				let _val = _obj[_key];
				let _num = parseInt(_val , 10);	//ミリ残し処理の場合、オブジェクトの中身がマイナスになる場合があるので、絶対値とする
				//マイナスの場合はこの数字を参考にしてはならない
				if(_num > 0){
				//	console.log(_num , _val);
					_valTurnArr[_valTurnCount] = _num;
					_valTurnCount++;
				}
			}
			//アンコール値を取得して入れる。パースに失敗しそうならとりあえず 0
			else if(_key.indexOf("encore_bonus") != -1){
				_valEncore = parseInt( _obj[_key] , 10 ) || 0;
			}
		}

	//	console.log(_valArr);
	//	console.log("sum:" , _sum , "_copyLog:" , _copyLog);
		//▲ここまで仮計算

		//得られた配列1ターンでも発揮値が 0 超過
		if(_valTurnArr.find((_val)=>{ return _val > 0;}) > 0){

			let _log = "";
			let _valAllSum = _valEncore;	//各種ターン発揮 + 別途アンコール発揮
			_valTurnArr.forEach((v)=>{
				_valAllSum += v;
			});


			console.log(_valTurnArr.join("\n") + "\n" + _valEncore + "(アンコール)\n" + _valAllSum + "(全体発揮)");
			//	console.log("↓Excel系コピペ用" , "総合発揮" , "1T～5Tまでの発揮(空白は0)" , "最後はアンコール発揮");
			console.log(_valAllSum + "\t" + _valTurnArr.join("\t") + "\t" + _valEncore);

			console.log("特技発:" , _skillMemArr.join(","));
			console.log(_skillStrArr.join("\n"));
			//▼画面上表示
			if(_skillMemArr.length > 0){
				let _retStr = "特技:(" + _skillMemArr.length + "):" + _skillMemArr.join(",");
				let _atkNode = document.createElement("div");
				let _infoNode = document.createElement("div");
				_atkNode.textContent = _valAllSum;
				_infoNode.textContent = _retStr;

				let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
				if(_infoAreaNode){
					_infoAreaNode.appendChild(_atkNode);
					_infoAreaNode.appendChild(_infoNode);
				}

			}

		}else{
		//	console.warn("ターン毎の発揮値取得に失敗 / 再帰処理");
			setTimeout(injectEventAnimationScriptIsInfo_IdolLiveRoyale_NPC , 50 , _callCount);	//同名の関数で再帰
		}

	}catch(e){
	//	console.error(e);
		setTimeout(injectEventAnimationScriptIsInfo_IdolLiveRoyale_NPC , 50 , _callCount);	//同名の関数で再帰
	}


}

//上のアレのJAM版
function injectEventAnimationScriptIsInfo_MusicJam(_callCount){
	console.info("callCount" , _callCount);
	_callCount++;
	if(_callCount > 25){
		return;
	}
	let _obj = null;
	try{
	//	_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
		_obj = window.im_cjs;
		//console.info(_obj);

		const _useSkillMembers = [];
		const _skillObj = {};
		let _skillCount = 0;
		//特定のキー名を持つ値を取り出して、特技の発動アイドル(の序列)を得る
		for(let _key in _obj){
			if(_key.indexOf("player") === 0){
				if(_key.match(/player_skill_user_id[0-9]+$/)){
					//console.info(_key , _obj[_key]);
					const _val = _obj[_key];
					/** 値が "8_0303333333_0_3" のような文字列になっており、1文字目が発動アイドルの序列
					 * 但しリーダーは 0 から..となるので、ここで得られる順番は配列添え字扱い
					 */
					if(_val > 0 && Number.isInteger(_val)){
						//console.info("格納" , _val);
						_useSkillMembers.push(_val);
					}else{
						//console.warn("発動メンバー値がIntではないようです");
						const _num = parseInt(_val);
						if(_num > 0){
							_useSkillMembers.push(_num);
						}
					}
				}
				// 発動人数
				else if(_key.match(/^player_skill_user_num$/)){
					const _val = _obj[_key];
					//console.info("スキルカウント格納" , _val);
					if(Number.isInteger(_val)){
						_skillCount =  _val;
					}else{
						_skillCount =  parseInt(_val);
					}
				}
			}
		}

		//console.info(_useSkillMembers);
		//console.info(_skillCount);

		//▼ここから仮計算
		let _sum = 0;
		let _log = "";
		for(let _key in _obj){
			if(_key.indexOf("A") === 0 && _key.match(/A[0-9]+$/)){
				let _val = _obj[_key];
				let _num = Math.abs(parseInt(_val));	//ミリ残し処理の場合、オブジェクトの中身がマイナスになる場合があるので、絶対値とする
			//	console.info(_num , _val);
				_log += (_num+"\n");
				_sum += _num;
			}
		}
	
		//▲ここまで仮計算
		if(_skillCount > 0){
			let _retStr = "特技：" + _skillCount + "人 [ " + _useSkillMembers.join(",") + " ]";
			let _node = document.createElement("div");
			_node.textContent = _retStr;
			let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
			if(_infoAreaNode){
				_infoAreaNode.appendChild(_node);
			}else{
				document.body.firstChild.appendChild(_node);
			}
		}
		else{
			console.warn("特技発動配列が正しく得られていません。再帰処理を行います");
			setTimeout(injectEventAnimationScriptIsInfo_MusicJam , 50 , _callCount);	//同名の関数で再帰
		}

	}catch(e){
		console.error(e);
		setTimeout(injectEventAnimationScriptIsInfo_MusicJam , 50 , _callCount);	//同名の関数で再帰
	}


}