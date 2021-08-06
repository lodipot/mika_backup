/**
 * ぷちデレラのレイアウト変更
 */
window.petit = {};

petit.router = function(){
	//UAによってURLが異なる？ 右側で呼ばれるケースもある(こっちが多い？)
	if(urlCheck("%2Fpetit_cg%3Fview_page%3D") || urlCheck("%2Fpetit_cg%3Fl")){
		petit.setLayoutMarker();
		petit.changeLayoutScrollBar();
	}
	
	if(urlCheck("petit_cg%2Faccessory_list") || urlCheck("petit_cg%2Fstorage_accessory_list")){
	//	petit.sendBackgroundMessage();
		petit.changeListLayoutProcess();
		petit.setPowerStateForm();
	}
	else if(urlCheck("event_fashion%2Fequipment_edit_top")){
		
		petit.changeListEventLayoutProcess();
		petit.setPowerStateForm();
	}
	else if(urlCheck("%2Fequipment_modify_idol")){
		
		petit.changeListEventLayoutProcessC();
		petit.setPowerStateForm();
	}
	//開催中イベントのぷち衣装編成
	else if(urlCheck("%2Fequipment_edit_top")){
		petit.changeListEventLayoutProcess();
		petit.setPowerStateForm();
	}
	
	
};

petit.layoutBaseMarkerNode = null;
petit.layoutUpMarkerNode = null;
petit.layoutDownMarkerNode = null;

petit.stretchTargetNode = null;

petit.addHeight = function(_num){

	const _stretch_in_blockNode = document.querySelector("#profile_coordinate > .in_block.no-border");
	const _stretch_item_listNode = document.querySelector(".item_list#jsCoordinateList");

	if(!_stretch_in_blockNode || !_stretch_item_listNode){
		return;
	}

	//console.log(_stretch_in_blockNode);
	//console.log(_stretch_item_listNode);
	
	const _origAH = parseInt(_stretch_in_blockNode.clientHeight || _stretch_in_blockNode.style.height.replace("px",""),10);
	const _origBH = parseInt(_stretch_item_listNode.clientHeight || _stretch_item_listNode.style.height.replace("px",""),10);
	//var _origH = parseInt(petit.stretchTargetNode.clientHeight || petit.stretchTargetNode.style.height.replace("px",""),10);
	
	if(_origAH + _num > 200){
		_stretch_in_blockNode.style.height = (_origAH + _num) + "px";
		_stretch_item_listNode.style.height = (_origBH + _num) + "px";
	}

};

/**
 * ぷちプロフ(コーディネート変更)ページにて、衣装系一覧の表示欄で隠されているスクロールバーを強制的に表示させる
 * ある領域を強制的に width 固定値にすることで、隠れていたスクロールバーを表示できる
 */
petit.changeLayoutScrollBar = ()=>{
	const _areaA = document.querySelector("#profile_coordinate > .in_block.no-border");
	if(_areaA){
		_areaA.style.width = "300px";
	}

};

petit.setLayoutMarker = function(){
	
	petit.stretchTargetNode = document.querySelector("#profile_coordinate > div > .item_list");
	if(petit.stretchTargetNode){
		//console.log("petit marker set start");
		this.layoutBaseMarkerNode = document.createElement("div");
		this.layoutBaseMarkerNode.className = "mkt_petit_layout_marker_base";
		this.layoutBaseMarkerNode.style.zIndex = 1;
		
		this.layoutUpMarkerNode = document.createElement("div");
		this.layoutDownMarkerNode = document.createElement("div");
		this.layoutUpMarkerNode.className = "mkt_petit_layout_up_marker";
		this.layoutDownMarkerNode.className = "mkt_petit_layout_down_marker";
		this.layoutUpMarkerNode.addEventListener("click",function(){
			petit.addHeight(-150);
		},false);
		this.layoutDownMarkerNode.addEventListener("click",function(){
			petit.addHeight(150);
		},false);
		
		this.layoutBaseMarkerNode.appendChild(this.layoutUpMarkerNode);
		this.layoutBaseMarkerNode.appendChild(this.layoutDownMarkerNode);
		
		petit.stretchTargetNode.parentNode.insertBefore(this.layoutBaseMarkerNode , petit.stretchTargetNode);
		//console.log("petit marker set complete!");
	}else{
		console.log("setLayoutMarker 処理に失敗");
	}

};

//押されるとレイアウトオプションをトグルで切り替えてリロード
petit.handleEventLayoutCheck = function(e){
	var _flag = getOption("layout_petit_accessory_list_param_check");
	saveOption("layout_petit_accessory_list_param_check" , !_flag );
	location.reload();
};

