
//▼総合
function mainfunc_talkbattle(mainElm){
	//▼回復時刻表示
	if(
			urlCheck("%2Fevent_talk%2Findex")	//index
		||	urlCheck("%2Fevent_teamtalk%2Findex")	//チーム対抗版index
		||	urlCheck("%2Fget_battle_point%2F")		//ちヒール
		||	urlCheck("%2Fget_nothing%2F")			//進行結果特になし
		||	urlCheck("%2Fget_card%2F")				//カード取得後
		||	urlCheck("%2Fget_raid_boss%2F")			//ライバルユニット
		||	urlCheck("%2Fraid_lose%3F")				//LIVE結果 DRAW or LOSE
		||	urlCheck("%2Fstage_clear%2F")			//エリアクリア
		){
		//▼イベントテーブルを基にした時刻処理
		subfunc_setEventTableTimer();

	}
	//とりあえず新お仕事と切り分けてみる
	else if(urlCheck("%2Fevent_teamtalk%2Fwork%2F%3Fstage%3D")){
		console.log("新お仕事検出");
		subfunc_setEventTableTimer();
	}
	// 発生トーク一覧のアイドル画像を縮めたい
	else if(urlCheck("event_teamtalk%2Fboss_index")){
		if(getOption("event_teamtalkbattleshow_smart_mode_check")){
			/**
			 * 画像自体は 130x163 , タグ上では wwidth=65 が指定されて 65x82 になっている
			 */
			const _targetNodes = document.querySelectorAll(".idol_card_image");
			[..._targetNodes].forEach(_e=>{
				if(_e){
					_e.style.display="none"
					/*
					const _imgs = _e.querySelectorAll("img");
					[..._imgs].forEach(_img=>{
						_img.width = 30;
					});
					*/
				}
			});
		}
	}


	
}


