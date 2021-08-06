/*イベント編成記憶
アイドル一覧 , イベント編成 , 通常攻守編成 で呼ばれる
①記憶フラグがONになっていれば、メイン関数呼ばれる毎に、常にbackground.jsに一覧データを送信する
　└background.jsでは常に値を上書きして保存されている
②resetボタンを押すと、background.jsで保持されているデータは破棄される
③sendボタンを押すと、background.jsに固有IDとアイドル名を全てとりに行く
　└返って来たデータを subfunc_event_deck_formset() に処理させる
*/


class idolPresetClass {
	constructor(){
		document.body.addEventListener("keydown" , this.KeyDown_EventhHandler);
		this.prevMemberPanelBaseNode;
		this.prevMemberPanelInfoNode;
		this.entryButtonNode = document.createElement("button");	//登録ボタン
		this.eventDeckMemberIndexObj = [];

		this.backGroundIdolDataObj = {};	//background.jsから引き出したのを格納
		
		this.eventDefineObj = eventSelectObj[getOption("eventpreset_active_keyname")];

		let _maxFrontMember = this.eventDefineObj["maxFrontMember"];
		if(!_maxFrontMember){
			throw new Error("maxFrontMember が取得できませんでした");
		}

		this.maxFrontMember = _maxFrontMember;			//ﾌﾛﾝﾄﾒﾝﾊﾞｰ上限
		this.maxUnitMember = this.eventDefineObj["maxUnitMember"];			//ユニットメンバー上限
		this.zIndexAreaNode;	// 最前面用のノードとして使う

	}
	
	/**
	 *  キーイベント。Escでユニット編成の表示モードをOFF
	 * @param {*} e 
	 */
	KeyDown_EventhHandler(e){
		if(e.key == "Escape"){
			console.log("キャンセル判定");
			saveOption("idolpreset_event_ui_show" , 0);
		}
	}

	/**
	 * 表示中のページが、イベントのフロントメンバー編成リストページかどうか
	 */
	isEventFrontMemberListPage(){
		if(location.href.indexOf("event_deck_edit%3Fdeck%3D1%26position%3D1")!=-1){
			return true;
		}
		else if(location.href.indexOf("position%3D2")!=-1){
			return false;	//バクメンページ
		}
		else if(location.href.indexOf("%2Fevent_deck_edit%3Fdeck%3D")!=-1){
			return true;
		}
	}
	/**
	 * 表示中のページが、イベントのバックメンバ編成リストページかどうか
	 */
	isEventBackMemberListPage(){
		return location.href.indexOf("position%3D2") != -1;
	}

	/** アイドル名から、backgroundで保持している、管理ID等含んだオブジェクトを取得
	 * 存在しなければ undefined が返る
	 * @param {*} _name 
	 */
	getBackGroundCardDataFromName(_name){
		return this.backGroundIdolDataObj[_name];
	}

	/**アイドル名から、編成ページで取得,保持した実位置Index 0～を取得。
	 * 存在しない場合は undefined を返す
	 */
	getDeckPageCardDataFromName(_name){
		const _tempObj = this.eventDeckMemberIndexObj;
		//console.log(_name , _tempObj);
		for(let _key in _tempObj){
			if(_name === _tempObj[_key]){
				return parseInt(_key);
			}
		}
		return undefined;
	}

	/** キャンセル趣旨のボタンを作成
	 * 編成パネルの表示や処理を閉じる。
	 */
	generateCancelButtonNod(){
		//キャンセルボタン
		let _cancelBtn = document.createElement("button");
		_cancelBtn.textContent = "キャンセル";
		_cancelBtn.style.display = "block";
		_cancelBtn.style.margin = "0 auto";
		_cancelBtn.addEventListener("click", e=>{
			saveOption("idolpreset_event_ui_show",0);
			//コントロールパネルを除去
			this.zIndexAreaNode.parentNode.removeChild( this.zIndexAreaNode );
		},false);

		return _cancelBtn;
	}

	/** オブジェクト上にて指定・定義されているイベント編成URLへ直接移動する。
	 * 遷移処理が確定していれば true そうでなければ false
	 */
	jumpEventDeckIndexURL(){
		//グローバルの定義取り出し
		let _eventDefineObj = this.eventDefineObj;
		let _deckIndexURL = _eventDefineObj["deckIndexURL"];
		//URL文字列が変更になってしまうので、書き換えで対応
		let _matchUrlStr = location.href.replace("&amp;" , "&");
		//表示中のページが、移動先のページと判断されなければ、そこへ遷移開始
		if(_matchUrlStr.indexOf( _deckIndexURL ) == -1){
			location.href = _deckIndexURL;
			return true;
		}
		return false;
	}

