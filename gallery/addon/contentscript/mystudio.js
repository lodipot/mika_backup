//メイン関数として囲う-------------------

function mainfunc_mystudio(){

	if(!mainElm){
		console.error("mainElmが取得できていないようです");
	}

	//▼infoエリア設置
	var _targetElement = mainElm.querySelector("div.t-Cnt.m-Btm8");

	if(_targetElement){
		_targetElement.setAttribute("style","margin:0 auto 3px");	//下マージンを少し縮める

		var _setBaseNode;
		//info
		_setBaseNode = document.createElement("div");
		_setBaseNode.id = "mkt_infomation";
		_setBaseNode.style.position = "relative;";
		//バージョン、拡張機能名
		var _versionNode = document.createElement("div");
		_versionNode.id = "mkt_versionArea";
		var _extensionNameNode = document.createElement("span");
		var extensionInfo = getOption("extension_name");
		_extensionNameNode.textContent = extensionInfo;
		_versionNode.innerHTML = "<span style='color:#88bbff;'>"+extensionInfo+"</span> <span style='color:orange;'>"+getOption("version")+"</span>";

		//▼メッセージエリア
		var _messageNode =  document.createElement("div");
		_messageNode.id = "mkt_messageArea";
		_messageNode.innerHTML = getOption("mkt_message");
		_setBaseNode.appendChild(_messageNode);

		_targetElement.parentNode.insertBefore(_setBaseNode,_targetElement);

		if(!EVENTMODE || EVENTMODE == "productionmatchfestival" || EVENTMODE == "idolsurvival"){
			_setBaseNode.appendChild(_versionNode);
		}
		//▼イベントモードがあれば、イベント用要素配置を試みる
		else if(EVENTMODE){
			var setAreaInfoElm = mainfunc_mystudioTimer.getElm(EVENTMODE);
		//	console.log(setAreaInfoElm);
			if(setAreaInfoElm){
				_setBaseNode.appendChild(setAreaInfoElm);
				//▼backgroundに保存された回復時間を取得して、backgroundにタイマー起動要求を送り返す
				var targetRecoverTimeNum = getOption(mainfunc_mystudioTimer.optionName(EVENTMODE));
				requestTimer(mainfunc_mystudioTimer.requestName(EVENTMODE) , targetRecoverTimeNum);
				//console.log( EVENTMODE , "タイマー:" , mainfunc_mystudioTimer.optionName(EVENTMODE) , "を" , targetRecoverTimeNum , "でbg要求");
				//▼書換先の要素をテーブルに保存して、マイスタジオのみの要素書換タイマー起動
				mainfunc_mystudioTimer.setRewriteElm(EVENTMODE , setAreaInfoElm);
				mainfunc_mystudioTimer.secondRewrite(EVENTMODE , targetRecoverTimeNum);
			}
		}

		//▼ぷちデレラ処理
		_setBaseNode.appendChild(mainfunc_mystudioTimer.getLessonElm());

		//▼ぷちデレラ時間解析
		var sendPetitElm = document.getElementById("jsAreaPetit");
		if(sendPetitElm){
			//▼解析に回した+タイマー起動要求
			//console.log("ぷちでれら時間解析を要求");
			mainfunc_mystudioTimer.petieAnalysis(sendPetitElm);
		}else{
			console.log("【×】ぷちでれら時間解析に失敗");
		}

	}else{
		console.warn("infoエリアの取得に失敗");
	}
	
	//スタミナ、攻コストの解析 + タイマーリクエスト + 毎秒要素書き換えの処理詰め合わせ
	myStudioSC.analysisOriginalElement();

	
	//▼イベントバナーがあればURL取得------------------
    var eventElm = mainElm.querySelector("#headerPopupMenu > div > a");	
	if(eventElm){
		//ランダム文字列を削除させる
		var eventURL = eventElm.getAttribute("href").replace(/rnd%3D[0-9]{1,}/,"");

		if(getOption("event_url") != eventURL){
			saveOption("event_url",eventURL);		//URL定義を更新
			BackgroundNotification("eventurl");
		}
	}

	//▼応援,凸,フリトレ,親愛MAX
	subfunc_mystudio_info_contrast();


}

var myStudioSC = {};	//スタミナ,コストに関する処理をまとめる

/*	スタミナ + 攻コストを解析
	bgにタイマーリクエスト
	毎秒要素書き換えの処理詰め合わせ
 */
