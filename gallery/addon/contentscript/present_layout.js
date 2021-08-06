/**
 * 贈り物のレイアウトを弄る
 * 2019/11-12月アニバアプデで一新された贈り物レイアウトに対応
 */
/**
 * div.frame-common_no-border _in_frame m-Btm8 jsPresentInfo
 * に相当するノードをパースする
 */
class PresentItemNodeParserClass{

    constructor(_node){
        /**
         * @type HTMLElement
         */
        this.node = _node;
        /**
         * アイテム名。数値や単位は含まないかも
         */
        this.itemName = null;
        /**
         * 個数、人数、マニー額、友情ポイント等の数値
         * 3桁区切りで , が付くと思うので文字列かな
         */
        this.itemValue = null;
        /**
         * 受け取りに使うプレゼントID
         */
        this.presentId = null;
        /**
         * データハッシュ
         */
        this.dataHash = null;
        /**
         * アイテムの日付
         */
        this.historyDateStr = null;
        /**
         * 入手経路
         */
        this.historyInfo = null;
        /**
         * 人気度
         */
        this.popularValue = null;
        /**
         * レアリティ 0 , 1～6
         */
        this.Rarity = 0;
        /**
         * ポップアップカテゴリ(番号？アイテム区分として判断できる？)
         */
        this.dataPopupCategory = null;
        /**
         * チェックボックス
         */
        this.checkBoxNode = null;
        /**
         * アイテム画像ノード
         */
        this.itemImageNode = null;
        /**
         * 独自追加の情報ノード
         */
        this.appendItemInfoNode = null;
    }

    parse(){
        const _baseNode = this.node;

        const _inTextNode = _baseNode.querySelector("._in_text");
        /**
         * 個数、人数、マニー額、友情ポイント等
         */
        const _valueNode = _inTextNode.querySelector("span");
        const _valueText = _valueNode.textContent;
        // div._in_text の中で最初に見つけたテキストノードをアイテム名とする
        const _ItemTextNode = [..._inTextNode.childNodes].find(_n => _n.nodeType == _n.TEXT_NODE);

        let tempRare = 0;
        {
            const _imgs = _baseNode.querySelectorAll(".present_name > img");
            [..._imgs].forEach(_n =>{

                const _src = _n.src;
                if(!_n){
                    return;
                }
                
                if(_src.indexOf("icon_status_normal.png") != -1){
                    tempRare = 1;
                }
                else if(_src.indexOf("icon_status_normal_plus.png") != -1){
                    tempRare = 2;
                }
                else if(_src.indexOf("icon_status_rare.png") != -1){
                    tempRare = 3;
                }
                else if(_src.indexOf("icon_status_rare_plus.png") != -1){
                    tempRare = 4;
                }
                else if(_src.indexOf("icon_status_srare.png") != -1){
                    tempRare = 5;
                }
                else if(_src.indexOf("icon_status_srare_plus.png") != -1){
                    tempRare = 6;
                }
            })
            this.Rarity = tempRare;
        }

        this.itemName = _ItemTextNode.textContent;

        this.itemValue = _valueText;

        this.checkBoxNode = _baseNode.querySelector("input.chkbox");

        this.itemImageNode = _baseNode.querySelector("a > img");
        this.dataHash = this.itemImageNode.dataset["hash"];

        this.dataPopupCategory = _baseNode.querySelector(".item_view > a").dataset["popup_category"];

        if(this.checkBoxNode){
            this.presentId = this.checkBoxNode.value;
        }

        const _dataViewNode = _baseNode.querySelector(".data_view");
        if(_dataViewNode){
            const _DateNode = _dataViewNode.querySelector("dl > dd");
            if(_DateNode){
                // 2019/12/14 6:05 のような形式
                this.historyDateStr = _DateNode.textContent;
            }
            // 入手経路 兼 (あれば)人気度
            const _historyNode = _dataViewNode.querySelector("dl+dl > dd");
            if(_historyNode){
                // 入手経路
                this.historyInfo = _historyNode.textContent;
                // 2020/02あたりから、人気度表記が変更になったので対応
                const _popularImgNode = _historyNode.querySelector("div > img");
                if(_popularImgNode){ 
                    this.popularValue = _popularImgNode.parentNode.textContent;
                }
            }

            {
                const _appendInfoNode = document.createElement("div");
                this.appendItemInfoNode = _appendInfoNode;
                // 配置
                _dataViewNode.parentNode.appendChild(_appendInfoNode);
            }
        }

        return
        //Myアイドルや人気度+1等のかぶせ画像から検出
        //2020/02 あたりから画像をかぶさ内表記に変更になったので、これは多分使わない
        if(0){
            const _iconRightNode = _baseNode.querySelector("a > div.icon_right_bottom");
            if(_iconRightNode){
                const _imgNodes = _iconRightNode.getElementsByTagName("img");
                let _isPlus = false;
                //人気度の抽出画像数値を加えていく。
                const _numArr = [];
                [..._imgNodes].forEach(_img=>{
                    //console.log(_img);
                    if(_img.src.indexOf("number%2Fplus.png") != -1){
                        _isPlus = true;
                    }
                    else{
                        // 数値の画像を抽出
                        const _matchArr = _img.src.match(/%2Fnumber%2F([0-9]{1,}).png/);
                        if(_matchArr && _matchArr.length == 2){
                            _numArr.push(_matchArr[1]);
                        }
                    }
                });
    
                if(_isPlus){
                    if(_numArr.length > 0){
                        let _popularValue = "";
                        _numArr.forEach(_val=>{
                            //console.log(_val);
                            _popularValue = _popularValue.concat(_val);
                        });
                        this.popularValue = _popularValue
                    }
                    //console.log("人気度" , _isPlus , this.popularValue);
                }
              
    
            }
        }


    }

