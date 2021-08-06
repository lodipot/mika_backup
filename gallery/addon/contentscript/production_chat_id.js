//▼プロダクションページから、チャットのIDを得て保存するだけ

function mainfunc_productionchat(){

	var _original_id = getOption("production_chat_id");

	var chatAreaElm = document.querySelector("div[data-plugins-type='mbga-game-chat']");
	if(chatAreaElm){
		var _getTalkId = chatAreaElm.getAttribute("data-talk-id");
		if(_getTalkId){
			console.log(_getTalkId);
			//オリジナルが取得されていたとして、同一なら返す
			if(_original_id == _getTalkId){
				console.log("チャットID更新の必要はありません : "+_getTalkId);
				return;
			}
			//それ以外の場合は処理が通るので保存
			saveOption("production_chat_id",_getTalkId);	//トークIDを保存
			BackgroundNotification("datatalkid");	//保存通知
			return;
		}else{
			console.warn("getTalkIdの取得に失敗");
		}
	}else{
		console.warn("chatAreaElmの取得に失敗");
	}
}
