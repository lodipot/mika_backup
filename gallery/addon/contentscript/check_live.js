
//livecheck
function mainfunc_livecheck(){


	//通信開始
	var httpObj = new XMLHttpRequest();

	var nicoliveURL = "https://com.nicovideo.jp/community/co1920457";

	httpObj.open("get", nicoliveURL, true);
	httpObj.onload = function(){

		if(this.readyState==4 && this.status==200){
		//	console.log(this);
			if(this.responseText.indexOf('class="now_live"') != -1){
				var matchTemp = this.responseText.match(/community\"\>([^\<]*)/);
				var matchTitle;
				try{
					matchTitle = matchTemp[1];
				} catch(e){
			//		console.log(e);
					console.log("live no title");
					return;
				}

			//	console.log(matchTitle);
				var matchURL = this.responseText.match(/\/watch\/lv[0-9]{5,}/);
				var setURL = "http://live.nicovideo.jp";
				if(matchURL){
				//	console.log(matchURL);
					setURL += matchURL[0];	//URLと繋げて実用可能に
				//	console.log(setURL);
					//mystudio情報を書き換え & イベントセット
					var liveLinkElm = document.getElementById("mkt_livelink");
					liveLinkElm.href = setURL;
					liveLinkElm.target = "_blank";
					liveLinkElm.title = matchTitle;

					var iconPath = getFilePath("image/info_icon/icon_orange.png");
					if(matchTitle.indexOf("限解") != -1){
						iconPath = getFilePath("image/info_icon/icon_green.png");
					}
					var liveImgElm = liveLinkElm.querySelector("#mkt_livelinkimg");
					liveImgElm.src = iconPath;

				}
			}
			httpObj = null;
		}
	}

	httpObj.send(null);

}

