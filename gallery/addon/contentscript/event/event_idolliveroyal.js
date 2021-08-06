//アイドルLIVEロワイヤルのスクリプト
//取得する時間は、BPの全回復予想時刻 と 現在開催中のLIVEが終了する時刻 (-n分) の2つ

var idolliveroyale = {};

idolliveroyale.router = function(){

	//▼あいぽん または あんどろ
	if(
		urlCheck("smart_phone_flash%2Fconvert%2F")
	||	urlCheck("%2Fraid_battle_swf%2F")
	||	urlCheck("%2Fencount_battle_swf%2F")
	||	urlCheck("%2Fappear_encount_swf%2F")
	||	urlCheck("%2Fappear_raid_boss_swf%2F")
	||	urlCheck("%2Fappear_sudden_raid_boss_swf%2F")
		){
			
		console.log("アニメーション演出");
		//	subfunc_event_flash_jump_btn();		//event_common.js	URL解析が出来ないのでナシ
		mainfunc_idolliveroyale_flash_btn();
		
		if(["quest_clear_swf",				//お仕事完了演出
			"appear_encount_swf",			//ロワイヤルバトルスタート！ 演出
			"event_point_reward_swf",		//XXXXpt獲得 → 報酬入手 演出
			"appear_sudden_raid_boss_swf",	//緊急ゲストLIVE発生！演出
			"appear_special_raid_boss_swf",	//スペシャルゲストLIVE参戦！演出
			].every((e)=>{return location.href.indexOf(e) == -1;}))
		{
			if(urlCheck("raid_battle_swf")){	//ゲストライブ対戦 , スペシャルゲストライブ対戦 演出 (vs NPC)
				//NPC用の解析埋め込み
				injectScriptFromFunction(injectEventAnimationScriptIsInfo_IdolLiveRoyale_NPC , ["0"]);
			}
			else if(urlCheck("encount_battle_swf")){	//ロワイヤルバトル(vs P)
				//vs P用の解析埋め込み
				injectScriptFromFunction(injectEventAnimationScriptIsInfo_IdolLiveRoyale_P , ["0"]);

			}

		}
		

	}
	//▼新お仕事用
	else if(urlCheck("%2Fidolmaster%2Fevent_royale%2Fwork%2F")){
		subfunc_setEventTableTimer();	//★新タイマー
	}
	//▼それ以外のページ
	else {
		if(urlCheck("%2Fget_raid_boss%2F") || urlCheck("%2Fget_encount%2F") || urlCheck("%2Fraid_lose%3Fraid_id%3D")){
			//BP投入画面でボルテ云々
			idolliveroyale.addVoltageInfo();
		}
		
		//★アバターが出るのでリンク作成
		if(	urlCheck("event_royale%2Fget_encount%2F") || urlCheck("%2Fencount_result%3Fencount_id%3D")){
			this.addProducerlink();
			idolLiveRoyaleUnitDataClass.process();
		}
		
		subfunc_setEventTableTimer();	//★新タイマー
	}

};

//ボルテゲージ確認して、発揮ボタンの下にアピール後のボルテ値を表示させるだけ
idolliveroyale.addVoltageInfo = function(){
	var _formMarkerNodes = document.querySelectorAll("form > span.blue");	//発揮率の青文字
	var _nowVoltageNode = document.querySelector(".voltage_gauge_area + .t-Cnt > span.yellow");	//数字
	if(_nowVoltageNode && _formMarkerNodes.length == 5){
		var _nowVoltageNum = parseInt(_nowVoltageNode.textContent , 10) || -1;
	//	console.log(_nowVoltageNum);
		if(_nowVoltageNum > -1){
			var _vArr = [2,5,8,12,16];
			for(var n=0; n<_formMarkerNodes.length; n++){
				var _setNode = document.createElement("span");
				var _afterNum = (_vArr[n]+_nowVoltageNum);
				_setNode.textContent = (_afterNum)+"%";
				_setNode.title = _nowVoltageNum+"%から +"+_vArr[n]+"%上昇";
				_setNode.style.display = "block";
				_setNode.style.cursor = "default";
				if(_afterNum >= 100){
					_setNode.textContent = "⚠";
					_setNode.title = (_afterNum)+"%";
					_setNode.className = "yellow";
				}
				_formMarkerNodes[n].parentNode.appendChild(_setNode);
			}
		}
	}else{
		console.error("ボルテ情報用マーカーの取得に失敗" , _formMarkerNodes , _nowVoltageNode);	
	}
};



