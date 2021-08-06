//(大体他のスクリプトもそうだけど)first_load.jsのgetStorage()内で呼ばれる
//ライブバトルに関するページ操作を行う処理をまとめたスクリプト
//①LIVEバトル開始直前のチェックページ(応援・タブ閉じボタンや単騎凸チェック)
//②実際のライブバトル中のフラッシュ演出ページ(上部に6ボタン表記)
//③ライブバトルが行われた結果のフラッシュ演出ページ＠リザルト(上部に6ボタン表記)

var liveBattleObj = {};

liveBattleObj.process = function(){	//	mainfunc_livebattle();

	console.log("MKT:mainfunc_livebattle");

	//▼実際のライブバトル画面-------------------------------
	if(urlCheck("battlesSsSsflash%3Fenemy_id%3D")
		|| urlCheck("win_or_lose%2F%3Fenemy_id%3D")
		|| urlCheck("flash%3Fenemy_id%3D")
		|| urlCheck("win_or_loseSsSs%3Fenemy_id%3D")
		){

		var enemy_id;
		enemy_id = location.href.match(/%3Fenemy_id%3D([0-9]{1,})/)[1];
		if(!enemy_id){
			console.log("×enemy_idを取得できませんでした");
			return;
		}

		//要素作成から新仕様の取得型に変更
		let _topElm = document.getElementById("mkt_animation_top_info_area");
		if(!_topElm){	console.error("missing node");	return;	}
	//	var _topElm = document.createElement("div");

		var _setBaseElm = document.createElement("div");
		_setBaseElm.style.display = "table";
		_setBaseElm.style.margin = "0px auto";		
		_topElm.appendChild(_setBaseElm);

		console.log("enemy_id:"+enemy_id);

		var _setClassName = "mkt_livebattle_menu_btn";	//mystyle.css
		var set_baseURL = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2F';

		//マイスタジオ
		var setMystudioElm = document.createElement("a");
		setMystudioElm.href = set_baseURL+"mypage";
		setMystudioElm.textContent = 'マイスタジオ';
		setMystudioElm.className = _setClassName;
			//相手プロフィール
		var setProfileElm = document.createElement("a");
		setProfileElm.textContent = '相手プロフ';
		setProfileElm.href = set_baseURL+'profile%2Fshow%2F'+enemy_id;
		setProfileElm.className = _setClassName;

			//Live再準備
		var setLiveElm = document.createElement("a");
		setLiveElm.textContent = 'LIVE再準備';
		setLiveElm.href = set_baseURL+'battles%2Fbattle_check%2F'+enemy_id+'%3F';

		setLiveElm.className = _setClassName;
			//道場
		var setDoJoElm = document.createElement("a");
		setDoJoElm.textContent = '道場';
		setDoJoElm.href = getOption("dojo_url");
		setDoJoElm.className = _setClassName;

			//応援
		var setCheerElm =  document.createElement("a");
		setCheerElm.textContent = '応援';
		setCheerElm.href = set_baseURL+'cheer%2Findex%2F'+enemy_id+'%2F1%3F';
		setCheerElm.className = _setClassName;
			//タブを閉じる
		var setCloseElm =  document.createElement("span");
		setCloseElm.textContent = '×';
		setCloseElm.className = _setClassName;
		setCloseElm.addEventListener("click",function(){
			chrome.extension.sendRequest(	{status: "tabclose"}, function(response) { });
		});

		//setBaseElm内に、上で作った要素を全て配置する
		_setBaseElm.appendChild(setMystudioElm);
		_setBaseElm.appendChild(setProfileElm);
		_setBaseElm.appendChild(setLiveElm);
		_setBaseElm.appendChild(document.createElement("br"));
		_setBaseElm.appendChild(setDoJoElm);
		_setBaseElm.appendChild(setCheerElm);
		_setBaseElm.appendChild(setCloseElm);
		//▲【！】ここまで【！】type2はここまで全て要素の下準備-----------------------------------------------

		//ライブバトルページパターンA
		var mainFlashElm = document.querySelector("embed");
		if(mainFlashElm){
		//	console.log(mainFlashElm);
			mainFlashElm.parentNode.insertBefore(_topElm,mainFlashElm);
		}
		//ライブバトルページパターンB？
		else {
			console.log("embedではない");
			mainFlashElm = document.querySelector("div#upperSpace");
			if(mainFlashElm){
				console.log("upperSpace");
				document.getElementsByTagName("body")[0].parentNode.insertBefore(_topElm , document.getElementsByTagName("body")[0]);
			}
			else {
				console.log('id:canvas');

				console.log(document.getElementsByTagName("body")[0]);

				document.getElementsByTagName("body")[0].parentNode.insertBefore(_topElm , document.getElementsByTagName("body")[0]);

			}
		}

	}
	else if(urlCheck("%2Fidolmaster%2Fbattle_log%2Fbattle_log_list")){
		
		liveBattleObj.battleLogClock();
	}
	//個別の確認ログ(情報表示)
	else if(urlCheck("%2Fbattle_log%2Fdetail_battle_log%2F")){
		//liveBattleObj.battleLogEnemyUnitAdd();
	}


}


