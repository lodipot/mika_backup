
class EventMusicJamClass{
    constructor(){
        /**
         * @type MutationObserver
         */
        this.observe = null;
        /**
         * 初手でのノード変動を記録。
         * 「ページを開いた最初の一回」用
         */
        this._firstObserveChange = false;
    }

    /**
     * サンプルメモ
     */
    _sample(){
        /**
         * URLサンプル
         * 
         * ▼スーパーLIVE発生
         * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jamSsSsappear_sp_raid_boss_swfSsSs91%3Fl_frm
         * ↓ 移動先
         * %2Fidolmaster%2Fevent_jam%2Fget_sp_raid_boss%2F91%3Fl_frm
         * 
         * ▼ライバルユニット登場演出
         * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jamSsSsappear_unit_boss_swfSsSs1852392%3Fl_frm
         * ↓ 移動先
         * %2Fidolmaster%2Fevent_jam%2Fget_raid_boss%2F1852392%3Fl_frm
         * 
         * 
         * ▼サプライズゲスト登場演出
         * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jamSsSsappear_unit_boss_swfSsSs1914723%3Fl_frm%3DEvent_jam_appear_unit_boss_1%26rnd%3D244445325
         * 
         * 
         * ▼ソロライブ対戦アニメーション演出
         * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jamSsSsraid_battle_swf%2F0%2F0%2F0%2F1%3Fall_damage%3D5120556%26after_boss_hp%3D879444%26raid_id%3D1848979%26vm%3D0%26ep%3D1%26l_frm
         * ↓ 移動先 (引き分け・LOSE) と Win
         * %2Fidolmaster%2Fevent_jam%2Fraid_lose%3Fraid_id%3D1848979
         * %2Fidolmaster%2Fevent_jam%2Fraid_win%3Fraid_id%3D1848979
         * 
         * ▼ライバルユニット対戦演出
         * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jamSsSsraid_battle_swf%2F0%2F0%2F0%2F1%3Fall_damage%3D7633991%26after_boss_hp%3D7366009%26raid_id%3D1852392%26vm%3D0%26ep%3D1%26l_frm
         * 
         */

         /**
          * ▼メダル引いた結果。
          * %2Fidolmaster%2Fsmart_phone_flash%2Fconvert%2Fevent_jam_box_rewardSsSsshow_chance_flash%3Fbox_round%3D%26count%3D18%26event_id%3D2002%26l_frm%3DEvent_jam_box_reward_check_box_chance_1%26rnd%3D216105884
          */

    }

    /**
     * 開催系演出のみのジャンプURLを解析・取得
     */
    getJumpUrl(){
        
        let _pageType;
        let _targetIdArr;
        let _targetURL;

        if(	urlCheck('%2Fconvert%2Fevent_jamSsSsappear_sp_raid_boss_swf')){
            //console.log("MKT:エンカウント > スーパーLIVE発生");
            _pageType = "appear_sp_raid_boss_swf";
            _targetIdArr = location.href.match(/Ss([0-9]{1,})%3F/);
        }
        else if(urlCheck('%2Fconvert%2Fevent_jamSsSsappear_unit_boss_swf')){
            //console.log("MKT:バトル > ライバルユニット or サプライズゲスト登場");
            _pageType = "appear_unit_boss_swf";
            _targetIdArr = location.href.match(/Ss([0-9]{1,})%3F/);
        }
        else {
            console.log("MKT:ミュージックJAM / 非対応のURLでした");
            return;
        }

    	//console.log(_pageType);
    	//console.log(_targetIdArr);

        if(!_targetIdArr){
            console.warn("targetIdの取得に失敗しました");
            return;
        }

        if(_pageType == "appear_sp_raid_boss_swf" ){
            _targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2Fget_sp_raid_boss%2F" +_targetIdArr[1];
        }
        else if(_pageType == "appear_unit_boss_swf"){
            _targetURL = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fevent_jam%2Fget_raid_boss%2F"+_targetIdArr[1];
        }

        return _targetURL;
    }

