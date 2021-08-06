

/**
 * ルーターから割り振られるツアー処理
 */
function mainFunc_livetourcarnival(){
	/*	▼バトルフラッシュは、スキップ処理と算出表示処理のみ 2018/10/17
		▼2018/12/11からのツアーで、urlCheck('SsSsraid_battle_swf') がfalseとなったので、
		試験的に urlCheck('_battle_swf%2F')	に置き換えた
	*/

	console.log("mainFunc_livetourcarnival 判定開始");
	// 編成トップページで、自動でアクセ枠編成させるボタンをアクセスしやすい箇所に置きたい
	if(urlCheck("idolmaster%2Fevent_carnival%2Fdeck_index")){
		const _markerNode = document.querySelector("._contents > a.btn_decision_line_2");
		if(_markerNode){
			const _tempArea = document.createElement("div");
			_tempArea.className = "area-btn-common _base-width m-Top8";
			// 一度テンプレを挿入してから移動
			_markerNode.parentNode.insertBefore(_tempArea , _markerNode);

			_markerNode.classList.remove("m-Cnt");
			_markerNode.classList.remove("m-Top8");

			const _formNode = document.createElement("form");
			{
				_formNode.title = "mkt.imcg の独自機能です";
				const _labelNode = document.createElement("label");
				//_formNode.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fmodify_equip_recommend";
				_formNode.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fmodify_equip_recommend%3Fl_frm%3DEvent_carnival_check_equip_recommend_1";
				
				_formNode.method = "POST";
				_labelNode.style.fontSize = "12px";
				_labelNode.className = "btn_decision_line_2";
				const _submit = document.createElement("input");
				_submit.type = "submit";
				_submit.value = "アクセ枠 即時自動割当";
				const _inputA = document.createElement("input");
				_inputA.type = "hidden";
				_inputA.name = "deck";
				_inputA.value = "1";
				const _inputB = document.createElement("input");
				_inputB.type = "hidden";
				_inputB.name = "remain";
				_inputB.value = "0";

				_labelNode.appendChild(_submit);
				_formNode.appendChild(_labelNode);
				_formNode.appendChild(_inputA);
				_formNode.appendChild(_inputB);
			}


			//const _link = document.createElement("a");
			if(0){
				_link.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fcheck_equip_recommend%3Fdeck%3D1";
				_link.classList.add("btn_decision_line_4");
				_link.classList.add("_line_2");
				_link.appendChild(document.createTextNode("アクセ枠"));
				_link.appendChild(document.createElement("br"));
				_link.appendChild(document.createTextNode("自動割当"));
				_link.title = "mkt.imcg の機能です";
			}

			//先に(左側に)アクセボタンを置く
			//_tempArea.appendChild(_link);
			_tempArea.appendChild(_formNode);
			_tempArea.appendChild(_markerNode);
		}

	}
	// convert%2Fevent_carnival から変更
	else if(urlCheck('idolmaster%2Fevent_carnival') && urlCheck('_battle_swf%2F')){
		console.log("ツアー");
		subfunc_event_flash_jump_btn();
		injectScriptFromFunction(injectEventAnimationScriptIsInfo_LiveTourCarnival , ["0"]);
	}
	//▼それ以外のページ
	else{
		subfunc_setEventTableTimer();	//イベント共通タイマー処理
	}
}



/**
 * イベバトル演出の解析埋め込み用
 * @param {*} _callCount 
 */
