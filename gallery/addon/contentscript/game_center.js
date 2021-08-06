/**
 * ゲームセンターのレイアウトをチェンジ
 */
/*
    以前はこれをbackground.js に書くことで実行させていた
chrome.webRequest.onCompleted.addListener(
	function(details){
		console.log(details)
		if(details.type == "xmlhttprequest"){
			console.log(details.url);
			let _url = details.url;
			if(_url.indexOf("game_center%2F") != -1 && _url.indexOf("%3FflashParam%3D") != -1){
				//ゲーム時にmargintopを弄る
				chrome.tabs.executeScript(null, {runAt:"document_end", code:"document.getElementById('container').style.marginTop='0px';console.log('st-change');" }, function(){});
			}
		}
	},
	{urls: ["http://*.mbga.jp/12008305/*"]	}
);
*/
/**
 * http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fsmart_phone_flash%2Fconvert_game_center%2Fhanafuda%3F
 * http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fsmart_phone_flash%2Fconvert_game_center%2Fdice_de_survival%3Fparty_hash%3D0f6f86d5cacfa1da2b8645263e2d6b6b427936622c6d52be95feaf2d4e5990c4%26
 * 
 */

if(0){
    let _Func = function(){
        document.getElementById('container').style.marginTop='0px';
        console.log('st-change');
    }
    injectScriptFromFunction(_Func);
}


