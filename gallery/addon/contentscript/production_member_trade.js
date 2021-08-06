/**
 * プロダクションメンバー同士のトレードに関するスクリプト
 */

/**
 * ワリとよろず機能
 */
class ProductionMemberTradeClass{

	constructor(){

		this.RecvIdolAddUrl
		this.RecvItemAddUrl
		this.RecvMoneyAddUrl
		this.SendIdolAddUrl
		this.SendItemAddUrl
		this.SendMoneyAddUrl

		this.RecvTradeCount = 0
		this.SendTradeCount = 0
		/**
		 * クイックアクセスパネル
		 */
		this.tradePanelBtnNode = null;
		/**
		 * 受け取る数の表示ノード
		 */
		this._recvCounterNode = null;
		/**
		 * 渡す数の表示ノード
		 */
		this._sendCounerNode = null;

		/**
		 * (受け取りたい)相手のユーザー名
		 */
		this.RecvUserName = "";
		/**
		 * (渡したい)自身のユーザー名
		 */
		this.SendUserName = "";

	}

	/**
	 * ページ内のノードを取得解析
	 */
	doParsePageNodes(){
		/**
		 * 「アイドル,アイテム,マニー を追加」する3つのリンクを
		 *  受取,送付 それぞれ2役割分 全6箇所 取得する
		 */
		const _btns = document.querySelectorAll(".area-btn-common > a.btn_decision_line_3 , a.btn_normal_line_3");
		if(_btns.length == 6){
			this.RecvIdolAddUrl = _btns[0].href;
			this.RecvItemAddUrl = _btns[1].href;
			this.RecvMoneyAddUrl = _btns[2].href;
			this.SendIdolAddUrl = _btns[3].href;
			this.SendItemAddUrl = _btns[4].href;
			this.SendMoneyAddUrl = _btns[5].href;
			_btns[5]
		}
		else{
			console.log("btn_decision_line_3 が想定分得られていません" , _btns);
		}

		const _recvTitleImages = document.querySelectorAll(".title_img_gray");
		if(_recvTitleImages.length == 2){
			this.RecvUserName = _recvTitleImages[0].textContent.replace(/から受け取るもの$/ , "")
			this.SendUserName = _recvTitleImages[1].textContent.replace(/が渡すもの$/ , "")

			this.RecvTradeCount = this._getItemCount( _recvTitleImages[0].parentNode );
			this.SendTradeCount = this._getItemCount( _recvTitleImages[1].parentNode );
			//console.log(this.RecvTradeCount , this.SendTradeCount);
		}else{			
			console.log("title_img_gray が想定分得られていません" , _recvTitleImages);
		}

	}

	changeRecvItemCount(_value){
		this._recvCounterNode.textContent = _value;
	}

	changeSendItemCount(_value){
		this._sendCounterNode.textContent = _value;
	}

	/**
	 * そのノード内にあるやり取りアイテム数を得るだけ
	 * @param {*} _targetSectionNode 
	 */
	_getItemCount(_targetSectionNode){
		/**
		 * 「リストから外す」(ハイパーリンク)ボタンを一度全取得し、
		 * ボタンの親が td であれば、アイテムorマニー
		 * そうでなければ、アイドルのノードが 1つ前(before)にあるものとして
		 * それぞれを回収する..つもりだったけど、とりあえずボタン数でアイテムをカウントさせるだけにした
		 */
		const _nodeArr = [];

		const _imgSeparators = _targetSectionNode.querySelectorAll("img.m-Btm15");
		//console.log(_imgSeparators.length);
		[..._imgSeparators].forEach(_sep=>{

			if(_sep.parentNode.tagName == "td"){
				_nodeArr.push()
			}else{
				const _before = _sep.previousElementSibling;
				if(_before.tagName == "div"){

				}
			}
		});

		return _imgSeparators.length;
	}

