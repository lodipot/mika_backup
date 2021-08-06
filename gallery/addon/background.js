

//通知ファイル取得巡回
var TimerID_mktmessage = 0;
var activeTabID = null;
/**
 * http://sp.pf.mbga.jp/12008305/*
 * http://sp.mbga.jp/_chat_widget_game*
 * https://sp.mbga.jp/*
 */

//===========================================
//送信周り
/*	マニフェストの "webRequestBlocking" パーミッションが必要
chrome.webRequest.onBeforeRequest.addListener(
	function(details){
	//	console.log(details);
		if(details.type == "xmlhttprequest"){
			console.log(details);
			if(details.url.indexOf("game_center%2Fhanafuda_play%2F") != -1){
				chrome.tabs.executeScript(null, {runAt:"document_end", code:"document.getElementById('container').style.marginTop='0px';console.log('st-change');" }, function(){});
			}
		}
	
		if(details.method === 'GET'){
			//マイスタジオアクセスブロック
			if(details.url.indexOf("%2Fmypage%3F") != -1 && getOption("mystudio_accessblock_check")){
				return {redirectUrl: "http://sp.pf.mbga.jp/12008305/?guid=ON"};
			//	return {cancel: true};	//ブロックする場合
			}
		}
	},
	{urls: ["http://*.mbga.jp/12008305/*","http://idolmaster.edgesuite.net/*"]	},	["blocking"]
);
*/
/**
 * permissions にて
 * "http://sp.mbga.jp/*" 
 * "http://sp.pf.mbga.jp/12008305/*" , 
 * "https://sp.mbga.jp/*" ,
 */
chrome.webRequest.onCompleted.addListener(
	function(details){
		//console.log(details)
		if(details.type == "xmlhttprequest"){
			//console.log(details.url);
			let _url = details.url;
			if(_url.indexOf("game_center%2F") != -1 && _url.indexOf("%3FflashParam%3D") != -1){
				//ゲーム時にmargintopを弄る
				chrome.tabs.executeScript(null, {runAt:"document_end", code:"document.getElementById('container').style.marginTop='0px';console.log('st-change');" }, function(){});
			}
		}
	},
	{urls: ["http://*.mbga.jp/12008305/*"]	}
);


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	activeTabID = tabId;
	// permissions "tab" を消しても機能できる
	if(tab.url){
		if (tab.url.indexOf("http://sp.pf.mbga.jp/12008305") != -1
		|| tab.url.indexOf("http://sp.mbga.jp/_chat_") != -1
		){
			chrome.pageAction.show(tabId);		//page actionを読み込む
		}
	}

});
//アクティブなタブを記憶
chrome.tabs.onActivated.addListener(function(_obj){
	activeTabID = _obj.tabId;
});

/**
 * コンテキストメニューへの動作登録
 */
{
	//コンテキストメニューで利用する保存関数
	const _eventContextMenu = (_info , _tab , _shortKey)=>{
		const _Obj = getOption("user_url_obj") || {};
		const _saveURL = _info.linkUrl || _info.pageUrl;
	//	console.log(_Obj , _saveURL);
		_Obj[_shortKey] = _saveURL;
		saveOption("user_url_obj",_Obj);
		NoticeInfomation('notification.png' , null ,_shortKey , 'リンク先またはこのページを'+_shortKey+'に登録しました' , getOption("notification_value") );
	};

	chrome.contextMenus.create({
		"title": "@USER_URL1に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL1");	})
	});
	chrome.contextMenus.create({
		"title": "@USER_URL2に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL2");	})
	});
	chrome.contextMenus.create({
		"title": "@USER_URL3に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL3");	})
	});
	chrome.contextMenus.create({
		"title": "@USER_URL4に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL4");	})
	});
	chrome.contextMenus.create({
		"title": "@USER_URL5に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL5");	})
	});
	chrome.contextMenus.create({
		"title": "@USER_URL6に登録","contexts": ["link" , "page"],
		"onclick": ((info , tab)=>{	_eventContextMenu(info , tab , "@USER_URL6");	})
	});
}




//▼検索
chrome.contextMenus.create({
	"title": "アルバム検索","contexts": ["selection"],
	"onclick": ((info , tab)=>{
		if(info.selectionText){
			const _editStr = info.selectionText.replace(/\[|\]|\+|\(|\)/g," ");
			const _baseURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Farchive%3Fkeyword%3D"+_editStr;
		// 	chrome.tabs.update(tab.id, {url: baseURL});
			window.open(_baseURL);
		}
	})
});
chrome.contextMenus.create({
	"title": "フリートレード検索","contexts": ["selection"],
	"onclick": ((info , tab)=>{
		if(info.selectionText){
			const _editStr = info.selectionText.replace(/\[|\]|\+|\(|\)/g," ");
			const _baseURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fsearch_top%3Fkeyword%3D"+_editStr;
		 	//chrome.tabs.update(tab.id, {url: baseURL});
			window.open(_baseURL);
		}
	})
});


//ぷち衣装記録用
var petitObject = {};
petitObject.collection = {};
petitObject.addList = function(_data){
	
};
petitObject.getObject = function(_data){
	
};
/**
 * ドロップデータ保存処理用オブジェクト,定義
 */
