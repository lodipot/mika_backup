//アイテム系画面で呼ばれるスクリプト


var ItemClass = {

	//アイテム使用後のリザルト画面URLで呼ばれる
	//主に、マイエナハ消費後に「同じ相手とLIVEバトル」が出現しない仕様への対策として扱われる
	useResult:function(){

		//リンク属性が見つからなければ、配置する
		if(!document.querySelector("#top > div:nth-of-type(3) > a.a_link")){

			var _orgBackLinkElm = document.querySelector("#top > a > div.backLink");
			if(_orgBackLinkElm){
				var enemy_id = getOption("lastprofile_id");	//live_battle.js で保存されたプロデューサーIDを得る
				var _linkElm = document.createElement("a");
				var _divElm = document.createElement("div");
				_linkElm.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattles%2Fbattle_check%2F"+enemy_id+"%3F";
				_divElm.className = "backLink";	//公式css
				_divElm.textContent = "同じ相手とLIVEバトル";
				_divElm.title = "この機能/表示は拡張機能によるものです";
				_divElm.style.cursor = "pointer";
				_linkElm.appendChild(_divElm);
			//	console.log(_divElm);
			//	console.log(_orgBackLinkElm);
				_orgBackLinkElm.parentNode.insertBefore(_linkElm , _orgBackLinkElm);
			}else{
				console.warn("_orgBackLinkElm の取得に失敗しました");
			}
		}else{
			console.warn("リンク属性を検知 -> #top > div:nth-of-type(3) > a.a_link");
		}

	}

};
