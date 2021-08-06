var jsonData = null;			// jsonData

var lastTimeStamp = 0;
var lastUserID = 0;
var lastUserName = null;
var lastMessageObj = null;

var tabID = 0;

var chatObj = {};

chatObj.nodeObj ={
	logCtrl:null
	,dummyMenu:null
	,locCtrlParent:null
	,JtextLimit:document.createElement("h1")
	,areaMenuHeader:document.createElement("nav")
	,top:null
};

chatObj.createJsOnBtn = function(){
		var _baseUlElm = document.createElement("ul");
	_baseUlElm.className = "jsOnBtn";
	
		var _jTextLimit = document.createElement("h1");
		_jTextLimit.id = "JtextLimit";
		_jTextLimit.textContent = "プロダクションチャット";
		_baseUlElm.appendChild(_jTextLimit);

	for(var n=0; n<5; n++){
		var _liElm = document.createElement("li");
		var _linkElm = document.createElement("a");
		_linkElm.className = "head_menu_bt_0"+(n+1);
		var _url;

		switch(n){
			case 0:
				_url = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fmypage%3F";
				break;
			case 1:
				_url = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%3F";
				break;
			case 2:
				_url = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fgacha%3Frnd";
				break;
			case 3:
				_url = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%3F";
				break;
			case 4:
				_url = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fauction_top%3F";
				break;
		}
		_linkElm.href = _url;
		_liElm.appendChild(_linkElm);
		_baseUlElm.appendChild(_liElm);
	}
	console.log(_baseUlElm);
	return _baseUlElm;
};
//▼URL確認
function urlCheck(_str){
	if(location.href.indexOf(_str) != -1){
		return true;
	}
	return false;
}


//▼background.jsにメッセージを送る。
chrome.extension.sendRequest({
	status: "tabsview"
	}, function(response){
	//	console.log(response);
		tabID = response.id;	//グローバルでtabidを保持
	}
);


//最初に非同期通信。通信が終わって、設定のオブジェクトが送られてくる
chrome.extension.sendRequest({status: "load" , type:"localstorage" }, function(retObj)
	{
		jsonData = retObj;
		(function(loadedListener){
			readyState = document.readyState;
			if(readyState === 'complete' || readyState === 'interactive'){
				loadedListener();
			}
			else {
				document.addEventListener("DOMContentLoaded",loadedListener,false);
			}
		})(function(){
			document.title = getOption("account_value");
			document.body.style.margin = "auto";	//左寄せを解除
			//作成
			var _areaMenuHeader = document.createElement("nav");
				_areaMenuHeader.className = "area_menu_header";
				_areaMenuHeader.style.height = "90px";
			
			var _jsOnBtn = chatObj.createJsOnBtn();
			var _6btn = document.createElement("div");
				_6btn.className = "area_menu_header_6btn";
				_6btn.appendChild(_jsOnBtn);
			
			_areaMenuHeader.appendChild(_6btn);
			
			
			cMenu.nodeObj.official.area_menu_header_6btn = _6btn;
			
			//全体確保
			var _topElm = document.body.querySelector("div");
			//ログコントロール領域確保
			var _logCtrlAreaElm = document.querySelector("div.log-controller-area");
			
		//	_logCtrlAreaElm.style.height = "200px";
			_logCtrlAreaElm.parentNode.insertBefore(_areaMenuHeader , _logCtrlAreaElm);
			
			
			cMenu.fastSetUp();
			
			cMenu.process();
			mainfunc_chatstamp();
		});

	}
);

