//イベントランキング確認ページで起動するスクリプト

var eventRanking = {};

eventRanking.process = function(){
	
	if(urlCheck('event_ranking%2Franking_top%3F')){
		this.setProductionMemberBtn();
	}
	else if(urlCheck('%2Fevent_ranking%2Franking_for_user%2F')){
		this.addRankingNumberLinkUrl();
		this.addPointCopyevent();
	}
	else if(urlCheck('event_ranking%2Franking_for_production')){
		this.addPointCopyevent();
		
		//プレチャレ処理
		//let premiereChallenge = new PremiereChallengeClass();
		//premiereChallenge.productionSearchFillter();

	//	this.searchDefine = getOption("event_ranking_production_object");
	//	console.log(this.searchDefine);
	/*
		if(typeof(this.searchDefine) === "object"){
			if(this.panelSetup()){
				this.productionSearchFillter();	
			}
		}else{
			console.error("event_ranking_production_object の取得に失敗");
		}
		*/
	}
	
	
	
};

eventRanking.event_id = (function(){
	var _retNum = null;
	var _matchArr = location.href.match(/[%3F|%26]event_id%3D([0-9]{1,})/);
	if(_matchArr){
	//	console.log(_matchArr);
		_retNum = parseInt(_matchArr[1] , 10);
	}else{
		console.error("event_id取得に失敗");
	}
	return _retNum;
})();

//画面内のDOMを回して、順位の数値をリンク化		first_load.jsから呼ばれる
eventRanking.addRankingNumberLinkUrl = function(){
	var _spanRedElms = document.querySelectorAll("#top > section > table > tbody > tr > td >span.red");
//	console.log(_spanRedElms);
	for(var n=0; n<_spanRedElms.length; n++){
		var _linkElm = document.createElement("a");
		var _fixNumStr = _spanRedElms[n].textContent.replace(",","");
		var _number = parseInt(_fixNumStr , 10) - 8;	//原則-8
		if(_number < -3){	//最高ランキング系は一律URL固定
			_linkElm.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_ranking%2Franking_for_user%2F%3Fevent_id%3D"+eventRanking.event_id;
		}else{
			_linkElm.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_ranking%2Franking_for_user%2F0%2F"+(_number)+"%3Fnext%3D1%26event_id%3D"+eventRanking.event_id;
		}
	//	console.log(_number);
		var _linkParentElm = _spanRedElms[n].parentNode;
		_linkParentElm.insertBefore(_linkElm , _linkParentElm.firstChild);
		_linkElm.appendChild(_spanRedElms[n]);
		
	}
};

//特定のDOMを足掛かりにして、プロ内順位ボタンをDOMに仕込む
eventRanking.setProductionMemberBtn = function(){
	var _setURL = this.getProductionMemberURL();
	if(_setURL){
		var _areaBtnCommonElms = document.getElementsByClassName("area-btn-common");
		if(_areaBtnCommonElms.length > 0){
			var _markElm = _areaBtnCommonElms[_areaBtnCommonElms.length-1];	
			//作成
			var _setLink = document.createElement("a");
			_setLink.href = _setURL;
			_setLink.textContent = "プロ内順位";
			_setLink.className = "btn_normal_line_2 m-Cnt";
			_markElm.parentNode.insertBefore(_setLink ,_markElm.nextSibling);
		}else{
			console.warn("プロ内順位の要素付与に失敗");
		}
		
	}
	
	
};

//DOMから個人順位を得て、プロダクション内順位を示すURLを返す
eventRanking.getProductionMemberURL = function(){
	var _links = document.links;
	for(var _n=0; _n<_links.length; _n++){
		var _href = _links[_n].href;
		if(_href.indexOf("ranking_for_user%2F") != -1){
			var _setURL = _href.replace("ranking_for_user%2F" , "ranking_for_user%2F5");	//2018/04/11
		//	console.log(_setURL);
			return _setURL;
		}
	}
	
};

