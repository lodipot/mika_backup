//@ run_at document_start
jsonData = null;
EVENTMODE = null;
var mainElm = null;

//▼URL確認
function urlCheck(_str){
	if(location.href.indexOf(_str) != -1){
		return true;
	}
	return false;
}
//▼ローカルファイルを使いたいときに呼ぶ関数。
function getFilePath(_path){
	//chrome.runtime.getURL("/***/+++.png");	というものがある？
	return chrome.extension.getURL( _path );
}
//▼タイマーリクエストをbackground.jsに送るだけの関数。引数はタイマータイプの文字列と、発動時間数値の２つ
function requestTimer(_type , _recoverTimeNum){
//	console.log("タイマーリクエスト送信" , _type , _recoverTimeNum);
	chrome.extension.sendRequest(
		{
			timer: _type ,
			recovertimenum : _recoverTimeNum
		}, function() {	}
	);
};
//▼jsonDataの中にある指定されたキーを返すだけ----------------
function getOption(_key){	
//	console.log(typeof(jsonData[key])　, "返却:"+jsonData[key]+"/key:"+key);
	if(!jsonData || jsonData[_key] === undefined){
		return null;
	}
	else {
		if(typeof(jsonData[_key]) == "object"){
			return jsonData[_key];
		}else{
			return JSON.parse(jsonData[_key]);
		}
	}
	return false;
}
//▼background.jsにセーブ要求を送る---------------------------
function saveOption(_getkey,_getvalue){
//	console.log("saveOption["+_getkey+"]="+_getvalue , typeof(_getkey) );
	jsonData[_getkey] = _getvalue;	//ローカルにも反映
	chrome.extension.sendRequest({
		status:"save",
		key: _getkey,
		value: _getvalue
	}, function(){});
};

// background.js の chrome.extension.onRequest.addListener へメッセージを送る----------
function BackgroundNotification(_type , _messageA , _messageB , _messageC){
	chrome.extension.sendRequest(
		{
			status: "notification" ,
			type: _type ,
			messageA: _messageA ,
			messageB: _messageB ,
			messageC: _messageC
		}, function() {	}
	);
};



function ClipBoardCopy(str){

	const _airNode =document.createElement("textarea");
	_airNode.textContent = str;
	document.body.appendChild(_airNode);
	_airNode.select();
	const _result = document.execCommand('copy');
	document.body.removeChild(_airNode);
	if(_result){
		//alert("クリップボードにコピーしました");
	}
	/*
	chrome.runtime.sendMessage({
		text: str
	});
	*/
};

//▼backgroundからのメッセージを受信する場合
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		var _title = request.title;
		var _value = request.value;
		if(_title && _value){
			titleAlart.process(_title , _value);
		}
      sendResponse({});
  }
);


function injectScriptFromStr(_code){
	const _injectScriptElm = document.createElement("script");
	_injectScriptElm.textContent = _code;
	document.documentElement.appendChild(_injectScriptElm);
}
/**
 * 関数を向こうのグローバルに埋め込むための処理
 * @param {*} _func 
 * @param {*} _argArr 
 * @param {*} callback 
 */
function injectScriptFromFunction(_func , _argArr = [] , callback = false){	
	const _injectScriptElm = document.createElement("script");
	_injectScriptElm.textContent = "("+_func+")('"+_argArr.join(",")+"');";
	document.documentElement.appendChild(_injectScriptElm);
	if(callback){callback();};
}

