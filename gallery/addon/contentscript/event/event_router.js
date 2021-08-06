/**
 * firstLoadから必ず呼ばれ、開催中(検出した)イベントに応じた基本的なイベント処理を割り振る
 */
function mainFunc_EventMultiRouter(){

    const _eventMode = getOption("event_mode");
    //console.log("イベント処理を割り振ります" , _eventMode);

	switch (_eventMode){
		//プロダクションマッチフェスティバル (+フェスS)	2017/0317開催時 idolmaster%2Fevent_pmf を確認
		case "productionmatchfestival":
			if(urlCheck('idolmaster%2Fp_match%') || urlCheck('idolmaster%2Fevent_fes%') || urlCheck('idolmaster%2Fevent_pmf%') ){
				mainfunc_matchfes();
			}
			break;
		//アイドルLIVEツアー&ツアーカーニバル
		case "idollivetour":
			if(urlCheck('%2Fevent_carnival')){
				mainFunc_livetourcarnival();
			}
			break;
		//ぷちコレ
		case "petitecollection":
			if (urlCheck('idolmaster%2Fevent_fashion')){
				petitColle.process();
			}
			break;
		//アイドルLIVEロワイヤル
		case "idolliveroyale":
			if(urlCheck('event_royale')){
				idolliveroyale.router();
			}
			break;
		//ドリームLIVEフェスティバル
		case "dreamlivefestival":
			if (urlCheck('idolmaster%2Fevent_dr')){	
				if(urlCheck('%2Fraid_battle_swf')){
					subfunc_event_flash_jump_btn();
					injectScriptFromFunction(injectEventAnimationScriptIsInfo_DreamLiveFestival , ["0"]);
				}
				else{
					mainfunc_dreamlive();
				}
			}
			break;
		//トークバトルショー
		case "talkbattleshow":
			if (urlCheck('idolmaster%2Fevent_talk') || urlCheck('idolmaster%2Fevent_teamtalk') ){
				if(urlCheck('talkSsSsraid_battle_swfSsSs') || urlCheck('%2Fraid_battle_swf%2F')){
					subfunc_event_flash_jump_btn();
				}
				else{
					mainfunc_talkbattle(mainElm);
				}
			}
			break;
		//チーム対抗TBS
		case "teamtalkbattleshow":
			if (urlCheck('idolmaster%2Fevent_teamtalk')){
				if(urlCheck('talkSsSsraid_battle_swfSsSs') || urlCheck('%2Fraid_battle_swf%2F')){
					subfunc_event_flash_jump_btn();
				}
				else{
					mainfunc_talkbattle(mainElm);
				}
			}
			break;
		//アイドルチャレンジ
		case "idolchallenge":
			if(urlCheck('idolmaster%2Fevent_challenge')){
				if(urlCheck('convert%2Fevent_challenge') && urlCheck('SsSsraid_battle_swf')){
					subfunc_event_flash_jump_btn();
					injectScriptFromFunction(injectEventAnimationScriptIsInfo_IdolChallenge , ["0"]);
				}
				else{
					mainfunc_idolchallenge();
				}
			}
			break;
		//アイプロ
		case "idolproduce":
			if(urlCheck('%2Fidolmaster%2Fevent_produce')){
				mainfunc_event_idolproduce();
			}
			break;
		//アイバラ
		case "idolvariety":
			if(urlCheck('idolmaster%2Fevent_variety')){
				//▼演出でも実行
				if(urlCheck('convert%2Fevent_variety') || urlCheck('%2Fraid_battle_swf%2F')){
					idolvariety.process();
				}
				else{
					idolvariety.process();
				}
			}
            break;
            
		//ミュージックJAM
		case "musicjam":
			if(urlCheck('%2Fidolmaster%2Fevent_jam')){
				//▼演出でも実行
				if(urlCheck('convert%2Fevent_jam') || urlCheck('%2Fraid_battle_swf%2F')){
					mainFunc_EventMusicJam();
				}
				else{
					mainFunc_EventMusicJam();
				}
			}
			else if(urlCheck('%2Fsmart_phone_flash%2Fconvert%2F')){
				mainFunc_EventMusicJam();
			}
			break;
	}


}