//イベントポイントのテキストノードを抜き出してクリックイベントを貼る	first_load.jsから呼ばれる
eventRanking.addPointCopyevent = function(){
	
	var _tdElms = document.querySelectorAll("#top > section > table > tbody > tr > td:nth-of-type(3)");

	for(var n=0; n<_tdElms.length; n++){
//		console.log(_tdElms[n]);
		var _td = _tdElms[n];
		for(var t=0; t<_td.childNodes.length; t++){
			//ターゲットがテキストノードかつ、 , が含まれる
			var _child = _td.childNodes[t];
			if(_child.nodeName == "#text" && _child.nodeValue.indexOf(",")!=-1){
				var _setNewElement = document.createElement("span");
				_setNewElement.textContent = (_child.nodeValue.replace("\n",""));
				_setNewElement.className = "mkt_event_point_cpoy_area";
				_setNewElement.title = "Point Copy to ClipBoard";
				_td.replaceChild(_setNewElement , _child);
				_setNewElement.addEventListener("click",eventRanking.eventPointCopy,false);
				break;
			}
		}
	}
};


eventRanking.Nodes = {
	baseArea:null
};


//ランキングページに付与するプレチャレ用パネル 成功すればtrue
eventRanking.panelSetup = function(){
	
	let _targetElm = document.querySelector("section >form:nth-of-type(2)");
	if(_targetElm){
		
		let _baseNode = document.createElement("div");
		_baseNode.id = "mkt_pc_base_area";
		_baseNode.hidden = true;
		//
		let _moreBtnBase = document.createElement("div");
			_moreBtnBase.className = "detailArea type_02 m-Top10 m-Btm20";
			_moreBtnBase.style.padding = "0px";
			let _moreBtnLink = document.createElement("span");
			_moreBtnLink.href = "#";
			_moreBtnLink.id = "js_btn_more";
			_moreBtnLink.className = "detailArea_more_link m-Top8 detail_accordion _alone";
			_moreBtnLink.textContent = "Premiere Challenge Control Panel";
			_moreBtnLink.style.cursor = "pointer";
			_moreBtnLink.dataset.title = "プレチャレ用";
			//ハンドル
			_moreBtnLink.addEventListener("click",function(e){
				console.log(e.target);
				eventRanking.Nodes.baseArea.hidden = !eventRanking.Nodes.baseArea.hidden;
			},false);
			
			let _jsMoreContents = document.createElement("div");
			_jsMoreContents.style.width = "300px";
			_jsMoreContents.textContent = "testaa";
			_jsMoreContents.hidden = 1;
			
			_moreBtnBase.appendChild(_jsMoreContents);
			_moreBtnBase.appendChild(_moreBtnLink);
		
		
		let _moreContent = document.createElement("div");
		_moreContent.className = "js_more_contents";
		
		
		//▼テキストエリア生成
		let _textArea = document.createElement("textarea");
		_textArea.rows = 27;
		_textArea.wrap = "off";
		_textArea.value = JSON.stringify(eventRanking.searchDefine , null , " ");

		_textArea.addEventListener("input",function(e){
			try{
				JSON.parse(e.target.value);
				e.target.style.backgroundColor = "white";
				saveOption("event_ranking_production_object", JSON.parse(e.target.value));
			}catch(er){
				e.target.style.backgroundColor = "#FFE0E0";
			}
		},false);
		//▲テキストエリア生成
	

		_baseNode.appendChild(_textArea);
		this.Nodes.baseArea = _baseNode;
		
		_targetElm.parentNode.appendChild(_moreBtnBase);
		_targetElm.parentNode.appendChild(_baseNode);
		
		return true;
	}else{
		console.error("パネルのセットアップに失敗しました");
	}
	
	return false;
	
};


eventRanking.eventPointCopy = function(e){
//	BackgroundNotification("idsave");
	ClipBoardCopy(e.target.textContent);	//first_load.js
};


class PremiereChallengeClass{

