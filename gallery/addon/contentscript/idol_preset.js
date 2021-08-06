//指定したアイドルがいるかどうかをチェックするスクリプト
//女子寮の入寮or呼出のURLで実行される

function mainfunc_idolpreset(mainElm){

	//女子寮関係のURLでなければ処理はさせない
	if(urlCheck('idolmaster%2Fcard_storage%2F') == false){
		return;
	}

	if(mainElm){
		//入寮か呼出のページ
		if(location.href.indexOf("card_storage%2Fpush_index") != -1	|| location.href.indexOf("card_storage%2Fpop_index") != -1){
			//▼入寮させる or 呼び出すアイドルのページを解析、アイドル名の要素をすべて取得する
		//	let _titleNameNodes = document.querySelectorAll("section > form > div.idolStatus > label > h4.nameArea > div.name");
			let _titleNameNodes = document.querySelectorAll(".area_card_status > .area_card_name > .card_name");
			if(_titleNameNodes.length <= 0){
				console.log("MKT:×アイドル名が取得できませんでした");
				return;
			}
			//▼【！】新イベントプリセット
			let eps = new eventPresetStorage();
			eps.mainProcess();
			
			subfunc_allCheckAddEvent(mainElm);
		}

	}

}

//▼全てチェックを付ける/外すにイベントを仕込むだけ。単体で動く
function subfunc_allCheckAddEvent(mainElm){
	let _allCheckElm = mainElm.querySelector("a#card_lump_all");
	if(_allCheckElm){
		_allCheckElm.addEventListener("click",function(){
			let _idolListElms = mainElm.querySelectorAll("div.presetchecklist");
			let _flag = _allCheckElm.classList.contains("btn_cancel_line_2");
			for(var i= 0; i<_idolListElms.length; i++){
			//	console.log(_idolListElms[i]);
				if(_flag){
					_idolListElms[i].classList.remove("active");
				}else{
					_idolListElms[i].classList.add("active");
				}
			}
		},false);
	}else{
		console.log("a#card_lump_allの取得に失敗");
	}

}

