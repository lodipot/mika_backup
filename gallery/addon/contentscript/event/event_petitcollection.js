//ぷちコレ

var petitColle = {};

petitColle.obs = null;	//オブサーバー
petitColle.comboTimeNode = null;	//対象ノード
petitColle.diffTime = 0;	//getOptionでえられる、n秒前通知

//メモ div.fashion_gauge_area > div.counter_area → counter_area special


petitColle.process = function(){
	
	petitColle.diffTime = getOption("event_petitecollection_combo_value");

	if(urlCheck("%2Fevent_fashion%2Fbattle_confirm")){	//ステージ上
		if(this.nodeCollect()){
			//▼深度1 @ bodyに#readyを検知するための監視をつける
			petitColle.obs = new MutationObserver(petitColle.observerEvent);
			petitColle.obs.observe(petitColle.comboTimeNode , {childList : true} );
		}
	}
	
	//indexページ上で、ステージへのリンクを見つけなければ、開催中ではないとして、タイマーを破棄
	if(urlCheck("idolmaster%2Fevent_fashion%2Findex")){
		var _stageBtnLinkElm = document.querySelector(".btn_play_area > a");
		var _link = null;
		if(_stageBtnLinkElm && (_link = _stageBtnLinkElm.href)){
			if(_link.indexOf("idolmaster%2Fevent_fashion%2Fbattle_confirm") != -1){
			//	console.log("ステージリンクを検出");
				return true;
			}
		}
		console.log("コンボタイマーを破棄");
		requestTimer("petitcombolimit" , 0);	//コンボタイマー破棄リクエスト
	}
	
};

//ノード収集
petitColle.nodeCollect = function(){
	this.comboTimeNode = document.getElementById("combo_counter");
	if(petitColle.comboTimeNode){
		return true;
	}
};


//petitColle.process()内で登録。変化毎に逐一呼ばれる。
petitColle.observerEvent = function(data1 , data2){
	try{
		petitColle.checkTimer();
	}catch(e){
		console.error(e);
		petitColle.obs.disconnect();	//エラーが起きれば監視解除
	}
};

//	高頻度で petitColle.observerEvent() 内から呼ばれる。
//	都度、petitColle.comboTimeNode の数値を確認して、background.jsへ送る
//	例外、エラー発生時は監視解除とタイマー破棄リクエストの送信
petitColle.checkTimer = function(){
	
	try{
		var _timeArr = petitColle.comboTimeNode.textContent.match(/([0-9]{1,2})分([0-9]{1,2})秒/);
		var _minNum = parseInt(_timeArr[1],10);
		var _secNum = parseInt(_timeArr[2],10);
		
		//現在時刻に残り時間を足し、純粋なリマインド時間を算出
		var nowTimeObj = new Date();
		var _nowTimeNum = nowTimeObj.getTime();
		var _remindTimeNum = _nowTimeNum + (1000 * 60 * _minNum) + (1000 * _secNum);
		//n秒前指定がある場合、その時間だけ減らす
		
		var _diffSec = petitColle.diffTime;
	//	console.log(_remindTimeNum);
		if(_diffSec > 0){
	//		console.log("\tDiffNumの定義により、発現時間 -"+_diffSec+"秒" , Math.floor(_diffSec/60) , "分",  _diffSec%60 , "秒");
			_remindTimeNum -= (1000 * _diffSec);
		}else{
			//終了前通知設定 0 or 不正 = リクエスト破棄 & 監視終了
			petitColle.obs.disconnect();	//監視解除
			requestTimer(_timerName , 0);	//破棄リクエスト
			return;
		}

		var _timerName = "petitcombolimit";	//background.jsで受け取る。 event_table.js は利用していない
		var _saveName = "timevalue_event_petit_combo";
	//	console.log(_minNum , _secNum);
	//	console.log("\ttimerName:" , _timerName , "saveName:" , _saveName , "value:" , _remindTimeNum);
		requestTimer(_timerName , _remindTimeNum);	//リクエスト

	}catch(e){
		console.error(e);
		petitColle.obs.disconnect();	//監視解除
		requestTimer(_timerName , 0);	//破棄リクエスト
	}
	
};