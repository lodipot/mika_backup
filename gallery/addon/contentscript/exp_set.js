//経験値に関係するスクリプト
//様々な･･･主に仕事やイベントのURLで呼ばれる。

//▼旧お仕事ページ用処理
function mainfunc_exp_old(mainElm){
	
	//チェックが入っていなければ配置作業は行わない。返すものも無し
	if(!getOption("exptimer_check")){
		return null;
	}


	if(!mainElm){
		console.error("mainElmが取得できていません");
	}


	let _infoNode = null;
	//▼外部クラスに、Expやドリンク量の取得～計算～情報ノード作成を全部任せる
	/**
	 * @type StaminaExpGetterClass
	 */
	const _staminaExpGetter = new StaminaExpGetterClass();
	if(_staminaExpGetter.getPageStaminaExpParam()){
		if(_staminaExpGetter.calc()){
			_infoNode = _staminaExpGetter.generateInfoTableNode();
		}else{
			console.warn("Expとスタミナの計算に失敗");
			console.log(_staminaExpGetter);
		}
	}

	//console.log( _infoNode );
	//console.log( _staminaExpGetter );

	//配置処理。 URLに気を使おう(開催イベントとかによって位置を変える)
	if(_infoNode){
		//▼ドリームLIVE + LIVEツアー URLでの処理。LIVE発生中のエリアの下にくるように。
		if(
			location.href.indexOf("event_dream%2F") != -1
		||	location.href.indexOf("event_assault%2F") != -1
		){
			let _setFlag;

			//▼これがとれればLIVE発生中？
			const _getElms = mainElm.querySelectorAll(" a > div.nextLink2 > span");
		//	console.log(getElms);
			for(var n=0; n<_getElms.length; n++){
				if(_getElms[n]){
					if(_getElms[n].innerText.match(/LIVE発生中/)){
					//	console.log(getElms[n].innerText.match(/LIVE発生中/));
						_setFlag = true;
						_getElms[n].parentNode.parentNode.parentNode.insertBefore(_infoNode , _getElms[n].parentNode.parentNode.nextSibling);
					}
				}
			}
			//▼設置できなければ今までどおりformンとこに入れる
			if(!_setFlag) {
		//							console.log(getElms);
				document.getElementsByTagName("form")[0].parentNode.insertBefore(_infoNode , document.getElementsByTagName("form")[0].NextSibling);
			}

		}
		//それ以外。フツーの仕事とかアイプロも多分これに入る
		else {
			if(document.getElementsByTagName("form").length > 0){

			//	console.log(document.getElementsByTagName("input").length);

				document.getElementsByTagName("form")[0].parentNode.insertBefore(_infoNode , document.getElementsByTagName("form")[0].NextSibling);
			}
		}

	}
}

//▼新お仕事でメイン実行される関数
function mainfunc_exp_new(){

	const _wrapNode = document.querySelector("body > div > div > div#wrap");
	if(!_wrapNode){
		console.log(_wrapNode);
		return;
	}
	const _headerNode = _wrapNode.querySelector(".area_menu_header_6btn");
	if(_headerNode){
		//メニューを最初から表示させる
		//	HeaderElm.style.display = "block";
	}else {
		console.warn("【×】MKT:HeaderElmの取得に失敗");
	}

//		console.log(bpInfoElm);

	//続けるボタンを取得してみたい。あわよくばイベントを仕込みたい
	const _playBtnNode = _wrapNode.querySelector("form#play > input[type='button']");
	if(!_playBtnNode){
		console.log(_playBtnNode);
		return;
	}
	//touchstartで反応するっぽい。イベントを仕込む。
	//Ultimate User Agent Switcher > iPhone4 > mousedown
	//cTouch e3 > iPhone > touchstart

	_playBtnNode.addEventListener("mousedown",function(e){
	//	console.log("mousedown");
	//	setTimeout("SystemTimeView()", 1000);
		setTimeout( subfunc_exp_get , 800);
		setTimeout( subfunc_get_eventworkstate , 800);
	//	subfunc_exp_get(mainElm);
	});

}