    /**
     * 内部でジャンプボタンを作成してそのまま配置。
     * @param {*} _targetUrl 
     * @param {*} _message 
     */
    setFlashJumpBtn(_targetUrl , _message = ""){

        if(!_targetUrl){
            return;
        }

        //▼要素作成
        const _setBaseNode = document.createElement("div");
        _setBaseNode.style.height = "50px";
        _setBaseNode.style.width = "100%";
        _setBaseNode.style.backgroundColor = "#1d1d1d";
        _setBaseNode.style.textAlign = "center";


        //▼リンクボタンの作成と一次配置
        const _LinkNode = document.createElement("a");
        _LinkNode.href = _targetUrl;
        //AndroidURLだとcssが読み込まれないのでstyleに
        _LinkNode.style.textDecoration = "none";
        _LinkNode.style.width = "250px";
        _LinkNode.style.fontSize = "12px";
        _LinkNode.style.color = "#FFFFFF";
        _LinkNode.style.padding = "13px";
        _LinkNode.style.marginTop = "5px";
        _LinkNode.style.display = "inline-block";
        _LinkNode.style.borderRadius = "5px";
        _LinkNode.style.background = '-webkit-gradient(linear, left top, left bottom, color-stop(0%,#777777), color-stop(100%,#333333))';
        
        //_LinkNode.setAttribute("style","text-decoration:none;width:250px;font-size:12px;color:#ffffff;padding:13px 0;margin-top:5px;display:inline-block;background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#777777), color-stop(100%,#333333));border-bottom:1px solid #444444;border-radius: 5px;-webkit-border-radius:5px;");
        _LinkNode.textContent = _message;
        _setBaseNode.appendChild(_LinkNode);

        //新配置
        let _infoAreaNode = document.getElementById("mkt_animation_top_info_area");
        if(_infoAreaNode){
            _infoAreaNode.appendChild(_setBaseNode)
        }else{
            document.body.insertBefore(_setBaseNode , document.body.firstChild);
        }
        console.log("MKT:skipボタン配置完了!");
    }

    /**
     * スーパーLIVE監視用ノードを得る
     */
    getSuperLiveObserveNode(){
        /**
         * a > のノードが出てくる
         * ▼開催まで
         * div.super_raid_btn-area
         *  div.jsSPRaidBtn //ここを監視
         *   div.p-Btm12
         *    div.gauge-area.btn_gauge_super_raid_gray._closed.m-Cnt
         *     div.gauge_bar-area
         *      div._bar btn_gauge_super_raid_bar jsSPRaidGaugeBar
         *     div._value jsSPRaidGaugeValue  //数値 (_e.target instanceof HTMLElement) で毎回反応
         * 
         * ▼開催中
         * div.super_raid_btn-area
         *  div.jsSPRaidBtn //ここを監視
         *   div.shine_effect importance
         *   a.gauge-area btn_gauge_super_raid_bg m-Cnt jsOnDesignBtn
         *    div.gauge_bar-area
         *    div._value jsSPRaidGaugeValue //数値
         */
        return document.querySelector(".super_raid_btn-area > div.jsSPRaidBtn");
    }

    /**
     * SPLiveノード監視。変化毎に逐一呼ばれる。
     * bind(_musicJamInstance) なので this. が使える
     * @param {*} data1 
     * @param {*} data2 
     */
    _obsFunc(data1 , data2){

        try{
            /**
             * SPLive開催時ページにアクセスした瞬間の変動は、[MutationRecord](length=1)となっている。
             * 未開催の場合は [MutationRecord,MutationRecord] のlen2が続く
             * 未開催からの開催変動時は 確かlen4
             * 開催中のパーセンテージ変動も len2 が続く
             * 開催が終わった時の変動は len4
             * なので、3未満は精査対象から外す
             */
            //console.log(data1.length);
            if(data1.length <= 2){
                return;
            }
            /**
             * _e は MutationRecord
             * 2以上(一応3)のノードがaddされて、且つそのノードの中に .shine_effect のクラス名が含まれている
             */
            const _findIndex = [...data1].findIndex(_e=>{
                if(_e.addedNodes.length > 2){   //開催中になった瞬間が 4。開催中にトップページ開いた場合は..?
                    console.log(_e.addedNodes);
                    const _temp = [..._e.addedNodes].findIndex(_addNode=>{
                        if(_addNode instanceof HTMLElement){
                            if(_addNode.classList.contains("shine_effect")){
                                console.log(_addNode);
                                return true;
                            }
                        }
                    })
                    if(_temp != -1){
                        return true;
                    }
                }
            });
            
            if(_findIndex != -1){
                BackgroundNotification("jamsuperlive");
            }
            return;
            /**
             * パーセンテージ監視のほう(多分使わない)
             */
            [...data1].forEach(_e=>{

                //console.log(_e);
                if(_e.target instanceof HTMLElement){

                    if(_e.target.removeNodes.length == 0){
                        return;
                    }

                    // 変動を検知1回目はスルー
                    if(this._firstObserveChange == false){
                        this._firstObserveChange = _e.target.classList.contains("jsSPRaidBtn")
                    }else{

                    }
                    console.log(_e.target);
                    /**
                     * <div class="_value jsSPRaidGaugeValue">99%</div> (複数子要素)
                     * から
                     * <div class="shine_effect importance"></div>
                     */
                }
                //変化したノードが、クラス名""jsSPRaidBtn""を含むノードである
            });
        }catch(e){
            console.error(e);
            this.observe.disconnect();	//エラーが起きれば監視解除
        }
    }
}


