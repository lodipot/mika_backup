//規制検出
//%2Fidolmaster%2Ferror%2Flimited_access%3F
//%2Fidolmaster%2Fgame_error%2Flimited_access%3Fl_frm%3DEvent_royale_index_1%26rnd%3D257018125

class TimerGaugeClass{

	constructor(){
		this._targetNode = null;
	}

	/**
	 * 伸縮させるノードをセット
	 * @param {HTMLElement} _node 
	 */
	setGaugeNode(_node){
		this._targetNode = _node;
	}

	/**
	 * 小数点が含まれる可能性がある
	 * @param {*} _percentage 
	 */
	tick(_percentage){
		
	}

}



function mainfunc_limitedaccess(){
	//まず、既にタイマーが起動しているかチェックする
	//起動中なら、ページを受信してもタイマーを上書き起動することはしない
	//console.log("規制ページ判定");

	const _targetNode = document.querySelector("#top > img");
	if(!_targetNode){
		return;
	}


	const _nowTimeObj = new Date();
	const _nowTimeNum = _nowTimeObj.getTime();
	let _recoverTimeNum = getOption("timevalue_limitedaccess");
	console.log(_recoverTimeNum);

	if(_recoverTimeNum >= _nowTimeNum){
		//console.log("既にタイマーが起動しているようです");
		//BackgroundNotification("limitedaccessoverlap");
	}
	else {
		//現在時間 + 1分
		_recoverTimeNum = _nowTimeNum + (1000 * 60);
		saveOption("timevalue_limitedaccess",_recoverTimeNum);
		requestTimer("limitedaccess", _recoverTimeNum);
		//console.log("タイマー起動");
		BackgroundNotification("limitedaccessstart");
	}

	/**
	 * ゲージ系
	 */
	const _gaugebaseNode = document.createElement("div");
	_gaugebaseNode.className = "mkt_lmited_access_gauge";	// limited_access.css
	_gaugebaseNode.style.backgroundColor = "#66CC66";
	_gaugebaseNode.style.width = "100%";
	_gaugebaseNode.style.margin = "10px 0px";
	const _gaugeNode = document.createElement("div");
	//_gaugeNode.className = "mkt_timerinfo_Gauge";
	_gaugeNode.style.backgroundColor = "#FF6666";
	_gaugeNode.style.height = "3px";
	_gaugebaseNode.appendChild(_gaugeNode);

	// スタンプ定義
	const _stampArray = [
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41004/ac8bf86d09?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41007/8c4121ba69?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41013/ce9ad45c7e?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41014/a3f6f01cbc?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41017/2a324bd0f9?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/41/89a50738b4/41020/d0800f6672?s=large&e=png&v=1385519662",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/59/3a9199af0d/59006/cfec4e2ae3?s=large&e=png&v=1392194665",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/59/3a9199af0d/59019/11076a3700?s=large&e=png&v=1392694925",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70005/8eb0677e61?s=large&e=png&v=1395028078",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70008/22903d2a3e?s=large&e=png&v=1395803130",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70009/b327037c20?s=large&e=png&v=1395803130",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70014/7faecd7367?s=large&e=png&v=1396409771",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70017/fdbbc532b1?s=large&e=png&v=1396409770",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70019/e0b2becb24?s=large&e=png&v=1396409770",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/70/e341a8ef10/70020/8f4e762387?s=large&e=png&v=1396409771",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72003/2e36e9aa57?s=large&e=png&v=1396591687",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72004/85c531712c?s=large&e=png&v=1396591686",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72008/f698820cac?s=large&e=png&v=1396591686",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72010/515585e6c4?s=large&e=png&v=1396591687",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72012/3e75a5f7da?s=large&e=png&v=1396591687",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72014/e7bdd218bc?s=large&e=png&v=1397462962",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/72/22565e2397/72020/9d8bf63884?s=large&e=png&v=1399603012",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82003/afe437956c?s=large&e=png&v=1401184187",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82007/bcc3a266b9",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82008/5e5e04e969",
		//"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82015/bf5fc882f0",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82017/0a5de225b1",
		//"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82018/7caa47b031?s=large&e=png&v=1404723023",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82020/563cf9c14b?s=large&e=png&v=1404960127",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/82/c07c19360d/82022/d6b5d35eba",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/88/5aae28816e/88003/fa2aafbd5e?s=large&e=png&v=1408069300",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/88/5aae28816e/88008/466bf499d7",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/88/5aae28816e/88009/63265d2bfb",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/88/5aae28816e/88018/1d0c93a860?s=large&e=png&v=1412755865",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/95/29a2c0b63c/95008/60c2bf3fda?s=large&e=png&v=1417051621",
		//"http://ava-a.sp.mbga.jp/img_chat_stamp/95/29a2c0b63c/95009/cfed4a4258?s=large&e=png&v=1417051621",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/95/29a2c0b63c/95011/b9fc993ee1?s=large&e=png&v=1417051621",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/95/29a2c0b63c/95024/33585ab895?s=large&e=png&v=1421286744",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105004/393b248e52",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105008/691eee7ba0",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105010/57bdcd1118?s=large&e=png&v=1425458586",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105015/bc3d1d31d2?s=large&e=png&v=1428646522",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105017/c811059fd1?s=large&e=png&v=1429671926",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105019/40a052d870?s=large&e=png&v=1431312168",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105022/3d20ff0e29?s=large&e=png&v=1433395417",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105023/6b64c5f4f9?s=large&e=png&v=1434437076",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/105/d3e2dd44ac/105024/d65b757fb9?s=large&e=png&v=1434591145",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136001/4bee274242?s=large&e=png&v=1435282791",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136004/17d7d9a44d?s=large&e=png&v=1436943627",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136006/24ffad298d?s=large&e=png&v=1437963563",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136008/926e4a92fb?s=large&e=png&v=1439364892",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136009/c829285730",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136010/6c01e8725b?s=large&e=png&v=1440746150",
		//"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136013/7f2ba3390d",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136015/88b10f05c2",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136017/944bb21326?s=large&e=png&v=1444877489",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136018/effdc5db22?s=large&e=png&v=1445996214",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/136/fbccac374c/136020/3184006fb1?s=large&e=png&v=1447381553",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167001/a0296fdcb5?s=large&e=png&v=1450921449",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167006/3417011705?s=large&e=png&v=1453786444",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167008/eb8e28d026?s=large&e=png&v=1455590966",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167010/33791f8355?s=large&e=png&v=1456464015",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167012/046977433e?s=large&e=png&v=1458183168",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/167/bb828dae6d/167019/64891d24d3?s=large&e=png&v=1462172831",
		//"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179004/b023fb007e?s=large&e=png&v=1468398333",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179005/0499cbd011?s=large&e=png&v=1469067460",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179006/74ce2ec147?s=large&e=png&v=1469675096",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179009/bd47e2824f?s=large&e=png&v=1472102173",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179018/f463cd0c0d?s=large&e=png&v=1477631362",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179020/5212e1137d?s=large&e=png&v=1479092049",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/179/05e5e4670b/179021/6c65e73a21?s=large&e=png&v=1479447137",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188001/5ae0d5f542?s=large&e=png&v=1482370876",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188004/0546bdf338?s=large&e=png&v=1484543307",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188007/30e5c8415c?s=large&e=png&v=1486090331",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188011/15a0f20e2c?s=large&e=png&v=1488770293",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188015/47385c1ee4?s=large&e=png&v=1491369610",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188018/df86e4fabd?s=large&e=png&v=1493172463",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188022/d309bf6158?s=large&e=png&v=1495689033",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188023/91c77a1e27?s=large&e=png&v=1496803480",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/188/8394a2dd38/188024/7b75aa7f84?s=large&e=png&v=1497248803",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/207/c309ab6550/207008/6782f2fbda?s=large&e=png&v=1502351711",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/207/c309ab6550/207009/46cfc036f0?s=large&e=png&v=1502860575",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/207/c309ab6550/207012/8496618607?s=large&e=png&v=1505455953",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/207/c309ab6550/207019/d1da3a9c79?s=large&e=png&v=1510017723",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/207/c309ab6550/207020/aa061c5ab9?s=large&e=png&v=1510191949",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/231/f1c7518338/231007/00a88f59ab?s=large&e=png&v=1517888471",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/231/f1c7518338/231011/c20aa738c5?s=large&e=png&v=1520315416",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/231/f1c7518338/231017/ca39dcf5f0?s=large&e=png&v=1524447610",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/231/f1c7518338/231022/570ebc87bf?s=large&e=png&v=1527558936",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244001/5777f8b5f7?s=large&e=png&v=1529458507",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244009/f1033a850a?s=large&e=png&v=1534822178",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244012/ca4cf52971?s=large&e=png&v=1536721180",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244016/b64ced123b?s=large&e=png&v=1539582995",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244018/d17b57cc96?s=large&e=png&v=1540806708",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244020/757181f427?s=large&e=png&v=1542159375",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/244/126827ca5b/244024/6f38e932c8?s=large&e=png&v=1544685831",
		//v16
		"http://ava-a.sp.mbga.jp/img_chat_stamp/256/4d48d002fc/256010/136c1334da?s=large&e=png&v=1551235934",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/256/4d48d002fc/256017/827adbf76a?s=large&e=png&v=1557198823",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/256/4d48d002fc/256018/c5c761c1ed?s=large&e=png&v=1557453298",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/256/4d48d002fc/256021/07fa6e787f?s=large&e=png&v=1560831781",
		//v17
		"http://ava-a.sp.mbga.jp/img_chat_stamp/262/9a36e7232f/262004/fffa2394d2?s=large&e=png&v=1567042137",
		"http://ava-a.sp.mbga.jp/img_chat_stamp/262/9a36e7232f/262005/0814f5f771?s=large&e=png&v=1567563961",

	];

	//スタンプに関する処理
	const _stampNode = new Image();
	const _targetStampURL = _stampArray[ Math.floor(Math.random() * ((_stampArray.length-1) - 0 + 1) + 0) ];
	_stampNode.style.height = "130px";
	_stampNode.src = _targetStampURL;
	const _imageAreaNode = document.createElement("div");
	_imageAreaNode.style.height = "130px";
	_imageAreaNode.appendChild(_stampNode);
	

	const _setDivElm = document.createElement("div");
	const _secNode = document.createElement("div");
	const _setDivElm_A = document.createElement("div");
	const _setDivElm_B = document.createElement("div");

	_secNode.style.fontSize = "18px";
	_secNode.classList.add("pink");
	_setDivElm.style.textAlign = "center";


	_setDivElm.appendChild(_imageAreaNode);
	//☆ライン画像をコピーしたものを配置
	//_setDivElm.appendChild(_targetNode.cloneNode());

	
	_setDivElm.appendChild(_gaugebaseNode);

	_setDivElm.appendChild(_secNode);
	_setDivElm.appendChild(_setDivElm_A);
	_setDivElm.appendChild(_setDivElm_B);
	_setDivElm.appendChild(document.createTextNode("※このページはタイマー発現後"));
	_setDivElm.appendChild(document.createElement("br"));
	_setDivElm.appendChild(document.createTextNode("なるべくリロードしないようにして下さい"));

	const _recoverTimeObj = new Date();
	_recoverTimeObj.setTime(_recoverTimeNum);
	_setDivElm_A.textContent = "解除予想時刻:"+_recoverTimeObj.toLocaleString();


	_targetNode.parentNode.insertBefore(_setDivElm, _targetNode.nextSibling);

	//更新間隔
	const _tickMs = 100;


	//現在時刻の表示時間更新
	const _timeUpdateFunc = _e => {
		const _nowDate = new Date();
		_setDivElm_B.textContent = "現在時刻(PC):"+_nowDate.toLocaleString();
		const _nowTimeNum = _nowDate.getTime();
		const _sa = (_recoverTimeNum - _nowTimeNum);
		if(_sa > 0){
			_secNode.textContent = Math.ceil(_sa / 1000);
			//console.log(_recoverTimeNum - _nowTimeNum , "ms");	
			// 100(%) に対し 60000ms を 刻み時間で割った値で割る = 刻み時間ごとの幅 n%
			const _xx = (100 / (60000/_tickMs)) * (_sa / _tickMs);
			//console.log(_xx);
			if(_xx > 0){
				_gaugeNode.style.width = _xx + "%";
				return;
			}
		}
		_secNode.textContent = "0";
		_gaugeNode.style.width = "0%";
	}
	_timeUpdateFunc();
	setInterval(_timeUpdateFunc ,_tickMs);



}