    /**
     * 保持ノードに対してプレミアムサインのエフェクトを与える
     */
    appendPremiumSignEffect(){
        //  css を使って img に .mkt_premium を与えるだけ
        if(this.itemImageNode){
            this.itemImageNode.classList.add("mkt_premium");
        }
    }

    /**
     * 保持しているアイテム名が、正規表現に引っ掛かったかどうか
     */
    isMatchFromRegexp(_regExp){

        if(typeof(this.itemName) !== "string" ){
            return;
        }

        const _def = {
            1:"(ノーマル)",
            2:"(ノーマル+)",
            3:"(レア)",
            4:"(レア+)",
            5:"(Sレア)",
            6:"(Sレア+)",
        }
        const _rareStr = _def[this.Rarity];

        const _checkItemName = _rareStr + " " + this.itemName;
        //console.log(_checkItemName , this.Rarity);
        //console.log(_checkItemName.match(_regExp));
        if(_checkItemName.match(_regExp)){
            return true;
        }
    }
}


/**
 * わりとよろず機能
 */
class PresentSystemClass{
    constructor(){
        /**
         * テンプレ受け取り定数:人気度なしの全トレーナー
         */
        this.RECV_TEMPLATE_NO_POP_TRANER = 1;
        /**
         * テンプレ受け取り定数：「その他」カテゴリに含まれる全アイテム
         * (友情pt/マニー/ガチャチケ/ぷちデレラ/ゲームメダル/ジュエル/投票権/衣装/その他)
         * その他...ぷちマニー/スタエン/カメムシ/レアメ
         */
        this.RECV_TEMPLATE_ALL_ANOTHER = 2;
        /**
         * イベント用アイテム全受け取り
         */
        this.RECV_TEMPLATE_ALL_EVENT_ITEM = 3;

    }
    /**
     * input の { name:value }に相当するオブジェクトを渡すと、それをもとに受け取り用送信フォームを生成して返す
     * .action は後付けで与えてね。
     * @param {JSON} _inputOption 
     */
    generateRecvFormNode(_inputOption){

        const _form = document.createElement("form");
        _form.method = "POST";
        //_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve_much%2F0";
        //_form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Freceive_all";
        _form.name = "rcmv";
        /*
        const _inputOption = {
            view_auth_type: 1 ,
            sort_type: 3 ,
            filter: 0 ,
            popularity_filter: 1 ,
            premium_filter: 0 ,
            attribute: 99 ,
            cost: 0 ,
            skill_filter: 0 ,
            keyword: "" ,
            item_filter: 0 ,
            other_filter: 0 ,
            petit_accessory_rarity_filter: 0 ,
            petit_accessory_type_filter: 0 ,
            un_recieve_card: 0 ,
            un_recieve_money: 0 ,
        };*/
    
        for(let _key in _inputOption){
            const _input = document.createElement("input");
            _input.type = "hidden";
            _input.name = _key;
            _input.value = _inputOption[_key];
            _form.appendChild(_input);
        }
    
        const _submit = document.createElement("input");
        _submit.type = "submit";
        //_submit.value = "全て受け取る";
        _form.appendChild(_submit);
    
        _form.style.display = "none";
    
        return _form;
    }