/*	テキスト状態のスキル説明文から、計算用のデータオブジェクトに変換して返す
	idolUnitの物を少し省略改造している
*/
function skillDataConvert(_textArr){
	
	function _localConv(_text){
		
		var retObj = {
			//フロントにかかるタイプ。ここがすべて 0 なら、mem_back が 1 になってるはず。
			type_cu:0
			,type_co:0
			,type_pa:0
			,type_my:0
			,debuff:0	//デバフなら真とする
			
			,mem_front:0	//フロントにかかるかどうか
			,mem_back:0		//バックメンバーにかかるかどうか
			
			
			,skill_min:0	//小,中,大,特大,極大,絶大,超絶を数値で表したもの
			,skill_max:0	//小,中,大,特大,極大,絶大,超絶を数値で表したもの
			
			,atk:0		//片面(攻 or 守)
			,def:0		//両方が 1 なら両面として判断

			,skill_val_arr:[]	//ランダム範囲を含む上昇値を配列で扱う
			,back_val_arr:[]	//バクメンの人数(ランダム範囲を含む)
		}

		if(_text.match("ﾀﾞｳﾝ")){
		//	console.log("デバフスキルと判断" , _text);
			retObj.debuff = true;
		}
		
		if(_text.match("ﾗﾝﾀﾞﾑで")){
		//	console.log("上昇ランダム範囲と判断");
			(function(){
				var Arr = _text.match(/(小|中|大|特大|絶大|極大|超絶)～(中|大|特大|絶大|極大|超絶|究極)/);
			//	console.log("★ランダム解析" ,Arr);
				if(Arr){
					retObj.skill_min = _bufType(Arr[1]);	//最小スキル
					retObj.skill_max = _bufType(Arr[2]);	//最大スキル
			//		console.log("範囲解析結果 / "+retObj.skill_min+ "～" +retObj.skill_max);
				}else{
					console.error("ランダム範囲の解析に失敗");
				}
			})();
		}else{
			//ランダムではないので、最小最大に同じ値を割り当てる
			var _ret_buf = _bufType(_text);
			retObj.skill_min = _ret_buf;
			retObj.skill_max = _ret_buf;
		}
		
		//スキル上昇文を解析する関数
		function _bufType(_text){
			var _retVal = 0;
			if(_text.match("究極")){
				_retVal = 9;	//	console.log("超絶");
			}
			if(_text.match("超絶")){
				_retVal = 8;	//	console.log("超絶");
			}
			if(_text.match(/大/)){
				_retVal = 4;	//	console.log("大");
			}
			if(_text.match("絶大")){
				_retVal = 7;	//	console.log("絶大");
			}
			if(_text.match("極大")){
				_retVal = 6;	//	console.log("極大");
			}
			if(_text.match("特大")){	
				_retVal = 5;	//	console.log("特大");
			}
			if(_text.match("中")){
				_retVal = 3;	//	console.log("中");
			}
			if(_text.match("小")){
				_retVal = 2;	//	console.log("小");
			}
			if(_text.match("極小")){
				_retVal = 1;	//	console.log("極小");
			}
			return _retVal;
		}
		
		//▽攻守
		var _atk_define = 0;
		if(_text.match("攻守")){
			_atk_define = 3;
			retObj.atk = 1;
			retObj.def = 1;
		}else if(_text.match("攻")){
			retObj.atk = 1;
			_atk_define = 1;
		}else if(_text.match("守")){
			_atk_define = 2;
			retObj.def = 1;
		}
		//DB用
		retObj["s_buff_type"] = _atk_define;
		
		//対象色 (あるいは自分のみ)
		var type_color_count = 0;
		if(_text.match("ｷｭｰﾄ[･|・]ﾊﾟｯｼｮﾝ")){
			retObj.type_cu = true;
			retObj.type_pa = true;
			type_color_count = 2;
	//		console.log("2色:Cute,Passion");
		}else if(_text.match("ｷｭｰﾄ[･|・]ｸｰﾙ")){
			retObj.type_cu = true;
			retObj.type_co = true;
			type_color_count = 2;
	//		console.log("2色:Cute,Cool");
		}else if(_text.match("ｸｰﾙ[･|・]ﾊﾟｯｼｮﾝ")){
			retObj.type_co = true;
			retObj.type_pa = true;
			type_color_count = 2;
	//		console.log("2色:Cute,Passion");
		}else if(_text.match("全ﾀｲﾌﾟ")){
			retObj.type_cu = true;
			retObj.type_co = true;
			retObj.type_pa = true;
			type_color_count = 3;
	//		console.log("全色明示");
		}else if(_text.match("自分の")){
			retObj.type_my = true;
	//		console.log("自分");
		}else if(_text.match(/ｷｭｰﾄ(ﾀｲﾌﾟ)?の/)){
			retObj.type_cu = true;
			type_color_count = 1;
	//		console.log("単色:Cute");
		}else if(_text.match(/ｸｰﾙ(ﾀｲﾌﾟ)?の/)){
			retObj.type_co = true;
			type_color_count = 1;
	//		console.log("単色:Cool");
		}else if(_text.match(/ﾊﾟｯｼｮﾝ(ﾀｲﾌﾟ)?の/)){
			retObj.type_pa = true;
			type_color_count = 1;
	//		console.log("単色:Pa");
		}
		
		if(!type_color_count){
	//		console.warn("type_color_countの判別に失敗 (対象が自分のみの可能性があります)",type_color_count);	
		}
		
	
		if(_text.match("及び")){
	//		console.log("フロント+バクメンスキル持ちと判断");
			retObj.mem_front = true;
			retObj.mem_back = true;
		}
		
		if(_text.match("ﾊﾞｯｸﾒﾝﾊﾞｰ上位")){
			retObj.mem_back = true;
	//		console.log("バクメン上位");
			var _backMemArr = _text.match(/ﾊﾞｯｸﾒﾝﾊﾞｰ上位([0-9]{1,2})人の/);
			var _backMemRandArr = _text.match(/ﾊﾞｯｸﾒﾝﾊﾞｰ上位([0-9]{1,2})～([0-9]{1,2})人/);
			var _min = 0;
			var _max = 0;
			var _retArr = [];
			if(_backMemArr){
	//			console.log("└バクメン上位人数", _backMemArr);
				_min = parseInt(_backMemArr[1] ,10);
				_retArr.push(_min);
			}
			else if(_backMemRandArr){
	//			console.log("└バクメン上位ランダム人数", _backMemRandArr);
				_min = parseInt(_backMemRandArr[1] ,10);
				_max = parseInt(_backMemRandArr[2] ,10);
				for(var x=_min; x<=_max; x++){
				//		console.log(x);
					_retArr.push(x);
				}
			}else{
				console.error("バクメン人数解析に失敗");
				return;
			}
			retObj.back_min = _min;
			retObj.back_max = _max;
	//		console.log(_min , _max , _retArr);	//データ確認
			retObj.back_val_arr = _retArr;
		}
		
		//フロントは偽 バクメンのみ真 → バクメンのみにかかる特技と判断させる
		var backmember_only = false;
		if(!retObj.mem_front && retObj.mem_back == true){
			backmember_only = true;
		}
		//↑でバクメンオンリーのフラグを立てられたので、フロントフラグを明示して保持できる
		else{
			retObj.mem_front = true;
		}
		
		//▲ここまでで、上昇値を算出するための値は出そろっている筈？


		//▼特技がかかる色をビットで示す	"自分, pa , co , cu"
		let _colorBitNum = 0	
		if (retObj["type_my"]){
			_colorBitNum |= 8;
		}
		else{
			if (retObj["type_cu"]){
				_colorBitNum |= 1
			}
			if (retObj["type_co"]){
				_colorBitNum |= 2
			}
			if (retObj["type_pa"]){
				_colorBitNum |= 4
			}
		}
		retObj["bit_color"] = _colorBitNum
		//console.log("特技色ビット値" , _colorBitNum);

		//▼特技の規模(範囲)をビットで示す 【※】DBの s_scale と同義
		let _skillScaleBitNum = 0;
		if (retObj["skill_min"] > 0 && retObj["skill_max"] > 0){
			let _sa = retObj["skill_max"] - retObj["skill_min"];
			for(let _n=0; _n<_sa+1; _n++){
				//console.log(_n);
				_skillScaleBitNum |= (1 << retObj["skill_min"]+_n-1)	//ビットシフトとorで記録
				//console.log(_skillScaleBitNum , "範囲を考慮した特技スケール値(ビット運用)")	
			}
			retObj["bit_skill"] = _skillScaleBitNum;
		}




		return retObj;
		//ｷｭｰﾄ･ﾊﾟｯｼｮﾝのﾌﾛﾝﾄﾒﾝﾊﾞｰ及びﾊﾞｯｸﾒﾝﾊﾞｰ上位4～5人の攻 極大ｱｯﾌﾟ	[冬のﾊｰﾓﾆｰ]水本ゆかり
	}
	
	//【▲】上の関数を配列で回し、スキルオブジェクトを配列化させる
	if(typeof(_textArr) != "object"){
		console.warn("_textArrを配列として認識できません s_txtを空の配列[]として扱います" , typeof(_textArr));
		_textArr = [];
	//	return;
	}
	
	
	var _retSkillObjArr = [];
	for(var _x=0; _x<_textArr.length; _x++){
		_retSkillObjArr[_x] = _localConv(_textArr[_x]);
	}
	
//	console.log(_retSkillObjArr);
	
	return _retSkillObjArr;	//配列で返す
}



