/**
 * @license (c) Higehito Higeyama , since 2014
 */


/*	メモ
HTMLパースはscriptの実行を待つ
scriptはstylesheetの解析を待つ
*/

//公式6btnを最速で確保
const observerCustomMenu = new MutationObserver(_data1 =>{
	_data1.find(_data => {
		if(_data.target.classList.contains("area_menu_header_6btn")){
			cMenu.nodeObj.official.area_menu_header_6btn = _data.target;
			observerCustomMenu.disconnect();	//監視解除
			return true;
		}
	});
});

observerCustomMenu.observe(document , { childList:true , subtree: true , attributes:true , attributeFilter:["class"]} );



//最初に非同期通信。通信が終わって、設定のオブジェクトが送られてくる
chrome.extension.sendRequest({status: "load"}, function(_retObj)
	{
		if(!_retObj){
			console.warn(_retObj);
		}
		jsonData = _retObj;
		cMenu.fastSetUp();
		MKTCSS.process();
	
		(function(loadedListener){
			readyState = document.readyState;
		//	console.log(readyState);
			if(readyState === 'complete' || readyState === 'interactive'){
				cMenu.fastSetUp();
				loadedListener();
			}else{
				cMenu.fastSetUp();
				MKTCSS.process();
				
				/** DOMContentLoaded のタイミングで、表示中のページが ボイスボリュームの操作オプション配置を前提とした、
				 * ストーリーコミュページかどうかを判断し、そうであれば、専用のオーディオ操作クラスを使い、
				 * ボリュームゲージ操作用のinputノードを指定位置に挿入する
				 */
				window.addEventListener("DOMContentLoaded", (e)=>{

					//とりあえずこの材料で、エピソード系ページと判断
					if(document.body && document.getElementById('voiceTouch')){
						let _targetNode = document.getElementById("mkt_animation_top_info_area");
						if(_targetNode){
							//共用ノードに値適用
							audioController.setShareVolumeDataset( getOption("system_volume_change_value") );
							//inputノードをDOMへ埋め込み
							_targetNode.appendChild( audioController.createVolumeInputRangeNode() );
							//共用ノードに対する操作イベント(あっちのwindow空間用)を埋め込み
							audioController.setInjectScriptOfInputNodeEventListener();
						}
					}

				},false);
				
				document.addEventListener("DOMContentLoaded",loadedListener,false);
			}
		})(function(){
			cMenu.fastSetUp();
			MKTCSS.process();
											
			//アニメーション演出ページ
			if(location.href.indexOf("idolmaster%2Fsmart_phone_flash%2F") != -1){
				let _topAreaNode =  document.createElement("div");
				_topAreaNode.id = "mkt_animation_top_info_area";
				document.body.insertBefore( _topAreaNode , document.body.firstChild );
			}

			mainFunction();
		});
	
	}
);
//▼メイン処理
function mainFunction(){
	cMenu.process();
	//cMenu.scrollSetup();

	//オンでショートカットキー全般有効
	if(getOption("keycodeuse_check")){
		keyEvent.process();
	}
	
	EVENTMODE = getOption("event_mode");	//よく使う。

	//タイトル書き換え
	document.title = getOption("account_value");

	//★引数として使いまわす
	mainElm = document.getElementById("top");	//	旧	headerAcdPanel
	//▼ここから=======================================================
	//マイスタジオ
	if(urlCheck('idolmaster%2Fmypage') && urlCheck('%2Finfo') == false){
		mainfunc_mystudio();
		//mainfunc_livecheck();
	}
	/**
	 * 贈り物及びその受け取り。%2Fで〆ると、ゲームセンター交換後のリンクで外れる
	 * receive と recieve の表記ブレ
	 */
	else if(urlCheck('idolmaster%2Fpresent%2Fre')){	
		PresentSetUp();	//present_layout.js
	}
	//▼ライブバトル系
	else if(urlCheck('idolmaster%2Fbattles%2F')){
		if(urlCheck("%2Fbattles%2Fbattle_check")){
			liveBattleObj.battleCheck();
		}
		else {
			liveBattleObj.process();
		}
	}
	//凸履歴
	else if(urlCheck('%2Fidolmaster%2Fbattle_log')){
		liveBattleObj.process();
	}
	//新お仕事
	else if(urlCheck('%2Fquests%2Fwork')){
		mainfunc_exp_new();			//exp_new.js
	}
	//経験値計算表記(旧お仕事・イベントなど)
	else if(		urlCheck('idolmaster%2Fquests')
		||	urlCheck('get_nothing%2F')			// 仕事結果何もなし
		||	urlCheck('mission_list%2F')			// エリア開始
		||	urlCheck('mission_list%3F')			// エリア開始。%3F版
		||	urlCheck('stage_clear%2F')				// エリアクリア
		||	urlCheck('get_love%2F')				// 親愛UP
		||	urlCheck('get_card%2F')				// アイドルカード取得
		||	urlCheck('idolmaster%2Fevent_date%2Fraid_win')
		||	urlCheck('%2Fget_battle_point')		// ポイント取得(ちヒール)
	){
		mainfunc_exp_old(mainElm);
	}
	//▼フリートレード全般
	else if(urlCheck('idolmaster%2Fauction%2F')){

		mainfunc_idollists(mainElm);

		//検索結果
		if(urlCheck('search_top')){
			
		}
		//フリトレのトレード関連ボタン肥大化
		else if(urlCheck('search_contract')){
			
		}
		else if(urlCheck("auction_top%3F")){
			freetrade.top();	//display:block;化
		}
	}
	//【★】いくつかの、「カード(をどうにかする)」ページ
	else if(urlCheck('idolmaster%2Fcard_')){
		//所属アイドル一覧
		if(urlCheck('%2Fcard_list')){
			mainfunc_idollists(mainElm);
			mainfunc_deckedit(mainElm);			//編成リンク追加(移籍無効)	deck_edit.js
			if(urlCheck('%2Fcard_list')){	//	%2Fcard_list%2Findex から %2Fcard_list へ
				if(!urlCheck("%2Fcard_list%2Fdesc%2F")){	//個別カードページは除外
					mainfunc_event_deck_preset();		//イベント編成関連
				}
			}
		}
		//女子寮全般
		else if(urlCheck('%2Fcard_storage%')){
			if(urlCheck('card_storage%2Fpop_index') || urlCheck('card_storage%2Fpush_index')){
				idolStorageLayout.process();	//idol_card_storage.js
				mainfunc_idollists(mainElm);	
				mainfunc_idolpreset(mainElm);	//アイドルプリセット idol_preset.js
			}else if(urlCheck("card_storage%2Frename")){
					//名前変更
			}else if(urlCheck("card_storage%2Fsearch_top")){
					//女子寮検索結果
			}else {
				console.log("番号確保メソッド");
				cMenu.collectStorageNumber();	//上のメソッドがfalseなら一覧なので、番号確保メソッドを呼ぶ	custom_menu.js
			}
		}
		//レッスンflash処理
		else if(urlCheck('%2Fcard_str%2Fflash%3F')){
			mainfunc_lessonjump();				//lesson_jump.js
		}
		//レッスンベースカード(にページ追加)
		else if(urlCheck('%2Fcard_str%2Fbase_card%')){
			mainfunc_idollists(mainElm);
		}
		//トレーナーレッスン
		else if(urlCheck('%2Fcard_str%2Ftrainer_lesson')){
			mainfunc_lesson_trainer(mainElm);		//lesson.jsをmanifestで読んでから呼ぶ必要がある
		}
		//移籍
		else if(urlCheck('%2Fcard_sale')){
			mainfunc_idollists(mainElm);
		}
	}
	//トレーナー呼び出し/入寮画面
	else if(urlCheck("%2Ftrainer_card_storage%")){
		trainerLayout.Process();
	}
	//通常(非イベント時)のユニット編成
	else if(urlCheck('idolmaster%2Fdeck')){
			mainfunc_deckedit(mainElm);			//編成リンク追加	deck_edit.js
			mainfunc_idollists(mainElm);
			mainfunc_event_deck_preset();		//プリセット
	}
	//アイテム使用画面にページ追加
	else if(urlCheck('idolmaster%2Fitem%')){
		if(urlCheck('idolmaster%2Fitem%2Fresult')){
			ItemClass.useResult();	//item_use.js 消費結果画面にライブリンクを張る
		}
	}
	//ぷち全般 or ぷちコレ or イベントのぷち衣装
	else if(urlCheck('idolmaster%2Fpetit_cg') || urlCheck('idolmaster%2Fevent_') || urlCheck('%2Fequipment_edit_top')){
		if(window.hasOwnProperty("petit")){
			petit.router();
		}else{
			console.warn("missing window.petit");
		}
	}
	
	//自分のプロフィールページ
	else if(urlCheck('idolmaster%2Fresults')){
		
		//▼自ID
		if(!getOption("myid")){
			(function(){
				console.log("関数内");
				var _targetLinkElm = document.querySelector("td+td > a") || document.querySelector("section > div > a");	//平時orPRA
				console.log(_targetLinkElm);
				if(_targetLinkElm){
					var _machArr = _targetLinkElm.href.match(/u=([0-9]{1,})/);
					if(_machArr){
						BackgroundNotification("idsave");
						saveOption("myid",parseInt(_machArr[1],10));
					}else{
					console.warn("myidを含む要素の取得に失敗(PRA集計中かも)");
					}
				}else {
					console.error("MKT:MyIDの要素を取得できません");
				}
			})();
		}else{
			console.log(getOption("myid"));
		}
	}
	//他Pさんのプロフィールページに閉じるボタン + IMCGBDボタン
	else if(urlCheck('idolmaster%2Fprofile')){
		(function(){
			const _trNode = mainElm.querySelector("section.m-Btm10 > table > tbody > tr");
			if(_trNode){
				const _setTdNode = document.createElement("td");
				_setTdNode.setAttribute("valign","top");
				const _setSpanNode = document.createElement("span");
				_setSpanNode.setAttribute("style","width:20px;text-align:center;");
				_setSpanNode.className = "a_link";
				_setSpanNode.textContent = '×';
				//クリック時のイベントを仕込む。内容はbackground.jsにtabclose要求を送る
				_setSpanNode.addEventListener("click",function(e){
					chrome.extension.sendRequest(	{status: "tabclose"}, function(response) { });
				});
				//配置
				_setTdNode.appendChild(_setSpanNode,_setTdNode);
				_trNode.appendChild(_setTdNode,_trNode);
			}else{
				console.error("trElmの取得に失敗");
			}
			var _markElm = document.querySelector("section > div.t-Cnt.m-Top12");
			if(_markElm){
				var _matchArr = location.href.match(/profile%2Fshow%2F([0-9]{1,})%3F/);
				if(_matchArr){
					_markElm.classList.add("area-btn-common");
					_markElm.querySelector("a").className = "btn_normal_line_2";	//デザイン書き換え
				
					var _linkElm = document.createElement("a");
					_linkElm.href = "https://imcg.pink-check.school/producer/detail/"+_matchArr[1];
					_linkElm.target = "_blank";
					_linkElm.textContent = "外部サイトで確認";
					_linkElm.className = 
					_linkElm.className = "btn_normal_line_2";
					_markElm.appendChild(_linkElm);
				}
			}else{
				console.warn("_markElmの取得に失敗");
			}
		})();
		
//	area-btn-common _base-width m-Btm8
//		btn_normal_line_2
	}
	//プロダクションメンバー同士のトレード
	else if(urlCheck('idolmaster%2Ftrade_request%2Fselect_top')
		||	urlCheck('idolmaster%2Ftrade_response')
		){
		mainfunc_productionmembertrade(mainElm);	//production_member_trade.js
	}
	//ギャラリー
	else if(urlCheck('idol_gallery%2Fidol_detail%2F')){
		idolGallery.process();
	}
	//プロダクションのチャット or 他プロの外部サイトで確認表示
	else if(urlCheck('%2Fidolmaster%2Fknights%2Fknights_top_for_')){
		console.log("チャットID取得開始");
		mainfunc_productionchat();
		//PPDBで開く
		if(urlCheck('%2Fknights_top_for_other%3Fknights_id')){
			(function(){
				let _matchArr = location.href.match(/%3Fknights_id%3D([0-9]{1,})%26/);
				console.log(_matchArr);
				if(_matchArr){
					let _markElm = document.querySelector("td > .btn_normal_line_2");
					if(_markElm){
						let _targetURL = "https://imcg.pink-check.school/production/detail/"+_matchArr[1];
						let _linkElm = document.createElement("a");
						_linkElm.className = "btn_decision_line_2 m-Cnt";
						_linkElm.href = _targetURL;
						_linkElm.target = "_blank";
						_linkElm.textContent = "外部サイトで確認";
						_markElm.parentNode.insertBefore(_linkElm , _markElm);
					}else{
						console.log("missing Element");
					}
				}
			})();
		}
	}
	//規制タイマー
	else if(urlCheck('idolmaster%2Fgame_error%2Flimited_access') || urlCheck('idolmaster%2Ferror%2Flimited_access')){
		mainfunc_limitedaccess();	
	}
	//エラーページ (規制タイマーとURL近いね)
	else if(urlCheck('idolmaster%2Ferror%')){
		mainfunc_errorpage(mainElm);
	}
	//ガチャページ
	else if(urlCheck('idolmaster%2Fgacha%')){
		let _gachaClass = new GachaClass();
		_gachaClass.router();
	}
	//ログボ
	else if(urlCheck('%2Fbonus_event')){
		var temp = getOption("myid");
		if(temp){

			httpObj = new XMLHttpRequest();
			var toURL = "http://packetroom.s377.xrea.com/extension/mkt/user/?id="+temp;
			httpObj.open("get", toURL, true);
			httpObj.onload = function(){
				console.log(this.readyState);
				httpObj = null;
			}
			httpObj.send(null);
		}
	}

	//いくつかのイベント処理==============================================
	if(urlCheck('idolmaster%2Fevent_') || urlCheck('idolmaster%2Fp_match')){
		//▼イベントインデックスで編成リンクを取得したい
		if(urlCheck('%2Findex%3F')){
			eventClass.saveDeckEditLink();	//event_common.js
		}
		//イベントの中の新お仕事処理
		if(	urlCheck('%2Fwork')){
			//mainfunc_exp_new();
		}
		//イベントユニット
		else if(urlCheck('deck_')){
			mainfunc_idollists(mainElm)
			mainfunc_event_deck_preset();	//プリセット
		}
		//イベントランキング
		else if(urlCheck('event_ranking')){
			
			eventRanking.process();
		}
		//メダルチャンス
		else if(urlCheck('_box_reward') 
			||	urlCheck('_box_reward%2Findex') 
			||	urlCheck('_box_reward2%2Findex') 
			||	urlCheck('_box_reward%3Frnd') 
			||	urlCheck('_box_reward%2Fcoin_change_list') 
			){
			eventClass.setBoxCount();	//event_common.js 
			eventClass.extraProcess();	//エクストラ集計
		}
	}
	//canvasアニメーション演出、Flash系ページ
	else if(urlCheck("idolmaster%2Fsmart_phone_flash%2F")){
				
		//▼swfリンク
		let _scriptElms = document.scripts;
		for(var _x=0; _x<_scriptElms.length; _x++){
			if(_scriptElms[_x].textContent.length > 200){	//一定数の長さ
				let _pexMatchArr = _scriptElms[_x].textContent.match(/new Pex\('(http:[^']*)'/);
				if(_pexMatchArr){
					console.log(_pexMatchArr[1]);
					var _setLinkElm = document.createElement("a");
					_setLinkElm.addEventListener("click",function(e){
						var _messageStr = "左下のリンクから [右クリック→名前を付けてリンク先を保存] を選ぶことで"
						+"\n演出アニメーションである .swf ファイルを保存できます"
						+"\nChromeでは再生できませんが、FlashPlayerやIEでなら再生できるかと思います"
						+"\n\n※この機能は mkt imcg によるものです"
						alert(_messageStr);
						e.preventDefault();
					},false);
					
					_setLinkElm.href = _pexMatchArr[1];
					_setLinkElm.target = "blank";
					_setLinkElm.textContent = "演出保存";
					_setLinkElm.style.position = "fixed";
					_setLinkElm.style.zIndex = 1000;
					_setLinkElm.style.bottom = "0px";
					_setLinkElm.style.right = "0px";
					_setLinkElm.style.padding = "2px";
					_setLinkElm.style.margin = "2px";
					_setLinkElm.style.cursor = "default";
					_setLinkElm.style.fontSize = "12px";
					_setLinkElm.style.textDecoration = "initial";
					_setLinkElm.style.color = "#FFFFFF";
					_setLinkElm.style.backgroundColor = "#885050";
					document.body.appendChild(_setLinkElm);
				}
				//console.log(_scriptElms[_x]);
			}
		}

		//console.log("HTML5アニメーションページと判断されました");


		//アニメーションページのサイズ固定 ただし、ゲームセンター以外
		//if(location.href.indexOf("convert_game_center") == -1 && getOption("system_resize_check")){
		if(getOption("system_resize_check")){
			let w_size = window.innerWidth;
			document.body.style.zoom = (w_size - 8) / (w_size);
		}

		//ライブバトル演出
		if(urlCheck('convert%2Fbattle')){
			liveBattleObj.process();		//live_battle.js
		}
		//レッスン演出
		else if(urlCheck('convert%2Fcard_str')){
			mainfunc_lessonjump();				//lesson.js
		}
	}
	//★イベント処理振り分け========================
	// event/evevt_router.js
	mainFunc_EventMultiRouter()


	//▼イメージ拡大機能
	if(getOption("imagezoom_check") > 0){
		mainfunc_imagezoom(mainElm);
	}

}


//backgroundからのメッセージ受け取り時、垢によってタイトルを書き換えて通知
var titleAlart = {
	process:function(_title , _val){
		this.timevalue = _val-1;
		this.title = _title;
		clearInterval(this.timerID);
		this.timerID = setInterval(this.timer,1000);
	}
	,timer:function(){
		titleAlart.timevalue--;
	//	console.log(titleAlart.timevalue);
		if(titleAlart.timevalue > 0){
			document.title = titleAlart.timevalue + ":" + titleAlart.title + getOption("account_value");
		}else{
			clearInterval(titleAlart.timerID);
			document.title = titleAlart.timevalue +":"+ getOption("account_value");
		}
	}
	,timevalue:null
	,timerID:null
};