	constructor(){

		//旧・backgroundの "event_ranking_production_object"
		this.defineObj = {
			"WONDERFUL":{
				"style":"background-color:#FF90A0;color:#FFF5F5;",
				"production":{
					"285596": "エターナルミーク",
					"416620": "ブルーバード",
					"352895": "￥ちひろペロだくしょん￥",
					"309761": "たのしいようちえん",
					"447254": "喫茶きらりん2号店",
					"463575": "安心警備保障",
					"240115": "Color of Happiness!!",
				}
			},
			"PARTY":{
				"style":"background-color:#F5F5FF;color:#303050;border:2px solid #0055FF;",
				"production":{
		
					"176": "らっき～☆すた～♪",
					"468669": "闇聖典マビノギオン",
					"255579": "Do-Dai",
					"539640": "Snowdrop",
					"681882": "take・∀・chance",
					"373199": "走れっ！イベント少女",
				},
			},
			"Smile":{
				"style":"background-color:white;color:#2050E0;",
				"production":{
					"762495": "24#とぅえんてぃふぉー",
					"787501": "m@gic hour",
					"153486": "(株) TNPﾌﾟﾛﾀﾞｸｼｮﾝ",
					"379717": "ベーコンタオル",
					"361212": "SHIBAR'S U・ω・U",
					"324711": "Golden Familiar",
				}
			},
			"Serendipity":{
				"style":"background-color:#E0FFE0;color:#806030;border:3px solid white;",
				"production":{
					"681883":"モバスク♪",
					"709847":"ロープレ・ガール!!",
					"928523":"M.C.Mプロダクション",
					"484890":"スイーツデリカ♪ガレット・ブルトンヌ部",
					"921544":"俺的プロダクション",
					"923489":"プロダクションBookmprk",
				}
			},
		};
		
	}


	/** そのプロダクションIDに関連するオブジェクトを得る
	 * マッチしない場合は undefined
	 */
	getProductionObj(_id){

		let _defineObj = this.defineObj;
		let _returnObj;
		for(let _key in _defineObj){
			let _proObj = _defineObj[_key]["production"];
			for(let _proId in _proObj){
			//	console.log(_proId);
				if(_proId == _id){
					_returnObj = {};
					_returnObj["reague"] = _key;
					_returnObj["name"] = _proObj[_proId];
					_returnObj["style"] =  _defineObj[_key]["style"];
				//	console.log("ID一致" , _proId);
					break;
				}
			}
			
		}
		return _returnObj;
	}

	productionSearchFillter(){
		//プロ要素を取得して、回して、一致したものをアップ
		let _listElms = document.querySelectorAll("section > table > tbody > tr > td:nth-of-type(3)");

		[..._listElms].forEach(_elm => {

			let _name = _elm.querySelector("a").textContent;
			let _url = _elm.querySelector("a").href;
			let _proID = parseInt(_url.match(/knights_id%3D([0-9]+)%/)[1]);
			
			//let _rank = parseInt(_elm.querySelector("span.red").textContent);
			//let _pLv = parseInt(_elm.querySelector("span.blue").nextSibling.textContent);
			//let _pRank = _elm.querySelector("span.blue:nth-of-type(3)").nextSibling.textContent;
			let _point = _elm.querySelector("span.blue:nth-of-type(4)").nextSibling.textContent;
			_point = parseInt(_point.replace(/\n|,/g,""));
			
		//	console.log(_name , "ID" , _proID , _rank , _pLv , _pRank , "pt" , _point);
			
			let _proObj = this.getProductionObj( _proID );
			if(_proObj){
			//	console.log("match!" , _proObj);
				let _reagueNode = document.createElement("span");
				
				_reagueNode.setAttribute("style",  _proObj["style"]);
				_reagueNode.style.color = _proObj["fontcolor"];
				_reagueNode.style.display = "block";
				_reagueNode.textContent = "★" + _proObj["reague"] + "リーグ";

				_elm.insertBefore(_reagueNode , _elm.firstChild);

				_elm.style.backgroundColor = "#550000";
				_elm.title = _proObj["name"];
			}

		});
		
	};

}