/**
 * 「お仕事を続ける」のボタンイベント(で実行される)関数
 * 経験値を取得して、情報を表示させる。押されるたびに処理が走るので、既に情報ノードがある場合はreplaceで入れ替え
 */
function subfunc_exp_get(){

	const _markerNode = document.querySelector("body > div > div > div#wrap");
	if(!_markerNode){
		console.log(_markerNode);
		return;
	}
	/**
	 * @type StaminaExpGetterClass
	 */
	const _staminaExpGetter = new StaminaExpGetterClass();

	if(_staminaExpGetter.getPageStaminaExpParam()){
		if(_staminaExpGetter.calc()){
			
			const _infoNode = _staminaExpGetter.generateInfoTableNode();
			if(_infoNode){
				//既にExp情報があった場合、書き換える。なかった場合は div#worp の直後に挿入
				const _MarkInfoNode = document.querySelector("body > div#pageArea > div#top > div#expstatus");
				console.log(_MarkInfoNode);
				if(_MarkInfoNode){
					_markerNode.parentNode.replaceChild(returnSetElm , _MarkInfoNode);
				}
				else {
					_markerNode.parentNode.insertBefore(returnSetElm , _markerNode.nextSibling);
				}

			}
		}
	}




}


//▼subfunc_exp_get()と同様、新お仕事演出の「お仕事を続ける」を押すごとに実行される。
//BPとかLPとかAPとか、そういうのを回収したい
function subfunc_get_eventworkstate(){

	subfunc_setEventTableTimer();	//イベントテーブルを利用した今、もうこれ1行でいいんじゃないかな



}


/**
 * お仕事やイベントのページ上から、スタミナと経験値の情報を取得したり解析したり計算したりするクラス
 */
class StaminaExpGetterClass{

	constructor(){
		/**
		 * 現在のスタミナ値
		 * @type Number
		 */
		this.staminaNowValue;
		/**
		 * スタミナ上限値
		 * @type Number
		 */
		this.staminaMaxValue;
		/**
		 * 現在のExp
		 * @type Number
		 */
		this.expNowValue;
		/**
		 * 今のレベル帯でLvUpまでに必要なExp値(残りではない)
		 * @type Number
		 */
		this.expMaxValue;
		// ----- ここから下は動的に生成される ----
		/**
		 * 全回復まで必要なスタミナ値
		 * @type Number
		 */
		this._staminaRestValue;
		/**
		 * LvUPに必要な残り経験値
		 * @type Number
		 */
		this._expRestValue;
		/**
		 * スタハの回復量定義
		 * @type Number
		 */
		this._recoverStaminaHalfVal;
		/**
		 * 20%アイテムのスタミナ回復量定義
		 * @type Number
		 */
		this._recoverStamina20ItemVal;

		/**
		 * LvUpまでに必要なスタドリ本数。端数はスタハと20%アイテムに持ち越し
		 * @type Number
		 */
		this._staminaItemDrinkAmount;
		/**
		 * LvUpまでキリ良くスタドリを使い、その端数でキリ良く消化できるスタハ本数(特性上、結果は0か1)
		 * @type Number
		 */
		this._staminaItemDrinkHalfAmount;
		/**
		 * LvUpまでキリ良くスタドリ、スタハを使い、その端数で消化できる20%アイテム個数
		 * @type Number
		 */
		this._staminaItem20PerAmount;
		/**
		 * LvUpまでキリ良く(スタドリ・スタハ・20%アイテム)＋現在の温存中スタミナも使い切ったときに出る最後の端数(自然回復時間分)
		 * この値が 0以下であれば、その時点でスタミナを使い切ってLvUpが可能である
		 * @type Number
		 */
		this._staminaNaturalRecoverVal;


	}