    /**
     * formに仕込むinputの定義オブジェクトを得る。
     * @param {*} _type 
     */
    getRecvInputOptionTemplateObject(_type){
        if(this.RECV_TEMPLATE_NO_POP_TRANER === _type){
            return {
                view_auth_type: 1 ,
                sort_type: 3 ,
                filter: 0 ,
                popularity_filter: 1 ,
                premium_filter: 0 ,
                attribute: 99 ,
                cost: 0 ,
                skill_filter: 0 ,
                keyword: "" ,
                item_filter: 0 ,
                other_filter: 0 ,
                petit_accessory_rarity_filter: 0 ,
                petit_accessory_type_filter: 0 ,
                un_recieve_card: 0 ,
                un_recieve_money: 0 ,
            }
        }
        else if(this.RECV_TEMPLATE_ALL_ANOTHER === _type){
            return {
                view_auth_type: 1 ,
                sort_type: 99 ,
                popularity_filter: 0 ,
                attribute: 99 ,
            }
        }else {
            console.log("未実装の定数です" , _type);
        }
    }

    /**
     * 受け取り用フォームボタンを一覧にして作成
     * (未実装)
     */
    generateRecvBtnList(){

        const _baseNode = document.createElement("div");
        _baseNode.className = "area-popup_common";

        const _def = [
            {
                text:"「人気度なしトレーナー」を全て受け取る" ,
                template : this.RECV_TEMPLATE_NO_POP_TRANER
            }
            ,
            {
                text:"「その他：全部」を全て受け取る" ,
                template : this.RECV_TEMPLATE_NO_POP_TRANER
            }
            ,
            {
                text:"「イベント用アイテム」を全て受け取る" ,
                template : this.RECV_TEMPLATE_ALL_EVENT_ITEM
            }

        ];

    }


    /**
     * 贈り物受け取った直後、TOPに戻したいので
     * 公式のタブノードを再現するためにこさえたメソッド。
     * http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Freceive_all%3Fl_frm%3DPresent_recieve_1%26rnd%3Dxxxxxxxxx
     * とかで呼び出されると思う
     */
    generateItemRecvTabListNode(){
        const _tabMenu = document.createElement("div");
        _tabMenu.id = "tab_menu";
        _tabMenu.className = "tab_common-large  m-Top8 m-Btm8";

        const _tabArray = [
            {
                "text":"全て",
                "url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F"
            }
            ,
            {
                "text":"アイドル",
                "url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%2F0%2F0%3Fsort_type%3D3"
            }
            ,
            {
                "text":"アイテム",
                "url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%2F0%2F0%3Fsort_type%3D1%"
            }
            ,
            {
                "text":"その他",
                "url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%2F0%2F0%3Fsort_type%3D99"
            }
            ,
            {
                "text":"ぷち衣装",
                "url" : "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve%2F1%2F0%2F0%2F0%3Fsort_type%3D101"
            }
        ]
            
        _tabArray.forEach(_data=>{
            const _link = document.createElement("a");
            _link.href = _data["url"];
            _link.textContent = _data["text"];
            _link.className = "tab_line_5 tab_text";
            _tabMenu.appendChild(_link);
        });

        return _tabMenu;
    }


}


/**
 * forstloadから呼ばれる。
 */
