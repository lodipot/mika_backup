//css挿入
/*
 * 使い方
 *	MKTCSS.setCss("hoge"); とすると、 MKTCSS.define で定義されているレイアウトが突っ込まれるはず
 */
MKTCSS = {};
MKTCSS.define = {
	"card_list":[
		[".statusTable>.data > .data_list , div.idolStatus > .data_list" , "margin-bottom:1px;"]		//margin-bottom詰め
		,[".idolStatus > label > .data_list" , "margin-bottom:1px;"]		//margin-bottom詰め
		,[".idolStatus" , "font-weight:normal;"]	//アイドルステータス全てのboldを無効化
		,[".area_right > .card_status_right" , "margin-bottom:1px;"]	//アイドルステータス一部を縦に詰める

		,[".status_headline.lv + .status_value._middle" , "width:40px;"]			//prLv
		,[".status_headline.cost + .status_value._middle" , "width:20px;"]						//prコスト
		,[".status_headline.att + .status_value._middle_long , .status_headline.def + .status_value._middle_long" , "width:110px;"]		//pr攻撃・守備
		,[".status_headline.grow + .status_value._middle_long" , "font-size:8px;padding:0px;width:125px;"]			//pr成長度
	//	,[".data_list > .wrap > .title.skl_ef+.pr" , "line-height:120%;"]									//pr特技効果
		,[".status_headline.grow + .status_value > img" , "width:80px;height:6px;position: relative;top: -3px;"]	//成長度の画像を縮める
		,[".status_headline.lv" , "width:16px;"]				//titleLvラベル
		,[".status_headline.grow" , "display:none;"]			//title成長度非表示
		,[".status_headline.att" , "width:12px;"]				//title攻
		,[".status_headline.def" , "width:12px;"]				//title守
		,[".data > .data_list > div.pr.abi" , "width:140px;font-size:11px;"]				//titleアビ(イベ特攻説明)
		,[".data_list >div.wrap > div.title.skl_ef" , "display:none;"]		//title特技効果非表示
		,[".data_list >.wrap > .title.skl_ef+.pr" , "width:290px;"]			//title特技効果非表示に伴い pr領域拡張
		,[".data_list >div.wrap > div.title.want" , "display:none;"]		//titleフリトレ希望品非表示
		
	//	,[".data>.data_list >div.pr.no_title" , "width:120px;"]				//アクセサリや特攻でのn倍説明
		,[".idolStatus > .data_list > div.wrap > div.pr" , "line-height:100%;font-size:12px;"]		//prフォントサイズ
		//追加コスト
		,[".data_list > .wrap > .title.mkt_atkdef_cost+.pr" , "line-height:1.3em;font-size:11px;width:120px;padding:2px 5px;background-color:#222222;-webkit-border-right-top-radius:7px;-webkit-border-left-top-radius:7px;"]
		
		,[".idolStatus>label>h4.nameArea" , "padding:3px;"]		//名前領域の縦幅縮め
		,[".idolStatus>h4.nameArea" , "padding:3px;"]		//フリトレver
		,["body#card_list > #pageArea > #top > section > h3.title_img_gray" , "display:none;"]			//リーダー のタイトル領域
		,["#top > section + img" , "display:none;"]		//属性ボタン上の星画像

	],
	"card_list_pure":[
		["nav.area_menu_header > div.area_menu_header_6btn" , "height:110px;"]	//プリセット領域用に高さを水増し
	]
	,"card_list_compact":[
		[".idolStatus.m-Btm15>.data_list+.data_list" , "display:none;"]		//特技情報
		,[".idolStatus.m-Btm15>.data_list.line02" , "display:none;"]		//特技効果
	]
	//入寮,呼び出し一覧
	,"card_storage_pop_index":[
	
		["body#card_storage > #top > header" , "margin-top:2px;"]
		,["header.m-Top8" , "height:57px;"]	//最終的な領域に合わせる様に先行介入
		,["header.m-Top8+img.m-Btm8" , "display:none;"]	//new 入寮時にのみなぜか表示される星画像
		,["header.m-Top8>div.t-Cnt" , "display:none;"]	//new 女子寮と所属アイドル人数情報非表示
	//	,["header.m-Top8 + section.t-Cnt > div.m-Btm5" , "display:none;"]	//All Cute Cool Passion フィルタ非表示
	//	,["header.m-Top8 + section.t-Cnt" , "display:none;"]	//All Cute Cool Passion フィルタ 及び 入寮呼び出しのnextLink領域をまとめて非表示
		
	
		,["section>ul.btn_link" , "margin-top:10px;"]		//3ボタンの上部に幅を設ける
		,["div.tab_common-middle.m-Btm8" , "width:240px;margin:2px;"]	//new 下2つの合計横幅
		,["section+section>div.tab_common-middle>a.tab_text" , "width:120px;"]	//new 一覧表示,詳細表示 の青ボタン幅変更
		,["section+section>div.tab_common-middle>a.tab_text:hover" , "width:120px;"]	//new 一覧表示,詳細表示 の青ボタン幅変更
		,["section+section>div.tab_common-middle>div.tab_text.selected" , "width:120px;"]	//new 一覧表示,詳細表示 の青ボタン幅変更
		,["section+section>div.tab_common-middle>div.tab_text.selected:hover" , "width:120px;"]	//new 一覧表示,詳細表示 の青ボタン幅変更
		,["a.btn_normal_line_2._line_2.m-Cnt" , "display:none;"]	//オリジナルの入寮⇔呼び戻し切り替え領域を非表示
		
		,["section+section>h3.title_img_gray" , "display:none;"]	//画像付きラベル非表示
		,["form>div.idolStatus" , "padding:2px 5px 0;"]
	]
	
	//女子寮一覧
	,"card_storage_list":[
		["td>br+div>a.a_link" , "display:none;"]	//編集する　のリンク非表示
		,["section.t-Cnt.m-Btm5 > div.title_sub_blue" , "margin:0px;"]
		,["td[align='left'] > br" , "display:none;"]	// br タグ
		,["td[align='center'] > img" , "width:60px;height:60px;"]	// img サイズ
		,["td[align='left'] > .blue" , "display:none;"]	// 利用期限
		,["td[align='left'] > .m-Btm5" , "margin-bottom:0px;"]	// 圧縮
	
	]
	//フリートレードモードがONの場合
	,"card_freetrade_list":[
		["style+section.t-Cnt.m-Top8> .m-Btm5" , "display:none;"]	//相手の希望で絞り込む　文字
		,["style+section.t-Cnt.m-Top8> div" , "display:none;"]	//検索結果上TOPの、トレチケ数などの情報
		,[".idolStatus.m-Btm12>.t-Cnt.m-Top8.yellow" , "display:none;"]	//トレードできませんの領域
	//	,["style+section.t-Cnt.m-Top8> img + br" , "display:none;"]	//brタグ
	]
	//個別のフリトレ確認系
	,"card_freetrade_submit":[
		["#delay+section.t-Cnt" , "display:none;"]	//トレード可能ですのテキストラベル
		,["section.t-Cnt>.title_img_gray.m-Btm5" , "display:none;"]	//受け取るもの のタイトル領域
	]
	//凸履歴
	,"battle_log_list":[
		["a:visited" , "color:orange;"]	//訪問済みに色を付ける
	]
	//凸直前画面。設定によりリハーサルボタンを非表示にする
	,"battle_check":[
		["input[value='リハーサル開始']" , "display:none;"]	//未使用
	]
};