myStudioSC.analysisOriginalElement = function(){
	var _targetElm = document.querySelector("ul.js_comment_off_target");
	if(_targetElm){
		_targetElm.style.marginTop = "-3px";		//レイアウト調整
		//div作ってセットしておく
		var _setBaseElm = document.createElement("div");
		_setBaseElm.style.textalign = "center";
		_setBaseElm.style.width = "250px";
		//共用プロパティにノードや検出値等を確保
		this.timerTable["stamina"].nodeInfo = document.createElement("span");
		this.timerTable["attackcost"].nodeInfo = document.createElement("span");
		this.timerTable["stamina"].nodeInfo.id = "mkt_timerinfo_stamina";
		this.timerTable["attackcost"].nodeInfo.id = "mkt_timerinfo_attack";
		_setBaseElm.appendChild(this.timerTable["stamina"].nodeInfo);
		_setBaseElm.appendChild(this.timerTable["attackcost"].nodeInfo);
		
		_targetElm.insertBefore(_setBaseElm , _targetElm.firstChild);
	//	console.log(_targetElm , _setBaseElm);
		//スタミナ・攻撃コスト表示の要素を得る
		var _staminaElm = _targetElm.querySelector("li:nth-of-type(2)");
		var _liveElm = _targetElm.querySelector("li:nth-of-type(3)");
		if(_staminaElm && _liveElm){
			
			this.timerTable["stamina"].nodeBar = _staminaElm.querySelector("a>div.bar_wrap>.bar");
			this.timerTable["attackcost"].nodeBar = _liveElm.querySelector("a>div.bar_wrap>.bar");
			
			//文字列を抽出して処理用の関数に送る
			var _staValElm = _staminaElm.getElementsByClassName("gauge_value")[0];
			var _atkValElm = _liveElm.getElementsByClassName("gauge_value")[0];
			//ノード確保
			this.timerTable["stamina"].nodeGaugeValue = _staValElm;
			this.timerTable["attackcost"].nodeGaugeValue = _atkValElm;
			//　123/222 といった "現在値/上限値" 文字列を正規表現で取り出し、解析用の関数に送る
			var _tempStr01 = _staValElm.textContent.match(/[0-9]{1,}.*\/.*[0-9]{1,}/)[0];
			var _tempStr02 = _atkValElm.textContent.match(/[0-9]{1,}.*\/.*[0-9]{1,}/)[0];
		//	console.log(_tempStr01 , _tempStr02);
			subfunc_valuecheck("stamina",_tempStr01);		//処理開始
			subfunc_valuecheck("attackcost",_tempStr02);		//処理開始

			myStudioSC.realtimeUpdateTimer("stamina");	//新処理
			myStudioSC.realtimeUpdateTimer("attackcost");	//新処理
		}
	}

};

//テーブル型にしよう
myStudioSC.timerTable = {
	"stamina":{
		nodeBar:null				//リアルタイム書き換え
		,nodeInfo:null				//回復予想時刻、全回復残り時間の表記を入れるために用意した新規ノード
		,nodeGaugeValue:null		//数値表記ノード
		,recoverTimeNum:null		//全回復予想時刻
		,maxValue:null				//最大値
		,timerID:null
	},
	"attackcost":{
		nodeBar:null				//リアルタイム書き換え
		,nodeInfo:null				//回復予想時刻、全回復残り時間の表記を入れるために用意した新規ノード
		,nodeGaugeValue:null		//数値表記ノード
		,recoverTimeNum:null		//全回復予想時刻
		,maxValue:null
		,timerID:null
	}
};