function PresentSetUp(){

    const _recvResultUrls = [
        "%2Fidolmaster%2Fpresent%2Freceive_all" ,
        "%2Fidolmaster%2Fpresent%2Frecieve_much" ,
    ].findIndex(_url => (location.href.indexOf(_url) != -1));
    
    /**
     * 贈り物を受け取った直後に遷移するリザルトURL
     * マーカー見つけて然るべき位置に、公式ノードを模したタブのリンクノードを配置する
     */
    if(_recvResultUrls != -1){
        const _t = document.querySelector("div.page_layout");
        if(_t){
            const _PresentSystem = new PresentSystemClass();
            const _setTabNode = _PresentSystem.generateItemRecvTabListNode();
            _t.insertBefore( _setTabNode , _t.firstChild.nextElementSibling );
            //console.log(_setTabNode);
        }
        return;
    }

    //トレーナー全受け取り用フォームこさえたり配置したり
    subfunc_presentPop0TrainerAllRecvGenNode();

    /**
     * 受け取らない,必ず受け取る 正規表現
     */
    let _exceptRegStr = null;
    let _receiveRegStr = null;

    //正規表現準備
    if(1){
        try {
            if(getOption("presentcheck_check")){
                _exceptRegStr = new RegExp(getOption("presentnocheck01_value"));
                _receiveRegStr = new RegExp(getOption("presentcheck_value"));
            }
            
        }catch( e ){
            //正規表現で処理させない
            //BackgroundNotification("presentinputerror");	//エラーメッセージ
        }
    }

    /**
     * 贈り物のチェック系を操作するか否か
     */
    const _presentReceveMode = !!getOption("presentrecevelayout_check");

    /**
     * 処理の関係で、まとめて自己チェックイベント発火させるインスタンスの配列
     * @type Array.<PresentItemNodeParserClass>
     */
    const _dispatchInstanceList = [];

    const _itemNodes = document.querySelectorAll("div.frame-common_no-border.jsPresentInfo");
    [..._itemNodes].forEach(_node=>{
        // クラスを用いてアイテムノードをパースさせてる
        const _ItemInstance = new PresentItemNodeParserClass(_node);
        _ItemInstance.parse();
       // console.log(_ItemInstance);

        const _itemName = _ItemInstance.itemName;
        const _itemValue = _ItemInstance.itemValue;
        const _historyInfo = _ItemInstance.historyInfo;
        const _historyDateStr = _ItemInstance.historyDateStr;

        _ItemInstance.node.title = (_itemName + " * " + _itemValue + "\n" + _historyInfo + "\n" + _historyDateStr);

        const _appendNode = _ItemInstance.appendItemInfoNode;
        if(_appendNode){
            _appendNode.parentNode.style.userSelect = "none";   //選択させない
            _appendNode.className = "mkt_item_appendInfo";
            _appendNode.style.fontSize = "11px";
            _appendNode.style.height = "50px";
            //贈り物判定
            const _presentHitStrIndex = _historyInfo.indexOf("からのプレゼントです")
            if(_presentHitStrIndex != -1){
                const _nameNode = document.createElement("div");
                _nameNode.textContent = "from:" + _historyInfo.substr(0 , _presentHitStrIndex);
                _nameNode.className = "yellow";
                _nameNode.style.marginRight = "5px";
                _appendNode.appendChild(_nameNode);
            }

            /**
             * アイテム名表記追加
             */
            {
                const _nameNode = document.createElement("span");
                if(_nameNode){
                    _nameNode.textContent = _itemName;
                    _appendNode.appendChild(_nameNode);
                }
            }
            
            /**
             * +1 の人気度が読みづらいので情報レイアウト追加
             */
            if(_ItemInstance.popularValue > 0){
                const _popularNode = document.createElement("span");
                //_popularNode.className = "red";
                _popularNode.style.marginLeft = "5px";
                _popularNode.style.backgroundColor = "rgb(130, 80, 80)";
                _popularNode.style.fontSize = "12px";
                _popularNode.style.padding = "1px";
                _popularNode.textContent = "+" + _ItemInstance.popularValue;
                _appendNode.appendChild(_popularNode);
            }

            /**
             * 個数ノード
             */
            {
                const _countNode = document.createElement("span");
                _countNode.className = "yellow";
                _countNode.style.marginLeft = "5px";
                _countNode.textContent = _itemValue;
                _appendNode.appendChild(_countNode);
            }

            /**
             * チェックボックス管轄のノードを取り出し、都合の良いように再配置
             * 上限などで受け取れない場合、checkBoxNode は取得できなくなるみたい
             */
            {
                if(_ItemInstance.checkBoxNode){
                    const _cbox = _ItemInstance.checkBoxNode.parentNode;
                    if(_cbox){
                        _ItemInstance.appendItemInfoNode.parentNode.appendChild( _cbox );
                    }
                }
            }

            /**
             * 特殊アイテムやぷち衣装以外は、アイテムクリックでポップアップを出さないようにする
             * a > img の a にイベントが貼られていたので、取り出して a を display:none で無効化？
             */
            {
                const _category = _ItemInstance.dataPopupCategory;
                if(_category && (_category == 101 || _category == 1001)){
                    //console.log("残すカテゴリ" , _category);
                }
                else{
                    //console.log("移動するカテゴリ" , _category);
                   const _a =  _ItemInstance.itemImageNode.parentNode;
                   _a.parentNode.appendChild( _ItemInstance.itemImageNode );
                }
            }

            /**
             * 独自領域クリックで、公式のイベントを発火させる
             */
            _appendNode.addEventListener("click" , _e=>{
                //発火させよる
                const _evt = document.createEvent("HTMLEvents");
                _evt.initEvent("click", true, true ); // event type, bubbling, cancelable
                _ItemInstance.checkBoxNode.dispatchEvent(_evt);
            });
        }

        /**
         * SRからのレアリティの場合、プレサイン判別のために公式鯖にPOSTする。
         * 受け取り結果に応じて内部でPサイン処理
         */
        if(_ItemInstance.Rarity > 4){
            const _baseApi = "http://sp.pf.mbga.jp/12008305/?guid=ON&amp;url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fdetail_data%2Fpresent_make_detail_data";
            const _recvId = _ItemInstance.presentId

            if(1){
                //  https://developer.mozilla.org/ja/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
                const _data = {
                    category : 3 ,
                    id : _recvId ,
                    history : 0
                };
                const _urlEncodedDataPairs = [];
                for(name in _data){
                    _urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(_data[name]));
                }
                const _bodyStr = _urlEncodedDataPairs.join('&').replace(/%20/g, '+');
                //console.log( _bodyStr );
                fetch(_baseApi , {
                    method : "POST" ,
                    body : _bodyStr ,
                    headers : {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With" : "XMLHttpRequest" ,
                    }
                }).then((res) =>{
                    return res.json();
                }).then(_json=>{
                    if(_json && "info" in _json){
                        const _info = _json["info"];
                        //console.log(_json);
                        if(_info && "premium" in _info){
                            //console.log(_ItemInstance.itemName , "Pサイン:" , _info["premium"]);
                            if(_info["premium"] > 0){
                                _ItemInstance.appendPremiumSignEffect();
                            }
                        }
                    }

                }).catch(_e=>{
                    console.log(e);
                });
            }

        }

        return;
        /**
         * 贈り物の操作を許可した場合、
         * _dispatchInstanceList に受け取りたいアイテム管理インスタンスを格納。
         * 後で使われる。
         */
        if(_presentReceveMode){
            /**
             * チェックを入れる用の正規表現が設けられていた場合、マッチするか確認
             * 1.一度、すべてのチェックを入れる
             *  2.チェックを入れたうち、チェックを外したいものを正規表現で調べてオフにする
             *   3.その中で更に必ず受け取りたいものを正規表現で調べてオンにする
             */
            let _checkEnable = true;    //すべてチェックを入れる前提
            if(_receiveRegStr && _exceptRegStr){
                if(_ItemInstance.popularValue > 0){
                    //console.log("人気度在りなので無条件でチェックを入れない");
                    _checkEnable = false;
                }else{

                    const _checkOffResult = _ItemInstance.isMatchFromRegexp(_exceptRegStr);
                    if(_checkOffResult){
                        //受け取らない
                        _checkEnable = false;
                        const _checkOnResult = _ItemInstance.isMatchFromRegexp(_receiveRegStr);
                        if(_checkOnResult){
                            //必ず受け取る
                            _checkEnable = true;
                        }
                    }
                }
            }

            if(_checkEnable){ 
                // でも最終的に人気度が含まれていれば絶対に受け取らない
                if(_ItemInstance.popularValue > 0){
                    console.log("人気度在りなので無条件でチェックを入れない");
                    console.log(_ItemInstance.itemName);
                }else{
                    _dispatchInstanceList.push(_ItemInstance);
                }

            }
        }




    });

    /**
     * 贈り物のチェックやフィルタ系の処理。
     * 2019/12月に再実装したが、昔のクリスマスケーキやチョコが名前付きで受け取れるようになっているので、もういらないかも。
     * http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Ftop%2Fdetail_announce%2F5555
     */
    return;


    //console.log(_dispatchInstanceList);

    // このタイミングでまとめてチェック操作(公式イベント発火させよる)
    if(false && _presentReceveMode){
        setTimeout(()=>{
            _dispatchInstanceList.forEach(_n=>{
                //_n.checkBoxNode.click();
                //console.log(_n.checkBoxNode);
                // 既に別ページからの持越しでチェックされていれば、チェックしない。
                if(!_n.checkBoxNode.parentNode.classList.contains("_selected")){
                    const _evt = document.createEvent("HTMLEvents");
                    _evt.initEvent("click", true, true );
                   _n.checkBoxNode.dispatchEvent(_evt);
                }
            });
        },100);

        
        /**
         * 外部関数で作成したオプションフォームをページ下に配置
         */
        {
            const _pageLayoutNode = document.querySelector(".page_layout");
            if(_pageLayoutNode){
                const _presetFormNode = subfunc_makepriset();
                _pageLayoutNode.parentNode.insertBefore(_presetFormNode , _pageLayoutNode.nextElementSibling);
            }

        }

    }

}


