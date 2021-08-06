//	idol_preset.js を作り直す感じで
//	女子寮への入寮呼び出しを行う操作パネル

class eventPresetStorage{

	constructor(){
	
		this.baseNode = document.createElement("div");
		let _btnParentNode = document.createElement("div");
			_btnParentNode.id = "mkt_idolpreset_btns";	//配置の目印
			_btnParentNode.setAttribute("style","background-color:#333333;text-align:center;padding:5px;");
		this.buttonParentNode = _btnParentNode;
		
		let _listParentNode = document.createElement("div");
			_listParentNode.style = "width:100%;font-size:13px;line-height:15px;user-select:none;";
		this.idolListParentNode = _listParentNode;
		
		//idol_preset_event.js で定義されてるグローバルオブジェクトを用いる
		this.eventDefineObj = eventSelectObj;
		
		this.markerNode = document.getElementById("card_lump_all");
		
		this.pageIdolListArray = [];	//表示中ページ内のアイドル名リスト配列
		this.callIdolListArray = [];	//background.jsで保持されている、アクティブにするイベントプリセットのアイドル名を【マージしたもの】
		
		this.systemType = getOption("eventpreset_system");	// 0:無効 1:一致 2:反転
		
		let _sysArr = [
			{text:"－",info:"無効中"}
			,{text:"正",info:"リストに一致するアイドルのみが選択されている状態です"}
			,{text:"反",info:"選択条件が反転している状態です"}
		];
		
		let _systemBtnParentNode = document.createElement("div");
			_systemBtnParentNode.style.display = "inline-block";
		this.systemBtnParentNode = _systemBtnParentNode;
		
		//無効,有効ボタン
		let _systemToggleBtn = document.createElement("button");
			_systemToggleBtn.className = "presetdisable";
			if(this.systemType == 0){
				_systemToggleBtn.classList.add("active");
			}
			_systemToggleBtn.textContent = "×";
			_systemToggleBtn.title = "機能の 有効/無効 を切り替えます"
			_systemToggleBtn.addEventListener("click",function(e){
				saveOption("eventpreset_system" , getOption("eventpreset_system")?0:1);	//挙動0
				location.reload();
			},false);
		this.systemTobbleBtnNode = _systemToggleBtn;
			
		//一致,反転 操作ボタン
		let _selectToggleBtn = document.createElement("button");
			_selectToggleBtn.textContent = _sysArr[this.systemType]["text"];
			_selectToggleBtn.title = _sysArr[this.systemType]["info"];
			_selectToggleBtn.addEventListener("click",function(e){
				if(this.systemType == 0){
					saveOption("eventpreset_system" , 1);
				}else if(this.systemType == 1){
					saveOption("eventpreset_system" , 2);
				}else if(this.systemType == 2){
					saveOption("eventpreset_system" , 1);
				}
				location.reload();
			}.bind(this),false);
		this.selectTobbleBtnNode = _selectToggleBtn;
	}
	
	//backgroundに保存されている、有効な呼び出しの【配列】を得る
	getActivePresetArray(){
		return getOption("eventpreset_active_array");
	}
	
	//対象のプリセット名を無効にする要求
	disablePresetName(_keyName){
		const _oldArr = getOption("eventpreset_active_array");
		const _newArr = _oldArr.filter(n => n !== _keyName);
		saveOption("eventpreset_active_array" , _newArr);
	}
	
	//対象のプリセット名を有効にする要求
	enablePresetName(_keyName){
		let _arr = getOption("eventpreset_active_array");
		_arr.push(_keyName);
		saveOption("eventpreset_active_array" , _arr);
	}
	
	//イベント名を冠した、各プリセットボタンをforで生成して返す
	//女子寮の入寮呼び出しで用いられる
	createButtonListNode(){
		let _parent = document.createElement("div");
		let _activeArr = this.getActivePresetArray();
		//idol_preset_event.js 上で定義されているオブジェクトから、表示名を参照している。
		for(var n in this.eventDefineObj){
			let _btn = document.createElement("button");
			_btn.textContent = this.eventDefineObj[n]["shortname"];	
			_btn.dataset["event_preset_name"] = n;
			_btn.title = getOption("eventpreset_" + n);
			//色を付ける
			if(_activeArr.includes(n)){
				_btn.className = "presetselect";
			}
			_btn.addEventListener("click",_e=>{this.onPresetBtnClick(_e);},false);
			_parent.appendChild(_btn);
		}
		return _parent;
	}
	
	//
	/** 上のメソッドで呼ばれる。プリセットボタンが押された時のイベントハンドラ
	 * イベントプリセットを有効or無効にしてリロード
	 * @param {*} _e 
	 */
	onPresetBtnClick(_e){
		console.log(_e);
		let _activeArr = this.getActivePresetArray();
		let _node = _e.target;

		let _presetName = _e.target.dataset["event_preset_name"];
		//含まれている or いない 場合に応じて、アクティブプリセットを更新してレイアウト変更する挙動
		if(_activeArr.includes(_presetName)){
			this.disablePresetName(_presetName);	//含まれている物が押されたので、解除振る舞い
			_e.target.className = "";
		}else{
			this.enablePresetName(_presetName);
			_e.target.className = "presetselect";
		}
		location.reload();	//リロ反映
		
	}
	