	/** バクメン配置ページに移動するだけ
	 * 
	 */
	jumpEventBackmemberDeckURL(){
		//グローバルの定義取り出し
		let _eventDefineObj = this.eventDefineObj;
		let _deckIndexURL = _eventDefineObj["deckIndexURL"];
		//バクメン用ページのURLを末尾につけて、単純にアクセス
		location.href = _deckIndexURL + "%26position%3D2";
	}

	


	testHoge(){
		/*	判定には3つのリストを用意する必要がある
		①アイドル名の文字列が要素となっている、ユーザー定義のイベ編成リスト(配列)
		②所属アイドル一覧からbackground.jsへ送信&保存した、アイドル名がkey,管理IDがvalueとなっているオブジェクト
		③表示中のイベ編成ページで実際に配置済みとなっているアイドル名が要素になった配列リスト
		*/

		//ユーザー定義の編成リスト
		const _eventPresetText = this.getActivePresetName() || "";
		const _eventPresetArray = _eventPresetText.split("\n");

		//表示中イベント編成ページで、実際に配置されているアイドルのリスト

		const _isFrontPage = this.isEventFrontMemberListPage();
		const _isBackMemberPage = this.isEventBackMemberListPage();

		//(イベ編成の))ページ上に配置されたアイドルのリスト
		this.eventDeckMemberIndexObj = this.getEventDeckIdolIndexList();

		console.log(this.eventDeckMemberIndexObj);

		let _judgeArr = [];

		//対象プリセット配列を回して、ID保持の有無や配置済みの場合の序列を得たのち、
		//管理IDと、実配置deck_indexを格納する
		_eventPresetArray.forEach((_presetIdolName , _arrayIndex)=>{
			if(!_presetIdolName || _presetIdolName.length < 2){
				//改行とか、スペース系とか、アイドル名が不正と判定すれば、何もしない
			}else{
				const _cardData = this.getBackGroundCardDataFromName(_presetIdolName);
				let _cardId , _getTime;
				if(_cardData){
					if(_cardData["id"]){
						_cardId = _cardData["id"];
					}
					if(_cardData["get_time"]){
						_getTime = _cardData["get_time"];
					}
				}
				let _valueObj = {
					"name":_presetIdolName,
					"card_id": _cardId ,
					"get_time": _getTime ,
				};
				const _deckMemberIndex = this.getDeckPageCardDataFromName(_presetIdolName);
				if(_deckMemberIndex != undefined){
					_valueObj["deck_index"] = _deckMemberIndex;
				}
				_judgeArr.push(_valueObj);
			}
		});
		//上のforEach抜けで、_judgeArrが完成する

		//今しがた作った配列を回して、表を作成
		let _areaNode = document.createElement("div");

		let _nexpAppendIdolObj = {
		};

		// 配置位置が不正なアイドルを最初の一人分だけ検出する
		let _wrongIndexIdolObj = {
		};

		console.table( _judgeArr );
		const _nowDate = new Date();
		const _nowTime = _nowDate.getTime();

		_judgeArr.forEach((_obj , _index)=>{
			let _lineDiv = document.createElement("div");
			_lineDiv.className = "mkt_idolpreset_event_btn";	//共通レイアウト ( mystyles.css 依存 )
			let _idolNameSpan = document.createElement("span");
			let _idolSetStatusMarkerNode = document.createElement("span");
			_lineDiv.appendChild( _idolSetStatusMarkerNode );
			_idolSetStatusMarkerNode.className = "set_status";
			let _name = _obj["name"];
			let _deckIndex = _obj["deck_index"];
			let _cardId = _obj["card_id"];
			_idolNameSpan.textContent = _name;
			_lineDiv.style.cursor = "help";

			let _titleMessage;
			
			//保持している配置メンバーのindexが未取得の場合
			if(_deckIndex == undefined){
				_lineDiv.classList.add("non_detection");
				_idolSetStatusMarkerNode.textContent = "❓";//"➖";//
				_titleMessage = "現在表示中のページでは、\n" +_name + "の編成や序列を検出できません";

				if(_nexpAppendIdolObj["name"] == undefined){
					//ここを次の配置アイドルとする
					//ただし、バックグラウンドページにおいては、先頭10人(10人 < (_index+1))まではこの条件であっても省く
					if(_isBackMemberPage && this.maxFrontMember < (_index+1) ){
						_nexpAppendIdolObj["name"] = _name;
						_nexpAppendIdolObj["preset_index"] = _index;
						_nexpAppendIdolObj["card_id"] = _cardId;
					}else if(_isFrontPage){
						//フロントメンバーページなら、無条件で上から順に未配置のアイドルをターゲットとする
						_nexpAppendIdolObj["name"] = _name;
						_nexpAppendIdolObj["preset_index"] = _index;
						_nexpAppendIdolObj["card_id"] = _cardId;
					}
				}

			}
			else if(_index == _deckIndex){
			// _judgeArr の index と、保持している配置メンバーindexが同じなら、配置済みとして判断
				_lineDiv.classList.add("seted");
				_idolSetStatusMarkerNode.textContent = "✅";
				_titleMessage = _name + "は、\nプリセット通りの正しい順番で配置されています";
			}
			else if(_index != _deckIndex){
				// 表記上では配置済みだが、プリセットとの序列が食い違う場合
				_idolSetStatusMarkerNode.textContent= "⚠️";//"🔴";//"❌";
				_lineDiv.classList.add("wrong_index");
				_titleMessage =  _name + "は、\nプリセットと異なる順番で配置されています\nプリセット上:"+(_index+1)+"番目 / 実配置:"+(_deckIndex+1)+"番目";
					
				if(_wrongIndexIdolObj["name"] == undefined){
					//リーダー位置(_unitMemberIndex:0かつ_isFrontPageがtrue)にいるアイドルはズレていても影響がないので、不正位置と判断させない
					if(_deckIndex > 0){
						_wrongIndexIdolObj["name"] = _name;
						_wrongIndexIdolObj["preset_index"] = _index;
						_wrongIndexIdolObj["deck_index"] = _deckIndex;
						_wrongIndexIdolObj["card_id"] = _cardId;
					}
				}
			}

			// backgroundでcard_idを取得,保持できているかどうか
			if(_cardId == undefined){
				_lineDiv.style.opacity = 0.8;
				_lineDiv.classList.add("blank_id");

				_idolSetStatusMarkerNode.textContent= "⛔️";//"✖️";
				
				_titleMessage = _name + "のIDが取得・管理できていません\n女子寮から引き出した直後は、IDを取得・管理する為に、\n一度、所属アイドル一覧のページを巡回表示させてください\n";
			}

			if(_titleMessage){		_lineDiv.title = _titleMessage;	}

			//バクメンの仕切り
			if(this.maxFrontMember == _index){
				_areaNode.appendChild( document.createElement("hr") );
			}
			//あぶれたメンバーの仕切り
			else if(this.maxUnitMember == _index){
				_areaNode.appendChild( document.createElement("hr") );
			}


			_lineDiv.appendChild( _idolNameSpan );
			
			// 所属アイドルとしての取得時間を表記
			{
				//console.log(_obj);
				const _timeInfoNode = this.generateTimeInfoNode( _nowTime , _obj["get_time"]);
				_lineDiv.appendChild( _timeInfoNode );
			}
			_areaNode.appendChild( _lineDiv );
		});
		// forEachここまで

		let _styleStr = "width:300px;margin:0px auto;background-color:#333;padding:3px;";

		//▼配置がずれているアイドルを検出したら、ユニットから外す操作を促す
		let _removeIdolBtnNode;
		if( _wrongIndexIdolObj["name"] ){
			let _removeIdolName = _wrongIndexIdolObj["name"];
			let _removeCardId = _wrongIndexIdolObj["card_id"];
			let _presetIndex = _wrongIndexIdolObj["preset_index"];	//本来のindex
			let _deckIndex = _wrongIndexIdolObj["deck_index"];	//実際に(異なって)配置されていたindex
			let _message = _removeIdolName +"が"+(_deckIndex+1)+"番目に配置されています。本来は"+(_presetIndex+1)+"番目です\nユニットから一度外してください";
			console.log( _message );
			//外すボタンを作成
			_removeIdolBtnNode = document.createElement("button");
			_removeIdolBtnNode.textContent = (_removeIdolName + "を外す");
			_removeIdolBtnNode.addEventListener("click",e=>{
				this.removeActionFromCardId( _removeCardId , _deckIndex);
			},false);

		}

		//配置ボタンとなるノード
		let _appendIdolButtonNode;
		//管理IDが見つからない旨を表示させるノード
		let _missingCardIdInfoNode;
		{
			let _idolName = _nexpAppendIdolObj["name"];
			let _cardId = _nexpAppendIdolObj["card_id"];
			let _presetIndex = _nexpAppendIdolObj["preset_index"];	//本来のindex
			let _message;


			//指定人数+1に達した場合は、その他メンバーとしてボタン処理を行わない
			if(_presetIndex + 1 > this.maxUnitMember ){
				_missingCardIdInfoNode =  document.createElement("div");
				_missingCardIdInfoNode.setAttribute("style" , _styleStr);
				_message = "全バックメンバー正常配置済と判断されています";
				_missingCardIdInfoNode.textContent = _message;
			}else{

				//このアイドルを配置するべきと判断された
				if(_idolName){


					//管理カードIDが存在するので、配置が可能
					if(_cardId){

						_appendIdolButtonNode = document.createElement("button");

						//次に配置するアイドルの序列(対象)が、バクメンの頭(11番目や6番目等)であり、
						//かつ、現在のページがバクメンページ以外なら、混乱回避の為に、バクメン配置情報を直接submitするボタン処理ではなく、
						//「イベント編成のバクメンページ」へ飛ばすだけのボタンを1つ噛ませる
						if(this.isEventBackMemberListPage() == false && this.maxFrontMember <= _presetIndex){
							_message = "バックメンバー配置ページへ移動します";
							_appendIdolButtonNode.addEventListener("click",_e=>{
								console.log( this.jumpEventBackmemberDeckURL() );
							},false);
						}else if(this.isEventFrontMemberListPage() == false && this.maxFrontMember > _presetIndex){
							_message = "フロントメンバー配置ページへ移動します";
							_appendIdolButtonNode.addEventListener("click",_e=>{
								console.log( this.jumpEventDeckIndexURL() );
							},false);

						}else{

							_message = _idolName +"を\n"+(_presetIndex+1)+"番目に配置します";
							_appendIdolButtonNode.addEventListener("click",_e=>{
								
								let _formNode = this.addActionFromCardData(_idolName , _cardId , (_presetIndex + 1) );
								document.body.appendChild( _formNode );
								//console.log( _formNode );
								//送信
								_formNode.submit();
								//最高人数に達したら、処理を終了
								if(_presetIndex + 1 == this.maxUnitMember){
									saveOption("idolpreset_event_ui_show" , 0);
									BackgroundNotification("default" , "イベント編成" , "イベント編成モードを終了します");
								}
								
	
							},false);

						}

						_appendIdolButtonNode.textContent = _message;
		
					}
					//ID未取得なので、配置できない旨を表示
					else{
						_missingCardIdInfoNode =  document.createElement("div");
						_missingCardIdInfoNode.setAttribute("style" , _styleStr);
						_message = _idolName +"を"+(_presetIndex+1)+"番目に配置しようとしましたが、\n管理IDを取得できませんでした";
						_missingCardIdInfoNode.textContent = _message;
					}
		
				}else{
					_message = "配置対象となるアイドルが検出できませんでした";
				}

			}


			console.log( _message , _nexpAppendIdolObj );
		}
		
		
		//最前面表示基本エリア
		let _zIndexBaseNode = document.createElement("div");
		let _parentAreaNode = document.createElement("div");
		_parentAreaNode.style.margin = "auto";

		// 一度プロパティに登録
		this.zIndexAreaNode = _zIndexBaseNode;
		_zIndexBaseNode.setAttribute("style","top:0px;left:0px;width:100%; height:100%; position: fixed;background-color:rgba(0,0,0, 0.4); z-index: 10000; text-align:center; ");

		//キャンセルボタンは別メソッドで生成したものを登録
		_parentAreaNode.appendChild( this.generateCancelButtonNod() );
		//_zIndexBaseNode.appendChild( _appendIdolInfoArea );
		
		//配置精査に引っかかって、リムーブ処理用のボタンが作られていれば配置
		//このケースなら、編成ボタンが用意されていても表示させない
		if( _removeIdolBtnNode ){
			_parentAreaNode.appendChild( _removeIdolBtnNode );
		}
		else if(_appendIdolButtonNode){
			//アイドル編成ボタンが作られていれば配置
			_parentAreaNode.appendChild( _appendIdolButtonNode );
		}


		//カードIDが得られず、そのエラーメッセージノードが作られていれば配置
		if( _missingCardIdInfoNode ){
			_parentAreaNode.appendChild( _missingCardIdInfoNode );
		}
		_parentAreaNode.appendChild( _areaNode );

		_zIndexBaseNode.appendChild( _parentAreaNode );
		document.body.appendChild( _zIndexBaseNode );

	}