//▼表示されている情報を書き換える。1秒ごとに自身を呼び直す
myStudioSC.realtimeUpdateTimer = function(_type){
	//計算で利用するためにプロパティに記憶させていたノードや値を取り出す
	var _tableObj = myStudioSC.timerTable[_type];
	var _nodeBar = _tableObj["nodeBar"];
	var _nodeInfo = _tableObj["nodeInfo"];
	var _nodeGaugeValue = _tableObj["nodeGaugeValue"];
	var _recoverTimeNum = _tableObj["recoverTimeNum"];
	var _maxValue = _tableObj["maxValue"];
		
	//計算に必要な値や、Dateオブジェクトを用意する
	var _nowTimeObj = new Date();
	var _nowTimeNum = _nowTimeObj.getTime();
	var _recoverTimeObj = new Date();
	_recoverTimeObj.setTime(_recoverTimeNum);
	var _restTimeNum = _recoverTimeNum - _nowTimeNum;
	var time_str = "Full Recovery";
	
	//値算出
	var _nowValue = 0;
	if(_type == "stamina"){
		_nowValue = _maxValue - Math.ceil((_restTimeNum/3) / (1000*60));	//3分で1回復
	}else if(_type == "attackcost"){
		_nowValue = _maxValue - Math.ceil(_restTimeNum / (1000*60));
	}
	//上限超過やマイナスの場合、異常な数値にならないようにする
	if(_nowValue > _maxValue || _nowValue < 0){
		_nowValue = _maxValue;
	}

//	console.log("現刻\t" , _nowTimeNum , "\n回復\t" , _recoverTimeNum , "\n残り\t" , _restTimeNum , _type , "算出スタor攻コス値" , _nowValue ,"/",_maxValue);
	
	//残り時間が0超過なら処理を行う
	if(_restTimeNum > 0){
		var rest_h = Math.floor(_restTimeNum / 1000 / 60 / 60);	//残り時間
		var rest_m = Math.floor(_restTimeNum / 1000 / 60 % 60);	//残り分
		var rest_s = Math.floor(_restTimeNum / 1000 % 60);		//残り秒
		var target_h = _recoverTimeObj.getHours();				//予想時間
		var target_m = _recoverTimeObj.getMinutes();				//予想分
//		if(rest_m < 10){	rest_m = "0"+rest_m;	}
		if(rest_s < 10){	rest_s = "0"+rest_s;	}
		if(target_h < 10){	target_h = "0"+target_h;	}
		if(target_m < 10){	target_m = "0"+target_m;	}

		var targetTimeTag = ' <span style="color:#ff8000;">('+target_h+':'+target_m+')</span>';

		if(rest_h > 0){
			time_str = (targetTimeTag+" "+rest_h+":"+rest_m+":"+rest_s);
		}
		else if(rest_h == 0 && rest_m > 0){
			time_str = (targetTimeTag+" "+"00:"+rest_m+":"+rest_s);
		}
		else if(rest_h == 0 && rest_m == 0 && rest_s > 0){
			time_str = (targetTimeTag+" 00:00:"+rest_s);
		//	console.log(rest_h+"時間"+rest_m+"分"+rest_s+"秒");
		}
		else {
			console.log(rest_h+"時間"+rest_m+"分"+rest_s+"秒");
		}
		//呼び直し
		_tableObj["timerID"] = setTimeout(function(){
			myStudioSC.realtimeUpdateTimer(_type);
		},1000);
	}
	//全回復判定
	else {		
		console.log("残り時間 0以下判定:"+_restTimeNum);
		clearInterval(_tableObj["timerID"]);	
	}

	//全快であってもなくても、情報を更新 @ 時間関係を表示 / バーの長さ書換 / 値書換
	if(_nodeInfo){
		_nodeInfo.innerHTML = time_str;
	}
	if(_nodeBar){
		var bar_length = 100 * (_nowValue / _maxValue);
		_nodeBar.style.width = bar_length+"%";
	}
	if(_nodeGaugeValue){
		_nodeGaugeValue.textContent = _nowValue+" / "+_maxValue;
	}
	
	
};



//▼送られたgetStrを、typeをもとに解析する。
// _keyType は "stamina" or "attackcost"
function subfunc_valuecheck(_keyType , getStr){

	var _nowTimeObj = new Date();
	var _nowTimeNum = _nowTimeObj.getTime();
	var _recoverTimeNum = 0;
	var _Num_now = 0;
	var _Num_max = 0;

	if(_keyType == "stamina" || _keyType == "attackcost"){
		var _splitArr = getStr.split("/");
		_Num_now = parseInt(_splitArr[0] , 10);
		_Num_max = parseInt(_splitArr[1] , 10);
		myStudioSC.timerTable[ _keyType ].maxValue = _Num_max;

//		console.log("現:"+_Num_now+"/満:"+Num_max);
		//▼全回復ではないのでタイマー起動、値書き換え諸々
		if(_Num_now < _Num_max){
			var _fixNum = 1;
			if(_keyType == "stamina"){
				_fixNum = 3;	//攻コストは 1分で1回復. スタミナは 3分で1回復 なので、そのための乗算用補正値
			}

			_recoverTimeNum = _nowTimeNum + (((_Num_max - _Num_now) * _fixNum) * 1000 * 60);	//_fixNum分で1回復
			myStudioSC.timerTable[ _keyType ].recoverTimeNum = _recoverTimeNum;

			if(_keyType == "stamina"){
				//指定コストで通知がオンなら、指定値タイマーを起動させる
				if(getOption("staminanotice_check") && getOption("staminanotice_value") > _Num_now){
					console.log("現スタミナ"+_Num_now+" < 指定スタミナ"+getOption("staminanotice_value")+" なのでタイマー起動");
					requestTimer("staminavalue" , _nowTimeNum + ((getOption("staminanotice_value") - _Num_now) * 3 * 1000 * 60));
				}
				else {
					requestTimer("staminavalue", 0);
				}
			}
			else if (_keyType == "attackcost"){
				if(getOption("attacknotice_check") && getOption("attacknotice_value") > _Num_now){
					console.log("攻コス"+_Num_now+" < 指定攻コス"+getOption("attacknotice_value")+" なのでタイマー起動");
					requestTimer("attackcostvalue", _nowTimeNum + ((getOption("attacknotice_value") - _Num_now) * 1000 * 60) );
				}
				else {
					requestTimer("attackcostvalue",0);
				}
			}
			
			requestTimer( _keyType ,_recoverTimeNum);
		}
		//▼elseなら全回復判定。全回復版と値指定版 両方破棄
		else {
			console.log("全回復判定により",_keyType,"定義系列のタイマー破棄");
			myStudioSC.timerTable[ _keyType ].nodeInfo.innerHTML = "Full Recovery";
			requestTimer(_keyType+"value", 0);	//	"staminavalue" or "attackcostvalue"
			requestTimer( _keyType ,0);
		}

	}
}




