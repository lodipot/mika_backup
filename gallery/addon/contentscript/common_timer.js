
/* ▼時間文字列を分解して、回復予想時刻の数値を返すだけ
	ただし、オブジェクトに saveName が定義されているときは、backgroundへの保存も行う
	失敗したときは 0 を返す感じで。
*/
function analysisTimer(typeName, getElm){
	//console.log(typeName);	console.log(timer_TypeTable);
//	console.log(getElm.textContent.length > 5);
	var timerInfoTable = TimerTableObj[typeName];	//単品取り出し
	if(!timerInfoTable){
		console.log("\t【×】analysisTimerの解析に失敗");
		return;
	}
//	console.log(timerInfoTable);

	//解析処理
	var reminderType;	//残り時間で起動させるか、指定時刻で起動させるか
	var timerType = timerInfoTable.timerType;
	var saveName = timerInfoTable.saveName;
	var timerDiff = timerInfoTable.timerDiff;	//時間差分

	//▼時間形式を確認したい
	//解析タイプによって正規表現を変更
	var timerType = timerInfoTable.timerType;

	if(timerType == "recover_digital"){
		regE = RegExp(/([^0-9]*)?([0-9]{2})\:([0-9]{2})/);	// 回復予想時間 xx:xx の形式
		reminderType = "just";
	}
	else if(timerType == "limit_digital" ){
		regE = RegExp(/([^0-9]*)?([0-9]{1,2}\:)?([0-9]{2})\:([0-9]{2})?/);	// ○○まで残り xx:xx の形式
		reminderType = "left";
	}
	else if(timerType == "recover_analog" ){		// 回復時刻	x時x分x秒 の形式
		regE = RegExp(/([^0-9]*)?([0-9]{1,2}時?)([0-9]{1,2}分)?([0-9]{1,2}秒)?/);
		reminderType = "just";
	}
	else if(timerType == "limit_analog"){
		regE = RegExp(/([^0-9]*)?([0-9]{1,2}時間)?([0-9]{1,2}分)?([0-9]{1,2}秒)?/);	// ○○まで残り時間 x時間x分x秒 の形式
		reminderType = "left";
	}
	else if(timerType == "now_slash_max"){
		//(未完成)
		regE = RegExp(/([^0-9]*)?([0-9]{1,3})[^0-9\/]+\/[^0-9]?([0-9]{1,3})/);	// nn/nn や nn / nn に対応
		reminderType = "left";	//どっちでもいいけど
	}

	//matchで引っ張り出す
	var timeArr;
	if(getElm.textContent.length > 2){
		timeArr = getElm.textContent.match(regE);
//		console.log(getElm , timeArr);
	}
//	console.log(timeArr , getElm.textContent);

	if(timeArr){
		var time_h;
		var time_m;
		var time_s;
		if(timeArr[2]){	//時間
			time_h = parseInt(timeArr[2] , 10);
		}
		if(timeArr[3]){
			time_m = parseInt(timeArr[3] , 10);
		}
		if(timeArr[4]){
			time_s = parseInt(timeArr[4] , 10);
		}
//		console.log("\t"+timerType+" >> "+reminderType+" / h*"+time_h+" : m*"+time_m+" : s*"+time_s+" / Diff = "+timerDiff);

		var nowTimeObj = new Date();
		var retRecoverTimeNum = 0;
		//▼パターンA 残り時間から時間値を算出
		if(reminderType == "left"){
			//undefinedを0化
			if(time_h === undefined){
				time_h = 0;
			}
			if(time_m === undefined){
				time_m = 0;
			}
			if(time_s === undefined){
				time_s = 0;
			}
			//現在時刻を得る
			var nowTimeNum = nowTimeObj.getTime();
			retRecoverTimeNum = nowTimeNum + (1000 * 60 * 60 * time_h) + (1000 * 60 * time_m) + (1000 * time_s);
//			console.log("\t saveName:"+saveName+" / retRecoverTimeNum:"+retRecoverTimeNum);
		}
		//▼パターンB 指定時刻に通知されるように時間値を算出
		else if(reminderType == "just"){
			if(time_h != undefined && time_h < nowTimeObj.getHours()){	//現時刻が下回っていれば、翌日0時扱い
				time_h = time_h+24;				//24h足す
			}
			var recovertimeObj = new Date(nowTimeObj.getFullYear(), nowTimeObj.getMonth(), nowTimeObj.getDate() , time_h , time_m ,nowTimeObj.getSeconds());
		//	console.log(recovertimeObj);
			retRecoverTimeNum = recovertimeObj.getTime();
			console.log("saveName:"+saveName+" / retRecoverTimeNum:"+retRecoverTimeNum);
		}else {
			console.log("\t【×】MKT:leftでもjustでもありません");
			return 0;
		}

		//▼n秒前指定がある場合、時間をセットしなおす(そこから-n秒前にすれば、指定秒数前の通知として使える)
		if(timerDiff){
			var DiffNum = getOption(timerDiff);
			console.log("\tDiffNumの定義により、発現時間 を"+DiffNum+"秒遅らせます");
			retRecoverTimeNum -= (1000 * DiffNum);
		}

		//保存定義がしてあればローカルストレージに回復時刻数値を保存しておく。この値自体はマイスタジオで使う
		if(saveName){
			saveOption(saveName , retRecoverTimeNum);
	//		console.log("MKT:保存定義が存在:["+saveName+"]に["+retRecoverTimeNum+"]で保存");
  		} else {
			console.log("\tsaveNameがありません");
		}

		return retRecoverTimeNum;

	}else {
		console.log("\t【×】MKT:["+typeName+"]時間配列timeArr取得に失敗:0を返却");
	}

	return 0;
}