//通常ぷちの衣装リスト
petit.changeListLayoutProcess = function(){
	
	var _static_area = document.querySelector(".base_back > .jsOnBtn");
	if(_static_area){
		var _layoutChangeBtn = document.createElement("button");
		_layoutChangeBtn.textContent = "パラメータ一括表示の切替(やっつけ)";
		_layoutChangeBtn.style.marginTop = "6px";
		_static_area.insertBefore(_layoutChangeBtn , _static_area.firstChild);
		_layoutChangeBtn.onclick = petit.handleEventLayoutCheck;
	}
	
	if(getOption("layout_petit_accessory_list_param_check")){
		var _jsItemList = document.querySelectorAll("a.jsItemList");
		for(var n=0;n<_jsItemList.length; n++){
			_jsItemList[n].style.height = "155px";
		}
		var _palamCls = document.getElementsByClassName("palamCls");
		for(var n=0;n<_palamCls.length; n++){
			_palamCls[n].style.display = "block";
		}
	}
};


//ぷちコレ衣装変更元(3*3)
//	%2Fidolmaster%2Fevent_fashion%2Fequipment_edit_top
petit.changeListEventLayoutProcess = function(){
	console.log("changeListEventLayoutProcess");
	var _marker = document.querySelector(".jsPopWindow > .in_block + .response_area > a");
	if(_marker){
		var _layoutChangeBtn = document.createElement("button");
		_layoutChangeBtn.textContent = "パラメータ一括表示の切替(やっつけ)";
		_layoutChangeBtn.style.marginTop = "6px";
		_marker.parentNode.insertBefore(_layoutChangeBtn , _marker.parentNode.firstChild);
		_layoutChangeBtn.onclick = petit.handleEventLayoutCheck;
	}
	
	if(getOption("layout_petit_accessory_list_param_check")){
		
		var _li = document.querySelectorAll(".sub_item_list > ul > li");
		for(var n=0;n<_li.length; n++){
			_li[n].style.height = "140px";
		}
		var active_skill_palam = document.querySelectorAll(".item_data");
		for(var n=0;n<active_skill_palam.length; n++){
			active_skill_palam[n].style.height = "80px";
		}
		var _palamCls = document.querySelectorAll("dl.palamCls");
	//	console.log(_palamCls);
		for(var n=0;n<_palamCls.length; n++){
			_palamCls[n].style.display = "block";
		}
	}
};

//ぷちコレ衣装変更先を選択(3*4)
//	%2Fidolmaster%2Fevent_fashion%2Fequipment_modify_idol
petit.changeListEventLayoutProcessC = function(){
	console.log("changeListEventLayoutProcessC");
	if(getOption("layout_petit_accessory_list_param_check")){
		var active_skill_palam = document.querySelectorAll(".active_skill_palam");

		var _jsItemList = document.querySelectorAll("a.jsConfirmView");
		for(var n=0;n<_jsItemList.length; n++){
			_jsItemList[n].style.height = "155px";
		}
		var _palamCls = document.querySelectorAll("dl.palamCls");
		console.log(_palamCls);
		for(var n=0;n<_palamCls.length; n++){
			_palamCls[n].style.display = "block";
		}
	}
};


//background.jsに衣装データを送信格納(未実装)
petit.sendBackgroundMessage = function(){
	var _type_define = {
		"ｺｽﾁｭｰﾑ":2
		,"ﾍｯﾄﾞｱｸｾｻﾘ":3
		,"ﾊﾝﾄﾞｱｸｾｻﾘ":4
		,"ﾚｯｸﾞｱｸｾｻﾘ":5
	};
	var _sendObject = {};
	var _jsItemLists = document.querySelectorAll(".jsPopUpSelect_btn.jsItemList , a.jsItemList");
	console.log(_jsItemLists);
	for(var n=0; n<_jsItemLists.length; n++){
		var _e = _jsItemLists[n];
		var _obj = {
			"accessory_name":_e.querySelector(".jsItemListPalam_name").value.replace("}","")
			,"accessory_id":parseInt(_e.querySelector(".grade_zoon > img").src.match(/petit_cg%2F([0-9]+)\.png/)[1],10)
			,"rarity":parseInt(_e.querySelector(".jsItemListPalam_rarity").value,10)
			,"param_id":parseInt(_e.querySelector(".jsItemListPalam_id").value,10)	//管理ID
			,"type_id":_type_define[_e.querySelector(".jsItemListPalam_type").value]
			,"skill_effect":_e.querySelector(".jsItemListPalam_effect").value || undefined
			,"evolution":parseInt(_e.querySelector(".jsItemListPalam_evolution").value,10)
			,"vo":parseInt(_e.querySelector(".jsItemListPalam_vo").textContent,10)
			,"da":parseInt(_e.querySelector(".jsItemListPalam_da").textContent,10)
			,"vi":parseInt(_e.querySelector(".jsItemListPalam_vi").textContent,10)
		};
		_obj["total"] = _obj["vo"] + _obj["da"] + _obj["vi"];
		console.log(_obj);
		_sendObject[_obj["param_id"]] = _obj;	//管理IDをキーとする
	}
	//必要なパラメータは accessory_id , evolution , param_id(管理ID) 必要に応じて accessory_name
	
	
	chrome.extension.sendRequest(	{petit: "save" , data:_sendObject}, function(response) { });
	
};

