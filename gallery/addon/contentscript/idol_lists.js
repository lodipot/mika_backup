//アイドル一覧が存在するページで呼ばれる
//URLに応じてレイアウトを変更したりする

/**
 * 所属アイドルや、フリトレ、寮呼び出し等、アイドルが一覧表示されるページで(大体)呼ばれたり使われるクラス
 * 
 */
class IdolListClass{
	
	constructor(){
		this.pageType = "";
	}

	//メイン処理。
	//軽いルーター処理も兼ねている
	mainProcess(){

		//現在のURLに応じて、pageTypeを決定する

		//所属アイドル(ただし個別ページは除く)
		if(location.href.indexOf("idolmaster%2Fcard_list") != -1 && location.href.indexOf("card_list%2Fdesc") == -1 ){
			this.pageType = "card_list";
		}//所属アイドル移籍
		else if(location.href.indexOf("idolmaster%2Fcard_sale") != -1){
			this.pageType = "card_sale";
		}//フリートレード検索
		else if(location.href.indexOf("auction%2Fsearch_top") != -1){
			this.pageType = "search_top";
			if(!getOption("freetrade_check"))	{
				return;	//機能がOFFなら差し戻し
			}
		}//女子寮・入寮
		else if(location.href.indexOf("card_storage%2Fpush_index") != -1){
			this.pageType = "push_index";
			//サムネバージョン
			if(location.href.match(/push_index%2F[\d]{1,}%2F[\d]{1,}%2F0%2F/)){
				this.pageType = "push_index_compact";
			}
		}//女子寮・呼出
		else if(location.href.indexOf("card_storage%2Fpop_index") != -1){
			this.pageType = "pop_index";
			//サムネバージョン
			if(location.href.match(/pop_index%2F[\d]{1,}%2F[\d]{1,}%2F0%2F/)){
				this.pageType = "pop_index_compact";
			}
		}//編成トップ
		else if(location.href.indexOf("deck%2Fdeck_edit_top") != -1){
			this.pageType = "deck_edit_top";
		}//編成・メンバー選択中(イベントを含む)
		else if(location.href.indexOf("deck_modify_card") != -1){
			this.pageType = "deck_modify_card";
		}//イベント用のユニット？
		else if(location.href.indexOf("%2Fevent_deck_edit") != -1){
			this.pageType = "event_deck_edit";
		}//移籍
		else if(location.href.indexOf("idolmaster%2Fcard_sale") != -1){
			this.pageType = "card_sale";
		}
		//レッスン
		else if(location.href.indexOf("card_str%2Ftrainer_lesson") != -1){//} || location.href.indexOf("%2Fcard_str%2Fbase_card%") != -1){
			this.pageType = "card_str";
			//▼外部関数
			subfunc_card_str_trainer_layout(mainElm);
		}
		else {
			console.log("MKT:pageTypeが設定できませんでした");
			return;
		}
	
		//アイドルリストコピペ用
		let _idolListObjectArray = [];

		//▼表記弄りここから
		/** そのページに含まれる全員分のアイドルステータスの要素を取得
		 * 	NodeListではなくArrayで返す(似てるけど)
		 */
		let _unEvent = true;
		let _idolNodeList = document.querySelectorAll("div.area_card_status");	//一般
		if(_idolNodeList.length == 0){
			//取れない場合はイベ編成で、クソ面倒なレイアウトも変更させない
			_idolNodeList = document.querySelectorAll("div.idolStatus");
			_unEvent = false;
		}

		//console.log(_idolNodeList);
		
		//展開してステータスをノードからパース。一般ならレイアウトも変更
		[..._idolNodeList].forEach(_elm => {
			//ステータスを一度パース
			let _paramObj;
			if(_unEvent){
				_paramObj = this.__parseStatsuParamFromNode(_elm);	
			}else{
				_paramObj = this.__parseStatsuParamFromEventNode(_elm);
			}

			if(_paramObj){
				_idolListObjectArray.push( _paramObj );
				//	console.log(_paramObj);
				if(_unEvent){
					this.changeIdolStatsuLayout(_elm , _paramObj);
				}
			}


		});


		//アイドル名リストのコピペボタン設置
		if(this.pageType == "card_list" || this.pageType == "event_deck_edit"){
			this.__appendIdolNameListCopyBtn( _idolListObjectArray );
		}


	}