	//その管理IDのアイドルをユニットから外す操作(URLへ遷移)
	//第二引数の index は、直接操作に関係ないが、このパラメタを設定しないと、
	//処理後の戻り先が フロントタブかバクメンタブかで異なる
	removeActionFromCardId( _cardId , _deckIndex){
		//グローバルの定義取り出し
		let _eventDefineObj = this.eventDefineObj;
		let _eventURL = _eventDefineObj["event_url"];
		let _unitDeckNumber = _eventDefineObj["valueNum"];
		let _positionValue = (_deckIndex+1)<11?"1":"2";	//フロントへ戻るなら1,バクメンへ戻るなら2

		let _removeSuffix = "deck_remove_card_check%3Frs%3D"+ _cardId +"%26deck%3D"+ _unitDeckNumber +"%26position%3D" + _positionValue;
		let _jumpURL = _eventURL + _removeSuffix;
		console.log("remove..", "deckIndex" , _deckIndex ,"positionValue", _positionValue);
		console.log( _jumpURL );
		location.href = _jumpURL;
	}
	

	/** 実際に配置の為に必要な情報を送るformノードを作成・返却する
	 * これは、上部に表示される配置ボタンのイベント処理内で用いられる
	 * 
	 * @param {*} _idolName 
	 * @param {*} _cardId 
	 * @param {*} _count 1～20を想定
	 */
	addActionFromCardData(_idolName , _cardId , _count){
		let _EventObj = this.eventDefineObj;	//グローバルの定義取り出し

		let _actionURL = _EventObj["actionURL_M"]+(_count<=10?"1":"2");	//★イベント
		if(_count == 1){
			_actionURL = _EventObj["actionURL_L"];	//★イベント
		}

		let _formElm = document.createElement("form");

		_formElm.name ="select_form";
		_formElm.action = _actionURL;
		_formElm.method = "post";

			let _inputElm01 = document.createElement("input");
			_inputElm01.type = "hidden";
			_inputElm01.name =(_count!=1?"rs":"sleeve");	//1ならリーダー	rsだとエラーが出る？ r にしてみる
			_inputElm01.value = _cardId;	//ID
			_formElm.appendChild(_inputElm01);

			let _inputElm02 = document.createElement("input");
			_inputElm02.type = "hidden";
			_inputElm02.name = _EventObj["nameValue"];
			_inputElm02.value = _EventObj["valueNum"];	//★0で無効.あとはユニット番号1～3
			_formElm.appendChild(_inputElm02);
			


			//Uncaught SyntaxError: Unexpected token u が出る
			let _inputSubmitElm = document.createElement("input");
				_inputSubmitElm.className = "mkt_idolpreset_event_btn";
				_inputSubmitElm.id = "mkt_idolpreset_event_dummey_id";	//documentに埋め込んでいるのに、Form submission canceled because the form is not connectedが出るので仕方なく。

				
			if(!_cardId){
				_inputSubmitElm.disabled = true;
				_inputSubmitElm.style.opacity = 0.6;
				_inputSubmitElm.style.cursor = "not-allowed";
			}

			_inputSubmitElm.value = _idolName;
			_inputSubmitElm.type = "submit";
			_formElm.appendChild(_inputSubmitElm);

		//	console.log(_formElm);
		return _formElm;

	}