/**
 * 無条件でSPLiveが開催中であれば反応
 * 　→ イベントトップを開くたび、開催中であれば通知が鳴ってうざい
 * 
 * 1.イベントページを開きっぱなし
 * 2.開いた直後のノード監視では、開催中であっても通知しない
 *   → 自らがイベトップページを開いた場合、既にその結果を自身で目視しているため
 * 3.開いた直後以外のノード変動でのみ通知させるには？
 */

/**
 * ルーターから呼び出されて実行
 */
function mainFunc_EventMusicJam(){


    //▼ 最初に演出系URLで判断
    if(urlCheck('convert%2Fevent_jam') || urlCheck('%2Fraid_battle_swf%2F')){
        console.log("ジャムイベ演出処理");
        
        // JAM用イベントクラス
        const _musicJamInstance = new EventMusicJamClass();
        /**
         * ・スーパーLIVE発生
         * ・ライバルユニット登場演出
         * に関しては、ロワと同じように独自で登場演出からジャンプさせる処理を組み込む必要があった。
         * それ以外の対戦演出は、イベントテーブルへの記述 + 汎用 subfunc_event_flash_jump_btn() 呼び出しでOK
         */
        if([
            "appear_sp_raid_boss_swf",      //スーパーLIVE発生
            "appear_unit_boss_swf",         //ライバルユニット or サプライズゲスト登場演出
            "event_jam_box_reward",         //イベメダル引き演出。関係ないので排除対象
        ].every((e)=>{return location.href.indexOf(e) == -1;}))
        {
            //上記URLに該当しない場合のみ、この汎用ジャンプ演出を呼ぶ
            subfunc_event_flash_jump_btn();
            //解析埋め込み
            injectScriptFromFunction(injectEventAnimationScriptIsInfo_MusicJam , ["0"]);
        }
        else{
            const _jumpURL = _musicJamInstance.getJumpUrl();
            console.log(_jumpURL);
            if(_jumpURL){
                _musicJamInstance.setFlashJumpBtn(_jumpURL , "jump");
            }
            
        }
    }
    /**
     * その他、全般処理では回復時間などの抽出
     */
    else if(urlCheck('%2Fidolmaster%2Fevent_jam')){
        let _eventTimerClass = new EventTimerClass();
        _eventTimerClass.mainProcess();

        //トップページならスーパーLIVE監視？
        /**
         * スーパーLIVE開催ノードを監視
         * EventMusicJamClass 内 _obsFunc メソッド
         */
        if(urlCheck('%2Fidolmaster%2Fevent_jam%2Findex') || urlCheck('%2Fidolmaster%2Fevent_jam%3Fl_frm')){
            if(getOption("event_musicjam_spliveobserve_mode_check")){

                // JAM用イベントクラス
                const _musicJamInstance = new EventMusicJamClass();
                const _obsNode = _musicJamInstance.getSuperLiveObserveNode();
                if(!_obsNode){
                    console.log("監視用スーパーLIVEノード取得に失敗");
                    return;
                }
                const _observe = new MutationObserver(_musicJamInstance._obsFunc.bind(_musicJamInstance));
                _observe.observe( _obsNode , {childList : true , subtree : true} );
                _musicJamInstance.observe = _observe;
            }
        }
    }



}

/**
 * window.Imascg.QuestModel
 * swf_params
 */