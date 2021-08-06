//アイドルチャレンジ用のスクリプト

function mainfunc_idolchallenge(mainElm){

	//▼回復時刻表示
	if(
			urlCheck("%2Fevent_challenge%2Findex%3F")	//index
		||	urlCheck("%2Fget_battle_point%2F")			//ちヒール
		||	urlCheck("%2Fget_nothing%2F")				//進行結果特になし
		||	urlCheck("%2Fget_card%2F")					//カード
		||	urlCheck("%2Fget_raid_boss%2F")				//ライバルユニット
		||	urlCheck("%2Fraid_lose%3F")					//LIVE結果 DRAW or LOSE
		||	urlCheck("%2Fget_voltage%2F")				//本気ボルテUP
		||	urlCheck("%2Fstage_clear%2F")				//エリアクリア
		){
		//▼イベントテーブルを基にした時刻処理
		subfunc_setEventTableTimer();
	}

}