var dropData = {};
{

	dropData.stockObj = {
		/*	構造↓
		"なんとかメダルチャンス":{
			"ほげほげドリンク":1
			,"なんとか衣装":1
		}
		*/
	};
	dropData.rndNumObj = {};	//ランダム数値データ格納
	dropData.checkTimeNum = (15*60*1000);	//何分までならブラバと判断するか
	//セットアップ
	dropData.ini = function(){
		dropData.rndNumObj = getOption("drop_data_rand_object");
		dropData.stockObj = getOption("drop_data_object");
	};
	//保持プロパティに追加	_recvObj は アイテム名key:個数value のペア
	dropData.process = function(_title , _rndVal , _recvObj){
		
		if(dropData.checkRndTime(_rndVal)){
			let _nTObj = new Date();
			dropData.rndNumObj[_rndVal] = _nTObj.getTime();
			
			if(dropData.stockObj[_title]){
				dropData.addBoxItemObject(_title , _recvObj);
			}else{
				//ギフト・メダルチャンス系タイトルが存在しなかった場合、新たに保存する
				dropData.stockObj[_title] = _recvObj;
				console.log(_title , "を新たに集計");
			}
			this.save();
			return true;
		}else{
		//	console.warn("ブラバと判断しました");
			//ブラバと判断
		}
	};
	//processから呼ばれる。
	dropData.addBoxItemObject = function(_title , _recvObj){
		//対象オブジェクトを指定
		var _stockObj = dropData.stockObj[_title];
		
		for(let key in _recvObj){
			let _rItemName = key;
			let _rItemAmount = _recvObj[key];
			//受信したアイテム名と同じものがあれば加算
			if(_stockObj[key]){
				let _oItemAmount = parseInt(_stockObj[key] , 10);
				_stockObj[key] = _rItemAmount + _oItemAmount;
		//		console.log("加算ログ",key, _rItemAmount ,"+", _oItemAmount , "=" ,_stockObj[key]);
			}else{
			//無ければ、新しく得たアイテムとしてkeyを増やす
				_stockObj[key] = _rItemAmount;
		//		console.log("追加ログ",key, _rItemAmount);
			}
		}
	}
	
	//そのrndが得られた時間は、未集計 または 重複時に指定時間を超えているか
	dropData.checkRndTime = function(_rndVal){
		
		let _nTObj = new Date();
		let _nowNum = _nTObj.getTime();
		let _flag = true;
		for(let n in dropData.rndNumObj){
			let _stockNum = parseInt(dropData.rndNumObj[n] , 10);
			let _intervalNum = _nowNum - _stockNum;
	//		console.log(_rndVal , "のデータは" ,_intervalNum , "㍉秒経過しています");
			//時間内のデータはそっとしておく
			if(dropData.checkTimeNum > _intervalNum){
				//万一、時間内かつrnd値が同じものが存在したなら、ブラバでの受信と判断してカウントしない
				if(_rndVal == n){
					_flag = false;	
				}
			}
			//時間が過ぎているものは削除
			else {
				delete dropData.rndNumObj[n];
			}
		}
		return _flag;
	};
	//localStorageにセーブ
	dropData.save = function(){
	//	console.log("セーブ命令");
		saveOption("drop_data_rand_object" , this.rndNumObj);
		saveOption("drop_data_object", this.stockObj);
	};
	dropData.clear = function(_key){
		if(typeof(this.stockObj[_key]) != "object"){
			for(var _boxName in this.stockObj){
				console.log(_boxName , "のドロップデータがあります\n\t削除するにはコマンド\n\tdropData.clear(\""+_boxName+"\");\n\tと入力、実行してください。");
			}
			console.log(_boxName , "全てのドロップデータを削除するにはコマンド\n\tdropData.clear(\"all\");\n\tと入力、実行してください。\n\t(※削除の際、確認メッセージは出ませんので注意してください)");
		}else if(typeof(this.stockObj[_key]) === "object"){
			console.error("ドロップデータ" , _key , "を削除しました");
			delete this.stockObj[_key];
			this.save();
		}
		else if(_key == "all"){
			this.rndNumObj = {};
			this.stockObj = {};
			this.save();
		}
	};
	dropData.check = function(){
		//	https://info.yama-lab.com さんから
		function keySort(hash,sort){
			var sortFunc = sort || reverse;
			var keys = [];
			var newHash = {};
			for (var k in hash) keys.push(k);
			keys[sortFunc]();
			var length = keys.length;
			for(var i = 0; i < length; i++){
				newHash[keys[i]] = hash[keys[i]];
			}
			return newHash;	
		}
	
		for(var _boxName in dropData.stockObj){
			var _obj = dropData.stockObj[_boxName];
			_obj = keySort(_obj , "sort");	//一度ソート
			var _sortObj = {};
			var _Amount = 0;
			for(var _n in _obj){
				_Amount += _obj[_n];	//個数
				_sortObj[_n] = _obj[_n];
			}
			console.log(_boxName , "のドロップデーター" , _Amount , "個分です");
			var _tableObj = {};
			
			for(var _t in _sortObj){
				_tableObj[_t] = ((_sortObj[_t]/_Amount)*100).toFixed(3)+"% ("+_sortObj[_t]+"/"+_Amount+")";
			//	console.log(_t , _sortObj[_t],"/",_Amount , "("+((_sortObj[_t]/_Amount)*100).toFixed(2)+"%)");
			}
			console.table(_tableObj);
		}
		
	};
	
}

/**
 * JSON定義。全ての初期設定
 */