function mainfunc_chatstamp(){

		var smileElm = document.querySelector("div.mocha-footer > div > div.mocha-z-index-s > div.mocha-talk-submit-wrap > a") || document.querySelector("div.custom-post-form-area > form > a");

		console.log(smileElm);
		if(!smileElm){
			console.log("スタンプボタンが得られませんでした。再取得を開始");
			setTimeout('mainfunc_chatstamp()',500);
			return;
		}

		console.log("スタンプボタンの取得に成功 / READY..");
/*
		if(getOption("chatwatch_check")){
			chatWatchi();	//★チャット監視
		}
*/
		var customStampCarouselElm = document.querySelector(".custom-stamp-carousel");
		if(customStampCarouselElm){

			var mo = new MutationObserver(hoge);	//★監視関数セット
			var opt = {childList : true	, subtree:true };
			mo.observe(customStampCarouselElm, opt);

			function hoge(change1 , change2){
			
				//スタンプ全体のエリア取得したら、不透明度変更
				var mocha_bg7Elm = document.querySelector("div.mocha-bg7");
				mocha_bg7Elm.style.background = "rgba(230,230,230,0.8)";

				//▼スタンプインデックス一覧のoverflowをscrollに変更したり。
				var stampSlectSliderElm = mocha_bg7Elm.querySelector("ul.mocha-stamp-select-slider");
				if(stampSlectSliderElm){
					stampSlectSliderElm.style.minWidth = "auto";
					stampSlectSliderElm.parentNode.parentNode.style.overflow = "scroll";
			//		stampSlectSliderElm.parentNode.parentNode.setAttribute("style","overflow:scroll;");
				}

				var getElm = mocha_bg7Elm.querySelector("div > div > div > table > tbody");

				//▼スタンプ選択領域をscrollに変更
				if(getElm){
					getElm.parentNode.parentNode.parentNode.style.overflow = "scroll";
				}


				stampLayout(getElm);	//(・_・)マーク初回タップ時に呼ばれる、左端スタンプタブのレイアウトを変える処理

				//▼ スタンプタブの各領域にイベントを仕込む
				var getliElms = document.querySelectorAll("div.mocha-footer > div.mocha-bg7 > div.mocha-wid1 > div > ul > li");
				if(getliElms.length == 0){
					getliElms = document.querySelectorAll("div.mocha-bg7 > div.mocha-wid1 > div > ul > div");
				//	console.log(getliElms);
				}
			//	console.log(getliElms.length);


				//▼スタンプカテゴリの領域をコンパクトにする
				for(var n=0; n<getliElms.length; n++){
				//	console.log("forでスタンプカテゴリ選択ページのレイアウトを変更しています"+n);
					var divLayoutElm = getliElms[n].querySelector("div > a > div");
					if(divLayoutElm){
						divLayoutElm.setAttribute("style","width:30px;");
						divLayoutElm.parentNode.parentNode.setAttribute("style","width:30px");
					}
				}

			}//END function 

		}


}



//▼ボタン属性にaddEventで仕込むとき、下方のli or a 群それぞれに仕込む
//やりたいことは、Table内にある全てのスタンプのリサイズと再配置
function stampLayout(getElm){

//	console.log(getElm.parentNode);
//	console.log(getElm.parentNode.parentNode);
	getElm.parentNode.parentNode.parentNode.style.overflow = "scroll";


	//全てのスタンプ領域を保存する
	var tempTdImgElms = getElm.querySelectorAll("tr > td");
//	console.log(tempTdImgElms);
//	return;
	if(tempTdImgElms){
		var lenImg = tempTdImgElms.length;
		var stampItemZoom = 1;	// 画像倍率
//		console.log(lenImg , divHeight);
		var _setWidth = (67 * stampItemZoom)+"px";
		var _setheight = (46 * stampItemZoom)+"px";

		for(var n=0; n<lenImg; n++){
			tempTdImgElms[n].style.height = _setheight;
			tempTdImgElms[n].style.width = _setWidth;
			tempTdImgElms[n].style.minWidth = _setWidth;
			tempTdImgElms[n].style.minHeight = _setheight;
		}

	}


}