//▼アバターからプロデューサーリンクを作る
idolliveroyale.addProducerlink = function(){
	
	if(!mainElm){
		console.log("【×】MKT:idolliveroyale:mainElmを得られませんでした");
		return;
	}
	var targetElm = mainElm.querySelector("section.royale_bt_deck_back > div.royale_bt_deck > div.enemy_img > img");
	if(!targetElm){
		//ロワイヤルLIVE結果
		targetElm = mainElm.querySelector("section.RoyalInfo > div.t-Cnt > div.displayBox > div[style='width:38%;text-align:center;'] > img");
	}

	if(targetElm){
		var linkStr = targetElm.getAttribute("src");
		if(linkStr){
			linkStr = linkStr.match(/img_op\/([0-9]{4,})\//);	//数字取り出し
			if(linkStr){
				var url = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fprofile%2Fshow%2F'+linkStr[1];
				var setElm = document.createElement("a");
				setElm.setAttribute("href",url);
				setElm.setAttribute("title","プロデューサーのプロフィールを開けます");

				targetElm.parentNode.insertBefore(setElm , targetElm);
				setElm.appendChild(targetElm);

			}
		}
	}
	
}


//▼Flash演出全般に介入
/**
 * 
 * 
 */
function mainfunc_idolliveroyale_flash_btn(){
	console.log("MKT:mainfunc_idolliveroyale_flash_btn()");

	
	//配置作業
	let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
	if(!_infoAreaNode || !document.body){
		console.error("missing body or #mkt_animation_top_info_area element");
		return;
	}

	var pageType;
	var targetIdArr;
	var targetURL;

	if(	urlCheck('%2Fconvert%2Fevent_royaleSsSsappear_encount_swf') || urlCheck('%2Fevent_royale%2Fappear_encount_swf')){
		console.log("MKT:エンカウント > (user)ロワイヤルバトルスタート");
		pageType = "appear_encount_swf";	//
		targetIdArr = location.href.match(/Ss([0-9]{1,})%3F/);
		if(!targetIdArr){
			targetIdArr = location.href.match(/%2F([0-9]{1,})%3Fl_frm/);	//Android
		}
	}
	else if(urlCheck('%2Fconvert%2Fevent_royaleSsSsencount_battle_swf') || urlCheck('%2Fencount_battle_swf%2F%3Fencount_id')){	//Android
		console.log("MKT:バトル > (user)ロワイヤルLIVEバトル");
		pageType = "encount_battle_swf";
		targetIdArr = location.href.match(/%3Fencount_id%3D([0-9]{0,})%26/);
	}
	else if(urlCheck('%2Fconvert%2Fevent_royaleSsSsappear_raid_boss_swf') || urlCheck('%2Fappear_raid_boss_swf%2F')){	//Android
		console.log("MKT:エンカウント > (NPC)ゲストLIVE参戦!");
		pageType = "appear_raid_boss_swf";
		targetIdArr = location.href.match(/SsSs([0-9]{1,})%3F/);
		if(!targetIdArr){
			targetIdArr = location.href.match(/boss_swf%2F([0-9]{1,})%3F/);	//Android
		}
	}
	else if(urlCheck('%2Fconvert%2Fevent_royaleSsSsappear_sudden_raid_boss_swf') ||	urlCheck('%2Fappear_sudden_raid_boss_swf%2F')){	//Android
		console.log("MKT:エンカウント > (NPC)緊急ゲストLIVE発生!");
		pageType = "appear_sudden_raid_boss_swf";
		targetIdArr = location.href.match(/SsSs([0-9]{1,})%3F/);
		if(!targetIdArr){
			targetIdArr = location.href.match(/boss_swf%2F([0-9]{1,})%3F/);	//Android
		}
	}
	else if(urlCheck('convert%2Fevent_royaleSsSsappear_special_raid_boss_swf')){
		console.log("MKT:エンカウント > (NPC)スペシャルゲストLIVE参戦!");
		pageType = "appear_special_raid_boss_swf";
		targetIdArr = location.href.match(/SsSs([0-9]{1,})%3F/);
	}
	else if(urlCheck('%2Fconvert%2Fevent_royaleSsSsraid_battle_swf') ||	urlCheck('%2Fraid_battle_swf%2F')){	//Android
		console.log("MKT:バトル > (NPC共通)ゲストLIVEバトルFlash");
		pageType = "raid_battle_swf";
		targetIdArr = location.href.match(/raid_id%3D([0-9]{1,})/);
	}
	else {
		console.log("MKT:mainfunc_idolliveroyale_flash_btn / 非対応のURLでした");
		return;
	}

//	console.log(pageType);
//	console.log(targetIdArr);

	if(!targetIdArr){
		console.warn("targetIdの取得に失敗しました");
		return;
	}

	let _showStr = "";

	if(pageType == "appear_encount_swf"){
		targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fget_encount%2F" + targetIdArr[1];
	}
	else if(pageType == "encount_battle_swf"){
		targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fencount_result%3Fencount_id%3D"+targetIdArr[1];
	}
	else if(pageType == "raid_battle_swf"){
		var get_attack_point = parseInt(location.href.match(/%3Fattack_point%3D([0-9]{1,})/)[1]);
		var get_after_boss_hp = parseInt(location.href.match(/after_boss_hp%3D([0-9]{1,})/)[1]);
		console.log("対戦後HP:"+get_after_boss_hp);
		console.log("発揮値:"+get_attack_point);

		//勝敗結果に応じて、ジャンプ先のURL末尾を弄る
		var targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2F";
		if(get_after_boss_hp <= 0){
			targetURL += ("raid_win%3Fraid_id%3D"+targetIdArr[1]);	//敵のHPが0なので勝利？
			_showStr = ("ATK = "+get_attack_point+" / AfterHP = 0");
		}
		else {
			targetURL += ("raid_lose%3Fraid_id%3D"+targetIdArr[1]);	//それ以外。残っているので引き分けというか敗北
			_showStr = ("ATK: "+get_attack_point+" / HP: "+get_after_boss_hp);
		}
	}
	else if(pageType == "appear_raid_boss_swf"	||	pageType == "appear_sudden_raid_boss_swf"	||	pageType == "appear_special_raid_boss_swf"	){
		targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fget_raid_boss%2F"+targetIdArr[1];
	}

	//▼作成と配置
	let setBaseDivElm = document.createElement("div");
	setBaseDivElm.setAttribute("style","text-align:center;width:100%;");
	//リンクボタン
	let LinkElm = document.createElement("a");
	LinkElm.href = targetURL;
	LinkElm.id = "mkt_flashSkip";	//外部css依存
	if(_showStr.length > 0){
		LinkElm.textContent = _showStr;
	}else{
		LinkElm.textContent = pageType;
	}
	setBaseDivElm.appendChild(LinkElm);	
	_infoAreaNode.insertBefore(setBaseDivElm , _infoAreaNode.firstChild);



}

/** ロワイヤルの相手ユニット特技表示に関してなんとなく作った仮クラス
 * 鯖に繋いだり、表示ノード作ったり、そういう感じのヤツ。
 */
class IdolLiveRoyaleUnitDataClass{
	constructor(){

		this.switchNode = document.createElement("div");
		//↓格納用配列 { hash:"ハッシュ" , node:imgノード , data:"鯖から得た情報" }
		this.getHashObjectArray = [];
	}

	process(){
		let _targetNode = document.querySelector(".royale_bt_deck > .enemy_img");
		if(_targetNode){
			_targetNode.style.paddingTop = "0px";	//元レイアウト調整(20->0)
			let _switchNode = document.createElement("button");
			_switchNode.style.cursor = "help";
			_switchNode.style.fontSize = "12px";
			_switchNode.style.userSelect = "none";
			_switchNode.style.width = "100%";
			_switchNode.textContent = "👀";
		//	_switchNode.style.height = "20px";
			//▼クリックしたときの処理
			_switchNode.addEventListener("click" , (e)=>{
				//配列保持されていない → 未取得
				if(this.getHashObjectArray.length == 0){
					this.getHashObjectArray = this._getIdolThumbnailHashArray();
					if(this.getHashObjectArray.length > 0){
						//index 0 から、再帰でサーバーに取得
						console.log("アイドル保有特技の取得を開始...");
						this._requestServerData( 0 );
					}
				}
				//配列保持されている → 取得せずに切替する
				else{
					this.getHashObjectArray.forEach(e=>{
						let _node = e["infonode"];
						if(_node){
							_node.style.display = _node.style.display.includes("none")?"block":"none";
						}
					});
				}
			},false);
			_targetNode.insertBefore(_switchNode , _targetNode.firstElementChild);
		}
	}

	/** ajax完了時...つまり鯖からアイドルデータを取得しきった状態で呼ばれる
	 * 保持している配列,アイドルオブジェクトを元に、対象のノードに対してアレコレ
	 */
	_attachThumbnailNodeIdolData(){

		this.getHashObjectArray.forEach((e,_index)=>{
			let _idolData = e["data"];
			if(_idolData){
		//		console.log(_idolData);
				e["node"].title = _idolData["name"];
				let s_txt = _idolData["s_txt"];
				if(typeof s_txt === 'string'){	//ダブル特技が現状 "0" で来るので
					//配列で返る
					let _skillDataArr = skillDataConvert([s_txt]);
					if(_skillDataArr.length == 0){
						return;
					}
					let _skillObj = _skillDataArr[0];
					if(_skillObj["atk"] && _skillObj["def"] == 0 && _skillObj["debuff"] == 0){
				//		console.log("×" , _idolData["name"] , "は、守備フロントでは特技が発動しません");
					}else{
				//		console.log("〇" , _idolData["name"] , s_txt);
						let _node = this._createSkillInfoNode(_skillObj);
						let _imgNode = e["node"];
						_imgNode.parentNode.style.position = "relative";	//absoluteの布石
						_imgNode.parentNode.insertBefore( _node , _imgNode );
						this.getHashObjectArray[_index]["infonode"] = _node;
					}

				}

			}
		});
		
	}

	/** this._attachThumbnailNodeIdolData() から呼ばれる
	 * フォーマット済みの特技オブジェクトから、表記用ノードを作成して返す
	 */
	_createSkillInfoNode(_skillObj){
	//	console.log(_skillObj);
		let _defineArr = ["*","小","中","大","特","極","絶","超","究","？"];
		let _skillScaleMaxIndexNum = _skillObj["skill_min"] - 1;
		let _skillScaleMinIndexNum = _skillObj["skill_max"] - 1;
		let _unKnownSkill = false;

		
		let _scaleStr = "";
		//ダブル特技の場合はスケールがmin,max共に0になるので、 -1 をかける事で undefined 扱いになるのを防止
		if(_skillScaleMaxIndexNum > -1 || _skillScaleMinIndexNum > -1){
			//範囲、まずは最大から
			_scaleStr = _defineArr[ _skillScaleMaxIndexNum ];
			if(_skillObj["skill_min"] != _skillObj["skill_max"]){
				_scaleStr += ("-" + _defineArr[ _skillScaleMinIndexNum ]);
			}
		}else{
			_unKnownSkill = true;
			_scaleStr = "？";
		}

		//究極に警告を与える
		//if(_skillScaleMinIndexNum >= 8){	_scaleStr += "⚠";	}


		let _backMemberStr = "";
		if(_skillObj["back_min"] > 0){
			_backMemberStr = "+" + _skillObj["back_min"];
			if(_skillObj["back_max"] > 0){
				_backMemberStr += ("-" + _skillObj["back_max"]);
			}
		}

		let _colorStr = "";
		if(_skillObj["type_cu"] && _skillObj["type_co"] && _skillObj["type_pa"]){
			_colorStr = "全色";
		}else if(_skillObj["type_cu"] && _skillObj["type_co"]){
			_colorStr = "CuCo";
		}else if(_skillObj["type_cu"] && _skillObj["type_pa"]){
			_colorStr = "CuPa";
		}else if(_skillObj["type_co"] && _skillObj["type_pa"]){
			_colorStr = "CoPa";
		}else if(_skillObj["type_cu"]){
			_colorStr = "Cu単";
		}else if(_skillObj["type_co"]){
			_colorStr = "Co単";
		}else if(_skillObj["type_pa"]){
			_colorStr = "Pa単";
		}else if(_skillObj["type_my"]){
			_colorStr = "自分";
		}


		let _retNode = document.createElement("span");



		let _atkdeftypeStr = "";
		if(_skillObj["atk"] && _skillObj["def"]){
			_atkdeftypeStr = "両";
		}else if(_skillObj["def"]){
			_atkdeftypeStr = "守";
		}else if(_skillObj["atk"]){
			_atkdeftypeStr = "攻";
		}

		if(_skillObj["debuff"]){
			_retNode.style.color = "#1050FF";
			_atkdeftypeStr += "⇩";
		}else{
			_retNode.style.color = "#E04000";
			if(_unKnownSkill == false){
				_atkdeftypeStr += "⇧";
			}
		}
		

		_retNode.style.position = "absolute";
		_retNode.style.backgroundColor = "rgba(255,255,255,0.7)";
		_retNode.style.fontSize = "12px";
		let _colorNode = document.createElement("div");
		let _atkdeftypeNode = document.createElement("div");
		let _scaleNode = document.createElement("div");
		_atkdeftypeNode.style.display = "inline-block";
		_colorNode.textContent =  _colorStr;
		_atkdeftypeNode.textContent = _atkdeftypeStr;
		_scaleNode.textContent = _scaleStr+_backMemberStr;

		let _skillColorSymbolNode = this._createSkillColorSymbolNode(_skillObj);
	//	console.log(_skillColorSymbolNode);
	//	_retNode.appendChild(_colorNode);
		if(_unKnownSkill == false){
			if(_skillColorSymbolNode){
				_retNode.appendChild(_skillColorSymbolNode);
			}
			_retNode.appendChild(_atkdeftypeNode);
		}
		_retNode.appendChild(_scaleNode);


		return _retNode;
	}

	/**
	 * skillDetailを引数にして、特技属性色のシンボル要素を作成して返す
	 * デバフ時は undefinde だったかも..？
	 *  */
	_createSkillColorSymbolNode(_skillDetail){
		if(!_skillDetail){	console.log("デバフ判定"); return;	}
			
	//	console.log(skillDetail);
		let _baseNode = document.createElement("div");
		_baseNode.className = "skill_panel_type_icon";
		
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
		
		let _sizeArr = [ 0 , 9 , 9 , 7];
	//	console.log(_colorTypeCount , _parentElm.childNodes);
		//要素数に応じて縦幅を調節
	//	var _iconHeight = 25 / (_colorTypeCount);
		for(var t=0; t<_baseNode.childNodes.length; t++){
		//	console.log(_parentElm.childNodes[t]);
			_baseNode.childNodes[t].style.width = _sizeArr[_colorTypeCount]+"px";
			_baseNode.childNodes[t].style.height = _sizeArr[_colorTypeCount]+"px";
		}
		return _baseNode;
	}

	/** アイドルのサムネから得たハッシュ配列を返す
	 * 失敗すれば 空の配列
	 */
	_getIdolThumbnailHashArray(){
		let _retHashArr = [];
		let _enemyNode = document.querySelector("div.enemy_deck");
		if(!_enemyNode){
			console.warn("missing .enemy_deck Element");
			return _retHashArr;
		}
		let _imgNodes = _enemyNode.querySelectorAll("ul > li > img");
		if(_imgNodes.length == 0){
			console.warn("missing img Elements");
			return _retHashArr;
		}

		//nodelist展開
		[..._imgNodes].forEach((e , _index)=>{
			let _datasetHash = e.dataset["hash"];
			if(_datasetHash){
				_retHashArr.push({hash:_datasetHash , node:e});

			}
		});
		return _retHashArr;
	}

	/** サーバーに対して、そのindex (this.getHashArray で保有済)の
	 * ハッシュに対応するアイドル情報を再帰方式で取得しに行く
	 * indexがlengthを超過時に再帰処理は終了。
	 * @param {*} _hashArrayIndex 
	 */
	_requestServerData(_hashArrayIndex){

		if(this.getHashObjectArray.length <= _hashArrayIndex){
	//		console.log(this.getHashObjectArray.length , "<",  _hashIndex);
			//再帰終了時(完了時)に、アタッチ系メソッドを実行
			console.log("アイドル情報の取得終了...");
			this._attachThumbnailNodeIdolData();
			return;
		}

		let _hashStr = this.getHashObjectArray[_hashArrayIndex]["hash"];
		let _url = "http://mkt.packetroom.net/idoldata/?hash="+_hashStr;

		let _postObj = {hash:_hashStr};

		fetch(_url).then((res) =>{
			if(res.ok){
				return res.text();
			}
		}).then((text)=>{
			let _chainObj = undefined;
			try{
		//		console.log(_hashIndex , text , _hashStr);
				_chainObj = JSON.parse(text);
			}catch(e){
				console.error(e);
			}
			return _chainObj;
		}).then((_chainObj)=>{
			this.getHashObjectArray[ _hashArrayIndex ]["data"] = _chainObj;
			_hashArrayIndex++;
			this._requestServerData(_hashArrayIndex);
		});

	}


}

let idolLiveRoyaleUnitDataClass = new IdolLiveRoyaleUnitDataClass();