var defaultSaveDataObj = {
	"sound_check":true,					//音声通知
	"sound_value":12,					//音量
	"notification_value":7,				//通知時間
	"attacknotice_check":false,			//指定攻撃コストで通知
	"attacknotice_value":15,			//コスト値
	"staminanotice_check":false,		//指定スタミナで通知
	"staminanotice_value":7,			//スタミナ値
	"exptimer_check":true,				//経験値タイマー(計算表記)をONにするか
	"exptimer_usestamina_value":0,		//経験値タイマー計算で使用する仕事の消費スタミナ
	"system_volume_change_check":true,	//ゲーム内ボリューム調整
	"system_volume_change_value":0.3,	//ゲーム内ボリューム調整
	
	"freetrade_check":true,					//フリートレードモード
//	"freetrade_menu_check":true,			//フリートレードモードでのカスタムフリトレメニュー即時ON
	"rehearsal_hidden_check":true,			//リハーサル開始ボタンを非表示
//	"classnaviremove_check":true,			//class naviを非表示
	"imagezoom_check":3,					//画像拡大機能
	"imagezoom_value":67,
	"system_resize_check":true,				//html5アニメーションページで、リサイズを行う(firstload line244)
	"layout_cardstorage_check":true,		//女子寮一覧の[編集]
	"layout_trainerlesson_check":true,		//レッスン画面のトレーナーレイアウト変更
	"layout_storage_pop_push_check":true,	//女子寮への入寮及び呼び出し画面レイアウト変更
	"layout_petit_accessory_list_param_check":true,	//ぷち衣装のパラメータ表示

	"presentrecevelayout_check":true,		//贈り物レイアウト変更
	"presentnocheck01_value":"\\[|\\(レア|と|が|の|チョコレート|クリスマス|クッキー|特製|みんな",	//贈り物チェックを入れないアイテムのプリセット文字列
	"presentnocheck01_check":true,			//プリセットをONにする？
	"presentcheck_value":"ﾄﾚｰﾅｰ|投票券",	//贈り物チェックを入れるアイテムのプリセット文字列
	"presentcheck_check":true,				//チェック入れない機能をONにする？
//	"presentcheck_popular_disable_sheck":true,	//人気度を受け取らない

	"keycodeuse_check":true,			//ショートカットキーを有効
//	"keycode_pageprev":"a",				//前のページへ
//	"keycode_pagenext":"d",				//次のページへ
//	"keycode_browserreload":"r",		//更新


	"event_deckeditlink_value":"",			//イベント編成のURLを保存する
	
	"menu_follow_mode_check":true,
	//"dojo_url":"https://imcg.pink-check.school/dojo",
	"dojo_url":"https://saasan.github.io/mobamas-dojo/",
	//"dojo_url":"http://nagura.herokuapp.com/",
	//"dojo_url":"http://imasdojo.com/",
//	"storage_index_object":{}	女子寮番号管理オブジェクト	cMenu.collectStorageNumber() で保存される
	"user_menu":{
			position:[5,5]
			,menu:[
				[	{name:"URL1",url:"@USER_URL1"}
					,{name:"URL2",url:"@USER_URL2"}
					,{name:"URL3",url:"@USER_URL3"}
				]
				,[	{name:"URL4",url:"@USER_URL4"}
					,{name:"URL5",url:"@USER_URL5"}
					,{name:"URL6",url:"@USER_URL6"}
				]
			]
		},
	//ユーザーメニューで利用
	"user_url_obj":{
		"@USER_URL1":""
		,"@USER_URL2":""
		,"@USER_URL3":""
		,"@USER_URL4":""
	}
	,
	"user_key_obj":{
		"r":"@reload"
		,"a":"@prev"
		,"d":"@next"
	}
	,
//	"event_mode":"",							//イベントモード
	"event_round_notice_timer_value":30,		//ラウンド終了 n分前通知。 0 で無効
	"event_dreamlive_check":false,				//イベント-ドリームLIVE機能
	"event_livetour_check":false,				//イベント-LIVEツアー機能
//	"event_limitvalue":300,						//汎用タイマー n 秒前通知
	"event_idolliveroyale_check":false,			//イベント-アイドルLIVEロワイヤルモード
	"event_productionmatchfestival_combo_value":60,	//イベント-フェスコンボタイマー n 秒前通知
	"event_teamtalkbattleshow_smart_mode_check":true,	//イベント - TBS(チーム) スマートモード (発生中トーク一覧のアイドル画像非表示系)
	"event_idolsurvival":false,					//イベント-アイドルサバイバルモード
	"event_idolliveroyale_limitvalue":300,		//イベント-アイドルLIVEロワイヤルの n 秒前通知
	"event_petitecollection_combo_value":60,	//ぷちコレのコンボ終了 n 秒前通知
	"event_idolvariety_limit_value":120,		//アイバラ応援終了 n 秒前通知
	"event_musicjam_spliveobserve_mode_check":true,	//JAMのSPlive監視
	"event_idolproduce_new_work_layout_change_value":-40,		//アイプロ新お仕事演出を弄る
	

//	"timevalue_stamina":0,
	"timevalue_limitedaccess":0,				//規制タイマーID参照用
	"timevalue_exp_levelup":0,					//経験値タイマーでの、回復予想時刻数値
	"timevalue_event_appealpoint":0,			//イベント ドリームLIVEのAP回復予想時刻
	"timevalue_event_livepoint":0,				//イベント LIVEツアーのLP-回復予想時刻
	"timevalue_event_battlepoint":0,			//イベント LIVEロワイヤルのBP回復予想時刻時間
	"timevalue_event_livelimit":0,				//イベント LIVEロワイヤル/LIVEツアーで開催中のLIVEバトル受付残り時間(ロイヤル,ゲスト,スペシャルゲストを兼ねる)
	"timevalue_event_talkpoint":0,				//イベント TBS
	"timevalue_event_challenegepoint":0,		//イベント アイチャレ
	"timevalue_event_supportpoint":0,			//イベント アイドルバラエティ
	"timevalue_event_support_limit":0,			//イベント アイドルバラエティ応援タイムリミット
	"timevalue_event_jampoint":0,				//イベント ミュージックJAMのJP回復予想時刻


//	"idolpreset_event_ui_show":0,	//イベントプリセット起動の有無(これは残る)


	//新イベントプリセット。 idolpreset_ 以降の文字列は、idol_preset_event.js の eventSelectObj キーに準ずる(依存)
	
	"eventpreset_system":1,						//プリセットのチェック挙動 0.無効 1.一致 2.相違
	"eventpreset_active_keyname":"idolliveroyal_guest",	//配置元・配置先のプリセットキー名であり、popupのアクティブなタブとしても用いられる
	"eventpreset_active_array":[	//呼び出し有効なプリセット名の配列
		"idolliveroyal_guest"
		,"idolliveroyal_atk"
		,"idolliveroyal_def"
	]
	,
	"eventpreset_idolliveroyal_guest":"",	//ロワゲスト
	"eventpreset_idolliveroyal_atk":"",		//ロワ攻
	"eventpreset_idolliveroyal_def":"",		//ロワ守
	"eventpreset_talkbattleshowteam_atk":"",//TBS攻(チーム)
	"eventpreset_talkbattleshowteam_def":"",//TBS守(チーム)
	"eventpreset_dreamlivefestival":"",		//ドリフェス
	"eventpreset_idollivetour":"",			//ツアー
	"eventpreset_idolchallenge":"",			//アイチャレ
	"eventpreset_idolvariety":"",			//アイバラ
	"eventpreset_musicjam":"",				//ミュージックJAM
	"eventpreset_idolproduce":"",			//アイプロ
	"eventpreset_deck_edit_atk":"",			//攻編成
	"eventpreset_deck_edit_def":"",			//守編成
	

//	"myid":"",						//自分のID カスタムメニューの応援と、マイスタジオリンク回避で使う。初回起動で保存するので、定義ナシで
//	"production_chat_id":"",		//プロダクションのチャットID。定義ナシで

	"mystudio_info":{
	//	"cheer_time":"",			//応援タイムスタンプ
	//	"cheer_name":"",			//応援者
	//	"livebattle_time":"",		//凸時間
	//	"livebattle_result":"",		//凸リザルト
		"freetrade_value":0,		//フリトレ値
	},
	
	"drop_data_count_check":false	//集計機能
	,"drop_data_object":{}	//メダル排出など
	,"drop_data_rand_object":{}	//ブラバ記録
	,
	"search_history":[
		{	name:""	,	cost:12	,rare:6	}
		,{	name:""	,	cost:23	,attr:1	}
		,{	lock:1	,	name:"高森藍子"	,cost:24	}
		,{	lock:1	,	name:"相葉夕美"	}
		,{	lock:1	,	name:"藤原肇"	}
		,{	lock:1	,	name:"五十嵐響子"	}
	],

	"window_position_object":{	// サブウィンドウ系で記録、保存させるウィンドウの位置等
		// key は _siteDefine の label とリンクさせている 
		// これを変える場合、各種 post_message.js の name も変更させる必要がある
		"mkt_idolunit":{	width:800,height:940,left:350,top:20	},
		"mkt_skillsearch":{	width:400,height:940,left:600,top:20	},
		"default_window":{	width:640,height:480,left:100,top:50	},
		"memo_skill_lv_html":{	left:640,top:50	},
	},

	"mkt_message":"",			//メッセージ内容
	"version":"",				//バージョン

	"account_value":"■ﾒｲﾝｱｶｳﾝﾄ",			//識別名

	"menu_selecttab":"idolpresetarea"	//ポップアップメニューの選択タブを記憶させる

};


