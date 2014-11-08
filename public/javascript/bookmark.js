/**
 * Created by Earl-PC on 2014. 9. 24..
 */

global_current_path = "/";

var bookmarkModel = {

    data : {},
    contents_data : {},

    setData : function(data){
        this.data = data;
    },

    setContentsData : function(data){
        this.contents_data = data;
    },

    setFirstPage : function(path){
        this.getBookmarkData(path);
        this.getContentData(path);
    },

    getBookmarkData : function(path){
        var params={
            path:path
        }
        $.ajax({
            url:"/ajax/get_pageDir_list",
            data:params,
            success : function(data) {
                bookmarkController.update(data);
                bookmarkUIManager.addNavbarBookmarkUI();
            }
        })
    },

    getContentData : function(pathdata){
        var jquery_obj= $(this);
        var name=jquery_obj.text().trim();
        var path=jquery_obj.data('path');
        if(path==null) path="/";
        path=path+(name=="/"?"":name);
        path=path&&path.trim()!="undefined"?path:"/"
        if(path=="/"&& typeof(pathdata)=="string")
            path=pathdata
        global_current_path=path;
        var params={
            path:path
        }
        $.ajax({
            url:"/ajax/get_pageAll_list", //dir with file
            data:params,
            success : function(data) {
                bookmarkController.contents_update(data);
                bookmarkUIManager.addContentBookmarkUI();
            }
        })
    },

    addNewFolderData : function(name, path){
        var params = {
            dirInfo : {
                name : name,
                path : path
            }
        }

        $.ajax({
            url:"/ajax/insert_pageDir",
            data:params,
            success : function(data) {
                bookmarkController.update();
            }
        })
    },

    addNewSubFolderData : function(jquery_obj,name){
        var a_obj=jquery_obj.find('a')
        var path=a_obj.data('path')+a_obj.text()
        path=path&&path.trim()!="undefined"?path:"/"
        var params={
            dirInfo:{
                name:name,
                path:path
            }
        }
        $.ajax({
            url:"/ajax/insert_pageDir",
            data:params,
            success : function(data) {
                bookmarkController.update();
            }
        })
    },

    renameFolderData : function(){
        var params={
            dirInfo:data.dirInfo
        }
        $.ajax({
            url:"/ajax/rename_pageDir",
            data:params,
            success : function(data) {
                bookmarkController.update();
            }
        })
    },

    renameFileData : function(){
        var params={
            pageInfo:data.pageInfo
        }
        $.ajax({
            url:"/ajax/rename_pageEntry",
            data:params,
            success : function() {
                bookmarkController.update();
            }
        })
    },

    deleteFileData : function(){
        var data = {}
        data.pageInfo
        var params={
            pageInfo:data.pageInfo
        }
        $.ajax({
            url:"/ajax/remove_pageEntry", //only dir
            data:params,
            success : function (){
                bookmarkController.update();
            }
        })
    },

    deleteFolderData : function(){
        var params={
            dirInfo:data.dirInfo
        }
        $.ajax({
            url:"/ajax/remove_pageDir", //only dir
            data:params,
            success : function(){
                bookmarkController.update();
            }
        })
    }

};

var bookmarkController = {

    update : function(_data){
        bookmarkModel.setData(_data);
        bookmarkUIManager.update(_data);
    },

    contents_update : function(_data){
        bookmarkModel.setContentsData(_data);
        bookmarkUIManager.contents_update(_data);
    }

};