	/** 取得したアイドルのステータスノードをバラしたりパースして、
	 * 一度オブジェクトにまとめたものを返す。
	 * 取れそうになければ undefined を返し、正常に取れれば例外が起きずオブジェクトを返す
	 * @param {*} _idolStatusElm 
	 */
	__parseStatsuParamFromNode(_idolStatusElm){

		let _status = {	};

		//console.log(_idolStatusElm);
		//アイドル名
		const _cardNameNode = _idolStatusElm.querySelector(".card_name");
		if(!_cardNameNode){
			return;
		}
		_status["name"] = _cardNameNode.textContent;

		//属性,レアリティ
		let _typeElm = _idolStatusElm.querySelector(".card_attr");
		let _rarityElm = _idolStatusElm.querySelector(".card_rarity");
		_status["type"] = parseInt(_typeElm.className.substring("card_attr att_".length) , 10);	//1Cu 2Co 3Pa
		_status["rare"] = parseInt(_rarityElm.className.substring("card_rarity r_".length) ,10);	//1N 2N+ 3R 4R+ 5SR 6SR+
		
		//ロック是非
		_status["lock"] = _idolStatusElm.querySelector(".lock")?true:false;

		//パラメータ。ただしイベント編成の簡易表示だと存在しなくなるため、
		// lvElmが得られなければ、以降は取得を省略する
		let _lvElm = _idolStatusElm.querySelector(".status_headline.lv");
		if(_lvElm){
			_status["cost"] = parseInt(_idolStatusElm.querySelector(".cost + .status_value").textContent , 10);
			_status["atk"] = parseInt(_idolStatusElm.querySelector(".att + .status_value").textContent , 10);
			_status["def"] = parseInt(_idolStatusElm.querySelector(".def + .status_value").textContent , 10);
			//_status["now_grow"] = parseInt(_idolStatusElm.querySelector("div.data_list > div.wrap > div.grow+div.pr").textContent , 10);
			//_status["lv_now"] = parseInt(_lvElm.textContent ,10);
			//_status["lv_max"] = parseInt(_lvElm.textContent.match(/[0-9]{1,2}$/) ,10);
		}
		/*	親愛度はいらんかなー
		let _loveElm = _idolStatusElm.querySelector("div.data_list > div.wrap > div.love+div.pr");
		if(_loveElm){
			_status["love_now"] =  parseInt(_loveElm.textContent.match(/^[0-9]{1,3}/) ,10);
			_status["love_max"] =  parseInt(_loveElm.textContent.substr( _loveElm.textContent.indexOf("/")+1) ,10);
		}
		*/
		let _skillLvElm = _idolStatusElm.querySelector(".skl_lv + .status_value");
		_status["skill_lv"] = parseInt( (_skillLvElm ? _skillLvElm.textContent : 0) , 10);

		_status["pop"] = parseInt( _idolStatusElm.querySelector(".popularity + .status_value").textContent , 10 );
		//現状ダブル特技には非対応
		let _skillTextElm = _idolStatusElm.querySelector(".skl_ef + ._1_line");
		if(_skillTextElm){
			_status["skill_txt"] = _skillTextElm.textContent;
		}

		if(this.pageType == "card_list"){
			//所属するアイドルの固有IDをあらかじめ得る。例外処理ガン無視
			let _sleeveId = _idolStatusElm.querySelector("a.area_card_name").dataset["popup_sleeve_id"];
			if(_sleeveId){
				_status["card_id"] = _sleeveId;
			}else{
				console.warn("missing card_id");
			}
		}

		return _status;
	}

	/** 取得したアイドルのステータスノードをバラしたりパースして、
	 * 一度オブジェクトにまとめたものを返す
	 * 公式仕様変更で、イベント編成と通常アイドルの構成が異なったので別に用意した
	 * @param {*} _idolStatusElm 
	 */
	__parseStatsuParamFromEventNode(_idolStatusElm){

		let _status = {	};

		//アイドル名
		_status["name"] = _idolStatusElm.querySelector(".name").textContent;

		//属性,レアリティ
		let _typeElm = _idolStatusElm.querySelector(".type");
		let _rarityElm = _idolStatusElm.querySelector(".rarity");
		_status["type"] = parseInt(_typeElm.className.substring("type att_1 att_".length) , 10);	//1Cu 2Co 3Pa
		_status["rare"] = parseInt(_rarityElm.className.substring("rarity r_".length) ,10);	//1N 2N+ 3R 4R+ 5SR 6SR+
		
		//ロック是非
		_status["lock"] = _idolStatusElm.querySelector(".lock")?true:false;

		//パラメータ。ただしイベント編成の簡易表示だと存在しなくなるため、
		// lvElmが得られなければ、以降は取得を省略する
		let _lvElm = _idolStatusElm.querySelector(".status_headline.lv");
		if(_lvElm){
			_status["cost"] = parseInt(_idolStatusElm.querySelector(".cost + .pr").textContent , 10);
			_status["atk"] = parseInt(_idolStatusElm.querySelector(".att + .pr").textContent , 10);
			_status["def"] = parseInt(_idolStatusElm.querySelector(".def + .pr").textContent , 10);
			//MAXLv,現在Lv,親愛度などは取得を省略
		}

		let _skillLvElm = _idolStatusElm.querySelector(".skl_lv + .pr");
		_status["skill_lv"] = parseInt( (_skillLvElm ? _skillLvElm.textContent : 0) , 10);

		_status["pop"] = parseInt( _idolStatusElm.querySelector(".popularity + .pr").textContent , 10 );
		//現状ダブル特技には非対応
		let _skillTextElm = _idolStatusElm.querySelector(".skl_ef + .pr");
		if(_skillTextElm){
			_status["skill_txt"] = _skillTextElm.textContent;
		}

		if(this.pageType == "card_list"){
			//所属するアイドルの固有IDをあらかじめ得る。例外処理ガン無視
			_status["card_id"] = _idolStatusElm.querySelector("nameArea > a").href.match(/desc%2F[0-9]{1,}/)[0].replace("desc%2F","");
		}

		return _status;
	}

