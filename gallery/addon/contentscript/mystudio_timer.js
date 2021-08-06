var myStudioTimer = {};

myStudioTimer.nodes = {
};


//マイスタジオで稼動するタイマー定義
var TimerTableObj = {
    "stamina": {
        selectorRemaining: "mkt_timerinfo_stamina_Remaining"//書換用セレクタ目印(残り時間)
        ,selectorTime: "mkt_timerinfo_stamina_Clock"//書換用セレクタ目印(全回復時刻)
        ,optionName: "timevalue_stamina"//background.jsに保存されている値
        ,saveName: "timevalue_stamina"//background.jsに解析と同時に保存する
        ,timerType: "now_slash_max"// **/** の形式
        ,timerType_pointTime: 3 // ↑の数値は1あたり何分で回復するのか
        ,rewriteAreaElm: null
    },
    "attackcost": {
        selectorRemaining: "mkt_timerinfo_attack_Remaining"//書換用セレクタ目印(残り時間)
        ,selectorTime: "mkt_timerinfo_attack_Clock"//書換用セレクタ目印(全回復時刻)
        ,optionName: "timevalue_attack"//background.jsに保存されている値
        ,saveName: "timevalue_attack"//background.jsに解析と同時に保存する
        ,rewriteAreaElm: null
    },
    "lesson01": {
        selectorRemaining: "mkt_timerinfo_lesson01_R",
        selectorTime: "mkt_timerinfo_lesson01_T",
        optionName: "timevalue_petit_lesson01",
        saveName: "timevalue_petit_lesson01",
        timerType: "limit_digital",
        textFullRecovery: "lesson complete!",
        textEmpty: "Empty",
        url: "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Findex%2F1%3Fview_page%3D2%26",
        rewriteAreaElm: null
    },
    "lesson02": {
        selectorRemaining: "mkt_t_petitLesson02_R"//書換用セレクタ目印(残り時間)
        ,selectorTime: "mkt_t_petitLesson02_T"//書換用セレクタ目印(全回復時刻)
        ,optionName: "timevalue_petit_lesson02"//background.jsに保存されている値
        ,saveName: "timevalue_petit_lesson02"//background.jsに解析と同時に保存する
        ,timerType: "limit_digital"
        ,textFullRecovery: "lesson complete!"//全回復テキスト
        ,textEmpty: "Empty"//空の状態
        ,url: "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Findex%2F2%3Fview_page%3D2%26",
        rewriteAreaElm: null //書換エリア
    },
    "lesson03": {
        selectorRemaining: "mkt_t_petitLesson03_R",
        selectorTime: "mkt_t_petitLesson03_T",
        optionName: "timevalue_petit_lesson03",
        saveName: "timevalue_petit_lesson03",
        timerType: "limit_digital",
        textFullRecovery: "lesson complete!",
        textEmpty: "Empty",
        url: "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpetit_cg%2Findex%2F3%3Fview_page%3D2%26",
        rewriteAreaElm: null
    },
    "idollivetour": {
        maxValue: 6,
        textString: "LP",
        textFullRecovery: "Full Recovery",
        selectorNum: "mkt_timerinfo_Num",
        selectorRemaining: "mkt_timerinfo_Remaining",
        selectorTime: "mkt_timerinfo_Clock",
        selectorGauge: "mkt_timerinfo_Gauge",
        optionName: "timevalue_event_livepoint",
        requestName: "livepoint",
        rewriteAreaElm: null
    },
    "dreamlivefestival": {
        maxValue: 6,
        textString: "AP"//ポイント名
		,textFullRecovery: "Full Recovery"//全回復テキスト
        ,selectorNum: "mkt_timerinfo_Num"//数値を書き換えるための目印
        ,selectorRemaining: "mkt_timerinfo_Remaining"//書換用セレクタ目印(残り時間)
        ,selectorTime: "mkt_timerinfo_Clock"//書換用セレクタ目印(全回復時刻)
        ,selectorGauge: "mkt_timerinfo_Gauge"//書換用セレクタ目印(ゲージ)
        ,optionName: "timevalue_event_appealpoint"//background.jsに保存されている値
        ,requestName: "appealpoint"//これをトリガにして、bg内backgroundShowTableのタイマーを起動させる
        ,rewriteAreaElm: null
    },
    "idolliveroyale": {
        maxValue: 5,
        textString: "BP",
        textFullRecovery: "Full Recovery",
        selectorNum: "mkt_timerinfo_Num",
        selectorRemaining: "mkt_timerinfo_Remaining",
        selectorTime: "mkt_timerinfo_Clock",
        selectorGauge: "mkt_timerinfo_Gauge",
        optionName: "timevalue_event_battlepoint",
        requestName: "battlepoint",
        rewriteAreaElm: null
    },
    "talkbattleshow": {
        maxValue: 6
		,textString: "TP"//ポイント名
		,textFullRecovery: "Full Recovery"//全回復テキスト
		,selectorNum: "mkt_timerinfo_Num"//数値を書き換えるための目印
		,selectorRemaining: "mkt_timerinfo_Remaining"//書換用セレクタ目印(残り時間)
		,selectorTime: "mkt_timerinfo_Clock"//書換用セレクタ目印(全回復時刻)
        ,selectorGauge: "mkt_timerinfo_Gauge"//書換用セレクタ目印(ゲージ)
		,optionName: "timevalue_event_talkpoint"//background.jsに保存されている値
		,requestName: "talkpoint"//これをトリガにして、bg内backgroundShowTableのタイマーを起動させる
		,rewriteAreaElm: null
    },
    "teamtalkbattleshow": {
        maxValue: 6
		,textString: "TP"
        ,textFullRecovery: "Full Recovery"
		,selectorNum: "mkt_timerinfo_Num"
		,selectorRemaining: "mkt_timerinfo_Remaining"
		,selectorTime: "mkt_timerinfo_Clock"
		,selectorGauge: "mkt_timerinfo_Gauge"
		,optionName: "timevalue_event_talkpoint"
		,requestName: "talkpoint"
		,rewriteAreaElm: null
    },
    "idolchallenge": {
        maxValue: 6,
        textString: "CP",
        textFullRecovery: "Full Recovery",
        selectorNum: "mkt_timerinfo_Num",
        selectorRemaining: "mkt_timerinfo_Remaining",
        selectorTime: "mkt_timerinfo_Clock",
        selectorGauge: "mkt_timerinfo_Gauge",
        optionName: "timevalue_event_challenegepoint",
        requestName: "challengepoint",
        rewriteAreaElm: null
    },
    "idolvariety": {
        maxValue: 6,
        textString: "SP",
        textFullRecovery: "Full Recovery",
        selectorNum: "mkt_timerinfo_Num",
        selectorRemaining: "mkt_timerinfo_Remaining",
        selectorTime: "mkt_timerinfo_Clock",
        selectorGauge: "mkt_timerinfo_Gauge",
        optionName: "timevalue_event_supportpoint",
        requestName: "supportpoint",
        rewriteAreaElm: null
    },
    "musicjam": {
        maxValue: 6,
        textString: "JP",
        textFullRecovery: "Full Recovery",
        selectorNum: "mkt_timerinfo_Num",
        selectorRemaining: "mkt_timerinfo_Remaining",
        selectorTime: "mkt_timerinfo_Clock",
        selectorGauge: "mkt_timerinfo_Gauge",
        optionName: "timevalue_event_jampoint",
        requestName: "jampoint",
        rewriteAreaElm: null
    }
};
//マイスタジオタイマー
var mainfunc_mystudioTimer = function(typeName) {}
//▼そのオブジェクトの保存,取り出しオプション名を得るメソッド
mainfunc_mystudioTimer.optionName = function(typeName) {
    return TimerTableObj[typeName].optionName;
}
//▼そのオブジェクトのbackgroundリクエスト名を得るメソッド
mainfunc_mystudioTimer.requestName = function(typeName) {
    return TimerTableObj[typeName].requestName;
}
//▼そのオブジェクトを取り出す
mainfunc_mystudioTimer.getObj = function(typeName) {
    return TimerTableObj[typeName];
}
//▼テーブル内に書換先の要素を保存
mainfunc_mystudioTimer.setRewriteElm = function(typeName, saveElm) {
    //	console.log(typeName);
    //	console.log(TimerTableObj[typeName]);
    TimerTableObj[typeName].rewriteAreaElm = saveElm;
}
//▼イベント用ゲージとタイマー用の要素を作成して返すメソッド mystudio.js で呼ばれる
mainfunc_mystudioTimer.getElm = function(typeName) {
    var singleObj = TimerTableObj[typeName];
    if (!singleObj) {
        console.error("【×】MKT:ゲージ用処理@タイマーテーブル[" + typeName + "]の抽出に失敗");
        return null ;
    }
    var maxValue = singleObj.maxValue;
    if (maxValue) {
        var setBaseElm = document.createElement("div");
        setBaseElm.setAttribute("style", "margin-bottom:3px;");
        //divを横方向に
        //ポイント名
        var setPointNameElm = document.createElement("span");
        setPointNameElm.innerText = singleObj.textString;
        //ポイント数
        var setPointNumElm = document.createElement("span");
        setPointNumElm.setAttribute("class", "blue");
        setPointNumElm.id = singleObj.selectorNum;
        setPointNumElm.setAttribute("style", "margin:0 10px 0 10px;");
        setPointNumElm.innerText = singleObj.maxValue;
        //▼時刻全般エリア
        var setTimeAreaElm = document.createElement("div");
        setTimeAreaElm.setAttribute("id", "point_time_state");
        //	setTimeAreaElm.setAttribute("style","font-size:13px;");
        //残り時間
        var setRemainingElm = document.createElement("span");
        setRemainingElm.id = singleObj.selectorRemaining;
        //予想時刻
        var setClockElm = document.createElement("span");
        setClockElm.setAttribute("class", "yellow");
        setClockElm.setAttribute("style", "margin-left:5px;");
        setClockElm.id = singleObj.selectorTime;
        setClockElm.innerText = singleObj.textFullRecovery;
        setTimeAreaElm.appendChild(setPointNameElm);
        setTimeAreaElm.appendChild(setPointNumElm);
        setTimeAreaElm.appendChild(setRemainingElm);
        setTimeAreaElm.appendChild(setClockElm);
        //▼ゲージ関連
        var setGaugeAreaElm = document.createElement("div");
        setGaugeAreaElm.setAttribute("style", "margin:0 auto;width:180px;");
        setGaugeAreaElm.setAttribute("name", "gauge_state");
        //目盛り用テーブル作成
        var setTableElm = document.createElement("table");
        setTableElm.setAttribute("border", 1);
        setTableElm.setAttribute("bordercolor", "#f0e0a0");
        setTableElm.setAttribute("style", "position:absolute;");
        var setTRElm = document.createElement("tr");
        var setWidth = Math.ceil((180 / maxValue) - 3);
        for (var i = 0; i < maxValue; i++) {
            var setTDElm = document.createElement("td");
            setTDElm.setAttribute("style", "width:" + setWidth + "px;height:1px;");
            //高さとか
            setTRElm.appendChild(setTDElm);
        }
        //▼バー作成
        var setBarElm = document.createElement("span");
        setBarElm.id = singleObj.selectorGauge;
        setBarElm.setAttribute("style", "width:100%;");
        //▼配置。absoluteの関係で配置順を云々
        setTableElm.appendChild(setTRElm);
        setGaugeAreaElm.appendChild(setTableElm);
        setGaugeAreaElm.appendChild(setBarElm);
        setBaseElm.appendChild(setTimeAreaElm);
        //ポイント
        setBaseElm.appendChild(setGaugeAreaElm);
        //ゲージ
        return setBaseElm;
    } else {
        console.log("MKT:[" + typeName + "]イベントゲージ外判定");
    }
}
//書き換え用のタイマーを起動 引数はテーブル内の固有オブジェクトと、全回復予想時刻数値
mainfunc_mystudioTimer.secondRewrite = function(typeName, recovertimenum) {
    var timeObj = new Date();
    var nowtimenum = timeObj.getTime();
    //	console.log("nowtimenum:"+nowtimenum+" / recovertimenum:"+recovertimenum);
    if (nowtimenum >= recovertimenum) {
        console.log("MKT:" + typeName + "時刻比較による全回復判定");
        return;
    }
    var singleObj = TimerTableObj[typeName];
    if (!singleObj) {
        console.log("【×】MKT:singleObj[" + typeName + "]の取得に失敗");
        return;
    }
    var resttime = recovertimenum - nowtimenum;
    //回復までの残り時間を20(分)で割って、それを切り上げ(繰上げ)た数字を、maxValueから引いたもの = 現在のBP
    var maxValue = singleObj.maxValue;
    var nowPoint = maxValue - Math.ceil((resttime / 1000 / 60) / 20);
    var puts_h = Math.floor(resttime / 1000 / 60 / 60);
    var puts_m = Math.floor(resttime / 1000 / 60 % 60);
    var puts_s = Math.floor(resttime / 1000 % 60);
    var fullRecoveryFlag = false;
    if (puts_h == 0 && puts_m == 0 && puts_s == 0) {
        fullRecoveryFlag = true;
    }
    var tempRewriteElm = singleObj.rewriteAreaElm;
    //	console.log(tempRewriteElm);
    if (!tempRewriteElm) {
        console.log("【×】MKT:singleObj[" + typeName + "]のrewriteAreaElm取得に失敗");
        return;
    }
    //▼書換先
    var targetRemainingElm = tempRewriteElm.querySelector("#" + singleObj.selectorRemaining);
    var targetPointNumElm = tempRewriteElm.querySelector("#" + singleObj.selectorNum);
    var targetTimeElm = tempRewriteElm.querySelector("#" + singleObj.selectorTime);
    if (fullRecoveryFlag == false) {
        //	if(puts_h < 10){	puts_h = "0"+puts_h;	}
        if (puts_m < 10) {
            puts_m = "0" + puts_m;
        }
        if (puts_s < 10) {
            puts_s = "0" + puts_s;
        }
        //全回復予想時刻
        var FullRecoverTimeObj = new Date();
        FullRecoverTimeObj.setTime(recovertimenum);
        var h = FullRecoverTimeObj.getHours();
        var m = FullRecoverTimeObj.getMinutes();
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        var puts;
        if (puts_h > 0) {
            puts = puts_h + "時間" + puts_m + "分" + puts_s + "秒 ";
        } else {
            puts = puts_m + "分" + puts_s + "秒 ";
        }
    }
    //	console.log(targetRemainingElm);
    if (targetRemainingElm) {
        if (!fullRecoveryFlag) {
            targetRemainingElm.innerHTML = (puts);
        } else {
            targetRemainingElm.innerHTML = "";
        }
    }
    if (targetPointNumElm) {
        if (!fullRecoveryFlag) {
            targetPointNumElm.innerText = nowPoint;
        } else {
            targetPointNumElm.innerText = maxValue;
            //計算では全回復時に正しい全回復値にならないので、強制書換
        }
    }
    if (targetTimeElm) {
        if (!fullRecoveryFlag) {
            targetTimeElm.innerText = h + ":" + m;
        } else {
            targetTimeElm.innerText = singleObj.textFullRecovery;
        }
    }
    //▼ゲージ書換(イベント用)
    if (maxValue && singleObj.selectorGauge) {
        //最高値 * 20分 = 全回復に必要な時間 のうち、 restTime の割合を見る
        //	console.log(singleObj.rewriteAreaElm);
        var gaugePercentage = 100 - ((resttime / (maxValue * (20 * 60 * 1000))) * 100).toFixed(3);
        try {
            var targetGaugeElm = singleObj.rewriteAreaElm.querySelector("#" + singleObj.selectorGauge);
            if (targetGaugeElm) {
                //	id =mkt_timerinfo_Gauge のstyleはcss任せ
                targetGaugeElm.setAttribute("style", "width:" + gaugePercentage + "%;");
            }
        } catch (e) {
            console.log("【×】MKT:イベント用ゲージ書換先Elmがテーブルから取り出せません");
            return;
        }
    }
    setTimeout("mainfunc_mystudioTimer.secondRewrite('" + typeName + "'," + recovertimenum + ")", 1000);
}
;
//▼ぷちデレラ用レッスンタイマー用の要素を作成して返す
//【※】同時に、テーブルに書換先要素を保存する
mainfunc_mystudioTimer.getLessonElm = function() {
    var setBaseElm = document.createElement("div");
    setBaseElm.setAttribute("name", "mkt_lessonArea");
    setBaseElm.setAttribute("style", "font-size:11px;display:box;display:-webkit-box;font-size:10px;line-height:11px;font-weight:normal");
    var maxCount = 3;
    //▼要素を作ってテーブルから得た属性も付与する
    for (var i = 0; i < maxCount; i++) {
        var tempStr = "lesson0" + (i + 1);
        //▼センターを真ん中に
        if (i == 0) {
            tempStr = "lesson03";
        } else if (i == 1) {
            tempStr = "lesson01";
        } else if (i == 2) {
            tempStr = "lesson02";
        }
        var setLinkElm = document.createElement("a");
        setLinkElm.setAttribute("style", "text-decoration:none;color:#ffffff;");
        setLinkElm.href = TimerTableObj[tempStr].url;
        var setSingleElm = document.createElement("div");
        setSingleElm.setAttribute("style", "width:33%;height:auto;background-color:#303030;margin:0 1px;");
        var setRemainingElm = document.createElement("span");
        setRemainingElm.id = TimerTableObj[tempStr].selectorRemaining;
        // lesson01~03となるように
        var setTimeElm = document.createElement("span");
        setTimeElm.id = TimerTableObj[tempStr].selectorTime;
        // lesson01~03となるように
        setTimeElm.setAttribute("class", "yellow");
        setTimeElm.setAttribute("style", "margin:0 auto;");
        setTimeElm.innerText = TimerTableObj[tempStr].textEmpty;
        //デフォルトテキスト
        setLinkElm.appendChild(setRemainingElm);
        setLinkElm.appendChild(setTimeElm);
        setSingleElm.appendChild(setLinkElm);
        setBaseElm.appendChild(setSingleElm);
        //
        mainfunc_mystudioTimer.setRewriteElm(tempStr, setSingleElm);
    }
    return setBaseElm;
}
;
//▼ぷちデレラの時間解析を行う。引数は要素。ついでにタイマー起動
mainfunc_mystudioTimer.petieAnalysis = function(targetElm) {
//    console.log("MKT:ぷちデレラの時間解析+タイマー起動");
    var tempElms = targetElm.querySelectorAll(".petit_idol_list > a > div");
    for (var i = 0; i < tempElms.length; i++) {
        var typeSTR = "lesson0" + (i + 1);
        var getRecoverValue = analysisTimer(typeSTR, tempElms[i]);
    //FanalysisTimer    console.log(typeSTR , tempElms[i] , getRecoverValue);
        if (getRecoverValue) {
            //書換起動要求+backgroundタイマー起動要求
            mainfunc_mystudioTimer.secondRewrite(typeSTR, getRecoverValue);
            requestTimer(typeSTR, getRecoverValue);
        }//▼時間の取得には失敗したが、レッスン完了に起因するものなら、レッスン終了のテキストを入れる
        else if (tempElms[i].parentNode.className == "lesson_comp") {
            try {
                var singeObj = mainfunc_mystudioTimer.getObj(typeSTR);
                var targetMarkElm = document.querySelector("#" + singeObj.selectorTime);
                targetMarkElm.innerText = mainfunc_mystudioTimer.getObj(typeSTR).textFullRecovery;
            } catch (e) {
                console.log("【×】MKT:lesson complete!処理に失敗");
            }
        }
    }
}
;