	/** 解説,説明用のノードを作って返すだけ
	 * 
	 */
	createMemberPanelInfoNode(){
		let _setBaseElm = document.createElement("div");
		_setBaseElm.setAttribute("style","font-size:11px;font-weight:normal;");
		let _setTitle = document.createElement("div");
		_setTitle.textContent = "表示中のイベント編成ページ上で検出されたアイドルは、「編成済み」扱いとして赤枠でマーキング表示されます。";
		_setTitle.setAttribute("style","background-color:#c0c0d0;color:black;padding:5px;text-align:center;border:2px solid red;");
		_setBaseElm.appendChild( _setTitle );
		return _setBaseElm;
	}
	

	/** そのページ(所属アイドル一覧)にあるアイドル群からIDを得て、
	 * アイドル名:ID のキーペアオブジェクトで返す。例外が起きれば false を返す
	 * このペアオブジェクトは、background.jsへ常に送信する為に用いられるケースを想定
	 */
	getIdolListObjectFromPage(){
		let _nameAreaLinkElms = document.querySelectorAll(".area_card_status > a > .card_name");
		let _retDeckObj = {	};

		//▼要素を探って"アイドル名":ID で格納
		[..._nameAreaLinkElms].forEach(_e => {
			let _idolName;
			let _idolID;
			try{
				_idolName = _e.textContent;
				//_idolID = _e.parentNode.href.match(/desc%2F([0-9]{1,})/)[1];
				_idolID = _e.parentNode.dataset["popup_sleeve_id"];
			}catch( e ){
				console.error(e);
				return false;
			}
		//	console.log(_idolName +" / "+_idolID);
			if(_idolName && _idolID){
				_retDeckObj[_idolName] = {
					"id":_idolID
				};
			}
		});
	//	console.log(_retDeckObj);
		return _retDeckObj;	//【！】これがそのまま呼び出し先でbackground.jsに送られる
	}
	