	/** アイドルステータス要素を1つ得て、レイアウトを変更させる
	 * 	やってる事がかなりめんどい。
	 * @param {*} _statusElm 
	 */
	changeIdolStatsuLayout(_idolStatusElm , _paramObj){

		let cardImageBoxNode = _idolStatusElm.querySelector(".area_card_image_box");
		if(cardImageBoxNode){
			cardImageBoxNode.style.display = "inline-flex";
		}else{
			console.warn(".area_card_image_box が見つかりません");
		}
		
		let _areaLeft = _idolStatusElm.querySelector(".area_left");
		if(_areaLeft){
			_areaLeft.removeAttribute("style");
		}

		let _areaRight = _idolStatusElm.querySelector(".area_right");
		if(_areaRight){

			//コスト比率のノードを作成に成功すれば、それを追加
			let _costLineNode = this.__createCostStatusNode( _paramObj );
			if(_costLineNode){
				_areaRight.appendChild( _costLineNode );
			}

			//▼操作ボタン系を入れる親DIV要素作成・配置
			let _expandedElm = document.createElement("div");
			_expandedElm.className = "mkt_StateExpanded";
			_areaRight.style.width = "140px";			//既存のアイドルステータス領域 div.data 横幅を縮める

			_areaRight.parentNode.appendChild( _expandedElm );

			//▼拡張表記処理
			this.__appendExpandedButton( _expandedElm , _paramObj);

			//フリトレ
			if(this.pageType == "search_top"){
				this.__changeLayoutWantItem( _idolStatusElm );
				this.__changeLayoutFreeTradeMMM( _idolStatusElm , _paramObj["name"]);
			}
	
		}else{
			console.warn("×:アイドルステータスのレイアウト変更に失敗");
		}

	}

	//コス比に関するノードを作成する
	__createCostStatusNode(_paramObj){

		const _cost = _paramObj["cost"];
		const _atk = _paramObj["atk"];
		const _def = _paramObj["def"];
		const _pop = _paramObj["pop"];

		//▼コスト比率表示用データを作成して突っ込む
		let _statusNode = document.createElement("div");
		//_line.className = "data_list line";
		_statusNode.className = "card_status_right";

		let _headline = document.createElement("div");
		_headline.className = "status_headline mkt_atkdef_cost";
		_headline.style.backgroundColor = "#e68a25";
		_headline.style.width = "10px";
		_headline.style.fontSize = "9px";
		_headline.style.padding = "1px 0px 0px 3px";
		_headline.textContent = "比";
		_headline.title = "コスト比率"

		let _costValueNode = document.createElement("div");
		_costValueNode.className = "status_value _middle_long";
		_costValueNode.style.width = "110px";

		let _baseCostValueText = (_atk/_cost).toFixed(1)+" / "+(_def/_cost).toFixed(1);

		//人気度がある場合はちょろっと弄る
		if(_pop > 0){
			const _boostVal = _pop * 50;
			const _popAtkCostValue = ( (_atk + _boostVal) / _cost ).toFixed(1);
			const _popDefCostValue = ( (_def + _boostVal) / _cost ).toFixed(1);
			_costValueNode.textContent = _popAtkCostValue + " / " + _popDefCostValue;
			_costValueNode.title = _baseCostValueText + " (純コス比)";
		}else{
			//人気度を40に想定した場合の情報をオマケでつける
			const _popAtkCostValue = ( (_atk + 2000) / _cost ).toFixed(1);
			const _popDefCostValue = ( (_def + 2000) / _cost ).toFixed(1);
			_costValueNode.title = _popAtkCostValue + " / " + _popDefCostValue + " (人気度+40想定値)";
			_costValueNode.textContent = _baseCostValueText;
		}

		_statusNode.appendChild(_headline);
		_statusNode.appendChild(_costValueNode);

		return _statusNode;

	}


