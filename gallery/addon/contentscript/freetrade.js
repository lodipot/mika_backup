//フリトレのページなどを書き換えるスクリプト

//	MKTCSS に任せたほうが良い


var freetrade = {};


//トップページで動作する。登録タブを初回から display:block; に替える
freetrade.top = function(){
	var _sectionElm = document.querySelector("section.area_tab+section.area_tab.m-Top12");
	if(_sectionElm){
		_sectionElm.style.display = "block";
		freetrade.obs = new MutationObserver(
			(data1 , data2)=>{
				const _disp = data1[0].target.style.display;
				data1[0].target.style.display = "block";
			}
		);
		freetrade.obs.observe(_sectionElm , {attributes : true , attributeFilter:["style"]} );
	}
};


/**
 * お仕事の拡張htmlから要素パースしたかった時のメモ
 */
if(0){
	const _trs = document.querySelectorAll(".mkt_submenu_work_area > tr");

	const _resultArr = [];

	[..._trs].forEach(_node=>{
		const _link = _node.querySelector("a");
		const _areaName = _link.textContent;
		const _areaLink = _link.href;
		const _stamina = _node.querySelector("td:nth-of-type(2)").textContent;
		const _cardNode = _node.querySelector("td:nth-of-type(3)");
		let _cardCostArr;
		if(_cardNode){
			const _txt = _cardNode.textContent;
			if(_txt){

				_cardCostArr = _txt.split(",");
			}
		}
		const _cosLink = _node.querySelector("td:nth-of-type(4) > a");
		let _costume;
		let _costumeLink;
		if(_cosLink){
			_costume = _cosLink.textContent;
			_costumeLink = _cosLink.href;
		}

		const _obj = {
			"area_name" : _areaName ,
			"area_url" : _areaLink ,
			"stamina_cost" : _stamina , 
		};
		if(_cardCostArr){
			_obj["card_cost"] = _cardCostArr.join(",");
		}

		if(_costume && _costumeLink){
			_obj["costume_name"] = _costume;
			_obj["costume_url"] = _costumeLink;
		}
		_resultArr.push(_obj);
	});
	console.log(JSON.stringify(_resultArr));
}	