	/** 上のメソッドと趣旨は同じ
	 * イベ編成ページの入れ替えノードで .front_member_list と .back_member_list があるので、
	 * それを利用して、管理IDを取得して返す
	 */
	getIdolListObjectFromEventChangePageNode(){
		let _frontNode = document.querySelector(".front_member_list");

	}

	/** アクティブな登録先のイベントプリセット名を得る
	 * 
	 */
	getActivePresetName(){
		return getOption("eventpreset_" + getOption("eventpreset_active_keyname"));	
	}


	/** イベント編成ページ上で既に配置されているアイドルのリストを取得し、リスト化させたオブジェクトを返す。
	 * { "0":"高森藍子" , "1":"藤原肇" } みたいな感じ
	 * [0]が無条件リーダーで[1]がﾌﾛﾝﾄﾒﾝﾊﾞｰ序列2またはバクメン序列1...みたいな感じ
	 */
	getEventDeckIdolIndexList(){
		//const _nameListNodes = document.querySelectorAll("div.idolStatus.clearfix > h4.nameArea > a > div > div.name");
		//2018/12/11に変更
		//const _nameListNodes = document.querySelectorAll("div.jsIdolStatus > div.area_card_status > a > div.card_name");
		//2019/01/04に変更
		//const _nameListNodes = document.querySelectorAll("div.idolStatus.clearfix > div.area_card_status > a > div.card_name");
		//2019/02/06に変更(ドリフ)
		const _nameListNodes = document.querySelectorAll("div > div.area_card_status > a > div.card_name");
		
		let _isBackMember = this.isEventBackMemberListPage();
		let _tempObj = {};
		// 
		[..._nameListNodes].forEach((_node , _index)=>{
			let _setKeyIndex = _index;
			//バクメンページかつ、indexが0以外(以上)なら、(フロントメンバー分数-1)を上乗せする。
			//これはページ上でのバクメンも、例えば11人目ならindexが0となってしまう為
			if(_isBackMember && _index > 0){
				_setKeyIndex = _index + (this.maxFrontMember - 1)
			}
			_tempObj[_setKeyIndex] = _node.textContent;
		});
		return _tempObj;
	}

