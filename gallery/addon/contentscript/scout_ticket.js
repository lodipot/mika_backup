/**
 * スカチケラインナップカード解析用
 */
(()=>{
    // マーカー取得
    const _MarkerNode = document.querySelector(".exchange_card_list.m-Top4");
    if(!_MarkerNode){
        return;
    }

    const _startBtn = document.createElement("div");
    {
        _startBtn.style.width = "100%";
        _startBtn.style.textAlign = "center";
        const _a = document.createElement("a");
        _a.className = "btn_decision_line_2 m-Cnt m-Top8";
        _a.style.display = "inline-block";
        _a.textContent = "カード解析(仮)";
        _a.style.cursor = "pointer";
        _startBtn.appendChild(_a);

        _MarkerNode.parentNode.insertBefore( _startBtn , _MarkerNode);
    }

    let _startFlag = false;


    const _cardNodes =document.querySelectorAll(".idol_card_image");
    /**
     * @type ImageZoomClass
     */
    const _imageInstance = new ImageZoomClass();

    /**
     * コストとチケ入手系ノード作成
     * @param {*} _idolObj 
     */
    const _createCostTicketNode = (_idolObj) =>{

        
        const _baseNode = document.createElement("div");
        const _getType = _idolObj["get_type"];
        const _eventId = _idolObj["event_id"];
        const _costNode = document.createElement("span");
        _costNode.textContent = _idolObj["cost"];

        const _eventLink = document.createElement("a");
        _eventLink.target = "_blank";
        const _ticketImage = new Image();
        _ticketImage.style.width = "16px";
        _ticketImage.style.marginLeft = "5px";

        if(_getType == "恒常"){
            _ticketImage.src = "http://sp.pf-img-a.mbga.jp/12008305?url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fui%2Ficon_gacha_ticket.jpg";
            _ticketImage.title = "恒常 または SR%チケ";
        }
        else if(_getType == "イベチケ" && _eventId){
            _eventLink.textContent = "EVENT";
            _eventLink.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fmemory%2Fdetail%2F" + _eventId;
            _ticketImage.src = "http://sp.pf-img-a.mbga.jp/12008305?url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fimage_sp%2Fgacha%2Ficon_event_gacha_ticket_093.jpg";
        }
        else if(_eventId){
            _eventLink.textContent = "EVENT";
            _eventLink.href = "http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fmemory%2Fdetail%2F" + _eventId;
        }

        _baseNode.appendChild(_costNode);
        if(_ticketImage.src){  
            _baseNode.appendChild(_ticketImage);
        }
        _baseNode.appendChild(_eventLink);

        return _baseNode;
    }

    /**
     * 特技シンボルノードを作成して返すだけ
     * @param {*} _idolObj 
     */
    const _createIdolInfoNodeFromObj = (_idolObj) =>{
        const _baseNode = document.createElement("div");
        const _skillInfoNode = document.createElement("div");
        //特技解析
        {
            let _skillTextTitle = "";
            // ダブル特技対応
            [ _idolObj["s_txt"] , _idolObj["s_txt2"]].forEach(_sText=>{
                
                if(_sText && _sText.length > 2){
                    _skillTextTitle += (_sText+"\n");
                    const _skillDetailObjArr = skillDataConvert( [ _sText ]);
                    _skillInfoNode.appendChild( _imageInstance._createSkillColorSymbolNode(_skillDetailObjArr[0]) );
                    _skillInfoNode.appendChild( _imageInstance._createSkillAtkDefSymbolNode(_skillDetailObjArr[0]) );
                    _skillInfoNode.appendChild( document.createElement("br") );
                    _skillInfoNode.appendChild( _imageInstance._createSkillPowerScaleSymbolNode(_skillDetailObjArr[0]) );
                    _skillInfoNode.appendChild( _imageInstance._createSkillBackmemberSymbolNode(_skillDetailObjArr[0]) );
                    const _debuffInfoNode =  _imageInstance._createSkillBuffSymbolNode(_skillDetailObjArr , 0);
                    //	console.log(_debuffInfoNode);
                    if(_debuffInfoNode){
                        _skillInfoNode.appendChild( _debuffInfoNode );
                    }
                }
            });

            _skillInfoNode.title = _skillTextTitle;
        }
        _baseNode.appendChild(_skillInfoNode);
        return _baseNode;
    };


    const _hoge = (_node) =>{

        const _img = _node.querySelector("img");
        
        const _hash = _imageInstance.getHashFromSrc( _img.src );
        
        if(!_hash){
			console.warn("サーバーに接続するためのhashが得られませんでした");
			return;
		}
		let postURL = "http://mkt.packetroom.net/idoldata/?hash="+_hash;
		let httpObj = new XMLHttpRequest();
		httpObj.open("POST", postURL, true);
		httpObj.addEventListener("load",(e)=>{
			try{
				let _parseData = JSON.parse(e.target.responseText);
				//console.log(_parseData);
				if(_parseData){
                    /**
                     * relative にして、absolute で配置
                     */
                    const _aNode = _node.parentNode;
                    const _liNode = _aNode.parentNode;
                    //_liNode.style.position = "relative";

                    const _costTicketNode = _createCostTicketNode(_parseData);
                    _costTicketNode.style.lineHeight = "20px";
                    //_liNode.insertBefore( _costTicketNode , _aNode);
                    _liNode.insertBefore( _costTicketNode , _aNode.nextElementSibling);

                    // 特技は元から relative されている .idol_card_image 直下に
                    const _skillSymbolNode = _createIdolInfoNodeFromObj(_parseData);
                    _skillSymbolNode.style.position = "absolute";
                    _skillSymbolNode.style.bottom = "0px";
                    _skillSymbolNode.style.color = "#333";
                    _skillSymbolNode.style.backgroundColor = "white";
                    _skillSymbolNode.style.lineHeight = "16px";
                    _node.appendChild( _skillSymbolNode );

                    //const _targetMarkNode = _node.parentNode.nextElementSibling;
				}
			}catch(err){
				console.log(err);
			}
		},false);

		httpObj.send();
        
    }

    _startBtn.addEventListener("click" , ()=>{

        if(_startFlag){
            return;
        }
        _startFlag = true;

        [..._cardNodes].forEach(_node=>{
            _hoge(_node);
        });
    
    });





})();