	//拡張要素に配置する作業
	__appendExpandedButton(_expandedElm , _paramObj){

		const _num_SkillLv = _paramObj["skill_lv"];
		const _idolName = _paramObj["name"];
		const _cardId = _paramObj["card_id"];

		//▼特技レベル視覚化
		let _setSkillLvViewElm = document.createElement("div");
		_setSkillLvViewElm.className = "mkt_idolstatus_skilllv";	//CSS依存
		//Lv12を考慮
		for(var n=0; n<(_num_SkillLv>10?12:10); n++){
			let _starElm = document.createElement("span");
			_starElm.textContent = "★";
			let _starColorCode = "#FF8833";
			
			if(n < 5){
				_starColorCode = "#FFC090";
			}
			else if(n > 10-1){
				_starColorCode = "#FF3300";
			}
			if(n > _num_SkillLv-1){
				_starColorCode = "#3f3f3f";	//超過したらoff
			}
			_starElm.style.color = _starColorCode;

			if(n == 5){	//5で改行
				_setSkillLvViewElm.appendChild(document.createElement("br"));
			}
			else if(n == 10){	//10で改行
				_setSkillLvViewElm.appendChild(document.createElement("br"));
			}
			_setSkillLvViewElm.appendChild(_starElm);
		}

		//▼ボタンテーブルを作成・配置
		_expandedElm.appendChild(	this.__createExpandedBtnTable(_cardId)	);


		//▼特技Lv 配置
		_expandedElm.appendChild(_setSkillLvViewElm);

		//▼特技検索
		//let _skillSearchNode = this.__createExpandedSkillSearchBtn( _paramObj );
		//if(_skillSearchNode){
		//	_expandedElm.appendChild( _skillSearchNode );
		//}

	}

	
	/** 拡張要素。アイコンリンク等を、カードIDから作るメソッド。作成した要素を返す
	 */
	__createExpandedBtnTable(_card_id){

		let _tableElm = document.createElement("table");
		_tableElm.style.width = "100%";
		let _setTableTr01Elm = document.createElement("tr");

		let _iconFlag;
		if(this.pageType == "card_list"){
			_iconFlag = true;
		}

		//	%3Dは「=」	%3Fは「?」	%2Fは「/」	%26は「&」

		//各種アイコンボタン付け
		for(var n=0; n<3; n++){
			let _td = document.createElement("td");
			switch(n){
				case 0://自動レッスン対象に設定
					if(!_iconFlag){	break;	}
					let _autoLesson = document.createElement("a");
					_autoLesson.href = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_auto_option%2Fup_target_sleeve%2F'+_card_id;
					_autoLesson.title = "自動レッスンの対象に指定";
					let _autoLessonIcon = new Image();
					_autoLessonIcon.src = getFilePath('./image/icon_s/lesson_auto.gif');
					_autoLesson.appendChild(_autoLessonIcon);
					_td.appendChild(_autoLesson);
					break;
				case 1://レッスンする
					if(!_iconFlag){	break;	}
					let _lessonLink = document.createElement("a");
					_lessonLink.href =  'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%2Fbase_change%2F'+_card_id;
					_lessonLink.title = "レッスンする";
					let _lessonIcon = new Image();
					_lessonIcon.src = getFilePath('./image/icon_s/lesson.gif');
					_lessonLink.appendChild(_lessonIcon);
					_td.appendChild(_lessonLink);
					break;
				case 2:	//リーダーボタン
					if(!_iconFlag){	break;	}
					//▼[攻編成][守編成]のページでなければ...
					if(document.URL.indexOf("idolmaster%2Fdeck%2Fdeck_edit_top") == -1){
						//▼リーダー化ボタン作る
						let _leaderLink = document.createElement("a");
						_leaderLink.href = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_list%2Fset_leader%2F'+_card_id;
						_leaderLink.title = "リーダーにする";
						let _leaderIcon = new Image();
						_leaderIcon.src = getFilePath('./image/icon_s/king.gif');
						_leaderLink.appendChild(_leaderIcon);
						_td.appendChild(_leaderLink);
					}
					break;
			}
			_setTableTr01Elm.appendChild(_td);
		}
		//▼二段目TR

		//ステータステーブルに3アイコンの入った要素設置
		_tableElm.appendChild(_setTableTr01Elm);	

		return _tableElm;
	}