function getOption(name) {
	let _value = localStorage.getItem(name);
//	console.log(_value , typeof(_value));
	if (_value == null || _value == undefined){
		return null;
	}
	else{
		if(typeof(_value) == "object"){
			return _value;
		}else{
			return JSON.parse(_value);	//localStorageのvalueは文字列なのでパースして返す
		}
	}
}

//▼直接localstorageに保存する関数
function saveOption(key , value){
//	console.log(key , value);
	localStorage[key] = JSON.stringify(value);	//いかなる値(オブジェクト)も文字列に変換する
}

//▼序盤にローカルストレージをチェックする
{
	for(key in defaultSaveDataObj){
		if(!localStorage[key]){
			console.log(key+"が存在しませんでした。新しく作成します");
			localStorage[key] = JSON.stringify(defaultSaveDataObj[key]);
		}
	}
	defaultSaveDataObj = null;	//チェックに利用したらもう不要なので破棄する。
}


//▼通知処理
function NoticeInfomation(icon , src , title , message , time) {

	if(time > 0){
		let opt = {
			type:"basic",
			title:title,
			message:message,
			iconUrl:('image/'+icon)
		};
	//	console.log(chrome.notifications);
		chrome.notifications.create("", opt, function(id){
			setTimeout(function(){	chrome.notifications.clear(id , function(e){})	} , time*1000)
		});
	}

	//音声処理
	if (getOption("sound_check") != 0 && src != null){
		let playsrc = null;
		playsrc = chrome.extension.getURL( ("./sound/"+src) );
		let audio = new Audio("");
		audio.src = playsrc;
		audio.volume = (getOption("sound_value") / 100);
		audio.play();
	}
}

//リクエスト監視。localstorageの値をcontentscripts側に教える
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
	//	console.log(request);
	    if (request.option) {
			sendResponse(getOption(request.option));
	    }
	    else if (request.options) {
			var options = {};
			for (var i = 0; i < request.options; ++i) {
				var key = request.options[i];
				options[key] = getOption(key);
	     	 }
			sendResponse(options);
	    }
		//読み出したりセーブしたり-------------------
		else if (request.status){
			if(request.status == "load"){
				sendResponse(localStorage);		//first_load.js で要求される
			}
			else if(request.status == "save"){
				//console.log("セーブ要求:["+request.key+"]" , request.value);
				localStorage[request.key] = JSON.stringify(request.value);
				sendResponse({});
			}
			// タブ閉じ命令
			else if (request.status == "tabclose"){
				chrome.tabs.remove(sender.tab.id , function(){});
				sendResponse({});
			}
			// タブ更新命令
			else if (request.status == "tabsupdate"){
			 	chrome.tabs.update(sender.tab.id, {url: request.url});
				sendResponse({});
			}
			//tab view (タブは選択されているか)	チャット監視機能の名残
			else if (request.status == "tabsview"){
				chrome.tabs.getSelected(null,
					function(tab) {
				//		console.log(tab);
						sendResponse(tab);
					}
				);
			}
			//▼サブウィンドウを開く。popupから呼ばれたりとか
			else if(request.status == "subwindowopen"){
				//console.log( request , request.option_str);
				//console.log( request.skill_obj );
				if(request.skill_obj){
					let _form = createSkillSearchFormNodeFromObject( request.skill_obj );
					subWindowObj.open(request.url , request.option_str , _form);
				}else{
					subWindowObj.open(request.url , request.option_str);
				}
				sendResponse({ });
			}
			else if (request.status == "notification"){
				NotificationShow(request.type , request.messageA , request.messageB ,request.messageC);
				sendResponse({});
			}
			// イベント編成 idol_preset_event.js から送られるデッキ情報
			else if (request.status == "eventdeck"){
				//console.log(request);
				const retData = getEventDeckData(request.message , request.data);
				//console.log(retData);
				sendResponse(retData);
			}
			//ドロップデータ保存
			else if(request.status == "dropdata"){
				if(request.type == "update"){
					//一応正しく終了すればtrue
					if(dropData.process(request.title , request.rnd , request.itemObj)){
						sendResponse({message:"ドロップデータを更新しました",data:dropData.stockObj});
					}else{
						sendResponse({message:"ドロップデータは更新されませんでした"});
					}
				}
				//else if(request.type == "clear")	とかやりたい

			}
			// イベントスケジュールタイマー再起動
			else if (request.status == "round_timer_restart"){
				startEventRoundTimer();
				sendResponse({});
			}
			// execute
			else if (request.status == "execute"){
				chrome.tabs.executeScript(null, { code:request.code }, function(){});
				sendResponse({});
			}
			else {	sendResponse({});	}
		}
		//ぷち関係
		else if (request.petit){
			if(request.petit == "save"){
				for(var n in request.data){
					console.log(request.data[n]);
					petitObject.collection[n] = request.data[n];
				}
				sendResponse({});
			}
			else if(request.petit == "load"){
				sendResponse({});
			}
			else if(request.petit == "clear"){
				sendResponse({});
			}
			else if(request.petit == "listup"){
				sendResponse({});
			}
		}
		//contentscript側 requestTimer()からのタイマー起動要求---------------------------
		else if(request.timer){

			var nowTimeObj = new Date();
			var nowTimeNum = nowTimeObj.getTime();
			var IntervalNum = request.recovertimenum - nowTimeNum;
		//	console.log(request.timer , +request.recovertimenum , "での発現でタイマー起動要求" , (request.recovertimenum - nowTimeNum) , "ミリ秒後 (約" , Math.floor((request.recovertimenum - nowTimeNum)/1000) , "秒)");

			//▼テーブル参照
			for(var i in backgroundShowTable){
				if(i == request.timer){
				//	console.log(request);
					clearTimeout(backgroundShowTable[i].TimerID);	//とりあえず破棄
					//▼リクエスト時間が現在と同じか過去の場合は(0も勿論)タイマーが破棄されるだけ。それ以外ならタイマーを再起動
					if(request.recovertimenum > nowTimeNum){
						//オブジェクトに保持してタイマー起動
						backgroundShowTable[i].TimerID = setTimeout( function(){	NotificationShow(request.timer);	} , IntervalNum );
				//		console.log(request.timer , backgroundShowTable[i].TimerID , IntervalNum , "ms" , (IntervalNum/(1000*60)) , "分後 (Diff影響後)");
					}else{
				//		console.log(request.timer , "の通知タイマーはリセットされました");
					}
					break;
				}
			}
			sendResponse({});
		}
		else {
			sendResponse({});
		}
	}
);