	/** クリック連動もするアイドルリスト(要素)を作成
	 * 
	 */
	createIdolListPanel(){
		this.pageIdolListArray.forEach(function(_name , _index){
			let singleItem = document.createElement("div");
			singleItem.className = "presetchecklist";
			singleItem.textContent = _name;
			singleItem.dataset["index"] = _index;
			if(this.systemType > 0){
				//呼び出し配列に名前が含まれていれば、アクティブ化
				//console.log( _name );
				if(this.isContainIdolFromPreset(_name)){
					if(this.systemType ==1){
						this.toggleCheckInput(_index , true);
						singleItem.classList.add("active");		
					}
				}
				//名前が含まれておらず、かつ mode 2(反転)ならそちらをアクティブ化
				else if(this.systemType == 2){
					this.toggleCheckInput(_index , true);
					singleItem.classList.add("active");	
				}
			}
			//クリック用ハンドラ
			singleItem.addEventListener("click",this.onIdolItemClick.bind(this),false);
			this.idolListParentNode.appendChild(singleItem);
		}.bind(this));
	}
	
	//上のメソッドで呼ばれる。アイドルのリストアイテムを単体クリックしたときのイベントハンドラ
	onIdolItemClick(e){
		e.target.classList.toggle("active");
		//保持していたindexを足掛かりに、チェックボックスを探す
		let _index = parseInt(e.target.dataset["index"] ,10);
		this.toggleCheckInput(_index , e.target.classList.contains("active"));
	}
	
	//対象indexのinputを、第二引数がtrueならチェック。falseなら解除するだけ
	toggleCheckInput(_index , _flag){
		//let _checkBox = document.querySelector("form > .idolStatus:nth-of-type("+(_index+1)+") > label > div > div.m-Btm5 > input");
		let _checkBox = document.querySelector(".area-frame_wrap > label#Label"+(_index+1)+" > div > div.m-Btm5 > input");
		if(!_checkBox){
			console.error(".chkboxの取得に失敗しました");
			return;
		}
	//	console.log(_index , _checkBox.checked);
		_checkBox.checked = _flag?"checked":"";
	}
	
	//ページ内ノードから、表示されているアイドル名の配列を得て、メンバ変数に格納
	getIdolListFromPageNode(){
		let _titleNodes = document.querySelectorAll(".area_card_status > .area_card_name > .card_name");
		if(_titleNodes.length == 0){
			return false;
		}
		_titleNodes.forEach(function(_node){
			this.pageIdolListArray.push(_node.textContent);
		}.bind(this));
		return true;
	}
	
	//そのアイドル名がページに含まれているか
	isContainIdoi(_name){
		return this.pageIdolListArray.some((_data) => _data === _name);
	}
	//そのアイドル名がアクティブプリセット内に含まれているか
	isContainIdolFromPreset(_name){
		return this.callIdolListArray.some((_data) => _data === _name);
	}
	
	/**
	 * 呼び出すアイドル名の配列をbackgroundから取得して、重複を除去したのち、メンバ変数に格納
	 */
	getCallIdolArray(){
		let _concatArr = [];
		//console.log( this.getActivePresetArray() );
		this.getActivePresetArray().forEach(function(_presetName){
			//console.log(getOption("eventpreset_" + _presetName));
			let _text = getOption("eventpreset_" + _presetName) || "";
			_concatArr = _concatArr.concat(_text.split("\n"));	//concatで配列結合
		}.bind(this));
		this.callIdolListArray = [...new Set(_concatArr)];	//重複除去
		//console.log( this.callIdolListArray );
	}

	
	
	mainProcess(){
		
		if(!this.markerNode){
			console.log("this.markerNodeが取得できませんでした");
			return;
		}
		
		this.getCallIdolArray();
		this.buttonParentNode.appendChild(this.createButtonListNode());	//ボタンノード群作成・セット
		this.buttonParentNode.appendChild( this.systemBtnParentNode );	//システムボタンノード群
		
		this.baseNode.appendChild( this.buttonParentNode );
		
		this.systemBtnParentNode.appendChild( this.systemTobbleBtnNode );	//有効無効
		this.systemBtnParentNode.appendChild( this.selectTobbleBtnNode );	//反転
		
		//
		if(this.getIdolListFromPageNode()){
			this.createIdolListPanel();
			this.baseNode.appendChild(this.idolListParentNode);
		}
		
		
		this.markerNode.parentNode.insertBefore(this.baseNode , this.markerNode);
		
	}
	
	
	
	
}