	/**
	 * 現在のURLに適したセレクタオブジェクトを返す。
	 * 合致する内蔵定義が見当たらない場合、nullが返る
	 * {
	 * 	"stamina":["selector1" , "selector2" ...] ,
	 *  "exp":["selector1" , "selector2" ...] ,
	 * }
	 */
	_getMatchSelectorObject(){

		/**
		 * セレクタテーブル
		 * 2019/11/12 
		 */
		const selectorTable = {

			//旧お仕事
			"%2Fidolmaster%2Fquests%3F":{
				"stamina":[
					"div#top > section > div > img + div"
				]
				,"exp":[
					"div#top > section > div > img + div + div"
				]
			},
			//新お仕事
			"%2Fidolmaster%2Fquests%2Fwork%2F":{
				"stamina":["#hp_bar > .progress_num.box_right"]
			,	"exp":["#exp_bar >.progress_num.box_right"]
			},
			//新お仕事イベント
			"%2Fwork%2F":{
				"stamina":["body > div#pageArea > div#top > div#wrap > section#play_area > section#get_condition > div#hp"]
			,	"exp":["body > div#pageArea > div#top > div#wrap > section#play_area > section#get_condition > div#exp"]
			},
			//イベント ポイント取得
			"%2Fget_battle_point%2F":{
				"stamina":["div#top > section.t-Cnt.m-Btm0 > div > table > tbody > tr:first-child > td[align='right']:nth-of-type(2)"]
			,	"exp":["div#top > section.t-Cnt.m-Btm0 > div > table > tbody > tr:nth-of-type(2) > td[align='right']:nth-of-type(2)"]
			},
			//イベント %2Fと%3Fがある
			"%2Fmission_list%":{
				"stamina":[
					"div#top > section.t-Cnt.m-Btm0 > div > img+div"	//201708~09アイプロ
					,"div#top > section > div > table > tbody > tr:first-child > td[align='right']:nth-of-type(2)"	//2017/12/12ツアー有効
					,"div#top > section > div > div"	//20170518アイチャレ時エラー
					]
				,"exp":[
					"div#top > section > div > img + table > tbody > tr + tr > td[align='right']:nth-of-type(2)",	//20191030チャレ有効(本気ゲージ誤検知なし)
					"div#top > section.t-Cnt.m-Btm0 > div > img+div+div",	//201708~09アイプロ
					"div#top > section > div > div:nth-of-type(2)",			//20170518アイチャレ時エラー
				]
			},
			
			//お仕事結果(カード無し)
			"%2Fget_nothing%2F":{
				"stamina":[
					"section > div >table > tbody > tr > td:nth-of-type(2)"	//2016/12/09 ツアーお仕事中 2017/09/30ツアー
					,"div#top > section > div > img + div"
					]
				,"exp":[
					"section > div >table > tbody > tr+tr > td:nth-of-type(2)"
					,"div#top > section > div > img + div + div"
				]
			},
			//お仕事結果(カード有り)
			"%2Fget_card%2F":{
				"stamina":[
					"div#top > section > div > table > tbody > tr:first-child > td[align='right']:nth-of-type(2)",
					"div#top > section > div > img + div",
					"div#top > section > section > div > img + div",
					]
				,"exp":[
					"div#top > section.t-Cnt.m-Btm0 > div > table > tbody > tr:nth-of-type(2) > td[align='right']:nth-of-type(2)",
					"div#top > section > div > img + div + div",
					"div#top > section > section > div > img + div + div",
				]
			},
			
			//ステージクリア
			"%2Fstage_clear%2F":{
				"stamina":["div#top > section > div > img + div"]
				,"exp":["div#top > section > div > img + div + div"]
			}
		};

		
		let _retObj = null;

		for(let _key in selectorTable){
			if(location.href.indexOf(_key) != -1){
				_retObj = selectorTable[_key];
			}
		}

		return _retObj;
	}