	/** 特技検索用のボタンを作成して返すメソッド
	 * common_scripts.js の skillDataConvert に処理を依存
	 * @param {*} _paramObj 
	 */
	__createExpandedSkillSearchBtn(_paramObj){
	//	console.log( _paramObj );
		
		let _baseNode = document.createElement("span");
		let _skill_txt = _paramObj["skill_txt"];
		let _rare = _paramObj["rare"];
		let _idol_type = _paramObj["type"];
		if(!_skill_txt){
			return;
		}
		let _skill_obj = skillDataConvert( [ _skill_txt ] );
		if(!_skill_obj){
			return;
		}
	//	console.log( _skill_obj );
		
		_skill_obj.forEach(_elm => {
			let _targetURL = "http://mkt.packetroom.net/skillsearch/";
			
			let _form = document.createElement("form");
			_form.method = "POST";
			_form.action = _targetURL;
			let _skill_bit_scale = _elm["bit_skill"];
			let _skill_color_bit_type = _elm["bit_color"];
			let _s_buff_type = _elm["s_buff_type"];
			let _is_debuff = _elm["debuff"];
			if(_skill_bit_scale){
				let _node = document.createElement("input");
				_node.type = "hidden";
				_node.name = "s_scale";
				_node.value = _skill_bit_scale;
				_form.appendChild( _node );
				//その規模ビットの特技のみ
				let _choiceNode =  document.createElement("input");
				_choiceNode.type = "hidden";
				_choiceNode.name = "s_scale_choice";
				_choiceNode.value = 1;
				_form.appendChild( _choiceNode );
			}
			if(_skill_color_bit_type){
				let _node = document.createElement("input");
				_node.type = "hidden";
				_node.name = "s_color";
				_node.value = _skill_color_bit_type;
				_form.appendChild( _node );
			}
			if(_idol_type){
				let _node = document.createElement("input");
				_node.type = "hidden";
				_node.name = "type";
				_node.value = _idol_type;
				_form.appendChild( _node );
			}
			if(_rare){
				let _node = document.createElement("input");
				_node.type = "hidden";
				_node.name = "rare";
				_node.value = _rare;
				_form.appendChild( _node );
			}
			if(_s_buff_type){
				let _node = document.createElement("input");
				_node.type = "hidden";
				_node.name = "s_buff_type";
				_node.value = _s_buff_type;
				_form.appendChild( _node );
			}
			let _node = document.createElement("input");
			_node.type = "hidden";
			_node.name = "s_buff";	//デバフなら1 
			_node.value = _is_debuff?1:2;
			_form.appendChild( _node );
		

			let _submitBtn = document.createElement("input");
			_submitBtn.type = "submit";
			_submitBtn.value = "検索";
			_form.appendChild( _submitBtn );

			let _setBtn = document.createElement("span");
			_setBtn.textContent = "特技検索";
			_setBtn.title = "近い規模の特技を持つアイドルを mkt:skill-search を用いて検索します\n同じ機能は、カスタムメニューの検索アイコン(虫眼鏡)経由でも開く事が出来ます";
			_setBtn.style.fontSize = "12px";
			_setBtn.style.padding = "2px";
			_setBtn.style.border = "solid 1px #606060";
			_setBtn.style.cursor = "pointer";

			//クリックしたら、window.openで開き、documentに作成したformを仕込み、それをPOSTさせる
			_setBtn.addEventListener("click",e=>{

				let _window_pos_define = getOption("window_position_object");

				//▼backgroundでの設定値
				let _use_pos_data = _window_pos_define[ "mkt_skillsearch" ];
				let _tempArr = [];
				if(_use_pos_data){
					for(let _key in _use_pos_data){
						_tempArr.push(_key + "=" + _use_pos_data[_key]);
					}
				}

				//アイドル情報も必要なので、スキルオブジェクトにまとめちゃえ
				_elm["type"] = _idol_type;
				_elm["rare"] = _rare;
				// あとは background.js に任せる
				chrome.extension.sendRequest({
					status:"subwindowopen",
					url: _targetURL,
					option_str: _tempArr.join(","),
					skill_obj:_elm
				}, function(){});


			},false);


			_baseNode.appendChild( _setBtn );
		});



		return _baseNode;
	}