//▼また別のメッセージ系	first_load のクリップボードコピー用
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		console.log(request.text);
        saveToClipboard(request.text);
});

//▼クリップボードへのコピー実作業。今は使えない
function saveToClipboard(_str) {

	// copy 用に textareaを作る
	const _node = document.createElement("textarea");
	_node.style.display = "none";
	document.body.appendChild(_node);
	_node.value = _str;
	_node.focus();
	_node.select();
	document.execCommand("copy");	// もう古いしセキュリティ上使えない？
	document.body.removeChild(_node);
}

//サブウィンドウオブジェクト
subWindowObj = {};
subWindowObj.open = function(_targetURL , _optionParamStr , _appendFormNode){
	//console.log(_optionParamStr , "で開きます");
	if(subWindowObj.Obj){
	//	console.log("一度閉じます");
		subWindowObj.Obj.close();
		subWindowObj.Obj = null;
	}

	subWindowObj.Obj = window.open( _targetURL , 'subwindow', _optionParamStr);
	if(_appendFormNode){
		subWindowObj.Obj.document.body.appendChild( _appendFormNode );
		_appendFormNode.submit();
	}
};

// 特技検索用のformノードを、スキルオブジェクトから作成して返す
function createSkillSearchFormNodeFromObject(_elm){

	let _targetURL = "http://mkt.packetroom.net/skillsearch/";
			
	let _form = document.createElement("form");
	_form.method = "POST";
	_form.action = _targetURL;
	let _skill_bit_scale = _elm["bit_skill"];
	let _skill_color_bit_type = _elm["bit_color"];
	let _s_buff_type = _elm["s_buff_type"];
	let _is_debuff = _elm["debuff"];
	let _idol_type = _elm["type"];
	let _rare = _elm["rare"];
	if(_skill_bit_scale){
		let _node = document.createElement("input");
		_node.type = "hidden";
		_node.name = "s_scale";
		_node.value = _skill_bit_scale;
		_form.appendChild( _node );
		//その規模ビットの特技のみ
		let _choiceNode =  document.createElement("input");
		_choiceNode.type = "hidden";
		_choiceNode.name = "s_scale_choice";
		_choiceNode.value = 1;
		_form.appendChild( _choiceNode );
	}
	if(_skill_color_bit_type){
		let _node = document.createElement("input");
		_node.type = "hidden";
		_node.name = "s_color";
		_node.value = _skill_color_bit_type;
		_form.appendChild( _node );
	}
	if(_idol_type){
		let _node = document.createElement("input");
		_node.type = "hidden";
		_node.name = "type";
		_node.value = _idol_type;
		_form.appendChild( _node );
	}
	if(_rare){
		let _node = document.createElement("input");
		_node.type = "hidden";
		_node.name = "rare";
		_node.value = _rare;
		_form.appendChild( _node );
	}
	if(_s_buff_type){
		let _node = document.createElement("input");
		_node.type = "hidden";
		_node.name = "s_buff_type";
		_node.value = _s_buff_type;
		_form.appendChild( _node );
	}
	let _node = document.createElement("input");
	_node.type = "hidden";
	_node.name = "s_buff";	//デバフなら1 
	_node.value = _is_debuff?1:2;
	_form.appendChild( _node );


	let _submitBtn = document.createElement("input");
	_submitBtn.type = "submit";
	_submitBtn.value = "検索";
	_form.appendChild( _submitBtn );

	return _form;
}


/** window.open()で、支配下にある(ローカル)ページを読み出す時に、
 * そのウィンドウの情報を受け取る役割を担うリスナとして用意 (windowsを閉じたときの位置とか)
 * custom_menu_search.js で呼び出すローカルまたは自サービスと連携させるときに使ってる。
 * post_message.js の内容と相互連携
 */