var bookmarkUIManager = {

    data : {},
    contents_data : {},

    init : function () {
        this.attachEvent();
    },

    addNavbarBookmarkUI : function(){
        $('.dir_only_elem').remove();
        console.log(this.data);
        var result=this.data.data.pageDir;
        var innerhtml_str=""
        innerhtml_str+="<p class='centered'>"+
            "<a href=''>"+"<img src='/assets/img/ui-sam.jpg' class='img-circle' width='60'>"+"</a>"+"</p>"
            +"<div class='row'>"+"<button type='button' class='btn btn-theme btn-newfolder'>"+"<i class='fa fa-check'>"+"</i>"+"새 폴더"+"</button>"+"<button type='button' class='btn btn-theme btn-delfolder'>"+"<i class='fa fa-check'>"+"</i>"+"지우기"+"</button>"+"</div>";
        console.log(result);
        result.forEach(function(indata){
            innerhtml_str+="<li class='mt'>"+
                "<a data-path='&&dirpath&&'>"+
                "<span>"+
                "&&dirname&&"+
                "</span>"+
                "</a>"+
                "</li>";
            innerhtml_str=innerhtml_str.replace('&&dirname&&',indata.name).replace('&&dirpath&&',indata.path)
        })


        document.getElementById("nav-accordion").innerHTML=innerhtml_str;
        this.init();
    },

    addContentBookmarkUI : function(){
        var resultEntry = this.contents_data.data.pageEntry;

        var innerhtml_str="";

        resultEntry.forEach(function(indata){
            innerhtml_str+="<div class='list-group'>"+
                "<a href='&&entryurl&&' class='list-group-item' data-path='&&entrypath&&'>"+
                "<h3 class='list-group-item-heading'>"+
                "&&title&&"+
                "</h3>"+
                "<p class='list-group-item-text'>"+
                "&&content&&"+
                "</p>"+
                "</a>"+
                "<div class='row'>"+
                "<button type='button' class='btn btn-theme delete_btn'>"+
                "지우기"+
                "</button>"+
                "<button type='button' class='btn btn-theme rename_btn'>"+
                "새 이름"+
                "</button>"+
                "</div>"+
                "</div>";
            innerhtml_str=innerhtml_str.replace(/&&entryurl&&/g,indata.url).replace(/&&entrypath&&/g,indata.path).replace(/&&title&&/g,indata.title).replace(/&&content&&/g,indata.content.substring(0,200));
        })

        document.getElementById("bookmark_menu").innerHTML=innerhtml_str;
        this.init();
    },

    addSubFolderViewerUI : function(){

    },

    update : function(data){
        this.data = data;
    },

    contents_update : function(data){
        this.contents_data = data;
    },

    attachEvent : function () {
        this._NavbarOffClickEvent();
        this._NavbarClickEvent();
        this._RenameBtnOffClickEvent();
        this._RenameBtnClickEvent();
        this._DeleteBtnOffClickEvent();
        this._DeleteBtnClickEvent();
    },

    _NavbarClickEvent : function(){
        $('li.mt').on('click', bookmarkModel.getContentData);
    },

    _NavbarOffClickEvent : function(){
        $('li,mt').off('click');
    },

    _RenameBtnClickEvent : function(){
        //$('rename_btn').on('click',)
    },

    _RenameBtnOffClickEvent : function(){
        $('rename_btn').off('click');
    },

    _DeleteBtnClickEvent : function(){
        $('.delete_btn').on('click',bookmarkModel.deleteFileData);
    },

    _DeleteBtnOffClickEvent : function(){
        $('.delete_btn').off('click');
    }

    /*_DropdownEvent : function(){
     var oDropdown = $("#fragment.item-dropdown");
     $('.dropdown_button').on('click', function(){
     $(this).parent().append(oDropdown);
     oDropdown.show();
     })
     },

     _LongNameHoverAnimationEvent : function(){
     var long_name_animateright=function(){
     $(this).animate({scrollLeft:this.scrollWidth-$(this).width()}, (this.scrollWidth-$(this).width())*15);
     $(this).one('mouseleave',long_name_animateleft)
     }
     var long_name_animateleft=function(){
     $(this).animate({scrollLeft:0}, (this.scrollWidth-$(this).width())*15);
     $(this).one('mouseover',long_name_animateright)
     }
     $('.long_name_overflow').one('mouseover',long_name_animateright)
     $('.long_name_overflow').one('mouseleave',long_name_animateleft)
     }*/
};


$(window).load(function(){
    jQuery.ajaxSetup({
        type : 'POST'
    })

    bookmarkModel.setFirstPage();
})
