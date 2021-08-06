//▼key操作を監視

document.addEventListener('keydown', function (e) {
		console.log(e.key);
		var codeveiwElm = document.getElementById("codeview");
		if(codeveiwElm){
			codeveiwElm.innerText = e.key;
		}
},false);


document.addEventListener("DOMContentLoaded", function(event) {
	//イベント用プリセットのフォームは、最初に動的に作成させる
	
	let epf = new eventPresetForm();
	epf.generateNodes();
	
	// ローカルストレージを呼び出して、各種input系のフォームに適用させる感じ
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; ++i) {
		var input = inputs[i];
		if (!input.name) continue;
		loadValueToInput(input);
	}
	var inputTexts = document.getElementsByTagName("textarea");
	for (var n = 0; n < inputTexts.length; ++n) {
		var input = inputTexts[n];
		if (!input.name) continue;
		loadValueToInput(input);
	}
	var selects = document.getElementsByTagName("select");
	for (var i = 0; i < selects.length; ++i) {
		loadValueToSelect(selects[i]);
	}

}, false);


//▼DOMのinput系を監視的なイベント的なアレ。変化(change)があればローカルストレージ値を更新もとい保存
document.addEventListener('change', function(e) {
	var value = null;
//	console.log(e.target);
//	console.log(e.target.value);
	if (e.target.type === "checkbox") {
		value = e.target.checked;
	//	console.log(value = e.target.checked);
	}
	else if(e.target === "select-one"){	//<select>
		value = e.target.value;
//		console.log(e.target.value);
	}
	else if (e.target.type === "radio") {
		value = e.target.value;

		//▼アイドルプリセット周り。inputのradioをクリックすると、該当のdivを表示。それ以外をnoneに書き換える
		if(e.target.name === "idolpreset_number"){
			var targetObj =  document.getElementsByClassName("idolpreset_textarea");
			var num = 0;
			for(var n=0; n<targetObj.length; n++){
				num = parseInt(value , 10);
				if(n == num-1){
					targetObj[n].setAttribute("style","display:block;");
				}
				else {
					targetObj[n].setAttribute("style","display:none;");
				}
			}
			//アイドルプリセット名のほう
			var presetNameObj =  document.getElementsByClassName("idolpreset_namearea");
		//	console.log(num);
			for(var n=0; n<presetNameObj.length; n++){
				num = parseInt(value , 10);
				if(n == num-1){
					presetNameObj[n].setAttribute("style","display:block;");
				}
				else {
					presetNameObj[n].setAttribute("style","display:none;");
				}
			}
		}
	}
	else if (e.target.type === "text") {
		value = e.target.value;
		//ターゲットIDならちょっと別挙動
		if(e.target.id == "targetuserid"){
		//	console.log("targetuserid");
			var num = e.target.value.replace(/[^0-9]/,"");	//不正な文字列消しとく
			if(num > 0){
				var url = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fprofile%2Fshow%2F'+num;
				window.open(url);
				return;
			}
		}//ジャンプ処理ここまで
	}
	//その他..というか、<textarea>のやつ
	else {
		
		//▼data-json が指定されていれば、一度変換して正しいか確認する(変換して保存はしない)
		if(e.target.dataset.json){
			try{
				console.log(JSON.parse(e.target.value));
			}catch(e){
				alert("プログラム的な文法として正しくないようです\n設定データへの保存は行われません");
				return;
			}
		}else{
			console.log(e.target);
		}
		value = e.target.value;
	}
	console.log(e.target.name, value , JSON.stringify(value));
	
	
	if(typeof(value) == "object"){
		localStorage.setItem(e.target.name, value);	//最終的にオブジェクトなら素で保存
	}else{
		localStorage.setItem(e.target.name, JSON.stringify(value));	//必ず文字列で保存しなければいけない
	}


}, false);


//▼ getOption("user-agent"); のような体で値を取得する。返す値は false とか 10 とか、そんなかんじ
function getOption(name) {
	var json = localStorage.getItem(name);
//	console.log(name+"要求"+json);
	if (json == null){			// null or undefined ..存在しなかったりする場合は
//		console.log(defaults[name]+"を返します");
//    	return defaults[name];	//デフォルトの値を参照してね
//		alert("キーが無いです");
		return false;
	}
	else {	return JSON.parse(json);	}
}
/*
//▼background.jsにセーブ要求を送る---------------------------
function saveOption(getkey,getvalue){
	console.log("saveOption/セーブ要求["+getkey+"]" , getvalue);
	chrome.extension.sendRequest({
		status:"save",
		key: getkey,		//キー
		value: getvalue	//値
	}, function(){});
}*/

