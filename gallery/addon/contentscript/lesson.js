//レッスン画面飛ばし

function mainfunc_lessonjump(){

	console.log("mainfunc_lessonjump呼び出し");

	let setInfoHTML = "";

	if(1){
		//Stringに変換しる
		let baseURL = new String(location.href);

		let get_now_prm = parseInt(baseURL.match(/%3Fnow_prm%3D([0-9]{1,})/)[1]);
		//console.log("Expゲージ変更前:"+get_now_prm);

		let get_fix_prm = parseInt(baseURL.match(/%26fix_prm%3D([0-9]{1,})/)[1]);
		//console.log("Expゲージ変更後:"+get_fix_prm);

		let get_effect1 = parseInt(baseURL.match(/%26effect1%3D([0-9]{1,})/)[1]);
		//console.log("パーフェクトレッスン:"+get_effect1);

		let get_skill_lv_up = parseInt(baseURL.match(/%26skill_lv_up%3D([0-9]{1,})/)[1]);
		//console.log("スキルLvUpの成否:"+get_skill_lv_up);

		let get_card_att = parseInt(baseURL.match(/%26card_att%3D([0-9]{1,})/)[1]);
		//console.log("攻:"+get_card_att);

		let get_card_def = parseInt(baseURL.match(/%26card_def%3D([0-9]{1,})/)[1]);
		//console.log("守:"+get_card_def);

		let get_bef_lv = parseInt(baseURL.match(/%26bef_lv%3D([0-9]{1,})/)[1]);
		//console.log("基本Lv:"+get_bef_lv);

		let get_max_lv = parseInt(baseURL.match(/%26max_lv%3D([0-9]{1,})/)[1]);
		//console.log("最高Lv:"+get_max_lv);

		let get_aft_mys = parseInt(baseURL.match(/%26aft_mys%3D([0-9]{1,})/)[1]);
		//console.log("get_aft_mys:"+get_aft_mys);

		let level_up_count = 0;
		//レベルアップ値s
		level_up_count = Math.floor((get_fix_prm)/100);

		setInfoHTML+= "Exp <font color='#FF9900'>+ "+(get_fix_prm - get_now_prm)+"%</font><br>";

		//0超過なら情報を出す
		if(level_up_count > 0){
			setInfoHTML+= "Lv "+get_bef_lv+" ["+get_now_prm+"%]　→　<font color='#FF9900'>"+(get_bef_lv+level_up_count)+" ["+(get_fix_prm%100)+"%] ( +"+level_up_count+" Lv )</font><br>";
		} else {
			setInfoHTML+= "Lv "+get_bef_lv+" ["+get_now_prm+"%]　→　"+get_bef_lv+" ["+get_fix_prm+"%] <font color='#FF9900'>( +"+(get_fix_prm - get_now_prm)+"% )</font><br>";
		}

		if(get_effect1){
			setInfoHTML+= "<font color='#FF9900'>Perfect Lesson!</font><br>";
		}
		if(get_skill_lv_up){
			setInfoHTML+= "<font color='#FF9900'>Skill Lv Up!</font><br>";
		}

		//console.log("Expが "+(get_fix_prm - get_now_prm)+"% 上がりました");
		//console.log("Lvが"+level_up_count+"上がります");
	}
	//情報要素
	let setInfoDivElm = document.createElement("div");
	setInfoDivElm.setAttribute("style","margin:5px;background-color:#333333;font-size:13px;color:#ffffff;text-align:center;");
	setInfoDivElm.innerHTML = setInfoHTML;


	//とりあえず要素作る
	let setBaseDivElm = document.createElement("div");
	setBaseDivElm.setAttribute("style","text-align:center;background-color:#111111;height:45px;width:100%;");
	//リンクボタン
	let LinkElm = document.createElement("a");
	LinkElm.href="http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%3Fl_frm%3D";
	LinkElm.className = "mkt_animation_skip_btn";
	LinkElm.textContent = '通常';


	let LinkElmB = document.createElement("a");
	LinkElmB.href="http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%2Ftrainer_lesson%2F0%3Fno_cache%3D1";
	LinkElmB.className = "mkt_animation_skip_btn";
	LinkElmB.textContent = 'トレーナー';
	//http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%2Ftrainer_lesson%2F1%3Fno_cache%3D1%26l_frm%3DCard_str_trainer_lesson_1%26rnd%3D100149485#page_tab_stop
	//http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fcard_str%2Ftrainer_lesson%2F0%3Fno_cache%3D1%26l_frm%3DCard_str_trainer_lesson_1%26rnd%3D54912097#page_tab_stop

	//セット
	setBaseDivElm.appendChild(LinkElm);
	setBaseDivElm.appendChild(LinkElmB);

	let topInfoArea = document.getElementById("mkt_animation_top_info_area");
	if(topInfoArea){
		//新領域が見つかればそこに格納
		topInfoArea.appendChild(setBaseDivElm);
		topInfoArea.appendChild(setInfoDivElm);
	}else{
		let mainElm = document.getElementsByTagName("body");
		//新領域が見つからなければ以前の方法で格納
		if(mainElm.length > 0){
			mainElm[0].parentNode.insertBefore(setInfoDivElm , mainElm[0].parentNode.firstChild);
			mainElm[0].parentNode.insertBefore(setBaseDivElm , mainElm[0].parentNode.firstChild);
		}
	}





}