/**
 * 人気度0のトレーナ群のみ全て受け取る
 */
if(0){

    const _form = document.createElement("form");
    _form.method = "POST";
    _form.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve_much%2F0";
    
	const _data = {
		view_auth_type: 1 ,
		sort_type: 3 ,
		filter: 0 ,
		popularity_filter: 1 ,
		premium_filter: 0 ,
		attribute: 99 ,
		cost: 0 ,
		skill_filter: 0 ,
		keyword: "" ,
		item_filter: 0 ,
		other_filter: 0 ,
		petit_accessory_rarity_filter: 0 ,
		petit_accessory_type_filter: 0 ,
		un_recieve_card: 0 ,
		un_recieve_money: 0 ,
	};

    for(let _key in _data){
        const _input = document.createElement("input");
        _input.type = "hidden";
        _input.name = _key;
        _input.value = _data[_key];
        _form.appendChild(_input);
    }

    const _submit = document.createElement("input");
    _submit.type = "submit";
    _submit.value = "全て受け取る";
    _form.appendChild(_submit);

    console.log(_form);

    _form.style.display = "none";

    document.body.appendChild(_form);
    
    _submit.click()
}



/**
 * 自動受け取りチェック、フィルタ等のユーザーオプションを入力,操作するフォームを作成して返す
 * 2019/12月あたりに作り直したけど、もう使わないかも。
 */