/** オーディオを操作する事に特化させたクラス
 * ①オリジナルwindow空間上で実行されるスクリプトを上書きして、介入可能にする処理
 * ②介入可能にする ＝ DOM上のinputや、DOMに紐づいているdataset.volumeの値を元に、デフォルト音量を組み込ませる
 * 
 */
class AudioControllerClass{

	constructor(){
		//互いのwindow空間の懸け橋を担う共用ノード。 dataset を用いる。
		this.shareVolumeNode = document.createElement("span");
		this.shareVolumeNode.id = "mkt_volume_ctrl";

	}


	/** ▼ window.getAudio() 上書き用 (主にマイスタジオのボイス再生で用いられる)
	 */
	overwrite_ScriptFromGetAudio(){
		function getAudio(url) {
		//	console.log("getAudio() 内部/上書済");
			var audio = new Audio(url);
			var _volCtrlNode = document.getElementById("mkt_volume_ctrl");	//こっちは共有ノード 
			if(_volCtrlNode){
				let _parseVolume = parseFloat(_volCtrlNode.dataset.volume);
		//【！】audio.volumeは、設定できる値が 0～1 迄なので、1.0超過の場合は無理矢理 1 に戻す
				audio.volume = (_parseVolume > 1.0)?1:_parseVolume;
			}else{
				console.warn("missing #mkt_volume_ctrl");
			}
			if (/Android/.test(navigator.userAgent)) {
				audio.addEventListener('play', function(){ bgm_pause(); }, false);
				audio.addEventListener('ended', function(){ bgm_resume(); }, false);
			}
			audio.addEventListener('pause', function(){ bgm_resume(); }, false);
			return audio;
		}
		
		injectScriptFromStr(getAudio.toString());	//こっちは即時関数ではなく文字列化して埋め込み利用
	}