MKTCSS.setCss = function(targetKey){	// 引数 targetKey は グローバル変数cssDefineオブジェクトのキー名と連動

//	console.log("MKTCSS.setCss("+targetKey+")が呼ばれました");

	//▼CSSセットなど
	var _stylesheet = document.styleSheets.item( document.styleSheets.length-1 );	//tempCSSindexNum
	var _setStr = "";
	var singleDefObj = MKTCSS.define[targetKey];
//	console.log(singleDefObj.length);
	
	if(singleDefObj){
	//	console.log(singleDefObj);

		//外で定義したcssルールを突っ込んでいく
		for(var n=0; n<singleDefObj.length;n++){
			//64.0.3282.140(Official Build) x64 無理矢理要素ぶっこむ感じで..
			_setStr += _setStr = singleDefObj[n][0] + "{"+singleDefObj[n][1]+"}";	//文字列書き出し
			/*
			_setStr = singleDefObj[n][0] + "{"+singleDefObj[n][1]+"}";	//文字列書き出し
			_stylesheet.insertRule( _setStr , n );
			*/
		}
	
		var _setCSS = document.createElement("style");
		_setCSS.textContent = _setStr;
		document.head.appendChild(_setCSS);
	}

	
};

MKTCSS.changedFlag = false;

/** 最適なタイミングが環境により異なるため、first_load.js 上で何度か呼ばれる */
MKTCSS.process = function(){
	
	if(document.styleSheets.length == 0 || MKTCSS.changedFlag){
//		console.warn("document.styleSheets.length が 0 または MKTCSS.changedFlag が true です" , document.styleSheets.length , MKTCSS.changedFlag);
		return;
	}
	
	if(urlCheck('idolmaster%2Fauction%2F')){	//フリトレ
		if(urlCheck('search_top')){		//検索結果
			MKTCSS.setCss("card_list");
			if(!urlCheck('%2Fauction%2Fhistory') && getOption("freetrade_check")){
				MKTCSS.setCss("card_freetrade_list");	//フリトレモード (履歴の時間が消えてしまうので履歴以外)
			}
		}else if(urlCheck('search_contract') && getOption("freetrade_check")){
			MKTCSS.setCss("card_freetrade_submit");
		}
	}else if(urlCheck("idolmaster%2Fcard_")){		//【★】いくつかの、「カード(をどうにかする)」ページ

		MKTCSS.setCss("card_list");
		
		if(urlCheck('%2Fcard_list')){			//所属アイドル一覧
			if(urlCheck('%2Fcard_list%2Findex') || urlCheck('%2Fcard_list%3F')){
				MKTCSS.setCss("card_list_pure");	//アイドルプリセット専用
			//	MKTCSS.setCss("card_list_compact");	//特技情報非表示	

			}
		}
		else if(urlCheck('%2Fcard_storage%')){		//女子寮全般
			//設定ON
			if(urlCheck('push_index') || urlCheck('pop_index')){
				if(getOption("layout_storage_pop_push_check")){
					if(!urlCheck('trainer_card_storage')){	//トレーナールーム以外
						MKTCSS.setCss("card_storage_pop_index");
					}
				}
			}
			else{
				//女子寮一覧と想定してCSS処理 2017/06/22のレイアウト変更に伴い凍結
				/*
				if(getOption("layout_cardstorage_check")){
					MKTCSS.setCss("card_storage_list");
				}*/
			}
		}
	}
	else if(urlCheck("battle_log%2Fbattle_log_list")){	//凸履歴一覧
		MKTCSS.setCss("battle_log_list");
	}
	/*
	else if(urlCheck("battles%2Fbattle_check") && getOption("rehearsal_hidden_check")){	//リハーサル表示を除去
		MKTCSS.setCss("battle_check");
	}
	*/
	
	//★いくつかのイベント処理==============================================
	if(urlCheck('idolmaster%2Fevent_') || urlCheck('idolmaster%2Fp_match')){
		if(urlCheck('deck_')){//イベントユニット
			MKTCSS.setCss("card_list");
		}
	}

	
	MKTCSS.changedFlag = true;
};