function subfunc_makepriset(){
    /**
     * 公式のスクリプトで、無作為に checkbox 属性拾って回っている処理があり、
     * オプション用として独自にcheckbox付けた際に、それも拾って処理してしまうきらいがある。
     * しかも例外を起こすので、回避策として .value を明示的にセットした。
     * セットした値が公式処理に影響を及ぼすかは知らない
     */
    const _baseNode = document.createElement("div");
    {
        _baseNode.style.backgroundColor = "#333333";
        _baseNode.style.clear = "both";
        _baseNode.style.marginBottom = "10px;"
    }
    
    
	//フォーム
    const _noCheckPrisetFormNode01 = document.createElement("input");
    {
        _noCheckPrisetFormNode01.setAttribute("type","text");
        _noCheckPrisetFormNode01.setAttribute("style","width:91%;");
        _noCheckPrisetFormNode01.setAttribute("maxlength",100);
        _noCheckPrisetFormNode01.setAttribute("value",getOption("presentnocheck01_value"));
        _noCheckPrisetFormNode01.setAttribute("title","ここの正規表現にかかる場合は、チェックが外れます");
        //いべんと
        _noCheckPrisetFormNode01.addEventListener("change",function(e){
            var value = e.srcElement.value;
            if(value){
                saveOption("presentnocheck01_value",value);
            }
        }); 
    }

    //有効無効を選ぶチェックボックス
    const _checkBoxNode01 = document.createElement("input");
    {
        _checkBoxNode01.setAttribute("type","checkbox");
        _checkBoxNode01.setAttribute("style","float:left;");
        _checkBoxNode01.value = 0;  // 公式対処
        if(getOption("presentnocheck01_check")){
            _checkBoxNode01.setAttribute("checked","");
        }
        //いべんと
        _checkBoxNode01.addEventListener("change",(e)=>{
            saveOption("presentnocheck01_check" , e.srcElement.checked);
        });
    }


	//▼チェックつけるフォームの作成とイベント付与------
    const _checkPrisetFormNode = document.createElement("input");
    {
        _checkPrisetFormNode.type = "text";
        _checkPrisetFormNode.style.width = "91%";
        _checkPrisetFormNode.style.fontSize = "11px";
        _checkPrisetFormNode.maxLength = "100";
        _checkPrisetFormNode.value = getOption("presentcheck_value");
        _checkPrisetFormNode.title = "ここの正規表現にかかる場合は、必ずチェックが入ります";
        _checkPrisetFormNode.addEventListener("change",_e=>{
            const _value = _e.srcElement.value;
            if(_value){
                saveOption("presentcheck_value",_value);
            }
        });
    }


	//有効無効を選ぶチェックボックス
    const _setCheckBoxNode02 = document.createElement("input");
    {
        _setCheckBoxNode02.type = "checkbox";
        _setCheckBoxNode02.style.float = "left";
        _setCheckBoxNode02.value = 0;   // 公式対処
        if(getOption("presentcheck_check")){
            _setCheckBoxNode02.checked = "checked";
        }
        _setCheckBoxNode02.addEventListener("change",_e=>{
            saveOption("presentcheck_check" , _e.srcElement.checked);
        });
    }
	
    //仕様確認ボタン
    const _infoBtn = document.createElement("button");
    {
        let _message = 
        "以下の序列で自動チェックのONOFFを判定・操作します"
        + "\n"
        + "\n1.全てのアイテムをチェック"
        + "\n 2.正規表現と照会して一部アイテムのチェックをオフ"
        + "\n  3.必ず受け取りたいアイテムのチェックをオン"
        + "\n"
        + "\n人気度付きカードは必ずチェックがオフになります"
        + "\n"
        + "\nチェックを入れたアイテム群は、\nページを移動してもその記録が持越されます"
        + "\n"
        + "\n現状、衣装だけはタイマーを切って個別に受け取ってください"

        _infoBtn.textContent = "仕様を確認する";
        _infoBtn.onclick = ()=>{
            alert(_message);
        }

    }

    //配置
	_baseNode.appendChild(_checkBoxNode01);
	_baseNode.appendChild(_noCheckPrisetFormNode01);
	_baseNode.appendChild(_setCheckBoxNode02);
	_baseNode.appendChild(_checkPrisetFormNode);
	_baseNode.appendChild(_infoBtn);

	return _baseNode;
}