window.addEventListener("message",function(e){
	
	let _status = e.data["status"];
	let _win_pos_obj = getOption("window_position_object");
	if(_status == "unload"){
		let _window_key_name = e.data["name"];
		let _positionObj = _win_pos_obj[ _window_key_name ];
		if(!_positionObj){
			console.log("window_position_objectから取り出しに失敗" ,  _window_key_name , _win_pos_obj );
			return;
		}

		//同じキーがあれば、それを取り出しつつ、e.data["name"] に準ずる位置情報に上書きする
		for(let _key in _positionObj){
			let _recv_val = e.data[_key];
			if(_recv_val && parseInt( _recv_val ) > -1){
				_positionObj[_key] = _recv_val;
			}
		}
		//console.log( _window_key_name , _positionObj , "で保存します");
		//更新したオブジェクトを集合体に戻して、保存
		_win_pos_obj[ _window_key_name ] = _positionObj;
		saveOption( "window_position_object" , _win_pos_obj);
	}
},false);


//▼個別処理テーブル
// evalかけるものは .message_e 通常は .message
var backgroundShowTable =
{
	//title_e と message_e は evalをあとでかける
	"stamina":{
		TimerID:null,
		Notification:{
			imageFile:"staminadrink.png",
			soundFile:"stamina.mp3",
			message:"スタミナ全回復時刻です"
		}
	},
	"staminavalue":{
		TimerID:null,
		Notification:{
			imageFile:"staminadrink.png",
			soundFile:"stamina.mp3",
			message_e:'"スタミナが【 "+getOption("staminanotice_value")+" 】まで回復しました"'
		}
	},
	"attackcost":{
		TimerID:null,
		Notification:{
			imageFile:"energydrink.png",
			soundFile:"attack.mp3",
			message:'攻撃コスト全回復時刻です'
		}
	},
	"attackcostvalue":{
		TimerID:null,
		Notification:{
			imageFile:"energydrink.png",
			soundFile:"attack.mp3",
			message_e:'"攻撃コストが【 "+getOption("attacknotice_value")+" 】まで回復しました"'
		}
	},
	"exp":{
		TimerID:null,
		Notification:{
			imageFile:"staminadrink.png",
			soundFile:"exp.mp3",
			message:'LVUPするスタミナに達したようです'
		}
	},	//▼ぷちデレラ
	"lesson01":{
		TimerID:null,
		Notification:{
			title:"【レッスン完了】",
			soundFile:"petit_lesson.mp3",
			message:'ぷちデレラレッスン[センター]終了時間です'
		}
	},
	"lesson02":{
		TimerID:null,
		Notification:{
			title:"【レッスン完了】",
			soundFile:"petit_lesson.mp3",
			message:'ぷちデレラレッスン[ライト→]終了時間です'
		}
	},
	"lesson03":{
		TimerID:null,
		Notification:{
			title:"【レッスン完了】",
			soundFile:"petit_lesson.mp3",
			message:'ぷちデレラレッスン[←レフト]終了時間です'
		}
	},
	"round_left":{
		TimerID:null,
		Notification:{
			soundFile:"round_left.mp3",
			message_e:'"ラウンド終了"+getOption("event_round_notice_timer_value")+"分前です"'
		}
	},
	"fescombo":{
		TimerID:null,
		Notification:{
			soundFile:"fescombo.mp3",
			message_e:'"コンボチャンス終了"+getOption("event_productionmatchfestival_combo_value")+"秒前です"'
		},
		requestAlart:{
			title:"コンボ",
			value:getOption("event_productionmatchfestival_combo_value")
		}
	},
	"livepoint":{		//LIVEツアー
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'LP全回復時刻です'
		}
	},
	"tourlivelimit":{		//LIVEツアーの残り時間
		TimerID:null,
		Notification:{
			soundFile:"livelimit.mp3",
			message_e:'"LIVE終了時間 "+getOption("event_limitvalue")+"秒前です"'
		},
		requestAlart:{
			title:"終了",
			value:getOption("event_limitvalue")
		}
	},
	"appealpoint":{		//ドリフェス
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'AP全回復時刻です'
		}
	},
	"battlepoint":{		//アイロワ
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'BP全回復時刻です'
		}
	},
	"royalelivelimit":{	//アイロワLIVE終了
		TimerID:null,
		Notification:{
			soundFile:"livelimit.mp3",
			message_e:'"LIVE終了時間"+getOption("event_idolliveroyale_limitvalue")+"秒前です"'
		},
		requestAlart:{
			title:"終了",
			value:getOption("event_idolliveroyale_limitvalue")
		}
	},
	"supportpoint":{		//アイバラSP
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'SP全回復時刻です'
		}
	},
	"idolvarietylimit":{	//アイバラ応援終了
		TimerID:null,
		Notification:{
			soundFile:"livelimit.mp3",
			message_e:'"アイドルバラエティ\\n全フェーズを通しての応援終了 "+getOption("event_idolvariety_limit_value")+"秒前です"'
		},
		requestAlart:{
			title:"応援",
			value:getOption("event_idolvariety_limit_value")
		}
	},
	"talkpoint":{		//TBS
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'TP全回復時刻です'
		}
	},
	"challengepoint":{	//アイチャレ
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'CP全回復時刻です'
		}
	},
	"petitcombolimit":{		//ぷちコレ
		TimerID:null,
		Notification:{
			soundFile:"fescombo.mp3",
			message_e:'"コンボ終了"+getOption("event_petitecollection_combo_value")+"秒前です"'
		},
		requestAlart:{
			title:"コンボ",
			value:getOption("event_petitecollection_combo_value")
		}
	},
	"jampoint":{		//ミュージックJAM
		TimerID:null,
		Notification:{
			soundFile:"recover_event_point.mp3",
			message:'JP全回復時刻です'
		},
	},
	"jamsuperlive":{	//JAMのスーパーライブ開催通知
		TimerID:null,
		Notification:{
			soundFile:"jamsuperlive.mp3",
			message:'スーパーLIVE開催を検知'
		}
	},
	"limitedaccess":{
		TimerID:null,
		Notification:{
			soundFile:"limitedaccess.mp3",
			message:'通信規制の解除時間です'
		}
	},
	"limitedaccessstart":{	//規制タイマー起動通知
		TimerID:null,
		Notification:{
			title:"アクセス規制",
			message:'タイマーを起動させます'
		}
	},
	"limitedaccessoverlap":{	//規制タイマー重複起動通知
		TimerID:null,
		Notification:{
			title:"アクセス規制タイマー",
			message:'既にタイマーが起動しています'
		}
	},
	"freetrade":{
		Notification:{
			soundFile:"freetrade.mp3",
			message_e:'"フリートレード完了件数 "+messageA+" 件"'
		}
	},
	"eventurl":{
		Notification:{
			title:"",
			message:'イベントURLを更新します'
		}
	},
	"presentinputerror":{	//プレゼント正規表現ミス
		Notification:{
			title:"【エラー】正規表現が不正です",
			message:'指定した受け取りチェック外しは機能しません'
		}
	},
	"lovemax":{	//親愛度MAX
		Notification:{
			title:"【親愛度MAX通知】",
			message_e:'messageA'
		}
	},
	"clipboardcopy":{	//クリップボード
		TimerID:null,
		Notification:{
			title:"クリップボード",
			message_e:'messageA+"人分のアイドル名をクリップボードにコピーしました"'
		}
	},
	"idsave":{
		TimerID:null,
		Notification:{
			title:"ID取得",
			message:"IDをストレージに保存しました。\n応援履歴のショートカットが利用できます"
		}
	},
	"datatalkid":{	//チャットID保存
		Notification:{
			title:"チャットIDを保存",
			message:'チャットIDをストレージに保存しました\nページ更新後、\nプロダクションチャットのショートカットが利用できます'
		}
	},
	"chat":{	//チャット
		Notification:{
			title_e:"messageA",
			message_e:'messageB'
		}
	},
	"default":{	//そのままメッセージを送るだけ
		Notification:{
			title_e:"messageA",
			message_e:'messageB'
		}
	}
};



