//プロダクションマッチフェスティバルのイベントページから、時間を抽出してタイマーを起動させる

function mainfunc_matchfes(){

	//▼コンボタイマー破棄
	if(getOption("event_productionmatchfestival_combo_value") < 1){
		requestTimer("fescombo" , 0);
		//後々参照するテーブルの中身をピンポイントで削除させることで、タイマーを強制的に起動させないようにする
		delete eventGlobalTable.productionmatchfestival.combo;
	}
	
	if(	
			urlCheck('%2Fevent_pmf%2Fmatching_detail')						//[S]
		||	urlCheck('%2Fevent_pmf%2Fbattle_confirm')					//投入選択画面
		||	urlCheck('%2Fevent_pmf%2Fbattle_result%2F%3Fbattle_id')			//[S]
	){
		subfunc_setEventTableTimer();	//★新タイマー
	}
	

}