	/** フリトレで呼ばれることを想定。
	 * 希望品のレイアウトを変更
	 */
	__changeLayoutWantItem(_idolStatusElm){
		//console.log( _idolStatusElm );

		//▼希望品レイアウト変更 親の次の要素＝.valuearea に相当
		let _ft_WantElm = _idolStatusElm.parentNode.nextElementSibling.querySelector(".valuearea");
		if(_ft_WantElm){
			
			let _wantLiNodes = _ft_WantElm.childNodes;
			let _outputHTML = "";
			
			[..._wantLiNodes].forEach((_node , _index)=> {
				let _wantText = _node.textContent;
			//	console.log(_node.textContent);
				if(_wantText.indexOf("スタミナドリンク") != -1){
					_wantText = _wantText.replace("スタミナドリンク" , "<img src='"+getFilePath("image/staminadrink_25px.png")+"'>");
					_wantText = _wantText.replace("(" , " x <font color='#ff5533' size='+1'>");
					_wantText = _wantText.replace(")" , "</font>");
				}
				else if(_wantText.indexOf("エナジードリンク") != -1){
					_wantText = _wantText.replace("エナジードリンク" , "<img src='"+getFilePath("image/energydrink_25px.png")+"'>");
					_wantText = _wantText.replace("(" , " x <font color='#aa66cc' size='+1'>");
					_wantText = _wantText.replace(")" , "</font>");
				}
				else if(_wantText.indexOf("鍵付きクローゼット") != -1){
					_wantText = _wantText.replace("鍵付きクローゼット" , "<img src='"+getFilePath("image/closet_25px.png")+"'>");
					_wantText = _wantText.replace("(" , " x <font color='#00ffcc' size='+1'>");
					_wantText = _wantText.replace(")" , "</font>");
				}
				else if(_wantText.indexOf("マニー") != -1){
					let fontColor = "#ffffff";	//色づけ
					switch(_wantText.length - 3){
						case 1:
							fontColor = "#33ff33";	//1
						case 2:
							fontColor = "magenta";	//2紫
						case 3:
							fontColor = "#00ccff";	//3シアン系
						case 5:
							fontColor = "orange";	//4オレンジ
						case 6:
							fontColor = "hotpink";	//5
						case 7:
							fontColor = "#0088ff";	//6
						case 9:
							fontColor = "#33ff33";	//7
						case 10:
							fontColor = "ff5050";	//7
							break;
					}

					_wantText = '<font color="'+fontColor+'">'+_wantText+'</font>'
				}else{
					//どれにも当てはまらない場合は恐らくアイドル
				}
				// _index 1以降のアイテムには、 , で区切る
				//_outputHTML = _outputHTML + (_index==0 ? "" : " <font color='orange'>,</font> ") + _wantText;
				_outputHTML = _outputHTML + " " + _wantText;
			});
			//forEach抜け
			

			_ft_WantElm.innerHTML = _outputHTML;
		}else{
			console.error(_ft_WantElm , "が見つかりません");
		}

	}

	/** フリトレで呼ばれることを想定。 特訓後(+が名前に含まれる)なら、非MMMを判定し、
	 * 必要に応じてレイアウトを内部で変更させる
	 * @param {*} idolStatusElm 
	 * @param {*} _idol_name 
	 */
	__changeLayoutFreeTradeMMM(idolStatusElm , _idol_name){

		//+が名前に入っていれば、非MMを判断
		if(_idol_name.includes("+")){
			let _mmmFlag = idolStatusElm.querySelector(".flag > .max");
			if(!_mmmFlag){
				//console.log("非MM判定");
				//親の、次の次の要素に相当。 トレードできませんという表示ノードが引っかかる可能性があるので、nextのnextだと取れない可能性がある
				let _tradeSubmitElm = idolStatusElm.parentNode.nextElementSibling.nextElementSibling.querySelector("form > label > [value='トレード可能です']");
				if(_tradeSubmitElm){
					_tradeSubmitElm.value = "【！】非MM【！】";
					_tradeSubmitElm.parentNode.className = "btn_cancel_line_2";
				}
			}
		}
		

	}


	/** アイドルリストをコピーするためのボタンを画面下部に配置
	 * 
	 * @param {*} _idolListObjectArray 
	 */
	__appendIdolNameListCopyBtn( _idolListObjectArray ){
	
		let _markElm = document.querySelector("footer");
		if(_markElm){
	
			let _clipbordElm = document.createElement("button");
			_clipbordElm.textContent = "アイドルリストをコピー";
	
			//▼要素作成
			let _idolnameListTempText = '';

			_idolListObjectArray.forEach(_paramObj => {
				_idolnameListTempText = _idolnameListTempText + _paramObj["name"] + '\r\n';
			});

			_clipbordElm.title = _idolnameListTempText;
	
			//▼クリップボードイベント
			_clipbordElm.addEventListener('click' , function(){
				ClipBoardCopy(_idolnameListTempText);
	
			},false);
	
			//▼配置
			_markElm.parentNode.insertBefore(_clipbordElm , _markElm);
	
		}
	
	}

}


function mainfunc_idollists(mainElm){

	console.log("MKT:mainfunc_idollists");

	let _idolListClass = new IdolListClass();
	_idolListClass.mainProcess();
	
}

/**
 * レッスンにおける、トレーナールームのレイアウト変更を司るクラス
 * 「特定のトレーナーを表示から外す」
 * 「select要素を書き換えて、ボタンを押すだけでその枚数レッスンを行うようにする」
 * といった機能を有する
 */