function injectEventAnimationScriptIsInfo_LiveTourCarnival(_callCount){
	//	console.log("callCount" , _callCount);
	_callCount++;
	if(_callCount > 25){
		return;
	}
	let _obj = null;
	try{
		_obj = window.pexApi.Ie.Ih.Ie.Qh.hj;
	//	console.log(_obj);
		let _val = "";
		let _skillMemArr = [];
		let _skillMemObj = {};
		let _skillStrArr = [];
		//特定のキー名を持つ値を取り出して、特技の発動アイドル(の序列)を得る
		for(let _key in _obj){

			if(_key.indexOf("SK") === 0 && _key.match(/SK[0-9]+$/)){
				//	console.log(_key , _obj[_key]);
				_val = _obj[_key];
				/** 値が "113333333333333330000000000" のような文字列になっており、1文字目が発動アイドルの序列
				 * 但しリーダーは 0 から..となるので、ここで得られる順番は配列添え字扱い
				 */
				if(_val && _val.length > 1){
					let _frontMemberNum =  parseInt(_val[0]) + 1;	//1文字目をパースして順番表記なので1増やす
					_skillMemArr.push(_frontMemberNum);
					_skillMemObj[ _frontMemberNum ] = 1;	//発動したメンバー序列番号をキーにする。
				}
			}
			//2018/12/10コラボツアーで対応
			else if(_key.match(/skill_user[0-9]+$/)){
				//console.log(_key , _obj[_key]);
				_val = _obj[_key];
				if(_val){
					//ダブル特技の場合、発動メンバーindexが重複するので、既に存在している場合は追加させない
					if(false == _skillMemArr.includes(_val)){
						_skillMemArr.push(_val);
					}
					_skillMemObj[ _val ] = 1;	//発動したメンバー序列番号をキーにする。
				}
			}
			else if(_key.indexOf("SE") === 0 && _key.match(/SE[0-9_]+$/)){
				//発動特技の説明文。バクメンは別の行扱いなので、ちょっと加工しておく？
				let _sVal = _obj[_key];
				if(_sVal.length > 0){
					//さらにがあれば、前の配列末尾に加える
					_sVal = _sVal.replace("ｷｭｰﾄ","Cu").replace("ｸｰﾙ","Co").replace("ﾊﾟｯｼｮﾝ","Pa").replace("全ﾀｲﾌﾟ","全色").replace("攻守","両").replace("ｱｯﾌﾟ","").replace("のﾌﾛﾝﾄﾒﾝﾊﾞｰの" , "");
					if(_sVal.indexOf("さらに") != -1 && _sVal.indexOf("ﾊﾞｯｸﾒﾝﾊﾞｰ") != -1){
						let _matchArr = _sVal.match(/ﾊﾞｯｸﾒﾝﾊﾞｰ上位([0-9])人/);
						if(_matchArr){
							_skillStrArr[_skillStrArr.length-1] = _skillStrArr[_skillStrArr.length-1] + " +" + _matchArr[1] + "";
						}else{
							_skillStrArr[_skillStrArr.length-1] = _skillStrArr[_skillStrArr.length-1] + _sVal;
						}
					}else{
						_skillStrArr.push(_sVal);
					}
				}
			}
		}
		//▼ここから仮計算
		let _valTurnArr = [0,0,0,0,0];	//未取得分は0埋め
		let _valTurnCount = 0;			//5回分のターン 0～4 を想定
		let _valEncore = 0;				//アンコール
		for(let _key in _obj){
			if(_key.indexOf("A") === 0 && _key.match(/A[0-9]+$/)){
				let _val = _obj[_key];
				let _num = parseInt(_val , 10);	//ミリ残し処理の場合、オブジェクトの中身がマイナスになる場合があるので、絶対値とする
				//マイナスの場合はこの数字を参考にしてはならない
				if(_num > 0){
				//	console.log(_num , _val);
					_valTurnArr[_valTurnCount] = _num;
					_valTurnCount++;
				}
			}
			//アンコール値を取得して入れる。パースに失敗しそうならとりあえず 0
			else if(_key.indexOf("encore_bonus") != -1){
				_valEncore = parseInt( _obj[_key] , 10 ) || 0;
			}
		}
	
	//	console.log(_valArr);
	//	console.log("sum:" , _sum , "_copyLog:" , _copyLog);
		//▲ここまで仮計算

		//得られた配列1ターンでも発揮値が 0 超過
		if(_valTurnArr.find((_val)=>{ return _val > 0;}) > 0){

			let _valAllSum = _valEncore;	//各種ターン発揮 + 別途アンコール発揮
			_valTurnArr.forEach((v)=>{
				_valAllSum += v;
			});

			let _showObject = 
				{
					"合計発揮":_valAllSum,
					"1T":_valTurnArr[0],
					"2T":_valTurnArr[1],
					"3T":_valTurnArr[2],
					"4T":_valTurnArr[3],
					"5T":_valTurnArr[4],
					"アンコール":_valEncore,
				};
			

			let _skillShowObj = {};	
			for(let n=0; n<=10; n++){
				if(n==0){
					_skillShowObj[ n ] = Object.keys(_skillMemObj).length + "人";
				}else{
					if(_skillMemObj[ n ]){
						_skillShowObj[ n ] = 1;
					}else{
						_skillShowObj[ n ] = 0;
					}
				}

			}


			console.table( [ _showObject ] );
			console.table( [ _skillShowObj ] );

			//	console.log("↓Excel系コピペ用" , "総合発揮" , "1T～5Tまでの発揮(空白は0)" , "最後はアンコール発揮");
			console.log(_valAllSum + "\t" + _valTurnArr.join("\t") + "\t" + _valEncore);

			console.log("特技序列:" , _skillMemArr.join(","));
			console.log(_skillStrArr.join("\n"));
			//▼画面上表示
			if(Object.keys(_skillMemObj).length > 0){
				let _retStr = "特技：" + _skillShowObj[ 0 ] + " @ " + _skillMemArr.join(",");
				let _infoNode = document.createElement("div");
				_infoNode.textContent = _retStr;
				let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
				if(_infoAreaNode){
					_infoAreaNode.appendChild(_infoNode)
				}else{
					document.body.firstChild.appendChild(_infoNode);
				}
			}

		}else{
		//	console.warn("ターン毎の発揮値取得に失敗 / 再帰処理");
			setTimeout(injectEventAnimationScriptIsInfo_LiveTourCarnival , 50 , _callCount);	//同名の関数で再帰
		}
	
	}catch(e){
		//	例外握りつぶすマン
	//	console.error(e);
		setTimeout(injectEventAnimationScriptIsInfo_LiveTourCarnival , 50 , _callCount);	//同名の関数で再帰
	}


}