//▼新通知処理
function NotificationShow(type , messageA , messageB , messageC){
	var NoticeObj;

	for(var i in backgroundShowTable){
		if(i == type){
		//	console.log(i);
		//	console.log(backgroundShowTable[i]);
			NoticeObj = backgroundShowTable[i].Notification;
			RequestObj = backgroundShowTable[i].requestAlart;
			break;
		}
	}
	//console.log(NoticeObj);
	//▼通知定義がなされている事が前提
	if(NoticeObj){
		var TimerID = NoticeObj.TimerID;
		var showTitle = NoticeObj.title;			//こんてんつぽりしーに	'unsafe-eval' を追加
		var showMessage = NoticeObj.message;		//こんてんつぽりしーに	'unsafe-eval' を追加
		var showIcon = NoticeObj.imageFile;
		var soundSrc = NoticeObj.soundFile;
		var showTimeValue = getOption("notification_value");
		if(!showTitle){
			showTitle = "";
		}
		showTitle = (getOption("account_value") + showTitle);	//アカウント名
		if(!showIcon){
			showIcon = "notification.png";
		}
		if(!showMessage){
			showMessage = eval(NoticeObj.message_e);	//メッセージがない場合は、eval用メッセージを変換
		}
		if(!showTitle){
			showTitle = eval(NoticeObj.title_e);	//eval用
		}
		if(TimerID){
			clearTimeout(backgroundShowTable[i].TimerID);	//スコープチェインでi辿る
		}
	//	console.log("ID:"+backgroundShowTable[i].TimerID+" / "+showTitle+" / "+showMessage);
	//	console.log(showTitle+" / "+showMessage);

		//▼秒数が0以上なら通知
		if(showTimeValue > 0){
			var opt = {
				type:"basic",
				title:showTitle,
				message:showMessage,
				iconUrl:('image/'+showIcon)
			};
	//		console.log(chrome.notifications);
			chrome.notifications.create("", opt, function(id){
				setTimeout(function(){	chrome.notifications.clear(id , function(e){})	} , showTimeValue*1000)
			});
		}

		//音声処理
		if (getOption("sound_check") != 0 && soundSrc){
			var playsrc = null;
			playsrc = chrome.extension.getURL( ("./sound/"+soundSrc) );
			var audio = new Audio("");
			audio.src = playsrc;
			audio.volume = (getOption("sound_value") / 100);
			audio.play();
		}

	}
	//ページタイトルを変更する 伝えるタイマーの名前と時間
	if(RequestObj && RequestObj.title && RequestObj.value){
		
		chrome.tabs.sendRequest(
			activeTabID,
			{
				title:RequestObj.title
				,value:RequestObj.value
			},function() {});
		
	}
}


/**
 * 旧アイドルプリセットの削除処理
 */
{

	let _delLocalStorageDefine = {
		"idolpreset_number":"",					//アイドルプリセット番号
		"idolpreset_text01":"",
		"idolpreset_text02":"",		//アイドルプリセット04
		"idolpreset_text03":"",		//アイドルプリセット02
		"idolpreset_text04":"",		//アイドルプリセット03
		"idolpreset_text05":"",		//アイドルプリセット04
		"idolpreset_text06":"",		//アイドルプリセット04
		"idolpreset_name01":"",
		"idolpreset_name02":"",
		"idolpreset_name03":"",
		"idolpreset_name04":"",
		"idolpreset_name05":"05止予定",
		"idolpreset_name06":"",
		"custommenu01_value":"",		//一段目定義
		"custommenu02_value":"",		//二段目定義
	};

	for(let value in _delLocalStorageDefine){
		if(localStorage[value]){
		//	console.log("delete" , value , localStorage[value]);
			delete localStorage[value];
		}
	}


}


////////////////////////////////////////////////////

/**
 * 一時的にイベント編成のために所属アイドルのデータを保存させる用オブジェクト。
 * アイドル名をキー名としている(同一アイドルは重複させないという意図)
 * {
		"[てづくりのしあわせ]高森藍子+": {id:"166233" ,hash:"xxxxxxxxx" , cost:"26" ,time:"xxxxxxxxxxxxxx" },
		"[楽園の佳景]藤原肇+": {id:"166233" ,hash:"xxxxxxxxx" , cost:"26" ,time:"xxxxxxxxxxxxxx" }
	}
 */
var backgroundEventDeck = {};

//
/**
 * イベント編成用	type未実装。	オブジェクトを返す
 * onRequestのリスナ内 "eventdeck" メッセージ受け取りで呼ばれる
 * deckObj の構成は、コンテンツスクリプト側と連携している
 * @param {*} _requestType 
 * @param {*} _deckObj 
 */