	/** ▼ window.boombox.get() 上書　(主に思い出エピソードのボイス再生で用いられる)
	 */
	overwrite_ScriptFromBoomboxGet(){
		let _injectPoolFunc = function(){
			try{
				boombox.get = function(a) {
					console.log("boombox.get() 内部/上書済");
					var _volCtrlNode = document.getElementById("mkt_volume_ctrl");
					if(_volCtrlNode){
						this.volume(_volCtrlNode.dataset.volume);
					}
					return this.pool[a];
				}
			}catch(e){
			//	console.log(e);
			}
		};
		injectScriptFromFunction(_injectPoolFunc);
	}

	/** ▼伝搬阻止埋め込み 空で埋めるので短い
	 */
	overwrite_ScriptFromBoomboxOnBlur(){

		injectScriptFromStr("if(window.boombox){ boombox.onBlur = function(){}; }");
	}

	/** サウンドブース用
	 * ゲージノードを探して、イベントを付与させる
	 */
	overwrite_ScriptFromHoge(){

		let _injectGaugeEvent_soundBoothFunction = function(){
			//ゲージノードを探して、boombox.poolで確保されているデータ音量を操作
			let _target = document.querySelector("#mkt_vol_gauge");	//ゲージノード
			_target.addEventListener("input",function(e){
				//ここで、共有ノードの値も変えておきたい
				let _volCtrlNode = document.getElementById("mkt_volume_ctrl");	//こっちは共有ノード
				if(_volCtrlNode){
					_volCtrlNode.dataset.volume = e.target.value;
					//特殊グローバル変数やな...
					window.mkt_audio_controller_anchor.volume = e.target.value;
				}
			},false);
		};
		injectScriptFromFunction(_injectGaugeEvent_soundBoothFunction);
	}