//▼引数に設定されたモノをローカルストレージから呼び出して当てはめていく関数。
//forで実行されるので、何度も呼ばれる
function loadValueToInput(input) {
	chrome.extension.sendRequest({option: input.name}, function(value) {
	//	console.log("ロード" ,input.name, value);
		if (input.type === "checkbox") {
			input.checked = !!value;
		}
		else if (input.type === "radio"){
			if(input.value == value){	// === ではないことに注意
		//		console.log("radioのvalueと合致" , input.value , value);
				input.checked = "checked";
				//▼アイドルプリセットチェックボックスの場合、末尾の文字列を取得して、要素を探す
				if(input.name === "idolpreset_number"){
					var targetObj =  document.querySelectorAll(".idolpreset_textarea");
					var num = 0;
					for(var n=0; n<targetObj.length; n++){
						num = parseInt(value , 10);
					//	console.log(num);
						if(n == num-1){
							targetObj[n].setAttribute("style","display:block;");
						}
						else {
							targetObj[n].setAttribute("style","display:none;");
						}
					}
					//▼プリセット名(使いまわし)
					var _nameAreaElms =  document.querySelectorAll(".idolpreset_namearea");
					for(var n=0; n<_nameAreaElms.length; n++){
						num = parseInt(value , 10);
					//	console.log(num);
						if(n == num-1){
							_nameAreaElms[n].style.display= "block";
						}
						else {
							_nameAreaElms[n].style.display= "none";
						}
					}
				}
			}
		}
		else {
			//▼オブジェクトの場合は、一度ほぐす
			if(typeof(value) === "object"){
				console.log("オブジェクト判定" ,value , input.name);
				input.value = JSON.stringify(value , null , " ");
			}else{
				input.value = value;
			}
		}
	});
}


//▼引数に設定されたモノをローカルストレージから呼び出して当てはめていく関数。
//forで実行されるので、何度も呼ばれる
function loadValueToSelect(select) {
	chrome.extension.sendRequest({option: select.name}, function(value) {
		options = select.getElementsByTagName("option");
		for(var n=0; n<options.length; ++n){
			if(value == options[n].value){
			//	console.log(options[n]);
				options[n].setAttribute("selected","");
			}
		}
	});
}

//カスタムメニュー・イベント等の設定項目divを表示したり非表示にしたり。
document.addEventListener( "click" , function(e){

	// .sectiontitle でしか反応させない
	if(e.target.className == "sectiontitle"){
		selectTabChange(e.target.dataset.tabname);
	}

});

//指定したタブIDの色を変えて、それ以外のIDタブも色を変えなおす。引数はクリックされたタブのtarget.id
function selectTabChange(clickAreaName){

	var AreaElms = document.getElementsByClassName("sectionarea");
	for(var n=0; n<AreaElms.length; n++){
//		console.log(AreaElms[n]);
//		console.log(AreaElms[n].id);
		//▼クリックしたエリアid名と、.sectionareaのid名が一致すれば表示。それ以外は非表示
		if(AreaElms[n].id == clickAreaName){
	//		console.log("表示"+AreaElms[n].id);
			AreaElms[n].setAttribute("style","display:block;");
			//▼(なんとなく)このタイミングでクリックされたタブ名をストレージに保存
			localStorage.setItem("menu_selecttab", JSON.stringify(clickAreaName));
		}
		else {
	//		console.log("非表示"+AreaElms[n].id);
			AreaElms[n].setAttribute("style","display:none;");
		}
	}
	//▼タイトルタブの色を変える
	var TitleElms = document.querySelectorAll(".sectiontitle , .sectiontitleselect");
	for(var n=0; n<TitleElms.length; n++){
		if(TitleElms[n].dataset.tabname == clickAreaName){
			TitleElms[n].className = "sectiontitleselect";
		}
		else {
			TitleElms[n].className = "sectiontitle";
		}
	}
}


var SelectTabID = getOption("menu_selecttab");
if(SelectTabID){
	selectTabChange(SelectTabID);
}


var getExtensionName = getOption("extension_name");
if(getExtensionName){
	var setElm = document.createElement("span");
	setElm.innerText = getExtensionName + " ";
//	setElm.setAttribute("style","color:#55aaff");
	document.querySelector("#version").appendChild(setElm);
}

var getVersion = getOption("version");
if(getVersion){
	var setElm = document.createElement("span");
	setElm.innerText = getVersion;
	setElm.setAttribute("style","color:#55ffaa");
	document.querySelector("#version").appendChild(setElm);
}

var localStorageDeleteBtnElm = document.getElementById("mkt_localstorage_delete");
if(localStorageDeleteBtnElm){
	
	localStorageDeleteBtnElm.addEventListener("click",function(e){
		if(window.confirm('本拡張機能の設定情報を一度全削除します\nカスタムメニュー等の設定もリセットされます\n削除後、一度ブラウザを再起動することで\n初期設定が復元されます\n\n初期化を行いますか？')){
			localStorage.clear();
		//	console.log(localStorage);
			var _message = "設定情報を削除しました\n初期設定を復元させるため、ブラウザを一度再起動させてください";
			_message += "\nまた、カスタムメニューの項目を正しく利用できるよう、\n以下のページを開き、情報を記録させてください";
			_message += "\n\n・女子寮一覧\n・プロダクション\n・プロフィール";
			alert(_message);
		}
	},false);

}