	/**
	 * パースして保持された内部情報をもとに、トレードのクイックアクセスパネルノードを生成
	 * デザインから配置まで。
	 * 取得する場合は this.tradePanelBtnNode で得てね
	 */
	generateTradeBtnPanelNode(){

		const _imgItemPath = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui/present/icon_category_item.png%3Fv%3D20190909144730";
		const _imgIdolPath = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui/present/icon_category_idol.png%3Fv%3D20190909144730";
		const _imgMoneyPath = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui/icon_many_m.jpg%3Fv%3D20190909144730";
		const _imgSize = 40;

		const _recvDefineArr = [
			{
				title:"アイドル" , 
				imgPath: _imgIdolPath ,
				url: this.RecvIdolAddUrl
			}
			,
			{
				title:"アイテム" , 
				imgPath: _imgItemPath , 
				url: this.RecvItemAddUrl
			}
			,
			{
				title:"マニー" , 
				imgPath: _imgMoneyPath , 
				url: this.RecvMoneyAddUrl
			}
		];
		const _sendDefineArr = [
			{
				title:"アイドル" , 
				imgPath: _imgIdolPath ,
				url: this.SendIdolAddUrl
			}
			,
			{
				title:"アイテム" , 
				imgPath: _imgItemPath , 
				url: this.SendItemAddUrl
			}
			,
			{
				title:"マニー" , 
				imgPath: _imgMoneyPath , 
				url: this.SendMoneyAddUrl
			}
		];

		
		const _baseNode = document.createElement("div");
		_baseNode.style.display = "table";
		_baseNode.style.width = "100%";
		_baseNode.style.textAlign = "center";


		/**
		 * 受け取るもの,渡すもの の領域を作成
		 */
		const _columnCaptions = document.createElement("div");
		{
			_columnCaptions.style.display = "table-row";
			const _titleRecv = document.createElement("div");
			const _titleSend = document.createElement("div");
			const _titleSum = document.createElement("div");
			_titleRecv.className = "mkt_trade_panel_title";
			_titleSend.className = "mkt_trade_panel_title";
			/*
			_titleRecv.style.display = "table-cell";
			_titleSend.style.display = "table-cell";
			_titleSum.style.display = "table-cell";
			*/

			const _sendSymbol = document.createElement("span");
			const _recvSymbol = document.createElement("span");
			_sendSymbol.className = "mkt_trade_symbol";
			_recvSymbol.className = "mkt_trade_symbol";
			//_sendSymbol.textContent = "渡す";
			//_recvSymbol.textContent = "貰う";
			_sendSymbol.textContent = this.SendUserName;
			_recvSymbol.textContent = this.RecvUserName;


			

			const _recvTextArea = document.createElement("span");
			const _sendTextArea = document.createElement("span");
			const _sumTextArea = document.createElement("span");
			_recvTextArea.className = "blue";
			_sendTextArea.className = "blue";
			_sumTextArea.style.color = "orange";
			_recvTextArea.textContent = "：";
			_sendTextArea.textContent = "：";
			_sumTextArea.textContent = "計：";
			const _recvCountArea = document.createElement("span");
			const _sendCountArea = document.createElement("span");

			this._recvCounterNode = _recvCountArea;
			this._sendCounterNode = _sendCountArea;

			_titleRecv.appendChild(_recvSymbol);
			_titleRecv.appendChild(_recvTextArea);
			_titleRecv.appendChild(_recvCountArea);

			_titleSend.appendChild(_sendSymbol);
			_titleSend.appendChild(_sendTextArea);
			_titleSend.appendChild(_sendCountArea);


			// 順番に注意
			_columnCaptions.appendChild( _titleSend );
			_columnCaptions.appendChild( _titleRecv );
		}

		/**
		 * トレード追加のボタン群ノードを配置
		 */
		const _columnBtns = document.createElement("div");
		{
			const _addtext = "";
			const _recvBtnArea = document.createElement("div");
			_recvBtnArea.className = "mkt_trade_btn_area";
			_recvDefineArr.forEach(_data=>{
				const _linkBtn = document.createElement("a");
				const _img = new Image();
				_linkBtn.href = _data["url"];
				//_img.title = _data["title"] + _addtext;
				_img.src = _data["imgPath"];
				_img.width = _imgSize
				_img.height = _imgSize
	
				_linkBtn.appendChild(_img);
				_recvBtnArea.appendChild(_linkBtn);
			});
	
			const _sendBtnArea = document.createElement("div");
			_sendBtnArea.className = "mkt_trade_btn_area";
			_sendDefineArr.forEach(_data=>{
				const _linkBtn = document.createElement("a");
				const _img = new Image();
				_linkBtn.href = _data["url"];
				//_img.title = _data["title"] + _addtext;
				_img.src = _data["imgPath"];
	
				_linkBtn.appendChild(_img);
				_sendBtnArea.appendChild(_linkBtn);
			});

			_columnBtns.style.display = "table-row";
			// 順番に注意
			_columnBtns.appendChild( _sendBtnArea );
			_columnBtns.appendChild( _recvBtnArea );
		}
		
		_baseNode.appendChild(_columnCaptions);
		_baseNode.appendChild(_columnBtns);
		// 確保
		this.tradePanelBtnNode = _baseNode;
	}

}