//▼ライブバトル直前の画面。×ボタン付けたりとか	呼び出し元は first_load.js
liveBattleObj.battleCheck = function(){		//mainfunc_battlecheck()

	console.log("MKT:mainfunc_battlecheck");

	liveBattleObj.btnWriteUnitName();
	
	//衣装を狙うボタンを足掛かりにする
	var _targetBtnElm = mainElm.querySelector('section.t-Cnt > a.btn_normal_line_2.m-Cnt');
	if(_targetBtnElm){
		_targetBtnElm.className = "mkt_js_btn_type";

		//タブを閉じるボタン生成してイベントを付与
		var _tabcloseElm = document.createElement("span");
		_tabcloseElm.className = "a_link";
		_tabcloseElm.style.width = "70px";
		_tabcloseElm.textContent = '×';
		_tabcloseElm.addEventListener("click",function(){
			chrome.extension.sendRequest(	{status: "tabclose"}, function() { });
		});
		
		//▼現在のURLから、enemy_idを割り出して、応援URLを生成
		var _enemy_id = location.href.match(/battle_check%2F[0-9]{1,}/);
		_enemy_id = _enemy_id[0].replace("battle_check%2F","");
		var cheer_url = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcheer%2Findex%2F'+_enemy_id+'%2F1%3F';
		//▼今開いたプロフィールIDを保存
		saveOption("lastprofile_id",_enemy_id);
		console.log(_enemy_id , "を保存");

		//▼応援エリア生成
		var _cheerBtn = document.createElement("a");
		_cheerBtn.className = "a_link";
		_cheerBtn.href = cheer_url;
		_cheerBtn.style.width = "70px";
		_cheerBtn.textContent = '応援';
	//	console.log(cheer_url);

		//配置作業
		_targetBtnElm.parentNode.insertBefore(_cheerBtn,_targetBtnElm);	//[応援要素]を[衣装狙い要素]の上に
		_targetBtnElm.parentNode.insertBefore(_tabcloseElm,_targetBtnElm.nextSibling);	//[閉じる要素]を[衣装狙い要素]の下に
	}
	else{
		console.warn("btnElmの取得に失敗 / リハーサルの可能性があります");
		if(getOption("rehearsal_hidden_check")){
			var _pinkFormElm = document.querySelector("div >form");
			if(_pinkFormElm){
				var _setInfoDiv =document.createElement("div");
				_pinkFormElm.style.display = "none";
				_setInfoDiv.textContent = "リハーサルボタンを非表示にする機能が有効になっています。この機能をオフにするには、mktのポップアップメニューから Layoutタブを開き、リハーサルボタン非表示の機能をオフにしてください";
				document.getElementById("top").insertBefore(_setInfoDiv,document.querySelector("nav").nextElementSibling);
			}
		}
	}

};


//ユニット名をボタンに摩り替える。liveBattleObj.battleCheck() 内で呼ばれる
liveBattleObj.btnWriteUnitName = function(){

	var btlAreaElm = mainElm.querySelector("section.line-retina-sprite > div > table > tbody > tr > td[align='right']");
//	console.log(btlAreaElm);
	if(btlAreaElm){
		var pinkBattleBtn = mainElm.querySelector("div.line-retina-sprite > div > form > input[type='submit']");
		if(pinkBattleBtn){
		//	console.log(pinkBattleBtn);
		//	console.log(btlAreaElm.childNodes);
			for(var i in btlAreaElm.childNodes){
			//	console.log(btlAreaElm.childNodes[i]);
				//最初に遭遇したテキストノード(ユニット名)でボタンのvalueを上書き
				if(btlAreaElm.childNodes[i].nodeType == 3){
					var unitName = btlAreaElm.childNodes[i].nodeValue;
					unitName = unitName.replace('\n',"");	//改行が邪魔なので消すます
				//	console.log(btlAreaElm.childNodes[i].nodeValue);
					pinkBattleBtn.value = unitName;
					break;
				}
			}
		}
	}

};


