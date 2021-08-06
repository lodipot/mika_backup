//アイプロ補助

	
function mainfunc_event_idolproduce(){

    if(urlCheck("%2Fevent_produce%2Fwork%2F") && false){

        //console.log("新お仕事演出");
        let _section = document.getElementById("direction_stage");
        if(!_section){
            console.warn( "#direction_stage の取得に失敗" );
            return;
        }
        let _choose_item = _section.querySelector("#choose_item");
        if(!_choose_item){
            console.warn("#choose_item の取得に失敗");
        }
        _section.style.overflow = "visible";    //hiddenから変更
        let _bottomValue = getOption("event_idolproduce_new_work_layout_change_value");
        _choose_item.style.bottom = _bottomValue + "px";    // 5 から変更
        console.log("アイプロ新お仕事 @ レイアウト変更" , _bottomValue);
    //    console.log(_choose_item);
        /*
            %2Fevent_produce%2Fwork%2F4%2F1%3Fl_frm @ コミュ発生ページ
        */
    }

}