function mainfunc_productionmembertrade(mainElm){
	console.log("MKT:mainfunc_productionmembertrade");

	const _proMemTrade = new ProductionMemberTradeClass();
	_proMemTrade.doParsePageNodes();
	{
		/**
		 * 配置目印
		 */
		const _marker = document.querySelector("header");
		if(_marker){
			/**
			 * 		[トレードを選択]
			 * アイドル・アイテム・マニーの
			 * 		交換を提案しよう!
			 * を隠す
			 */
			_marker.style.display = "none";

			/**
			 * 画面下部にある[トーレド][申請][拒否]などのボタンを
			 * コピー&レイアウト弄って最上部に配置
			 */
			{
				const _TradeBtn = mainElm.querySelector("form[name='gotrade']");
				if(_TradeBtn){
					const _newBtn = _TradeBtn.cloneNode(true);
					const _tempNode = _newBtn.querySelector("input[type='submit']");
					_newBtn.querySelector("label.btn_decision_line_2").className ="";	//クラス名を削除することで、デザインに対応
					_tempNode.setAttribute("style","margin-top:5px;width:100%;height:45px;");
					_tempNode.className = "grayButton300";
					_newBtn.className = "m-Btm5";	// オリジナルの m-Btm10 から置き換え
					// 最上部に配置
					_marker.parentNode.insertBefore(_newBtn , _marker);
				}
			}
			/**
			 * 完了したトレード一覧の「一番最後」にある [内容を確認する] ボタンを
			 * コピー & レイアウト弄って上に持ってくるだけ
			 */
			{
				const _tradeBtns = mainElm.querySelectorAll("section.t-Cnt > a.btn_normal_line_2");
				if(_tradeBtns.length > 0){
					const _newTradeBtn = _tradeBtns[_tradeBtns.length-1].cloneNode(true);
					_newTradeBtn.className = "grayButton300";
					_marker.parentNode.insertBefore(_newTradeBtn , _marker);
				}
			}
			/**
			 * 受け取る数,渡す数,合計数
			 * および クイックトレードアクセスのボタンなどをまとめたノードを生成 & 配置
			 */
			if(urlCheck("trade_request%2Fselect_top")){
				_proMemTrade.generateTradeBtnPanelNode();
				const _panel = _proMemTrade.tradePanelBtnNode;
				//console.log(_panel);
				_marker.parentNode.insertBefore(_panel ,_marker);
	
				// 数の表記を更新
				{
					const _recvCount = _proMemTrade.RecvTradeCount;
					const _sendCound = _proMemTrade.SendTradeCount;
					_proMemTrade.changeRecvItemCount( _recvCount );
					_proMemTrade.changeSendItemCount( _sendCound );

				}

			}


		}

	}

}