	/**
	 * N秒やN分前に取得した、という旨を表示する単体のノードを作成して返す
	 * @param {*} _nowTime 現在の時刻値
	 * @param {*} _targetTime 取得時の時刻値
	 */
	generateTimeInfoNode(_nowTime , _targetTime){
		//console.log(_nowTime , _targetTime);
		const _baseNode = document.createElement("span");
		_baseNode.style.float = "left";
		if(!_targetTime){

		}else{
			//差の時間を得つつ、単位をミリ秒から秒へ
			const _saSec = Math.floor((_nowTime - _targetTime)/1000);
			let _symbol = "";
			let _minOver = false;
			if(_saSec <= 15){
				_symbol = "🕛"
			}
			else if(_saSec <= 30){
				_symbol = "🕒"
			}
			else if(_saSec <= 45){
				_symbol = "🕕"
			}
			else if(_saSec < 60){
				_symbol = "🕘"
			}else {
				_minOver = true;
				_symbol = "⌛"
			}
			let _text = (_saSec + "秒前に管理IDを取得/更新");
			if(_minOver){
				_text = Math.floor(_saSec/60) + "分前に管理IDを取得/更新";
			}
			_baseNode.textContent = _symbol;
			_baseNode.title = _text
		}
		return _baseNode;
	}

