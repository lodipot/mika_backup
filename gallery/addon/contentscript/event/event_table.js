//	BGR = backGroundRequest / subfunc_set_event_pointtimer() event_common.js
// URLD = URL Decode / subfunc_event_flash_jump_btn()	event_common.js
//	WorkNewPointSelectorA / subfunc_get_eventworkstate()	exp_set.js

	var eventGlobalTable = {
		"idollivetour":{			//LIVEツアー系 @ LP
			"URL":{
				"%2Fevent_carnival%2Findex%3F":{		//index
				//	"#top > div.displayBox > div > div > div+div > div > span.yellow":"recover"
					//".user_palam_wrap > .user_palam+.user_palam > div > span.yellow":"recover_limit_degi"
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"
			//		,".boss_remaining_time":"live_limit_top"	//	stages_info[1][1].raid_remaining_time; のオブジェクトを得たい
				},
				"event_carnival%2Fget_live_point%2F":{	//ちヒール結果
					"div.t-Cnt.m-Btm10 > div.t-Cnt.m-Btm5 > span.gray > span.yellow":"recover_limit_degi"	
				},
				"event_carnival%2Fget_nothing%2F":{		//進行結果特にナシ
					"div#bpImg > span.gray > span.yellow":"recover_limit_degi"	
				},
				"event_carnival%2Fget_raid_boss%2F":{	//ライバルユニット出現 (span.gray > span.yellow)
					"div#bpImg > span.gray > span.yellow":"recover_limit_degi"
				//	,"#raid_boss_info > .displayBox > .m-Top5 > span":"live_limit"
				},
				/*
				"event_carnival%2Fraid_win%3F":{		//(2014/09/24では回復時間ナシ)LIVE結果 WIN (span.gray > span.yellow)
					"section.assault_header_btn > div.stg_btn > div.Btn-m > div > span.gray > span.yellow":"recover_limit_degi"	
				}
				"event_carnival%2Fraid_lose%3F":{	//LIVE結果 DRAW or LOSE (span.gray > span.yellow)
					"section.assaultArea > div#bpImg > span.gray > span.yellow":"recover_limit_degi"	
				},,*/
				"event_carnival%2Fget_card%2F":{		//仕事結果カード取得 (span.gray > span.yellow)
					"div#bpImg > span.gray > span.yellow":"recover_limit_degi"
				},
				"event_carnival%2Fstage_clear%2F":{	//エリアクリア・お仕事完了 (span.gray > span.yellow))
					"div#bpImg > span.gray > span.yellow":"recover_limit_degi"
				},
				"event_carnival%2Fget_love%2F":{		//親愛UP (span.gray > span.yellow))
					"div#bpImg > span.gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_carnival%2Fwork%":{	//☆新お仕事
					"div#wrap > section#play_area > section#get_condition > div#lp_info > span > span#lp_recovery_time":"recover_limit_degi"
				}
			},
			"recover_limit_degi":{
				"timerName":"livepoint"					//backgroundShowTableのkey
				,"timerType":"limit_digital"
				,"saveName":"timevalue_event_livepoint"
			},
			"live_limit":{
				"timerName":"tourlivelimit"			//backgroundShowTableのkey
				,"saveName":"timevalue_event_livelimit"
				,"timerType":"limit_analog"
				,"timerDiff":"event_limitvalue"	//★差分 n 秒前のオプション文字列
			},
			"live_limit_top":{
				"timerName":"tourlivelimit"			//backgroundShowTableのkey
				,"saveName":"timevalue_event_livelimit"
				,"timerType":"limit_digital"
				,"timerDiff":"event_limitvalue"	//★差分 n 秒前のオプション文字列
			}
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_carnival%2F"
		},
		"productionmatchfestival":{	//フェス系
			"URL":{
				//▼
				"%2Fevent_pmf%2Fmatching_detail":{
					"section.m-Top10 > div > div > div.yellow":"combo"
				},
				"%2Fevent_pmf%2Fbattle_confirm":{	//投入ページ
					"div.pmf_battle_info_cell > div.combo > span.yellow":"combo"
				},
				"%2Fevent_pmf%2Fbattle_result%2F%3Fbattle_id":{	//リザルト
					"section > div.fesArea_02b > span.blue + span.yellow":"combo"
				}
			},
			"combo":{
				"timerName":"fescombo"
				,"timerType":"limit_analog"		//残り時間（～～まで） xx分xx秒 形式
				,"saveName":"timevalue_event_fes_combo"
				,"timerDiff":"event_productionmatchfestival_combo_value"	//★差分 n 秒前のオプション文字列
			}
		},
		"dreamlivefestival":{		//ドリフェスAP
			"URL":{
				"_dream%2Findex%3F":{	//index
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"
				},
				"%2Fget_battle_point%2F":{	//ちヒール
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fget_nothing%2F":{	//進行結果特になし
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fget_card%2F":{	//カード取得
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fget_love%2F":{	//親愛UP
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fget_raid_boss%2F":{	//ライバルユニット遭遇後のAP投入画面
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fraid_lose%3F":{	//LIVE結果 DRAW or LOSE
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"%2Fstage_clear%2F":{	//お仕事完了・エリアクリア系
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_dream%2Fwork%":{	//新お仕事 (一度お仕事ボタンを押す必要がある)
					"body > div#pageArea > div#top > div#wrap > section#play_area > section#get_condition > div#ap_info > span > span#ap_recovery_time":"recover"
				}
			},
			"recover_limit_degi":{
				"timerName":"appealpoint"
				,"saveName":"timevalue_event_appealpoint"
				,"timerType":"limit_digital"
			},
			"recover":{
				"timerName":"appealpoint"
				,"saveName":"timevalue_event_appealpoint"
				,"timerType":"recover_digital"
			}
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_dream%2F"
		},
		"idolliveroyale":{			//ロワBP
			"URL":{
				"idolmaster%2Fevent_royale%2Findex":{	//index (2019/11/22)
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_digital"
					,"li+li._btm_0 > div > a > div > span.yellow":"limit"
				},
				"idolmaster%2Fevent_royale%3Frnd%3D":{	//index再帰
					".user_palam:nth-of-type(2) > div > span.yellow":"recover_limit_digital"
					,"section.displayBox > div.t-Cnt > span.yellow":"limit"
				},
				"idolmaster%2Fevent_royale%2Fget_encount%2F":{	//ロワイヤルLIVE発生BP投入ページ
					".left_time > span.yellow":"limit"
					,"span#remain_recover > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fencount_result%3F":{	//他PとのロワイヤルLIVE結果(勝利&敗北)	20191112
					"#js_raid_boss_detail + section.t-Cnt > span.yellow":"limit"
				},
				"idolmaster%2Fevent_royale%2Fget_raid_boss":{	//ゲスト(orスペシャル)LIVE発生
					"span#remain_recover > span.yellow":"recover_limit_digital"
					,"div#raid_boss_info > div.displayBox > div > span.yellow":"limit"
				},
				"idolmaster%2Fevent_royale%2Fraid_win%3Fraid_id%3D":{	//NPCゲストLIVE結果勝利。(スペシャルゲストリザルトも含まれる)
					"#top > #js_raid_boss_detail+section.t-Cnt.m-Top10 > span.yellow":"limit"
				},
				"idolmaster%2Fevent_royale%2Fraid_lose%3Fraid_id%3D":{	//ゲストLIVE DROW(lose) タイマーは存続
					"section.t-Cnt > div.royaleArea_01_b > div.bossLifeGaugeWrap+span.yellow":"limit"	//	 > 普通のspan.yellow でいくと、残り気力と被る
				},
				"idolmaster%2Fevent_royale%2Fraid_win%3Fencount_id%3D":{	//ゲストLIVE結果(勝利) 無条件でタイマー破棄をする
					"body > #no_timer_search":"limit"	//デタラメな値を入れておくことで、破棄の流れにする
				},
				"idolmaster%2Fevent_royale%2Fget_battle_royale_point%2F":{	//ちヒール結果
					"#bp_mic > span.gray > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fget_nothing%2F":{	//進行結果特になし
					"#bp_mic > span.gray > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fget_card%2F":{		//仕事結果カード取得
					"#bp_mic > span.gray > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fstage_clear%2F":{	//エリアクリア
					"#bp_mic > span.gray > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fget_love%2F":{		//親愛UP
					"#bp_mic > span.gray > span.yellow":"recover_limit_digital"
				},
				"idolmaster%2Fevent_royale%2Fwork%":{	//新お仕事	(初回では得られない)
					"body > div#pageArea > div#top > div#wrap > section#play_area > section#get_condition > div#bp_info > span > span#bp_recovery_time":"recover"
				}
			},
			"recover_limit_digital":{	//新規
				"timerName":"battlepoint"
				,"saveName":"timevalue_event_battlepoint"
				,"timerType":"limit_digital"
			},
			"recover":{
				"timerName":"battlepoint"
				,"saveName":"timevalue_event_battlepoint"
				,"timerType":"recover_digital"
			},
			"limit":{
				"timerName":"royalelivelimit"
				,"saveName":"timevalue_event_livelimit"
				,"timerType":"limit_digital"
				,"timerDiff":"event_idolliveroyale_limitvalue"	//★差分 n 秒前のオプション文字列
			}
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_royale%2F"
		},
		
		"talkbattleshow":{	//TBS (プロ対抗)
			"URL":{
				//	チームトークバトルの存在により	"idolmaster%2Fevent_talk%2Findex"　から変更
				"idolmaster%2Fevent_talk%2Findex":{	//★index
					".user_palam_wrap > .user_palam+.user_palam > div+div > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_talk%3Fl_frm":{//★index再帰
					"section.t-Cnt > div.displayBox > div+div > a > div.liveBattle > div > span":"recover_limit_degi"	
				},
				"idolmaster%2Fevent_talk%2Fget_card%2F":{//★カード取得
					"section.t-Cnt > div+div > span.gray > span.yellow":"recover"			
				},
				"idolmaster%2Fevent_talk%2Fget_nothing":{//★カードなし
					"section.t-Cnt > div+div > span.gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_talk%2Fget_battle_point%":{//★CP回復
					"div.t-Cnt > div.t-Cnt.m-Top5 > span.gray > span.yellow":"recover_limit_degi"		
				},
				"idolmaster%2Fevent_talk%2Fget_raid_boss%2F":{	//★発生
					"section > div.talkArea > div.talk > span.gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_talk%2Fraid_lose%3F":{//★リザルトDRAW or LOSE
					"section > div.talkArea > div.talk > span.gray > span.yellow":"recover"	
				},
				"idolmaster%2Fevent_talk%2Fstage_clear":{	//★ステージクリア
					"section.t-Cnt > div.t-Cnt.m-Top5 > span.gray > span.yellow":"recover"
				},
				"idolmaster%2Fevent_talk%2Fwork%":{	//☆新お仕事
					"body > div#pageArea > div#top > div#wrap > section#play_area > section#get_condition > div#ap_info > span > span#ap_recovery_time":"recover"
				}
			},
			"recover_limit_degi":{
				"timerName":"talkpoint"
				,"saveName":"timevalue_event_talkpoint"
				,"timerType":"limit_digital"
			},
			"recover":{	//上のURLテーブルをトリガとして呼ぶように作った。タイマー起動に必要な情報
				"timerName":"talkpoint"	//bacgground要求名
				,"saveName":"timevalue_event_talkpoint"	//セーブ要求名
				,"timerType":"recover_digital"
			}
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_talk%2F"
		},
		"teamtalkbattleshow":{	//チーム対抗TBS
			"URL":{
				"idolmaster%2Fevent_teamtalk%2Findex":{	//index
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"	//20191023更新
				},
				"idolmaster%2Fevent_teamtalk%3Fl_frm":{//index再帰
					".user_palam_wrap > .user_palam+.user_palam > div+div > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_teamtalk%2Fget_card%2F":{	//カード取得
					"div > span.gray > span.yellow":"recover_limit_degi"		
				},
				"idolmaster%2Fevent_teamtalk%2Fget_nothing":{//カードなし
					"div > span.gray > span.yellow":"recover_limit_degi"	
				},
				"idolmaster%2Fevent_teamtalk%2Fget_battle_point%":{//CP回復
					"div > span.gray > span.yellow":"recover_limit_degi"		
				},
				"idolmaster%2Fevent_teamtalk%2Fget_raid_boss%2F":{	//発生
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_teamtalk%2Fraid_lose%3F":{//リザルトDRAW or LOSE
					"div > span.gray > span.yellow":"recover_limit_degi"	
				},
				"idolmaster%2Fevent_teamtalk%2Fstage_clear":{	//お仕事完了・エリアクリア系
					"div > span.gray > span.yellow":"recover_limit_degi"
				},
			//	"idolmaster%2Fevent_teamtalk%2Fwork%":{	//新お仕事
			//		処理が早すぎて、要素が得られない
			//		"#ap_recovery_time >.yellow":"recover_limit_degi"
			//	}
			},
			"recover_limit_degi":{
				"timerName":"talkpoint"	//bacgground要求名
				,"saveName":"timevalue_event_talkpoint"	//セーブ要求名
				,"timerType":"limit_digital"
			},
			"recover":{	//上のURLテーブルをトリガとして呼ぶように作った。タイマー起動に必要な情報
				"timerName":"talkpoint"
				,"saveName":"timevalue_event_talkpoint"
				,"timerType":"recover_digital"
			}
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_teamtalk%2F"
		},
		"idolchallenge":{			//アイチャレ CP
			"URL":{
				"idolmaster%2Fevent_challenge%2Findex":{	//TOP
					//".user_palam:nth-of-type(2) > div > span.yellow":"recover_limit_degi"
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"	//20191023更新
				},
				"idolmaster%2Fevent_challenge%3Fl_frm":{	//ページバック復帰
					".user_palam:nth-of-type(2) > div > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_challenge%2Fget_card%2F":{	//カード取得(2018/09/10)
					"section.t-Cnt > div.m-Btm10 > div > div > .gray > .yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_challenge%2Fget_nothing":{	//結果なにも無し(2018/09/10)
					"section.t-Cnt > div.m-Btm10 > div > div > .gray > .yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_challenge%2Fget_voltage":{	//本気ボルテUP(2018/09/10)
					"section.t-Cnt > div.m-Btm10 > div > div > .gray > .yellow":"recover_limit_degi"			
				},
				"idolmaster%2Fevent_challenge%2Fget_battle_point%":{	//CP回復(2018/09/10)
					"div.m-Btm10 > div > div > .gray > .yellow":"recover_limit_degi"	
				},
				"idolmaster%2Fevent_challenge%2Fget_raid_boss%2F":{	//チャレンジ発生でCP選択する画面(2018/09/10)
					"div.challenge > .gray > span.yellow":"recover_limit_degi"
				},
				"idolmaster%2Fevent_challenge%2Fwork%":{
					"#ap_recovery_time >.yellow":"recover_limit_degi"		//☆新お仕事
				}
			},
			"recover_limit_degi":{
				"timerName":"challengepoint"
				,"saveName":"timevalue_event_challenegepoint"
				,"timerType":"limit_digital"
			},
			"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_challenge%2F"
		},
		"idolvariety":{			//アイバラ
			"URL":{
				"idolmaster%2Fevent_variety%2Findex":{	//TOP
					".user_palam:nth-of-type(2) > div > span.yellow":"recover_limit_degi",
					".stage_navi > .txt_left_time":"limit_ouen_digi",	//応援時間はデジタル
				},
				"idolmaster%2Fevent_variety%3Fl_frm":{	//ページバック復帰
					".user_palam:nth-of-type(2) > div > span.yellow":"recover_limit_degi",
					".stage_navi > .txt_left_time":"limit_ouen_digi",	//応援時間はデジタル
				},
				"idolmaster%2Fevent_variety%2Fget_raid_boss%2F":{	//SP投入選択画面
					".varietyArea > div.t-Cnt > span.gray > span.yellow":"recover_limit_degi",
					"#top > section > div[class*='eventH2Color']":"limit_ouen_analog",	//応援時間はアナログ
				},
				"idolmaster%2Fevent_variety%2Fraid_win%2F":{	//リザルト @ お仕事フェーズ成功
					// recover 情報は得られない(セレクタ不要)
					//次のフェーズが自動で発生するので、応援時間は再び拾うが、ラストフェーズのアニメ終了後ページでは、まだ応援時間が表記されており、それを拾ってしまうケースがある
					"#top > section > div[class*='eventH2Color']":"limit_ouen_analog"
				},
				"idolmaster%2Fevent_variety%2Fraid_lose%2F":{	//リザルト @ お仕事フェーズ進行中一旦のリザルト
					"#top > section > .varietyArea > div.t-Cnt > span > span.yellow":"recover_limit_degi",
					"#top > section > div[class*='eventH2Color']":"limit_ouen_analog",
				},
				"reward_received%3D1%26canceled":{	//応援失敗および成功ページ。強制的にタイマー解除
					// recover 情報は得られない(セレクタ不要)
					"#HOGE_reseeeeeet":"limit_ouen_analog",
				}
			},
			"recover_limit_degi":{
				"timerName":"supportpoint"
				,"saveName":"timevalue_event_supportpoint"
				,"timerType":"limit_digital"
			}
			,
			"limit_ouen_analog":{	//応援リミット解析タイプ分秒表記
				"timerName":"idolvarietylimit"					//backgroundShowTableのkey
				,"saveName":"timevalue_event_support_limit"		
				,"timerType":"limit_analog"
				,"timerDiff":"event_idolvariety_limit_value"	//★差分 n 秒前のオプション文字列
			}
			,
			"limit_ouen_digi":{		//応援リミット解析タイプデジタル表記
				"timerName":"idolvarietylimit"
				,"saveName":"timevalue_event_support_limit"
				,"timerType":"limit_digital_variety"	//態々用意...
				,"timerDiff":"event_idolvariety_limit_value"	//★差分 n 秒前のオプション文字列
			}
			//スキップボタンで利用(アイバラはやや特殊？)
			,"URLD_attackPoint":RegExp(/attack_point%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_.*%252F([0-9]{1,})%26/)
			,"URLD_new_type_flag":true	//アイバラではリザルトに raid_id の文字列はエラーの原因となる
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_variety%2F"
		}
		,
		
		"musicjam":{			//ミュージックJAM
			"URL":{
				"idolmaster%2Fevent_jam%2Findex":{	//TOP
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"
				},
				"idolmaster%2Fevent_jam%3Fl_frm":{	//ページバック復帰
					".stamina_battle_point-area > div+div > .display._block.small":"recover_limit_degi"
				},
			},
			"recover_limit_degi":{
				"timerName":"jampoint"
				,"saveName":"timevalue_event_jampoint"
				,"timerType":"limit_digital"
			}
			,
			"URLD_attackPoint":RegExp(/all_damage%3D([0-9]{1,})%26/)
			,"URLD_afterBossHp":RegExp(/after_boss_hp%3D([0-9]{1,})%26/)
			,"URLD_raidID":RegExp(/raid_id%3D([0-9]{1,})%26/)
			,"URLD_resultURL":"http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2F"
		}
	};
	
	
	
