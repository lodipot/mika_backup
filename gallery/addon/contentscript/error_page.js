//	エラーページ介入
//	最後に開いたプロフィールページからIDを保存、エラー画面でリンク生成
//	live_battle.js の mainfunc_livebattle() でIDを取得してローカルストレージ or background.js内に保存
//	本スクリプト (error_page.js) の関数にて取り出してリンク生成

function mainfunc_errorpage(mainElm){

	const _markElm = mainElm.querySelector("h2.title_tenhoshi");
	console.log(_markElm);

	if(_markElm){

		const _baseNode = document.createElement("div");
		_baseNode.setAttribute("style","width:100%;height:100px;");

		const _profileLink = document.createElement("div");
		_profileLink.setAttribute("style","margin:10px;text-align:center;");
		
		//保存してあるプロフィールIDを取得してリンク生成
		const _enemyId = getOption("lastprofile_id");
		console.log(_enemyId);
		if(_enemyId){
			const _baseURL = 'http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattles%2Fbattle_check%2F'+_enemyId+'%3F';
			_profileLink.innerHTML = "<a href='"+_baseURL+"' class='a_link'>最後に開いたプロフィールページへ<br>※単騎凸用機能※</a>";

			_baseNode.appendChild(_profileLink);
			_markElm.parentNode.insertBefore(_baseNode , _markElm.nextSibling);
		}
		
		//配置
	}

}