	/** サウンドブース用
	 * 
	 */
	overwrite_ScriptMusicTheater_audioplayer(){
		//DOMでのscript(公式window空間)上書き用
		function _injectFunction() {
			if(__musicTheater.HlsAudioPlayer.prototype.play){
				__musicTheater.HlsAudioPlayer.prototype.play = function(){
					let _volCtrlNode = document.getElementById("mkt_volume_ctrl");	//こっちは共有ノード
					if(_volCtrlNode){
						this.audio.volume = _volCtrlNode.dataset.volume;
						//無理矢理だけど、window空間に放り投げて、別の埋め込んだ関数から操作させる
						window.mkt_audio_controller_anchor = this.audio;
					};
				   this.audio.play();
				}
			}
		}
		injectScriptFromFunction(_injectFunction);	//こっちは即時関数ではなく文字列化して埋め込み利用
	};

	/** 共用ノードに対して daaset を操作する。
	 * 　saveOptionでの繁栄も同時に。
	 * 
	 * @param {*} _volume 
	 */
	setShareVolumeDataset(_volume){
		let _setVol = parseFloat(_volume);
		this.shareVolumeNode.dataset["volume"] = _setVol;
		saveOption("system_volume_change_value" , _setVol);
	}

	
	/**
	 * 操作用Inputノードをみつけたら操作時に あちらのwindow空間上にある boombox へ
	 * 影響を与えるイベントを貼り付けを含んだ処理を埋め込むメソッド
	 */
	setInjectScriptOfInputNodeEventListener(){
		let _Func = function(){
			let _target = document.querySelector("#mkt_vol_gauge");	//ゲージノード
			let _volCtrlNode = document.getElementById("mkt_volume_ctrl");	//こっちは共有ノード
			_target.addEventListener("input",function(e){
				boombox.pool[Object.keys(boombox.pool)[0]].volume(e.target.value);
				//ここで、共有ノードの値も変えておきたい
				if(_volCtrlNode){
					_volCtrlNode.dataset.volume = e.target.value;
				}
			},false);
			
			//タッチ→音声再生系の要素がに、クリックすると、即座にvol反映する簡易リスナも同時登録
			document.querySelector('#voiceTouch').addEventListener('click',function(){
				boombox.volume(_target.value);
			},false);
		};
		injectScriptFromFunction( _Func );
	}

