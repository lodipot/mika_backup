
/*	first_load.js の最初の方でも、同様に boombox の上書きを入れている
*/

/** 公式のオーディオ操作メソッドに対し、"改造したもので上書きする処理"を埋め込む処理全般
 * 改造メソッドは参照する音量を #mkt_volume_ctrl ノードの dataset.volume から得ている
 * 大抵は common_script.jsの AudioControllerClass を利用している
 */
document.addEventListener("DOMContentLoaded", (e)=>{

	//調整有効
	if(getOption("system_volume_change_check")){

		//▼音量保持 , 懸け橋的ノードを作成。
		document.body.appendChild( audioController.shareVolumeNode );	//雑に配置
		//	この作成タイミングで getOption() を用いて初期volumeセット
		audioController.shareVolumeNode.dataset["volume"] = getOption("system_volume_change_value") || 1;	//初期値

	//	console.log("window.getAudio() OverWrite!");
		audioController.overwrite_ScriptFromGetAudio();

	//	console.log("boombox.get() OverWrite!");
		audioController.overwrite_ScriptFromBoomboxGet();
		
	//	console.log("boombox.onBlur() OverWrite!");
		audioController.overwrite_ScriptFromBoomboxOnBlur();

		/*
		//▼ブラー無効の短いスクリプトを あちらのwindow空間へ埋め込む(伝搬阻止)
		//boombox.onBlur に処理を一任させたのか、あっちを無効にするだけでOKになったぽい？
		window.addEventListener("blur" , (function(e){
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			e.stopImmediatePropagation();
		}) , false );
		*/
		
		//サウンドブース
		if(location.href.indexOf("idolmaster%2Fs_booth%2Fdetail") != -1){
			var _markerNode = document.getElementById("mt_player");
			if(_markerNode){
				//ゲージノードを用意して配置
				_markerNode.parentNode.insertBefore(audioController.createVolumeInputRangeNode() , _markerNode.nextElementSibling);

				audioController.overwrite_ScriptFromHoge();

				audioController.overwrite_ScriptMusicTheater_audioplayer();
			}
		}

	}



} , false);

		
/*

	boombox.pool.idolVoice0.volume(0.4);

	boombox.pool.idolVoice1.volume(0.1);

	boombox.volume(0.3);	//再生毎に1に戻るン...

	boombox.onBlur = function(){};	//フォーカスがナンボのモンじゃい

	boombox.pool.idolVoice1.play();
	
	boombox.pool[Object.keys(boombox.pool)[0]].volume(1);	//これすればリアルタイムで変えられるかな
	boombox.pool[Object.keys(boombox.pool)[0]].gainNode.gain.value;	//とやってる事は近い
	
	▼オーディオルーム
	html/script内にある __musicTheater から辿ると music_theater.js にある
	 __musicTheater.AudioPlayer.prototype.play あたりを上書きする？
	html内で即時無名な処理で走っているうえ、
	__musicTheaterも即読み込んでいる。contentscript側で対応できる気がしない..
	↓
	ブレポ貼ると __musicTheater.HlsAudioPlayer.prototype.play をつかってた

*/