//凸ログのdataset格納 & 表示を担うノード配列
liveBattleObj.battleLogNodes = [];


//凸個別の確認ページにあるユニット下に、特技情報を付与
liveBattleObj.battleLogEnemyUnitAdd = function(){
	let _imgNodeArr = document.querySelectorAll(".idol_card_image > img");
	if(!_imgNodeArr || _imgNodeArr.length < 1){
		console.warn("missing .idol_card_image > img");
	//	return;
	}
	//common_script.js に記載されているクラス
	let HogeAttach = new AttachIdolDataServerClass();
	let _hashArr = [];
	[..._imgNodeArr].forEach((e,_index)=>{
		let _hashStr = HogeAttach._getHashStrFromIdolImageURL(e.src);
		if(_hashStr){
			_hashArr.push(_hashStr);
		}
	});
	if(_hashArr.length == 0){
		console.warn("not found hash Array");
		return;
	}
	console.log(_hashArr);

	//抽出したハッシュ配列を用いて、鯖からアイドルデータを貰ってくる
	HogeAttach.asyncGetIdolDataFromHashArray(
		_hashArr , 
	(_ObjArr) =>{
		console.log(_ObjArr);
		
		console.log(_imgNodeArr);
		
	});
};



//凸履歴で時間計測
liveBattleObj.battleLogClock = function(){
	this.battleLogNodes = [];
	var _timeSpanNodes = document.querySelectorAll("section > .t-Lft.m-Btm5 > span.gray");
//	console.log(_timeSpanNodes);
	for(var n=0;n<_timeSpanNodes.length; n++){
		//日時抽出
		var _mArr = _timeSpanNodes[n].textContent.match(/([0-9]+)\/([0-9]+) ([0-9]+):([0-9]+)/);
		if(_mArr && _mArr.length == 5){
			var _now =  new Date();
			var _d = new Date(_now.getFullYear() , parseInt(_mArr[1],10)-1 , _mArr[2] , _mArr[3] , _mArr[4]);
			var _setElm = document.createElement("span");
			//時間だけノードに記憶させる
			_setElm.dataset.timevalue = _d.getTime();
			//指定個所に配置
			var _parentNode = _timeSpanNodes[n].parentNode;
			_parentNode.insertBefore(_setElm , _timeSpanNodes[n].nextElementSibling.nextElementSibling);
			this.battleLogNodes.push(_setElm);//ノード確保
		}
	}
	//即座に一度だけ実行
	liveBattleObj.battleLogTimer();
	//んで周期
	this.battleLogTimerId = setInterval(liveBattleObj.battleLogTimer , 1000);
	
};

//秒ごとに、格納済みノード配列をチェックしつつ弄るだけ。破棄無し
liveBattleObj.battleLogTimer = function(){
	var _now =  new Date();
	var _nowTime = _now.getTime();
	
	try{
		var _len = liveBattleObj.battleLogNodes.length;
		for(var n=0; n<_len; n++){
			var _node = liveBattleObj.battleLogNodes[n];
			if(_node.dataset.timevalue){
				var _sabun = _nowTime - parseInt(_node.dataset.timevalue,10);
			//	console.log(_sabun , "ミリ秒前");
				var _sec = Math.floor(_sabun/1000);
				var _min = Math.floor(_sabun/(1000*60));
				var _hour = Math.floor(_sabun/(1000*3600));
				var _day = Math.floor(_sabun/(1000*3600*24));
			//	console.log(_day , _hour , _min);
				var _setText = "";
				if(_day >= 1){
					_setText = _day+"日前";
					_node.className = "gray";
				}else if(_hour >= 1){
					_setText = _hour+"時間前";
				}else if(_min >= 1){
					_setText = _min+"分前";
					_node.style.color = "#ff9933";
				}else{
					_setText = "1分以内";
					_node.style.color = "#ff5500";
				}
				_node.textContent = _setText;
				
			}
			
		}
	}catch(e){
		console.warn(e);
		clearInterval(liveBattleObj.battleLogTimerId);
	}


};