// ラウンド終了タイマーの通知値が変更されたら、backgroundへそのタイマー処理の再起動を掛ける
{
	let _eventRoundTimerInputNode = document.querySelector("[name=event_round_notice_timer_value]");
	if(_eventRoundTimerInputNode){
		_eventRoundTimerInputNode.addEventListener("input",_e => chrome.extension.sendRequest({status:"round_timer_restart"}, function(){}) , false);
	}else{
		console.warn("missing _eventRoundTimerInputNode");
	}
}

//イベントプリセット用のフォームやタブなどの要素を動的に生成するクラス
class eventPresetForm{
	constructor(){
		//定義
		this.keyNameObj = {
			"idolliveroyal_guest":"ﾛﾜｹﾞｽﾄ",
			"idolliveroyal_atk":"ﾛﾜ攻",
			"idolliveroyal_def":"ﾛﾜ守",
			"talkbattleshowteam_atk":"TBS攻",
			"talkbattleshowteam_def":"TBS守",
			"dreamlivefestival":"ﾄﾞﾘﾌ",
			"idolproduce":"ｱｲﾌﾟﾛ",
			"idollivetour":"ツアー",
			"idolchallenge":"ｱｲﾁｬﾚ",
			"idolvariety":"ｱｲﾊﾞﾗ",
			"musicjam":"JAM",
			"deck_edit_atk":"攻編成",
			"deck_edit_def":"守編成",
		}
		this.tabParentNode = document.createElement("div");
		this.textAreaParentNode = document.createElement("div");
	}
	//アクティブなイベントタブ名を取得
	getActivePresetName(){
		return getOption("eventpreset_active_keyname");
	}
	
	//タブノード群を作成
	createTabNodes(_keyObj){
		let _parentNode = this.tabParentNode;
		_parentNode.style.display = "inline-flex";
		_parentNode.style.flexWrap = "wrap";
		let _activeName = this.getActivePresetName();
		for(var n in _keyObj){
			let _Node = document.createElement("span");
			_Node.className = "eventpreset_tab";	//mystyle.css
			_Node.textContent = _keyObj[n];
			_Node.onclick = this.onPresetTabClick.bind(this);
			//記憶されているアクティブタブは色付け
			if(n === _activeName){
				_Node.classList.add("active");
			}
			_Node.dataset.preset_key_name = n;	//タブクリックで利用するdataset
			_parentNode.appendChild(_Node);
		}
		return _parentNode;
	}
	//入力エリア群を作成
	createtextAreaNodes(_keyObj){
		let _parentNode = this.textAreaParentNode;
		for(var n in _keyObj){
			let _activeName = this.getActivePresetName();
			let _Node = document.createElement("textarea");
			_Node.name = ("eventpreset_" + n);	//nameを指定しておくことで、適切に保存されているoption値が入力される
			_Node.textContent = _keyObj[n];
			_Node.className = "presettextarea";
			//記憶されているアクティブタブのみ表示
			if(n === _activeName){
				_Node.style.display = "block";
			}else{
				_Node.style.display = "none";
			}
			_Node.cols = 30;
			_Node.rows = 25;
			_Node.wrap = true;
			_Node.dataset.preset_key_name = n;	//タブクリックで利用するdataset
			_parentNode.appendChild(_Node);
		}
		return _parentNode;
	}
	//タブクリックでのハンドラ (付与時にbind済み)
	onPresetTabClick(e){
		let _keyName = e.target.dataset.preset_key_name;
		if(!_keyName){
			console.error("datasetのpreset_key_nameが得られませんでした");
			return;
		}
		//クリックされたノードと一致するタブノードのみアクティブスタイル化
		this.tabParentNode.childNodes.forEach(function(_node){
			if(_node === e.target){
				_node.classList.add("active");
				//▼(なんとなく)このタイミングでクリックされたタブ名をストレージに保存
				localStorage.setItem("eventpreset_active_keyname", JSON.stringify(_keyName));	//アクティブ時に値を保存
			}else{
				console.log(e.target.dataset.preset_key_name , "を非アクティブ化");
				_node.className = "eventpreset_tab";
			}
		});
		this.textAreaParentNode.childNodes.forEach(function(_node){
			console.log();
			if(_node.dataset["preset_key_name"] === _keyName){
				_node.style.display = "block";
			}else{
				_node.style.display = "none";
			}
		});
		
	}
	
	generateNodes(){
		
		let _secBlockNode = document.createElement("div");
		_secBlockNode.className = "sectionblock";
		_secBlockNode.appendChild(this.createTabNodes(this.keyNameObj));
		_secBlockNode.appendChild(this.createtextAreaNodes(this.keyNameObj));
		
		let _parentAreaNode = document.querySelector("#idolpresetarea , .sectionarea");
		
		//_parentAreaNode.appendChild(_secBlockNode);
		_parentAreaNode.insertBefore(_secBlockNode , _parentAreaNode.firstChild);
		
	}
	
}