/**
 * 人気度0トレーナー即時全受け取り用のボタンこさえたり配置したりする
 */
function subfunc_presentPop0TrainerAllRecvGenNode(){
    /**
     * マーカーノード
     */
    const _marker = document.querySelector(".page_layout > .frame-common_simple > a.js-btn_all_recieve");
    if(!_marker){
        return;
    }

    //アイドルの受け取りタブの時だけズレるので、細工
    _marker.classList.remove("m-Top12");

    /**
     * ボタンデザイン系新規ノード
     */
    const _newArea = document.createElement("div");
    _newArea.className = "area-btn-common m-Top8";
    const _label = document.createElement("div");
    {
        _label.title = "「人気度0のみ」 の全トレーナー\n即時全受け取り(最大200人)";
        _label.classList.add("mkt_tab_attr_trainer");   // custom_present.css 依存
        const _iconArea = document.createElement("div");
        _iconArea.style.position = "absolute";
        _iconArea.style.bottom = "0px";
        _iconArea.style.right = "0px";
        // 公式の + や 数字画像流用
        const _plus = new Image();
        _plus.src = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui%2Frich%2Fnumber%2Fplus.png%3Fv%3D20101001000000";
        const _zero = new Image();
        _zero.src = "http://sp.pf-img-a.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui%2Frich%2Fnumber%2F0.png%3Fv%3D20101001000000";
        _plus.width = "12";
        _zero.width = "12";
        // 一次配置
        _iconArea.appendChild(_plus);
        _iconArea.appendChild(_zero);
        _label.appendChild(_iconArea);
    }

    /**
     * 外部クラスにノード作らせて配置
     */
    const _PresentSystem = new PresentSystemClass();
    const _templateOptionData = _PresentSystem.getRecvInputOptionTemplateObject(_PresentSystem.RECV_TEMPLATE_NO_POP_TRANER);
    if(_templateOptionData){
        const _recvForm = _PresentSystem.generateRecvFormNode( _templateOptionData );
        if(_recvForm){
            _recvForm.action = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fpresent%2Frecieve_much%2F0";
            //console.log(_recvForm);
            _label.addEventListener("click", (_e=>{
                //console.log("人気度+0 の全トレーナーを受け取る");
                document.body.appendChild(_recvForm);
                _recvForm.submit();
            }));
            // 再配置
            _marker.parentNode.appendChild(_newArea);
            _newArea.appendChild(_marker);
            _newArea.appendChild(_label);
        }
    }



}