class LessonTrainerClass{
	
	constructor(){
		//この配列に属するトレーナー以外は非表示にさせる
		this.__showTrainerNameArray = [
			"ﾄﾚｰﾅｰ",
			"ﾍﾞﾃﾗﾝﾄﾚｰﾅｰ",
			"ﾙｰｷｰﾄﾚｰﾅｰ",
			"ﾏｽﾀｰﾄﾚｰﾅｰ",
			"[ｽｲﾐﾝｸﾞﾚｯｽﾝ]ﾄﾚｰﾅｰ",
			"[ｽﾍﾟｼｬﾙﾃｸﾆｯｸ]ﾏｽﾀｰﾄﾚｰﾅｰ",
			"[地獄の特訓]ﾏｽﾀｰﾄﾚｰﾅｰ",
		];
	}
	
	/**
	 * メイン処理。
	 */
	mainProcess(mainElm){
		let _layoutFlag = getOption("layout_trainerlesson_check");

		//レイアウト切り替えのトグルボタン配置処理。新旧レイアウトによって異なる
		let _toggleButtonNode = this.__createLayoutChangeButtonNode( _layoutFlag );
		if(urlCheck("%2Ftrainer_lesson%2F")){
			let _markElm = mainElm.querySelector(".lesson_back");
			if(_markElm){
				_markElm.parentNode.insertBefore(_toggleButtonNode , _markElm.nextSibling);
			}
		}
		//旧レイアウト
		else if(urlCheck("%2Fcard_str%2Ftrainer_lesson")){
			let _markElm = mainElm.querySelector("section > form.m-Btm10");
			if(_markElm){
				_markElm.parentNode.insertBefore(_toggleButtonNode , _markElm.nextSibling);
			}
		}

		
		//	%2Ftrainer_lesson%2F0%2F0%2F0	(新表示)一括選択
		//	%2Ftrainer_lesson%2F1%2F0%2F0	(新表示)個別選択
		//	%2Fcard_str%2Ftrainer_lesson	(旧表示)一括選択
		//	%2Fcard_str%2Ftrainer_lesson%2F1%3Fno_cache%3D1%26	(旧表示)個別選択

		if(!_layoutFlag){
			return;
		}


		//▼実際のレイアウト変更処理
		//新レイアウト
		if(urlCheck("%2Ftrainer_lesson%2F")){
			
			let trainerNames = mainElm.querySelectorAll(
				".area-frame_wrap > form[method='post'] > div#idolChk > div > .area_card_status > .area_card_name > .card_name"
			);
			[...trainerNames].forEach((_node , _arrayIndex)=>{
				
				if(this.__isVisibleTrainer(_node.textContent)){
					//以下のURLは、個別選択の場合では発動しない(個別はそもそも枚数指定しないため)
					if(urlCheck("%2Ftrainer_lesson%2F1") == false){
						this.__reWriteNewLessonSelectButtonLayout(
							_node.parentNode.parentNode ,
							_arrayIndex
						);
					}
				}else{
					//その要素を非表示にする
					//新レイアウトだと、select要素群が囲われてないので、そのトレーナーに付随するものも探って非表示にする
					_node.parentNode.parentNode.style.display = "none";
					//親の親の親の次の要素っぽい
					_node.parentNode.parentNode.parentNode.nextElementSibling.style.display = "none";
				}
	
			});
		}
		//旧レイアウト
		else if(urlCheck("%2Fcard_str%2Ftrainer_lesson")){

			let trainerNames = mainElm.querySelectorAll(
				"section > form[method='post'] > div#idolChk > .idolStatus > h4.nameArea > div.name"
			);
			[...trainerNames].forEach(_node=>{

				if(this.__isVisibleTrainer(_node.textContent)){
					//以下のURLは、個別選択の場合では発動しない(個別はそもそも枚数指定しないため)
					if(urlCheck("card_str%2Ftrainer_lesson%2F1") == false){
						this.__reWriteOldLessonSelectButtonLayout(
							_node.parentNode.parentNode ,
							_arrayIndex
						);
					}
				}else{
					//非表示
					_node.parentNode.parentNode.style.display = "none";
				}
	
			});
		}


	}

	/**
	 * そのトレーナーの表示が許可されているかどうかを bool で返す
	 * @param {*} _trainerName チェック対象のトレーナー名
	 */
	__isVisibleTrainer(_trainerName){
		//includesを使っている。1つでも含まれていれば true
		return this.__showTrainerNameArray.includes(_trainerName);;
	}

