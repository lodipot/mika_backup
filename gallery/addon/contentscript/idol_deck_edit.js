//所属アイドル一覧、フロントメンバー攻守編成のページ上部に色々ボタンを増やす
//所属アイドル個別ページ(プロフィール的なアレ)の移籍を非表示 & 親愛UP演出確認ボタンを設置
/**
 * %2Fidolmaster%2Fdeck%2F とかそのあたりの(イベント外)フロントメンバー編成で主に呼ばれる？
 */
class MainDeckEditClass{

	constructor(){

	}

	/**
	 * ボタンとそれをまとめたノードを内部で生成して返す
	 * 使ってない。
	 */
	generateFrontMemberEditBtnPanelNode(){
		const _baseNode = document.createElement("div");
		_baseNode.style.textAlign = "center";
		_baseNode.className = "tab_common-large";	//公式依存
		_baseNode.classList.add("m-top10");

		const _defObjArray = [
			{
				"text" : "攻編成" ,
				"match_url" : "%3Ftype%3D0%26did%3D1" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%2F0%3Ftype%3D0%26did%3D1" , 
			},
			{
				"text" : "攻+追加" ,
				"match_url" : "%3Fno%3D1%26type%3D0" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card%3Fno%3D1%26type%3D0" , 
			},
			{
				"text" : "守+追加" ,
				"match_url" : "%3Fno%3D1%26type%3D1" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card%3Fno%3D1%26type%3D1" , 
			},
			{
				"text" : "守編成" ,
				"match_url" : "%3Ftype%3D1%26did%3D1" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%2F1%3Ftype%3D1%26did%3D1" , 
			},
		];

		_defObjArray.forEach(_e=>{
			var _link = document.createElement("a");
			_link.href = _e["set_url"];
			_link.textContent = _e["text"];
			_link.classList.add("tab_line_4");
			_link.classList.add("tab_text");
			if(location.href.includes(_e["match_url"])){
				_link.classList.add("selected");
			}
			_baseNode.appendChild(_link);
		});

		return _baseNode;
	}

	/**
	 * 攻守メンバーボタンを2つ含んだ操作パネルノードを生成して返す
	 */
	generateFrontMemberAddBtnPanelNode(){

		const _baseNode = document.createElement("div");
		_baseNode.classList.add("area-btn-common");
		_baseNode.classList.add("_base-width");

		const _defObjArray = [
			{
				"text" : "攻フロント追加" ,
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card%3Fno%3D1%26type%3D0" , 
			},
			{
				"text" : "守フロント追加" ,
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card%3Fno%3D1%26type%3D1" , 
			},
		];

		_defObjArray.forEach(_e=>{
			var _link = document.createElement("a");
			_link.href = _e["set_url"];
			_link.textContent = _e["text"];
			_link.style.fontSize = "12px";
			_link.classList.add("btn_decision_line_2");
			_baseNode.appendChild(_link);
		});

		return _baseNode;

	}

	/**
	 * 公式フロントメンバー編成ページにある 攻編成 , 守編成 タブを再現したノードを生成して返す
	 * 使ってない。
	 */
	generatePageSelectTabPanelNode(){
		const _baseNode = document.createElement("div");
		_baseNode.style.textAlign = "center";
		_baseNode.className = "tab_common-large";	//公式依存
		_baseNode.classList.add("m-top10");

		const _defObjArray = [
			{
				"text" : "攻編成" ,
				"match_url" : "%3Ftype%3D0%26did%3D1" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%2F0%3Ftype%3D0%26did%3D1" , 
			},
			{
				"text" : "守編成" ,
				"match_url" : "%3Ftype%3D1%26did%3D1" , 
				"set_url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%2F1%3Ftype%3D1%26did%3D1" , 
			},
		];

		_defObjArray.forEach(_e=>{
			var _link = document.createElement("a");
			_link.href = _e["set_url"];
			_link.textContent = _e["text"];
			_link.classList.add("tab_line_2");
			_link.classList.add("tab_text");
			if(location.href.includes(_e["match_url"])){
				_link.classList.add("selected");
			}
			_baseNode.appendChild(_link);
		});

		return _baseNode;
	}
}


function mainfunc_deckedit(mainElm){
	console.log("MKT:mainfunc_deckedit");

	if(mainElm){

		/**
		 * 所属アイドルの縦長個別ページ
		 */
		if(location.href.indexOf("idolmaster%2Fcard_list%2Fdesc") != -1){
			subfunc_idoloptionbtnedit();
			return;
		}

		/**
		 * @type MainDeckEditClass
		 */
		const _mainDeckEditInstance = new MainDeckEditClass();

		const _newAddBtnPanelNode = _mainDeckEditInstance.generateFrontMemberAddBtnPanelNode();

		//フロントメンバー変更画面で無い場合
		if(location.href.indexOf("deck_modify_card") == -1){

			//攻編成・守編成の画面に２つボタンを追加させる
			if(location.href.indexOf("deck_edit_top") != -1){
				console.log("編成判定");
				const _markerNode = mainElm.querySelector("header");
				if(_markerNode){
					_markerNode.classList.add("m-Top12");
					_newAddBtnPanelNode.classList.add("m-Btm5");
					_markerNode.appendChild(_newAddBtnPanelNode);
				}
			}

		}
	}

}


/**
 * idolmaster%2Fcard_list%2Fdesc のURLの時だけ上の関数から呼ばれる。
 * 所属アイドルの縦長個別ページに、フリトレと特別移籍のボタンをつけるだけ
 */
function subfunc_idoloptionbtnedit(){
	
	const _markerNode = document.querySelector("section.t-Cnt > div.area-btn-common");
	if(_markerNode){
		const _newArea = document.createElement("div");
		_newArea.classList.add("area-btn-common");
		_newArea.classList.add("_base-width");
		_newArea.classList.add("m-Btm8");
		const _setLink = document.createElement("a");
		//	http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_list%2Fdesc%2F87814
		//	http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_list%2Fdesc%2F87814%3Fl_frm%3DCard_list_1%26rnd%3D437938889
		//	http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fauction%2Fexhibit_select%3Fs%3D87814%26l_frm%3Dauction_1%26rnd%3D718378230
		_setLink.href = location.href.replace("card_list%2Fdesc%2F","auction%2Fexhibit_select%3Fs%3D");
		_setLink.className = "btn_normal_line_2";
		_setLink.textContent = "フリトレ出品";
		_newArea.appendChild(_setLink);
		
		const _materialLink = document.createElement("a");
		_materialLink.href = location.href.replace("card_list%2Fdesc%2F","auction%2Fexhibit_select%3Fs%3D");
		_materialLink.className = "btn_normal_line_2";
		_materialLink.textContent = "特別移籍画面";
		_newArea.appendChild(_materialLink);
		
		_markerNode.parentNode.appendChild(_newArea);
	}
	else{
		console.log("出品,特別移籍ボタンの設置に失敗");
	}

}