function getEventDeckData(_requestType , _deckObj){

	if(0){	
		const _sampleObj = {
		"[てづくりのしあわせ]高森藍子+": "166236" ,
		"[楽園の佳景]藤原肇+": "166233" ,
		"[寿ぎの逢瀬]小早川紗枝+": "166237" ,
		}
		_deckObj = {
			"[てづくりのしあわせ]高森藍子+": {
				id:"166236" ,
				hash:"xxxxxxxxx" , 
				cost:"26" ,
				time:"xxxxxxxxxxxxxx" ,
			}
		}
	
	}

//	console.log(_requestType , _deckObj);
//	console.log(backgroundEventDeck);

	if(_requestType == "send"){
		const _retObj = {};	//返却用オブジェクト用意
		const _prisetListText = getOption("eventpreset_"+getOption("eventpreset_active_keyname"));	//新アイドルプリセット
		const _prisetArray = _prisetListText.split('\n');
	//	console.log(prisetArray);
		// continue 使ってるので forEach 使えないよ
		for(let _index=0; _index<_prisetArray.length; _index++){
			const _name = _prisetArray[_index];
			if(_name.length < 3){	//3文字未満は弾く
				continue;
			}
			const _dataObj = backgroundEventDeck[ _name ];	//アイドル名をキーとして、紐づいてるオブジェクトを得る
			if(!_dataObj){
				continue;
			}
			const _id = _dataObj["id"];
			if(!_id){
				//指定されているが、(まだ)IDを得て居ない(存在しない)アイドルの場合、"抜け"を意識できるように空のオブジェクトを作る
				_retObj[ _name ] = {};
			}
			else {
				_retObj[ _name ] = _dataObj;
			}
		}
		//console.log(_retObj);
		return _retObj;

	}else if(_requestType == "save"){
		//送られたオブジェクトの中身を全て参照し、background.jsで管理している backgroundEventDeck に追加させる
		const _date = new Date();
		const _nowTimeValue = _date.getTime();
		for(let _keyName in _deckObj){
	//		console.log(deckObj[_keyName]+"と"+_keyName+"をbackgroundEventDeckに追加");
			// 取得時刻を加えて保存
			const _obj = _deckObj[_keyName];
			_obj["get_time"] = _nowTimeValue;
			backgroundEventDeck[_keyName] = _obj;
		}
		return;
	}
	else if(_requestType == "reset"){
		backgroundEventDeck = {};
		return;
	}

}



//ラウンド終了前タイマーに関する処理
let event_round_notice_timer_id = null;

startEventRoundTimer();
// popup.js から sendRequestで呼ばれ直す場合がある
function startEventRoundTimer(){
	
	clearTimeout( event_round_notice_timer_id );

	if(getOption("event_round_notice_timer_value") <= 0){
		return;
	}

	fetch('http://mkt.packetroom.net/api/event_round_schedule/')
	.then(res=> {
			return res.json();
	})
	.then(_objArr=> {
		//console.log(_objArr);
		
		let _nowDate = new Date();
		let _nowTimeStamp = _nowDate.getTime();
		//console.log(_nowTimeStamp);
		if(0){	//確認用
			for(let _key in _objArr){
				const _data = _objArr[_key]
				//console.log(_data);
				let _sDate = new Date();
				_sDate.setTime(_data["start"]);
				let _eDate = new Date();
				_eDate.setTime(_data["end"]);
				console.log("開始" , _sDate);
				console.log("└終了" , _eDate);
			}

		}

		//条件抜き出し
		let _matchTimeObj = _objArr.find(_obj=>{
			let _startTimeStamp = _obj["start"];
			let _endTimeStamp = _obj["end"];
			if(_startTimeStamp && _endTimeStamp){
				//console.log(_nowTimeStamp , "<" , _endTimeStamp , "比較" , (_nowTimeStamp < _endTimeStamp));
				//最初にマッチした「ラウンド終了時間が現在の時間より後」のもの
				if(_nowTimeStamp < _endTimeStamp){
					return 1;
				}
			}
		});

		//ラウンド終了時刻のタイムスタンプが抽出出来たら、タイマー起動
		if(_matchTimeObj){
			//console.log(_matchTimeObj)
			let _endTimeStamp = _matchTimeObj["end"];
			if(_endTimeStamp){
				let _endDate = new Date(_endTimeStamp);
				//console.log(_endDate);
				// n分前設定 を、* 1000で秒 更に * 60で分にして、実数値ミリ秒にする
				let _settingValue = getOption("event_round_notice_timer_value") * 60000;
				let _left = (_endTimeStamp - _nowTimeStamp) - _settingValue;
				//少なくとも0ミリ秒以上の差がある場合、タイマー発動
				if(_left > 0){
					//console.log("ミリ秒数差" , _left);
					//console.log(_settingValue);
					//console.log("あと",_left / (1000 * 60) , "分");
					//console.log("あと", Math.floor(_left / (1000 * 3600)) , "時間" , (_left / (1000 * 60)) % 60 , "分");
					event_round_notice_timer_id = setTimeout( ()=>NotificationShow("round_left") , _left );
				}
			}
		}

	});//END fetch


}






//作者の通知ファイル取得巡回
var mktMessage = function(){
	
	var httpObj = new XMLHttpRequest();
	var fileURL = "http://packetroom.s377.xrea.com/extension/mkt/imcg/message.txt";
	var getMessage = "";
	httpObj.open("get", fileURL, true);
	httpObj.onload = function(){
		if(this.readyState == 4 && this.status == 200){
			if(this.responseText && this.responseText.length < 350){
				getMessage = this.responseText;
			}
		}
		//console.log(getMessage);
		saveOption("mkt_message",getMessage);
		clearTimeout( TimerID_mktmessage );
		TimerID_mktmessage = setTimeout( mktMessage , 900000 );	//60秒 * 1000ミリ秒 * 15分
	}
	httpObj.setRequestHeader('Pragma', 'no-cache');
	httpObj.setRequestHeader('Cache-Control', 'no-cache');
	httpObj.send(null);
};

{
	mktMessage();
	dropData.ini();
}


//バージョン情報とプラグイン名
var manifestData = chrome.app.getDetails();
if(manifestData){
	saveOption("version" , manifestData.version );
	saveOption("extension_name" , manifestData.name);
}