	/** カスタムメニュー直下に表示されるあのフォームを作成する。
	 * background.jsに保存されている eventpreset_active_keyname で指定されたアクティブプリセット名を取得して利用している。
	*/
	createEntryPanelNode(){
		
		//①親ノード作成
		let _parentAreaNode = document.createElement("div");
		_parentAreaNode.id = "mkt_event_set_preset_area";

		//②編成ボタン群ノードをforで作成
		//グローバルオブジェクトの eventSelectObj を参照する
		let _selectNode = document.createElement("select");
		_selectNode.setAttribute("style","min-width:50px;font-size:12px;height:20px;");
		let _activePreset = getOption("eventpreset_active_keyname");
		for(var n in eventSelectObj){
			
			let _optionNode = document.createElement("option");
			_optionNode.name = "event_select";
			_optionNode.value = n;
			_optionNode.textContent = eventSelectObj[n].selectname;
			//キーが保存値と同一なら、select選択
			if(n == _activePreset){
				_optionNode.selected = "selected";	
			}
			_selectNode.appendChild(_optionNode);
		}
		
		//②+ selectフォーム変更検知したら、保存してリロードするリスナを登録しておく
		_selectNode.addEventListener("change" , function(e){
		//	console.log(e.target.value);
			saveOption("eventpreset_active_keyname" , e.target.value);
			location.reload();
		},false);
		
		//③エントリー(登録開始)ボタン作成
		let _entryButtonNode = document.createElement("button");
		_entryButtonNode.textContent = "編成開始";
		_entryButtonNode.title = "クリックで配置開始";
		let _presetTextData = this.getActivePresetName() || "【！】プリセットが設定されていません";
		_entryButtonNode.title = _presetTextData.split("\n,");

		//③+ 登録ボタンが押されれば、配置モードをONにして、
		_entryButtonNode.addEventListener("click",e=>{
			saveOption("idolpreset_event_ui_show",1);	//この値が0になるまで、イベ編成とアイドル一覧ではセットUIが表示され続ける
			// ページ遷移が確定すれば、UI表示は後回し(遷移後)にする。
			if(this.jumpEventDeckIndexURL()){

			}else{	
				//▼メイン処理
				chrome.extension.sendRequest({
					status:"eventdeck",
					message: "send"
				}, retData=>{	//受信する
					//console.log(retData);
					//bg保持のアイドル管理IDを非同期で取り出して、インスタンスに一度取り込む
					this.backGroundIdolDataObj = retData;
					//★取り込み後、ボタンUI表示を処理
					this.testHoge(retData);
				});	
			}

		},false);

		//④ ノード構成
		_parentAreaNode.appendChild( _selectNode );
		_parentAreaNode.appendChild( _entryButtonNode );

		return _parentAreaNode;
	}
	
}


function mainfunc_event_deck_preset(){

	let _idolInstance = new idolPresetClass();

	//配置用
	let _markElm = cMenu.nodeObj.custom.base;
	if(!_markElm){
		console.log("event_header要素が取得できていません");
		return;
	}

	/**
	 * アイドル所属ページから {"アイドル名":"管理ID"} のオブジェクトを取得し、
	 * backgroundに送信
	 */
	const _sendData = _idolInstance.getIdolListObjectFromPage();
	if(_sendData){
		console.log(_sendData);
		//常に所属アイドル一覧の情報をbackgroundへ送信
		chrome.extension.sendRequest({
			status:"eventdeck",
			message: "save",
			page: 0,			//ページ数
			data: _sendData	//送る値(アイドル名+IDのペア)をページから取り出すメソッド
		}, ()=>{
			console.log("eventdeckにてアイドル情報を" , Object.keys(_sendData).length ,"件送信しました");
		});
	}


	//とりあえずフォーム？はイベ編成ページでのみ出すようにしておく
	//if(urlCheck("%2Fevent_deck_edit%3Fdeck%3D")){

	/**
	 * 配置用パネル表示フラグが有効のままであれば処理続行
	 */
	if(getOption("idolpreset_event_ui_show") > 0){

		//遷移が確定していれば、UI表示は後回しにする
		if(_idolInstance.jumpEventDeckIndexURL()){

		}else{
			chrome.extension.sendRequest({
				status:"eventdeck",
				message: "send"
			}, _retData=>{
				//console.log(_retData);
				//bg保持のアイドル管理IDを非同期で取り出して、インスタンスに一度取り込む
				_idolInstance.backGroundIdolDataObj = _retData;
				//★取り込み後、ボタンUI表示を処理
				_idolInstance.testHoge();
			})
		}


	}


	// 自動配置中であれ何であれ、エントリーボタンフォームは付与。
	_markElm.appendChild( _idolInstance.createEntryPanelNode() );
	

}

