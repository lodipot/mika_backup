/** ガチャページのリミテなどを視覚化させるために作成
 * 
 */

 class GachaClass{

	constructor(){

	}

	/**
	 * ガチャページで実行される。URLに応じて実行
	 */
	router(){
		if(this.limited()){

		}
		else if(this.dreamLimited()){

		}
	}


	/** ガチャのリミテページで実行されると、残り人数を可視化する
	 * 処理が最後まで通れば true
	 */
	limited(){
		if(location.href.indexOf("%2Fidolmaster%2Fgacha%") == -1){
			return;
		}
		let _targetNode = document.querySelector(".area-frame_common > .area-frame_wrap > .area-frame_header + .gacha_award_block")
	//	console.log(_targetNode);
		if(!_targetNode){
			return;
		}

		let _numNode = _targetNode.querySelectorAll("div.t-Cnt > a + div.m-Btm4");
		if(_numNode.length < 1){
			return;
		}
	//	console.log(_numNode);
		let _maxCount = 0;
		let _nowCount = 0;
		//要素回してtextContentからmatchとparseIntやらのループで合計数値割り出し
		[..._numNode].map((n) => {
			let _parseArr = n.textContent.match(/([0-9]*) \/ ([0-9]*)人/);
			if(_parseArr && _parseArr.length == 3){
				let _now = parseInt(_parseArr[1],10);
				let _max = parseInt(_parseArr[2],10);
			//	console.log("count" , _maxCount , "max" , _max);
			//	console.log("count" , _nowCount , "max" , _now);
				_maxCount += _max;
				_nowCount += _now;
			}else{
				console.warn("リミテ人数解析に失敗" , n , n.textContent);
			}
		});

		//とりあえず上限50に満たなければ失敗扱いで
		if(_maxCount < 50){
			return;
		}

		//設置ノードは公式のデザインに近い物を意識
		let _setNode = document.createElement("div");
		let _spanBlue = document.createElement("span");
		let _spanNow = document.createElement("span");
		let _maxTextNode = document.createTextNode(" / " + _maxCount + "人");

		_setNode.className = "m-Top4 m-Btm4 t-Cnt";
		_spanBlue.className = "blue";
		_setNode.style.fontSize = "11px";
		_spanNow.style.color = "#ccffcc";
		_spanBlue.textContent = "限定アイドル";
		_spanNow.textContent = _nowCount;

		_setNode.appendChild(_spanBlue);
		_setNode.appendChild(document.createTextNode(" "));
		_setNode.appendChild(_spanNow);
		_setNode.appendChild(_maxTextNode);

		_targetNode.appendChild(_setNode);
		return true;
	}

	/**
	 * ガチャのドリリミトップで実行されると、残り人数を可視化する
	 * 処理が最後まで通れば true
	 */
	dreamLimited(){
		if(location.href.indexOf("%2Fidolmaster%2Fgacha%") == -1){
			return;
		}
		// 1～等の 「残り *8*/10 個」に当たる残数部分 
		// および 特等の 「残り *1*/1 個」に当たる残数部分
		const _targetAmountNodes = document.querySelectorAll(".area_award_limit_special > div , ._limited > div ")
	//	console.log(_targetAmountNodes);
		//特等+1～7等まであるので、8未満は検出失敗とした
		if(_targetAmountNodes.length < 8){
			return;
		}

		const _numNode = _targetAmountNodes;
		let _maxCount = 0;
		let _nowCount = 0;
		//要素回してtextContentからmatchとparseIntやらのループで合計数値割り出し
		[..._numNode].map((n) => {
			let _parseArr = n.textContent.match(/([0-9]*)[^\/]?\/[^0-9]?([0-9]*)/);
			if(_parseArr && _parseArr.length == 3){
				let _now = parseInt(_parseArr[1],10);
				let _max = parseInt(_parseArr[2],10);
				//console.log("count" , _maxCount , "max" , _max);
				//console.log("count" , _nowCount , "max" , _now);
				_maxCount += _max;
				_nowCount += _now;
			}else{
				console.warn("リミテ人数解析に失敗" , n , n.textContent);
			}
		});
		//console.log(_nowCount , "/" , _maxCount);

		//とりあえず上限250に満たなければ失敗扱いで
		if(_maxCount < 250){
			return;
		}

		const _markerNode = document.querySelector(".area-frame_common > .area-frame_wrap > .area-frame_line_dot");
		if(!_markerNode){
			//console.warn("ドリリミの個数は得られましたが、マーカーが見つかりません");
			return;
		}

		//設置ノードは公式のデザインに近い物を意識
		let _setNode = document.createElement("div");
		let _spanBlue = document.createElement("span");
		let _spanNow = document.createElement("span");
		let _maxTextNode = document.createTextNode(" / " + _maxCount + "個");

		_setNode.className = "t-Cnt";
		_spanBlue.className = "blue";
		_setNode.style.fontSize = "12px";
		_spanNow.style.color = "#ff9900";
		_spanBlue.textContent = "残りドリーム報酬";
		_spanNow.textContent = _nowCount;

		_setNode.appendChild(_spanBlue);
		_setNode.appendChild(document.createTextNode(" "));
		_setNode.appendChild(_spanNow);
		_setNode.appendChild(_maxTextNode);

		_markerNode.parentNode.insertBefore(_setNode , _markerNode);
	}

}