//発揮値書き換え。引数は係数で、特定の要素を穿り出して書き換える。1未満の値は強制的に1とする
petit.setPowerStateRewrite = function(_voC , _daC , _viC){
	let _paremParentNodes = document.getElementsByClassName("active_skill_palam");
	let _selectorStr = "";

//	console.log(_type , _selectorStr , _paremParentNodes);
	
	for(let value of _paremParentNodes){
		let _totalNode = value.querySelector(".jsItemListPalam_total");
		let _voNode = value.querySelector(".jsItemListPalam_vo");
		let _daNode = value.querySelector(".jsItemListPalam_da");
		let _viNode = value.querySelector(".jsItemListPalam_vi");
		
		let _Obj = {	
			"vo":{
				node:_voNode
				,orig:_voNode.dataset.origval
				,c:_voC
			}
			,"da":{
				node:_daNode
				,orig:_daNode.dataset.origval
				,c:_daC
			}
			,"vi":{
				node:_viNode
				,orig:_viNode.dataset.origval
				,c:_viC
			}
		};
		let _totalValue = 0;
		let _isChange = false;
		for(let _n in _Obj){
			let _v = _Obj[_n];
			if(_v["orig"] == undefined){
				_v["node"].dataset.origval = _v["node"].textContent;	//datasetを得られなかった場合は、初回にdataset値確保
				_v["orig"] = _v["node"].textContent;
			}
			if(_v["c"] < 1){ _v["c"] = 1;	}	//1未満は強制的に1
			
			let _setVal = Math.ceil(parseInt(_v["orig"]) * parseFloat(_v["c"]));
			_v["node"].textContent = _setVal;
			_v["node"].title = "+"+(_setVal - _v["node"].dataset.origval);
			if(_v["c"] > 1){
				_isChange = true;
			}
			_v["node"].style.color = (_v["c"] > 1)?"#FF5555":"";
			_totalValue += _setVal;
		}
	//	console.log(_totalValue);
		_totalNode.textContent = _totalValue;
		_totalNode.style.color = (_isChange)?"#FF0000":"";
	}
	
};


//発揮値書き換え用UI追加云々
petit.setPowerStateForm = () =>{
	
	let _targetNode = document.getElementById("jsPalamSwitch");
	if(!_targetNode){	return;	}
	
	
	let _baseNode = document.createElement("span");
	_baseNode.className = "mkt_petit_power_input_area";
	let _defArr = [
		{name:"petit_power_vo_value",title:"vo"}
		,{name:"petit_power_da_value",title:"da"}
		,{name:"petit_power_vi_value",title:"vi"}
	];
	
	for(let _value of _defArr){
		let _input = document.createElement("input");
		_input.value = getOption(_value["name"]) || 1;
		_value["node"] = _input;
		_input.title	= _value["title"] + "倍率";
		_input.type = "number";
		_input.step = 0.01;
		_input.min = 1;
		_input.max = 2;
		//▼リスナ弄って発揮書き換えメソッドを呼ぶカンジ。
		_input.addEventListener("input",function(e){
		//	console.log(e);
			saveOption(_value["name"] , e.target.value);
		//	console.log(_input);
			//▼値書き換え
			petit.setPowerStateRewrite(
				_defArr[0].node.value
				,_defArr[1].node.value
				,_defArr[2].node.value
			);
			
			
		}, false);
		_baseNode.appendChild(_input);
	}
	
//	_targetNode.parentNode.insertBefore(_baseNode , _targetNode);
	_targetNode.parentNode.replaceChild(_baseNode , _targetNode);
	
	//▼値書き換え
	petit.setPowerStateRewrite(
		_defArr[0].node.value
		,_defArr[1].node.value
		,_defArr[2].node.value
	);
//	return _baseNode;
};