	/**
	 * 実行すると、ページ内のノードを内部定義テーブルをもとに取得・解析する。
	 * 成功すればtrueを返し、現在,MAXのスタミナ値と現在・LvUpの最大Exp値をプロパティに確保する
	 */
	getPageStaminaExpParam(){

		const _tableObj = this._getMatchSelectorObject();
		if(!_tableObj){
			//スタミナやExpが記載されたページではないと判断
			return;
		}
		const _staminaSelectorArr = _tableObj["stamina"];
		const _expSelectorArr = _tableObj["exp"];

		//スタミナとExpのノードを取得
		let _staminaNode = null;
		let _expNode = null;
		for(let _n=0; _n<_staminaSelectorArr.length; _n++){
			_staminaNode = document.querySelector(_staminaSelectorArr[_n]);
			if(_staminaNode){
				//console.log(_staminaSelectorArr[_n]);
				break;
			}
		}
		for(let _n=0; _n<_expSelectorArr.length; _n++){
			_expNode = document.querySelector(_expSelectorArr[_n]);
			if(_expNode){
				//console.log(_expSelectorArr[_n]);
				break;
			}
		}
		//どちらかの取得に失敗
		if(!_staminaNode || !_expNode){
			console.log(_staminaNode , _expNode);
			return;
		}

		let _staminaText = _staminaNode.textContent;
		let _expText = _expNode.textContent;
		//どちらかの取得に失敗
		if(!_staminaText || !_expText){
			console.log(_staminaText , _expText);
			return;
		}

		
		_expText = _expText.replace(/,/g,"");

		//console.log("抽出テキスト" , _staminaText, _expText);

		const _staNow = parseInt( _staminaText.match(/([0-9]{1,})\//)[1] , 10);
		const _staMax = parseInt( _staminaText.match(/\/([0-9]{1,})/)[1] , 10);
		const _expNow = parseInt( _expText.match(/([0-9]{1,})\//)[1] , 10);
		const _expMax = parseInt( _expText.match(/\/([0-9]{1,})/)[1] , 10);
		// いずれかの値の取得に失敗
		if(isNaN(_staNow) || isNaN(_staMax) || isNaN(_expNow) || isNaN(_expMax)){
			console.log(_staNow , _staMax , _expNow , _expMax);
			return;
		}
		//全ての値が正常に取得できたら、プロパティに確保する
		this.staminaNowValue = _staNow;
		this.staminaMaxValue = _staMax;
		this.expNowValue = _expNow;
		this.expMaxValue = _expMax;
		

		return true;
	}

	/**
	 * 保持している4値をもとに、スタ本数などを算出。
	 * 計算に成功すれば true を返し、結果をプロパティに確保する
	 */
	calc(){

		if(
			!Number.isInteger(this.staminaNowValue) || 
			!Number.isInteger(this.staminaMaxValue) || 
			!Number.isInteger(this.expNowValue) ||
			!Number.isInteger(this.expMaxValue)
		){
			return;
		}

		const _staNow = this.staminaNowValue;
		const _staMax = this.staminaMaxValue;
		const _staRest = (_staMax - _staNow);

		//console.log("スタミナ" , _staNow , "/" , _staMax , " 全回復まで" , _staRest);

		const _expNow = this.expNowValue;
		const _expMax = this.expMaxValue;
		const _expRest = (_expMax - _expNow);

		//console.log("Exp" , _expNow , "/" , _expMax , " LvUpまで" , _expRest);
		
		//スタハ及び20%アイテムで回復するスタミナ値を定義しておく
		const _recoverStaminaHalfVal = Math.ceil(_staMax / 2);
		const _recoverStamina20ItemVal = Math.ceil(_staMax / 5);

		let _staDrinkAmount = 0;
		let _staDrinkHalfAmount = 0;
		let _sta20ItemAmount = 0;


		if(1){

			let _natural_recovery_val = 0;

			//【！】残りExpから、現在のスタミナ値を差し引いておくのがポイント？
			let _rest_temp_exp = _expRest - _staNow;	//アイテム計算で利用する

			//▼今後の計算に影響を与えるので、マイナスのときは本数代入等を一切行わない
			if(_rest_temp_exp > 0){
			//	console.log(rest_temp_exp);
				//順番に計算基数を調整しつつ、アイテム個数を算出
				console.log(_rest_temp_exp ,"/", _staMax , _rest_temp_exp / _staMax);
				_staDrinkAmount = Math.abs(Math.floor(_rest_temp_exp / _staMax));
				_rest_temp_exp -= (_staDrinkAmount * _staMax);
				_staDrinkHalfAmount = Math.abs(Math.floor((_rest_temp_exp) / _recoverStaminaHalfVal));
				_rest_temp_exp -= (_staDrinkHalfAmount * _recoverStaminaHalfVal);
				_sta20ItemAmount = Math.abs(Math.floor(_rest_temp_exp / _recoverStamina20ItemVal));
				_rest_temp_exp -= (_sta20ItemAmount * _recoverStamina20ItemVal );
				_natural_recovery_val = _rest_temp_exp;
			}else{
				console.log("LvUp可能:" , _rest_temp_exp , "の損失");
			}

			// 産出した値をプロパティに確保
			this._staminaRestValue = _staRest;
			this._expRestValue = _expRest;
			this._staminaItemDrinkAmount = _staDrinkAmount;
			this._staminaItemDrinkHalfAmount = _staDrinkHalfAmount;
			this._staminaItem20PerAmount = _sta20ItemAmount;
			this._staminaNaturalRecoverVal = _natural_recovery_val;

			this._recoverStaminaHalfVal = _recoverStaminaHalfVal;
			this._recoverStamina20ItemVal = _recoverStamina20ItemVal;

		}

		return true;
	}


	/**
	 * テスト用
	 */
	test(){
		this.staminaNowValue = 266;
		this.staminaMaxValue = 718;
		this.expNowValue = 49405;
		this.expMaxValue = 50190;

		
		this.calc();

		console.log("スタミナ" , this.staminaNowValue , "/" , this.staminaMaxValue , "全回復まであと" , this._staminaRestValue);
		console.log("Exp" , this.expNowValue , "/" , this.expMaxValue , "LvUpまであと" , this._expRestValue);
		console.log("消費目安 = スタドリ:" , this._staminaItemDrinkAmount , "スタハ:" , this._staminaItemDrinkHalfAmount , "20%:" , this._staminaItem20PerAmount
			, "自然回復分:" , this._staminaNaturalRecoverVal);

		const _infoNode = this.generateInfoTableNode();

		console.log(_infoNode);
		
	}


	/**
	 * 保持プロパティを参照して、LvUpに必要なアイテムの個数などを示すノードを作成する
	 * 本当は切り分けた方が良いけど、経験値タイマー起動系の処理もさせてる
	 */
	generateInfoTableNode(){

		const _info = {};

		_info.exp_max = this.expMaxValue;
		_info.exp_now = this.expNowValue;
		_info.stamina_now = this.staminaNowValue;
		_info.stamina_max = this.staminaMaxValue;
		_info.amount_stamina = this._staminaItemDrinkAmount;
		_info.amount_stamina_half = this._staminaItemDrinkHalfAmount;
		_info.amount_stamina_20 = this._staminaItem20PerAmount;

		_info.stamina_half = this._recoverStaminaHalfVal;
		_info.stamina_20 = this._recoverStamina20ItemVal;

		_info.natural_recovery_val = this._staminaNaturalRecoverVal;
		_info.exp_rest = this._expRestValue;

		
	//	console.log(info);
	
		//▼計算とかどうでもいいパターン
		if(_info.exp_max <= _info.exp_now){
			console.log("経験値が上限を超えているため、処理は行いません");
			return false;
		}
	
		const _work_stamina = parseInt(getOption("exptimer_usestamina_value") , 10);	//【!!】仕事の消費量を設定。この値で割る
	
		//▼配置準備-------------------------
		const _baseNode = document.createElement("div");
		_baseNode.setAttribute("style","text-align:left;background-color:#333333;font-size:12px;line-height:120%;padding:5px;margin-top:5px;");
		_baseNode.setAttribute("id","expstatus");
		const _fontColor = "color:#555555;";
		//説明文その1
	
	
		//▼スタミナTABLE構築
		const _tableNode =  document.createElement("TABLE");
		_tableNode.setAttribute("style","font-size:12px;line-height:11px;");
		for(let i=0; i<6; i++){
			const _trNode = document.createElement("tr");
		//	console.log(i);
			//▼色変更
			if(i==0 && _info.stamina_now == 0){
				_trNode.setAttribute("style",_fontColor);
			}
			else if(i==1){
				if(_info.amount_stamina == 0){
					_trNode.setAttribute("style","color:red;");
				}else if(_info.amount_stamina <= 2 ){
					_trNode.setAttribute("style","color:orange;");
				}
			}
			else if(i==2 && _info.amount_stamina_half == 0){
				_trNode.setAttribute("style",_fontColor);
			}
			else if(i==3 && _info.amount_stamina_20 == 0){
				_trNode.setAttribute("style",_fontColor);
			}
			else if(i==4 && _info.natural_recovery_val == 0){
				_trNode.setAttribute("style",_fontColor);
			}
			else if(i==5){
				_trNode.setAttribute("style","color:#999999;");
			}
			//▲色ここまで
	
			//TDとTR設置
			for(let t=0; t<5; t++){
				const _tdNode = document.createElement("td");
			//	console.log(i+"/"+t);
				if(i==0){
					if(t==0){
						_tdNode.setAttribute("width","120px");
						_tdNode.textContent = "現在のスタミナ";
					}else if(t==1){
						_tdNode.setAttribute("width","auto");
						_tdNode.setAttribute("style","padding-right:10px;");
						_tdNode.textContent = "("+_info.stamina_now+")";
					}else if(t==2){
						_tdNode.setAttribute("width","auto");
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.stamina_now;
					}
				}
				else if(i==1){
					if(t==0){
						_tdNode.textContent = "スタミナドリンク";
					}else if(t==1){
						_tdNode.textContent = "("+_info.stamina_max+")";
					}else if(t==2){
						_tdNode.textContent = " × "+_info.amount_stamina;
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.amount_stamina*_info.stamina_max;
					}
				}
				else if(i==2){
					if(t==0){
						_tdNode.textContent = "スタドリハーフ";
					}else if(t==1){
						_tdNode.textContent = "("+_info.stamina_half+")";
					}else if(t==2){
						_tdNode.textContent = " × "+_info.amount_stamina_half;
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.amount_stamina_half*_info.stamina_half;
					}
				}
				else if(i==3){
					if(t==0){
						_tdNode.textContent = "20%アイテム";
					}else if(t==1){
						_tdNode.textContent = "("+_info.stamina_20+")";
					}else if(t==2){
						_tdNode.textContent = " × "+_info.amount_stamina_20;
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.amount_stamina_20*_info.stamina_20;
					}
				}
				else if(i==4){
					if(t==0){
						_tdNode.textContent = "自然回復";
					}else if(t==1){
						_tdNode.textContent = (_info.natural_recovery_val * 3)+" 分";
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.natural_recovery_val;
					}
				}
				else if(i==5){
					if(t==0){
						_tdNode.textContent = "次のレベルまであと";
					}else if(t==3){
						_tdNode.textContent = "　= "+_info.exp_rest;
					}
				}
	
				_trNode.appendChild(_tdNode);
			}
			_tableNode.appendChild(_trNode);
		}
	
	
		//▼タイマー起動準備
		const _nowTimeObj = new Date();
		const _nowTimeNum = _nowTimeObj.getTime();
		let _sendrecovertimenum = 0;
	
		//▼配置下準備
		var _infoNode01 = document.createElement("div");
		_infoNode01.setAttribute("style","color:#ff0000;");
	
		//▼ここから経験値とスタミナの計算式------------------------------------------------
	
		//▼レベルアップまでの時間(数値)を計算
		var exp_wait = _info.exp_rest;	//今からレベルが上がるまでの必要Exp(端数考慮) 下のif分岐で値が変わる
	
		//▼端数(仕事スタミナ)設定がしてある
		if(_work_stamina > 0){
		/*
			console.log("残り経験値が "+info.exp_rest+" なので、消費量 "+work_stamina+" で割ります = "+(info.exp_rest/work_stamina));
			console.log(+(info.exp_rest/work_stamina)+"を切り捨てた結果は "+Math.floor(info.exp_rest/work_stamina)+" です。");
			console.log("端数を考慮すると、仕事(消費"+work_stamina+")を "+Math.floor(info.exp_rest/work_stamina)+" 回行って、Expが"+(Math.floor(info.exp_rest/work_stamina) * work_stamina)+"たまる計算です");
			*/
			var exp_shortage = (_info.exp_rest - (Math.floor(_info.exp_rest/_work_stamina) * _work_stamina) );
		//	console.log("exp_wait:"+exp_wait+" / exp_shortage(端数):"+exp_shortage);
	
			//仕事端数が1以上でた場合
			if(exp_shortage > 0){
				//★仕事消費量を考慮した場合に必要な残りのスタミナが書き換わる
				var exp_wait = (_info.exp_rest - (_info.exp_rest % _work_stamina) + _work_stamina);
			/*
				console.log("\t[端数発生]本来レベルを上げるのに必要な経験値 "+info.exp_rest+" より "+exp_shortage+" 足りない計算になります");
				console.log("\t足りない経験値が "+exp_shortage+" なので、キリよくするために、仕事消費量 "+work_stamina+" に置き換えて、足りない経験値を "+work_stamina+" と考えます");
				console.log("\tこの時点で、経験値(スタミナ)が"+exp_wait+"あれば、Lvもあがることが出来て、キリよく仕事でスタミナも消費し切る事が判明します");
			*/
			}
		}
	
		const _setrecovernum = ((exp_wait - _info.stamina_now) * 3) * 1000 * 60;	//exp_wait によって計算結果が異なる
		_sendrecovertimenum = (_setrecovernum + _nowTimeNum);			//LvUpになる時刻 (現時刻+残りの時間)
		var fullrecovertime = new Date(_sendrecovertimenum);			//予想時刻をセット。あとでリクエストに使う
	//	console.log("setrecovernum:"+setrecovernum+" / 残りEXP:"+exp_wait+" / LvUpまで:"+(setrecovernum / (1000 * 3600))+"時間");
	
		//▼Lvを上げられるか、そうでないか
		if(_info.stamina_now >= exp_wait){
			_infoNode01.innerText = '既にLvUp可能です / 予測損失スタミナ ( '+(_info.stamina_now - _info.exp_rest)+' )';
			_infoNode01.setAttribute("style","color:#ff2222;");
			requestTimer("exp", 0);	//破棄
			saveOption("timevalue_exp_levelup",_sendrecovertimenum);	//値も保存
		}
		else {
		/*
			console.log("\t現在のスタミナが "+info.stamina_now+" なので、"+exp_wait+" - "+info.stamina_now+"とします");
			console.log("\t結果が"+(exp_wait - info.stamina_now)+"となるので、このスタミナ分だけ予想回復時間として待てばOKです");
			console.log("\t適切にスタミナを消費し続けることが前提として、最終的にLvUPまでに必要な自然回復時間は"+((exp_wait - info.stamina_now) * 3)+"分");
		*/
			_infoNode01.innerText = ("LvUP予測："+Math.floor((_info.exp_rest - _info.stamina_now) * 3/(60*24))+"日と"+Math.floor( (_info.exp_rest - _info.stamina_now) *3/60%24)+"時間"+( (_info.exp_rest - _info.stamina_now) *3%60)+"分後");
			_infoNode01.setAttribute("title" , fullrecovertime.toLocaleString());
			_infoNode01.setAttribute("style","color:orange;");
	
			//★このタイミングでタイマー起動要求★
			//ifやelseif関係なく、必ず起動要求しているのは　タイマー起動後にスタドリなどを飲んだ結果、タイマーを起動するべきでない経験値とスタミナの関係に戻った時、
			//0を送ってbackground.jsで起動されている経験値タイマーを破棄させるため
	
			// 48時間前にのみタイマー起動を許可
			if((48 * (1000 * 60 * 60)) >= _setrecovernum){
				requestTimer("exp", _sendrecovertimenum);
				saveOption("timevalue_exp_levelup",_sendrecovertimenum);	//値も保存
			}
			else {
				requestTimer("exp", 0);	//48時間超過は破棄
				saveOption("timevalue_exp_levelup", 0 );	//値もゼロタイムで保存
			}
	
		}
	
		//▲経験値とスタミナ計算式ここまで
	
	
	
	
	
		//▼配置作業-----------------------------
	
		_baseNode.appendChild(_tableNode);
		_baseNode.appendChild(document.createElement("hr"));
		_baseNode.appendChild(_infoNode01);
	
	
	
		return _baseNode;


	}

}