//▼チャットを監視する。更新があれば要素が変わるはずなので、それを検知して通知。 setTimeoutでn秒おきに呼ぶようにする？
function chatWatchi(){

	//コメント群の複数要素を取得
	var messageListElms = document.querySelectorAll("div > ol.talk-list > li.custom-message-cell2 , div > ol.talk-list > li.custom-stamp-cell2");

	if(!messageListElms.length){
		//公式の大きい「チャット」は此方で処理 ワイルドカードは divかliをとりたかったので。
		messageListElms = document.querySelectorAll("div.wrapper > div > ul > * > .mocha-box-align-start");
	}
//	console.log(messageListElms);

	if(messageListElms.length > 0){
//		console.log(messageListElms.length);
		//【！】複数要素の最後(いわゆる最新)の要素を取り出し、時間を取得する
		var lastTalkElm =messageListElms[ messageListElms.length -1 ];
//		console.log(lastTalkElm);
		if(lastTalkElm){
			if(getChatState(lastTalkElm) == false){	//★取得した最後の発言要素を分解し、精査
				console.log("取得失敗により、再取得開始");
				setTimeout('chatWatchi()',5000);
			}
		}
	}
	else {
		//【※】チャット欄が自分の発言で埋まっている場合は、elseになってしまう。
		//タイムラグを解消させるためと判断して、setTimeoutで何度も取りに行かせるのは危ない..ので、1秒単位に設定
		//console.log("【!】コメント群の取得に失敗。再取得開始");
		setTimeout('chatWatchi()',1000);
	}


}