/**
 * プリセット定義関係。
 * キー名は popup.jsの定義と同一
 */
var eventSelectObj = {
	idolliveroyal_guest:{
		selectname:"ロワ ゲスト",
		shortname:"ﾛﾜｹﾞｽﾄ",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	},
	idolliveroyal_atk:{
		selectname:"ロワ 攻",
		shortname:"ﾛﾜ攻",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fevent_deck_edit%3Fdeck%3D2",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:2
	},
	idolliveroyal_def:{
		selectname:"ロワ 守",
		shortname:"ﾛﾜ守",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fevent_deck_edit%3Fdeck%3D3",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:3
	},
	talkbattleshowteam_atk:{
		selectname:"TBS 攻",	//チーム
		shortname:"TBS攻",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	},
	talkbattleshowteam_def:{
		selectname:"TBS 守",	//チーム
		shortname:"TBS守",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fevent_deck_edit%3Fdeck%3D2",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:2
	},
	idollivetour:{
		selectname:"LIVEツアー",
		shortname:"ﾂｱｰ",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fdeck_set_leader_card%3F",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	}
	,
	dreamlivefestival:{
		selectname:"ドリフェス",
		shortname:"ﾄﾞﾘﾌ",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_dream%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_dream%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_dream%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_dream%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	},
	idolchallenge:{
		selectname:"アイチャレ",
		shortname:"ﾁｬﾚ",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_challenge%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_challenge%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_challenge%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_challenge%2Fdeck_inside_exchange%3Fno%3D%26position%3D",
		nameValue:"type",
		valueNum:1
	},
	idolvariety:{
		selectname:"アイバラ",
		shortname:"ｱｲﾊﾞﾗ",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_variety%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_variety%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_variety%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_variety%2Fdeck_inside_exchange%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	}
	/*,
	talkbattleshow_atk:{
		selectname:"TBS(プロ) 攻",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	},
	talkbattleshow_def:{
		selectname:"TBS(プロ) 守",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fevent_deck_edit%3Fdeck%3D2",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2Fdeck_modify_card_check%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:2
	}
	*/
	,
	musicjam:{
		selectname:"JAM",
		shortname:"JAM",
		maxFrontMember:10,
		maxUnitMember:20,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2Fdeck_set_leader_card%3Fno%3D%26",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2Fdeck_inside_exchange%3Fno%3D%26position%3D",
		nameValue:"deck",
		valueNum:1
	}
	,
	idolproduce:{
		selectname:"アイプロ",
		shortname:"ｱｲﾌﾟﾛ",
		maxFrontMember:10,
		maxUnitMember:10,
		event_url:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_date%2F",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_date%2Fevent_deck_edit%3Fdeck%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_date%2Fdeck_set_leader_card%3Fno%3D%26",
		//l_frmがないとエラー扱いだった
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_date%2Fdeck_modify_card_check%3Fno%3D%26l_frm%3DEvent_date_2%26rnd%3D",
		nameValue:"deck",
		valueNum:1
	}
	,
	deck_edit_atk:{
		selectname:"通常 攻編成",
		shortname:"攻",
		maxFrontMember:5,
		maxUnitMember:5,
		event_url:"	",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%3Fdid%3D1%26type%3D0",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_set_leader_card%3Fno%3D1",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card_check%3Fno%3D1",
		nameValue:"type",
		valueNum:0
	},
	deck_edit_def:{
		selectname:"通常 守編成",
		shortname:"守",
		maxFrontMember:5,
		maxUnitMember:5,
		event_url:"	",
		deckIndexURL:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_edit_top%3Ftype%3D1%26did%3D1",
		actionURL_L:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_set_leader_card%3Fno%3D1",
		actionURL_M:"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdeck%2Fdeck_modify_card_check%3Fno%3D1",
		nameValue:"type",
		valueNum:1
	}
	
};

