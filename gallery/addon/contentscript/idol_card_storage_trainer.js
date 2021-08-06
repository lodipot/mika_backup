//トレーナの入室/呼戻の画面を弄るだけ	first_load.js から呼ばれる

let trainerLayout = {}


trainerLayout.Process = () =>{
	//..が、トレーナー呼び出し画面では別途レイアウト変更処理を行う
	if(urlCheck("trainer_card_storage%2Fpop_index")){
		trainerLayout.ListPopCustom();
	}
	else if(urlCheck("trainer_card_storage%2Fpush_index")){
		trainerLayout.ListPushCustom();
	}
}

//呼び出し処理
trainerLayout.ListPopCustom = () =>{

	let _setBtnElm = document.createElement("div");
	//_setBtnElm.className = "btn_important_line_1 m-Cnt m-Btm12";
	//_setBtnElm.className = "btn_other_l m-Cnt m-Btm12";	// width: 280px; のcssが適用されている手ごろなクラス名
	_setBtnElm.className = "btn_gray t-Cnt m-Btm12";
	
	_setBtnElm.style.display = "block";
	_setBtnElm.style.cursor = "pointer";
	_setBtnElm.textContent = "即時トレーナーの最大呼出";
	console.log(_setBtnElm);
	let _targetMarkNode = document.querySelector(".area-frame_common._hd_blue");
	if(!_targetMarkNode){
		console.warn("対象ノードが見つかりません");
		return;
	}	
	
	_targetMarkNode.parentNode.insertBefore(_setBtnElm , _targetMarkNode);
	
	_setBtnElm.addEventListener("click",function(){
		let _targetSelectElm = document.querySelector(".area-frame_wrap > form > div.area-btn-common > select:last-child > option:last-child");
		if(_targetSelectElm){
			_targetSelectElm.selected = "selected";
			let _submitBtnNode = document.querySelector('.area-frame_wrap > form > label > input[type="submit"]');
			if(!_submitBtnNode){
				console.warn("missing submit Node");
				return;
			}
			_submitBtnNode.click();
		}else{
			console.warn("対象の option:last-child が見つかりません");
		}
	},false);

}

//入室処理
trainerLayout.ListPushCustom = () =>{
	
	let _setBtnElm = document.createElement("div");
	//_setBtnElm.className = "btn_important_line_1 m-Cnt m-Btm12";
	_setBtnElm.className = "btn_gray t-Cnt m-Btm12";

	
	_setBtnElm.style.display = "block";
	_setBtnElm.style.cursor = "pointer";
	_setBtnElm.textContent = "即時ページ内トレーナーの全入室";
	
	let _targetMarkNode = document.querySelector(".area-frame_common._hd_blue");
	if(!_targetMarkNode){
		console.warn("対象ノードが見つかりません");
		return;
	}	
	
	_targetMarkNode.parentNode.insertBefore(_setBtnElm , _targetMarkNode);
	
	_setBtnElm.addEventListener("click",function(){
		let _checkNodes = document.querySelectorAll("div.m-Btm5 > input.chkbox");
		
		for(var n=0; n<_checkNodes.length; ++n){
			console.log(_checkNodes[n]);
			if(_checkNodes[n]){
				_checkNodes[n].click();
			}
		}
		let _submitBtnNode = document.getElementById("push_all");
			if(!_submitBtnNode){
				console.warn("missing submit Node");
				return;
			}
		_submitBtnNode.click();

	},false);
	
}