	/** レイアウト切り替え用のトグルボタンを作成して返す
	 * @param {*} _layoutFlag 現在のレイアウト変更フラグ
	 */
	__createLayoutChangeButtonNode( _layoutFlag ){
		let _btn = document.createElement("div");
		//_btn.className = "btn_important_line_1 m-Cnt";
		_btn.className = "btn_gray t-Cnt m-Btm12";
		_btn.style.display = "block";
		_btn.style.cursor = "pointer";

		if(_layoutFlag){
			_btn.textContent = "レイアウト変更解除";
		}
		else {
			_btn.textContent = "レイアウト変更中(一部トレーナー非表示)";
		}

		_btn.addEventListener('click', e=>{
				(_layoutFlag?saveOption("layout_trainerlesson_check",false):saveOption("layout_trainerlesson_check",true));
				location.reload();
			}
		,false);
		return _btn;
	}


	/**
	 * クリックすると、自分の枚数を選択しつつ、レッスンボタンを押すボタンを
	 * 0～10個生成し、対象のノードを一部書き換える形で配置させる
	 * 新レイアウト用
	 * トレーナー種類ごとに複数回呼ばれる。
	 * @param {*} _targetNode 
	 * @param {*} _index 
	 */
	__reWriteNewLessonSelectButtonLayout(_targetNode , _index){

		let _dataNode = _targetNode.querySelector("div.area_card_image_box > div.area_right");
		let _newSetNode = document.createElement("div");
		
		for(let i=0; i<11; i++){
			let inputElm = document.createElement("input");
			inputElm.type = "button";
			inputElm.name = "num_select" + _index;
			inputElm.value = i;
	
			inputElm.addEventListener("click",e=>{
				let _targetSelectNode = document.querySelector("select[name=num_select"+ _index +"]");
				//console.log(_index , i , "枚選択");
				//console.log(_targetSelectNode);
				if(_targetSelectNode){
					_targetSelectNode.selectedIndex = i;
					//更に、0超過ならついでにレッスンボタンも押す
					if(i > 0){
						let lessonBtnElm = document.querySelector("form > #idolChk > label > input[type='submit']");
						console.log(lessonBtnElm);
						if(lessonBtnElm){
							//レッスンする(submit)ボタンと、その親のクラス名にあるdisabled系を除去
							lessonBtnElm.removeAttribute("disabled");
							lessonBtnElm.parentNode.classList.remove("_disabled");
							lessonBtnElm.click();
						}
					}
				}
			});
			_newSetNode.appendChild(inputElm);
			if(i == 5){
				_newSetNode.appendChild(document.createElement("br"));
			}
		}
		
		_dataNode.parentNode.replaceChild(_newSetNode , _dataNode);
	}

	/**
	 * クリックすると、自分の枚数を選択しつつ、レッスンボタンを押すボタンを
	 * 0～10個生成し、対象のノードを一部書き換える形で配置させる
	 * 旧レイアウト用
	 * トレーナー種類ごとに複数回呼ばれる。
	 * 2Fidolmaster%2Fcard_str%2Ftrainer_lesson%2F0%2F0%2F0%3Fno_cache%3D1%26lesson_type%3D1%26l_frm%3DCard_str_index_1
	 * @param {*} _targetNode 
	 * @param {*} _index 
	 */
	__reWriteOldLessonSelectButtonLayout(_targetNode , _index){

		let _dataNode = _targetNode.querySelector("div.statusTable > div.data");
		let _newSetNode = document.createElement("div");
		
		for(let i=0; i<11; i++){
			let inputElm = document.createElement("input");
			inputElm.type = "button";
			inputElm.name = "num_select" + _index;
			inputElm.value = i;
	
			inputElm.addEventListener("click",e=>{
	
				let targetOptionElm = _targetNode.querySelector(".data_list > .wrap > div > select > option[value='"+ i +"']");
				//console.log(i);
				//console.log(targetOptionElm);
				if(targetOptionElm){
					targetOptionElm.setAttribute("selected",true);
					//更に、0超過ならついでにレッスンボタンも押す
					if(i > 0){
						let lessonBtnElm = _targetNode.parentNode.querySelector("input[type='submit']");	//レッスンするボタン
						if(lessonBtnElm){
							lessonBtnElm.click();
						}
					}
				}
			});
			_newSetNode.appendChild(inputElm);
			if(i == 5){
				_newSetNode.appendChild(document.createElement("br"));
			}
		}
		
		_dataNode.parentNode.replaceChild(_newSetNode , _dataNode);
	}

}


//▼レッスン＠トレーナールームのレイアウトを変更
function mainfunc_lesson_trainer(){
	//	idolmaster%2Fcard_str%2Ftrainer_lesson	で呼び出し
	let _lessonTrainerClass = new LessonTrainerClass();
	_lessonTrainerClass.mainProcess(mainElm);

}