//▼フリトレ件数や、応援、凸、等の情報を比較する
function subfunc_mystudio_info_contrast(){
	//引き出したオブジェクトは、ページ上の情報と比較される。比較後は上書きされ、最終的にsaveに再利用される
	var mystudioInfoObj = getOption("mystudio_info");
/*	
	//応援
	if(getOption("cheer_check")){
		var cheerAreaElm = document.querySelector("section.tabArea > div#tab_01 > div.tabBack > ul > li > dl");
		if(cheerAreaElm){
			var cheerTime = cheerAreaElm.getElementsByTagName("dt")[0].textContent;
			var cheerName = cheerAreaElm.querySelector("dd > div.usarName > a").textContent;
		//	console.log(cheerTime+" / "+cheerName);
			if(mystudioInfoObj.cheer_time != cheerTime || mystudioInfoObj.cheer_name != cheerName){
				console.log(cheerTime+" / "+cheerName);
				//通知直後、オブジェクトを直接書き換える(あとでこのまま保存しなおす)
				BackgroundNotification("cheer", cheerTime , cheerName);
				mystudioInfoObj.cheer_time = cheerTime;
				mystudioInfoObj.cheer_name = cheerName;
			}
		}
	}
	//出来事

	if(getOption("livebattle_check")){
		var livebattleAreaElm = document.querySelector("section.tabArea > div#tab_02 > div.tabBack > ul > li > dl");
		if(livebattleAreaElm){
			var Time = livebattleAreaElm.getElementsByTagName("dt")[0].textContent;
			var Result = livebattleAreaElm.querySelector("dd > div.usarName > a").textContent;
			var Name = livebattleAreaElm.querySelector("dd > div.usarText").textContent;
			if(mystudioInfoObj.livebattle_time != Time || mystudioInfoObj.livebattle_result != Result){
			console.log(Time+" / "+Result+" / "+Name);
				//通知直後、オブジェクトを直接書き換える(あとでこのまま保存しなおす)
				BackgroundNotification("battle", Time , Result+"\n"+Name );	//結果と名前をセットにしてメッセージBとして扱う
				mystudioInfoObj.livebattle_time = Time;
				mystudioInfoObj.livebattle_result = Result;
			}
		}
	}
*/	
	//フリトレや親愛MAX通知など
	var newInfoAreaElms = document.querySelectorAll("div.lBox > section#newInfo > div.newInfoBody > ul > li");
	if(newInfoAreaElms){
		var freetraderewriteNum = 0;
	//	console.log(newInfoAreaElms);
		for(var n=0; n<newInfoAreaElms.length; n++){
			var _text = newInfoAreaElms[n].textContent;
		//	console.log(_text);
			if(_text.match(/.*との親愛度がMAXになりました/)){
				BackgroundNotification("lovemax" , _text);
			}
			if(_text.match(/完了したフリートレードが[0-9]{1,}件あります/)){
				freetraderewriteNum = parseInt(_text.match(/[0-9]{1,}/)[0] , 10);
				//初回起動で、1件以上ある場合は呼ばれてしまうが仕様。何度もsaveOption呼ぶよりは効率的と判断。
				if(freetraderewriteNum > mystudioInfoObj.freetrade_value){
					BackgroundNotification("freetrade" , freetraderewriteNum );
				}
			}
			if(_text.match(/アイドルに会いに行けます/)){
				BackgroundNotification("default" , "通知" , "アイドルに会いに行けます" );
			}
		}
		//どのみち最終的に保存
		mystudioInfoObj.freetrade_value = freetraderewriteNum;
	}

	saveOption("mystudio_info",mystudioInfoObj);	//再保存

}