	/** 音量ゲージ操作用のInputノードを作成して返す。
	 *	リスナ組み込み済
	 */
	createVolumeInputRangeNode(){
		console.log("by .createVolumeInputRangeNode()");

		let _inputRange = document.createElement("input");
		_inputRange.id = "mkt_vol_gauge";
		_inputRange.type = "range";
		_inputRange.style.width = "150px";
		_inputRange.max = 1;
		_inputRange.min = 0;
		_inputRange.step = 0.05;
		_inputRange.value = this.shareVolumeNode.dataset.volume;	//ノードからとる

		//ゲージ調整でcontentScript側挙動
		_inputRange.addEventListener('input',function(e){
			saveOption("system_volume_change_value" , parseFloat(e.target.value));	//少数で
			e.target.title = e.target.value;
		},false);

		return _inputRange;
	};


}

//▼オーディオ操作インスタンス
//audio_volume.js と first_load.js あたりで利用している気がする
let audioController = new AudioControllerClass();



//アニメーション演出ページの margin-topを操作する公式処理に介入させる
if(location.href.indexOf("idolmaster%2Fsmart_phone_flash%2F") != -1){

	injectScriptFromFunction(function(){

		window.addEventListener("DOMContentLoaded",
			function(){
				console.log("run_at:document_start -> DOMContentLoaded");
				if(typeof marginTop === "number"){
					if(document.body){
						//グローバルにあるmargin参考数値用の変数を弄り、強制的に0にする
						marginTop = 0;
					}else{
						console.log("missing body..");
					}
					//タッチして次の処理、というイベント領域が 最前面の全体に張り付けられている為、
					//ここでmarginTopを加えて下へずらしている
					let _voiceTouchNode = document.getElementById("voiceTouch");
					if(_voiceTouchNode){
						_voiceTouchNode.style.top = "100px";
					}else{
						//再生の無いシーン、いわゆる他の演出アニメーションページでは、このノードは得られない
						console.log("missing #voiceTouch element by common_scripts.js");
					}
				}
			}
		,false);
	});

}

/** アイドルデータを得るために鯖に繋ぐクラス
 */
class AttachIdolDataServerClass{
	constructor(){
		//↓格納用配列 { hash:"ハッシュ" , node:imgノード , data:"鯖から得た情報" }
		this._apiURL =  "http://mkt.packetroom.net/idoldata/";
	}

	/** ハッシュ配列を与え、そこから鯖にアタッチしてデータを取得する
	 * @param {*} _setHashArray 
	 * @param {*} _callback 
	 */
	asyncGetIdolDataFromHashArray(_setHashArray , _callback){
		this._callback = _callback;
		this._retObjectArray = [];
		this._setHashArray = _setHashArray;
		this._requestServerData( 0 );
	}
	
	/** サーバーに対して、そのindex (this.getHashArray で保有済)の
	 * ハッシュに対応するアイドル情報を再帰方式で取得しに行く
	 * indexがlengthを超過時に再帰処理は終了。
	 * @param {Array<string>} _hashArrayIndex 
	 */
	_requestServerData(_hashArrayIndex){

		let _setHash = this._setHashArray[_hashArrayIndex];
		let _setQueryUrl = this._apiURL + "?hash=" + _setHash;

		fetch(_setQueryUrl).then((res) =>{
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
			this._retObjectArray.push(_chainObj);
		}).catch(e=>{
			console.error(e);
		}).finally(e=>{
		//	console.log("必ず実行される");
			//結果如何に関わらず、再帰呼び出し
			_hashArrayIndex++;
			if(this._setHashArray.length - 1 < _hashArrayIndex ){
				this._callback(this._retObjectArray);
			}else{
				this._requestServerData(_hashArrayIndex);
			}
		});

	}

	/** srcといった画像URLから、正規表現でハッシュ値のみを抜き出す
	 * 	※ 32文字であることが前提
	 * @param {*} _imageurl 
	 */
	_getHashStrFromIdolImageURL(_imageurl){
		//hashを32文字とする
		let _matchArr = _imageurl.match(/%2F([0-9a-g]{32})\./);
		let _resultStr = undefined;
		if(_matchArr && _matchArr.length == 2){
			_resultStr = _matchArr[1];
		}
		return _resultStr;
	}

}
