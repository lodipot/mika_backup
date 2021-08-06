//アイドルLIVEロワイヤルのスクリプト
//取得する時間は、BPの全回復予想時刻 と 現在開催中のLIVEが終了する時刻 (-n分) の2つ

var idolvariety = {};

idolvariety.process = function(){

	//▼あいぽん
	if(urlCheck("SsSsraid_battle_swfSsSs")){	//バトル演出 sSs が含まれるのは、リザルトのURLにraid_～が含まれており、演出と判断されてしまうため
		subfunc_event_flash_jump_btn();
	}
	else if(urlCheck("SsSsappear_raid_boss_swf")){		//フェーズ開始演出のみpexで取り出し
		injectScriptFromFunction(idolvariety.injectScript);
	}
	//▼それ以外のページ
	else {
		subfunc_setEventTableTimer();	//イベント共通タイマー処理
	}
};

//pex監視用
idolvariety.injectScript = function(){
	var _count = 0;
	var _moge = setInterval(function(){
		try{
		//	console.log(pexApi.Ie.Qh.hj);
			if(pexApi.Ie.Qh.hj){
				var _url = pexApi.Ie.Qh.hj.url;
				var _targetScore =  pexApi.Ie.Qh.hj.target_score;
				var _rare_cheer_flag = pexApi.Ie.Qh.hj.rare_cheer_flag;
				var _cheer_phase = pexApi.Ie.Qh.hj.cheer_phase;
			
				var setBaseDivElm = document.createElement("div");
				setBaseDivElm.setAttribute("style","text-align:center;background-color:#111111;height:60px;width:100%;");
				//リンクボタン
				var LinkElm = document.createElement("a");
				LinkElm.href = _url;
				LinkElm.id = "mkt_flashSkip";	//外部css依存
				LinkElm.textContent = 'phase : '+_cheer_phase+' , '+_targetScore+(_rare_cheer_flag>0?" / [rare]":"") ;
				setBaseDivElm.appendChild(LinkElm);
				if(_url){
					document.body.insertBefore(setBaseDivElm,document.body.firstChild);
					clearInterval(_moge);
				}
				
			}
			_count++;
		}catch(e){
			_count++;
			console.log(e);		//何度か試行する(重い時間帯は100msの20回でもダメだった)
		}
		if(_count >= 30){
			clearInterval(_moge);
		}
	},100);

};