//▼要素を分解して、会話内容やスタンプの画像、時間を精査。
//一つでも取得に失敗したら、falseを返す
function getChatState(mainElm){

	if(mainElm){

		//取得前の古い ID,名前,タイムスタンプ,メッセージ をそれぞれ用意
		var oldUserID = lastUserID;
		var oldUserName = lastUserName;
		var oldTimeStamp = lastTimeStamp;
		var oldMessageObj = lastMessageObj;

		//▼アバター画像からUserIDを取得=====================================
		var avatarElm = mainElm.querySelector(".avatar-thumb > img");
		if(!avatarElm){
			avatarElm = mainElm.querySelector("div > a.mocha-sys-profile > img");
		}
//		console.log(avatarElm);
		if(avatarElm){
			var tempObj = avatarElm.getAttribute("src");
			if(tempObj){
				tempObj = tempObj.match(/\/([0-9]{1,})\//);
				if(tempObj.length > 1){
					lastUserID = tempObj[1];
				}
				else {
					console.log("×取得失敗:UserID");
					return false;;
				}
			}
		}
		//▼名前を取得=================================
		var nameElm = mainElm.querySelector(".comment-name");
		if(!nameElm){
			nameElm = mainElm.querySelector("div > ul > li:first-child");
		}
		if(nameElm){
			lastUserName = nameElm.innerText;
		}
		else {
			console.log("×取得失敗:名前");
			return false;
		}

		//▼タイムスタンプを取得========================
		var timeElm = mainElm.querySelector(".comment-time");
		if(!timeElm){
			timeElm = mainElm.querySelector("div > ul > li+li");
		}
//		console.log(timeElm);
		//■時間分解
		if(timeElm){
			var timeArr = timeElm.innerText.match(/^([0-9]{2}):([0-9]{2})$/) || timeElm.innerText.match(/^([0-9]{1,2})\/([0-9]{1,2}) ([0-9]{2}):([0-9]{2})$/);
			if(!timeArr){
		//		console.log(timeElm.innerText);
		//		console.log("×取得失敗:タイムスタンプ");
				return false;
			}
			else if(timeArr.length == 5){
				//昨日以前のタイムスタンプ＠時間と分をセット。秒は0にする
				var timeObj = new Date();
				timeObj.setMonth(parseInt( timeArr[1] , 10));
				timeObj.setDate(parseInt( timeArr[2] , 10));
				timeObj.setHours(parseInt( timeArr[3] , 10));
				timeObj.setMinutes(parseInt( timeArr[4] , 10));
				timeObj.setSeconds(0);
				timeObj.setMilliseconds(0);
				lastTimeStamp = timeObj.getTime();	//最後に取得したタイムスタンプ(相手側の会話に限る)
			}
			else if(timeArr.length == 3){
				//本日のタイムスタンプ＠時間と分をセット。秒は0にする
				var timeObj = new Date();
				timeObj.setHours(parseInt( timeArr[1] , 10));
				timeObj.setMinutes(parseInt( timeArr[2] , 10));
				timeObj.setSeconds(0);
				timeObj.setMilliseconds(0);

				lastTimeStamp = timeObj.getTime();	//最後に取得したタイムスタンプ(相手側の会話に限る)
			}
			else {
//				console.log("×取得失敗:タイムスタンプ /ここまで来ると好ましくないかも");
				return false;
			}
		}
		else {
			console.log("×取得失敗:タイムスタンプ");
			return false;
		}


		//▼チャット内容 あるいはスタンプを取得=========================
		var messageElm = mainElm.querySelector("div.gamechat-post-stamp > img") || mainElm.querySelector("div.mocha-sys-stamp-area > img:last-child");
		//■上で取れてなければ、スタンプではなくメッセージ判定
		if(!messageElm){
//			console.log("メッセージ判定");
			messageElm = mainElm.querySelector("p[data-ch-name='msg']") || mainElm.querySelector(".mocha-balloon");
		}
//		console.log(messageElm);
		//■ここまで取得できなければ、取得失敗
		if(!messageElm){
			console.log("×取得失敗:メッセージ or チャットスタンプ");
			return false;
		}
		if(messageElm.src){
	//		console.log("image判定");
			lastMessageObj = messageElm.src;
		}
		else {
	//		console.log("text判定");
			lastMessageObj = messageElm.innerText;
		}

		//==============================================
		//フラグ立てて通知を行う
		var alertFlag = false;
		//IDが0以外で、以前と違う
		if(oldUserID != lastUserID){
	//		console.log("別のユーザー["+lastUserID+"]が発言しています");
			alertFlag = true;
		}
		//名前が存在しており、以前と違う
		else if(oldUserName != lastUserName){
	//		console.log("別のユーザー["+lastUserName+"]が発言しています");
			alertFlag = true;
		}
		//古いタイムスタンプが0超過で、古いタイムスタンプより、新しいタイムスタンプのほうが大きい
		else if(oldTimeStamp < lastTimeStamp){
	//		console.log("タイムスタンプ["+lastTimeStamp+"]更新");
			alertFlag = true;
		}
		//古いメッセージがnull以外で、古いメッセージと新しいメッセージが相違
		else if(oldMessageObj != lastMessageObj){
	//		console.log("メッセージ相違判定です");
			alertFlag = true;
		}

		//▼通知処理
		if(alertFlag == true){
	//		console.log(lastUserID);
	//		console.log(lastUserName);
	//		console.log(lastTimeStamp);
	//		console.log(lastMessageObj);
			//▼background.jsにメッセージを送る。
			chrome.extension.sendRequest({
					status: "tabsview"
			}, function(response){
			//	console.log(response.id);
			//	console.log(tabID);
				//保存されたtabIDと、返ってきたidが違っていれば、非アクティブという事で通知
				if(response.id != tabID){
					chatAlert(lastUserName , lastMessageObj);
				}
			});

		}

		setTimeout('chatWatchi()',5000);
	}

}


//▼通知するだけ
function chatAlert(name , msg){

	if(msg.indexOf("http://") != -1){
		msg = "チャットスタンプ";
		name += "のスタンプ";
	}else {
		name += "の発言";
	}

	var accName = getOption("account_value");

	name = name +"("+accName+")";

	BackgroundNotification("chat", name , msg);

}




//▼ローカルファイルを使いたいときに呼ぶ関数。
function getFilePath(path){
	return chrome.extension.getURL( path );
}


// background.js の chrome.extension.onRequest.addListener へメッセージを送る----------
function BackgroundNotification(type , messageA , messageB , messageC){
	chrome.extension.sendRequest(
		{
			status: "notification" ,
			type: type ,
			messageA: messageA ,
			messageB: messageB ,
			messageC: messageC
		}, function(response) {	}
	);
}


//▼jsonDataの中にある指定されたキーを返すだけ----------------
function getOption(key){
	var ret = jsonData[key];
	if(ret === undefined){
	//	console.log("undefinedなんでfalse返します");
		return false;	//
	}
	else {	return JSON.parse(ret);	}
	return false;
}

