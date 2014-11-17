/**
 * Created by Earl-PC on 2014. 9. 24..
 */

var global_current_path="/";

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
        var jquery_obj,name,path;
        if(typeof(pathdata)!="string") {
            jquery_obj = $(pathdata).find('span');
            name = jquery_obj.text().trim();
            if(name=="미분류") path="/";
            else {
                path = jquery_obj.data('path');
                if (path == null) path = "/";
                path = path + (name == "/" ? "" : name);
                path = path && path.trim() != "undefined" ? path : "/"
            }
        }
        else {
            if(pathdata=="미분류") path="/";
            else path = pathdata;
        }

        global_current_path=path;

        var params={
            path:path
        }
        $.ajax({
            url:"/ajax/get_pageAll_list", //dir with file
            data:params,
            success : function(data) {
                bookmarkController.contents_update(data);
                bookmarkUIManager.addContentBookmarkUI(pathdata);
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
                bookmarkModel.getBookmarkData(global_current_path);
            }
        })
    },

/*    addNewSubFolderData : function(jquery_obj,name){
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
    },*/

    renameFolderData : function(_data){
        var data={};
        data.dirInfo={};
        var a_obj=$(this).parents('a');
        data.dirInfo.path=a_obj.data('path');
        data.dirInfo.name=a_obj.find('span').text().trim();
        bookmarkModel.getName(function(new_name){
            data.dirInfo.new_name = new_name;
        })
        var params={
            dirInfo:data.dirInfo
        }
        $.ajax({
            url:"/ajax/rename_pageDir",
            data:params,
            success : function(data) {
                bookmarkController.update();
                bookmarkModel.getBookmarkData();
            }
        })
    },

    renameFileData : function(_data){
        var contents_data={};
        contents_data.pageInfo={};
        var a_obj=$(this).parent().find('.link_btn');
        contents_data.pageInfo.url=a_obj.attr('link')
        a_obj=$(this).parent();
        contents_data.pageInfo.path=a_obj.data('path')

        bookmarkModel.getName(function(data){
            contents_data.pageInfo.new_title = data;
        })

        var params={
            pageInfo:contents_data.pageInfo
        }
        $.ajax({
            url:"/ajax/rename_pageEntry",
            data:params,
            success : function() {
                bookmarkController.contents_update();
                bookmarkModel.getContentData(global_current_path);
            }
        })
    },

    deleteFolderData : function(_data){
        var data={};
        data.dirInfo={};
        var a_obj=$(this).parents('a');
        data.dirInfo.path=a_obj.data('path');
        data.dirInfo.name=a_obj.find('span').text().trim();

        var params={
            dirInfo:data.dirInfo
        }
        $.ajax({
            url:"/ajax/remove_pageDir", //only dir
            data:params,
            success : function(){
                bookmarkController.update();
                bookmarkModel.getBookmarkData();
            }
        })
    },

    deleteFileData : function(_data){
        var contents_data={};
        contents_data.pageInfo={};
        var a_obj=$(this).parent().find('.link_btn');
        contents_data.pageInfo.url=a_obj.attr('link')
        a_obj=$(this).parent();
        contents_data.pageInfo.path=a_obj.data('path')

        var params={
            pageInfo:contents_data.pageInfo
        }
        $.ajax({
            url:"/ajax/remove_pageEntry", //only dir
            data:params,
            success : function (){
                bookmarkController.contents_update();
                bookmarkModel.getContentData(global_current_path);
            }
        })
    },

    getName : function(callback){
        var result = prompt("새 이름 입력","");

        var alphaExp = /^[a-zA-Z0-9_-]+$/;
        if(result.match(alphaExp)) {
            callback(result);
        }
        else{
            alert("File name contains bad character");
        }
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

    update : function(data){
        this.data = data;
    },

    contents_update : function(data){
        this.contents_data = data;
    },

    init : function () {
        this.attachEvent();
    },

    addNavbarBookmarkUI : function(){
        $('.dir_only_elem').remove();
        var result=this.data.data.pageDir;
        var innerhtml_str=""
        innerhtml_str+="<div style='text-align: center; background: #FF865C; color:#fff; height: 50px; width:100%; line-height: 40px;border-radius:0px' class='btn folder_make_btn'>"+
            "<span class='glyphicon glyphicon-plus'>"+
            "</span>"+
            "새 폴더"+
            "</div>"+
        "<li class='mt droppable_binding'>"+
        "<a data-path='/'>"+
        "<span>"+
        "미분류"+
        "</span>";

        result.forEach(function(indata){
            innerhtml_str+="<li class='mt droppable_binding'>"+
                "<a data-path='&&dirpath&&'>"+
                "<span>"+
                "&&dirname&&"+
                "</span>"+
                "<div class='btn-group' style='float:right; margin-bottom:5px'>"+
                "<button type='button' class='btn btn-theme btn-xs rename_folder_btn' style='float:right; margin-bottom:7px'>"+
                "새 이름"+
                "</button>"+
                "<button type='button' class='btn btn-theme btn-xs delete_folder_btn' style='float:right; margin-bottom:7px'>"+
                "지우기"+
                "</button>"+
                "</div>"+
                "</a>"+
                "</li>";
            innerhtml_str=innerhtml_str.replace('&&dirname&&',indata.name).replace('&&dirpath&&',indata.path)
        })


        document.getElementById("nav-accordion").innerHTML=innerhtml_str;
        this.init();
    },

    addContentBookmarkUI : function(path){
        var resultEntry = this.contents_data.data.pageEntry;

        var innerhtml_str="";

        resultEntry.forEach(function(indata){
            innerhtml_str+="<div class='list-group draggable_file'>"+
                "<a class='list-group-item file_a_tag_title' data-path='&&entrypath&&'>"+
                "<h3 class='list-group-item-heading'>"+
                "&&title&&"+
                "<button type='button' class='btn btn-theme delete_btn' style='float:right; margin-top:7px'>"+
                "지우기"+
                "</button>"+
                "<button type='button' class='btn btn-theme rename_btn' style='float:right; margin-top:7px'>"+
                "새 이름"+
                "</button>"+
                "<button type='button' class='btn btn-theme link_btn' style='float:right; margin-top:7px' link='&&entryurl&&'>"+
                "링크"+
                "</button>"+
                "</h3>"+
                "<p class='list-group-item-text'>"+
                "&&content&&"+
                "</p>"+
                "</a>"+
                "</div>";
            innerhtml_str=innerhtml_str.replace(/&&entryurl&&/g,indata.url).replace(/&&entrypath&&/g,indata.path).replace(/&&title&&/g,indata.title).replace(/&&content&&/g,indata.content.substring(0,65));
        })

        document.getElementById("bookmark_menu").innerHTML=innerhtml_str;

        this.init();

    },

    addSubFolderViewerUI : function(path){
        var resultDir = bookmarkUIManager.contents_data.data.pageDir;
        var innerhtml_str="";

        resultDir.forEach(function(indata){
            innerhtml_str+="<li class='mt'>"+
                "<a data-path='&&dirpath&&'>"+
                "<span>"+
                "&&dirname&&"+
                "</span>"+
                "</a>"+
                "</li>";
            innerhtml_str=innerhtml_str.replace(/&&dirname&&/g,indata.name).replace(/&&dirpath&&/g,indata.path)
        })

        $(path).append(innerhtml_str);
    },

    attachEvent : function () {
        this._NavbarOffClickEvent();
        this._NavbarClickEvent();
        this._AddNewFolderOffClickEvent();
        this._AddNewFolderClickEvent();
        this._RenameBtnOffClickEvent();
        this._RenameBtnClickEvent();
        this._DeleteBtnOffClickEvent();
        this._DeleteBtnClickEvent();
        this._LinkBtnOffClickEvent();
        this._LinkBtnClickEvent();
//        this._DropdownBindingOffEvent();
//        this._DropdownBindingEvent();
        this._DraggableBindingEvent();
        this._DroppableBindingEvent();
//        this._DropdownMenuOffClickEvent();
//        this._DropdownMenuClickEvent();
        this._FolderRenameBtnOffClickEvent();
        this._FolderRenameBtnClickEvent();
        this._FolderDeleteBtnOffClickEvent();
        this._FolderDeleteBtnClickEvent();
    },

    _NavbarClickEvent : function(){
        $('li.mt').on('click', function(){
            bookmarkModel.getContentData(this);
            // Sub Folder 표현
        });

    },

    _NavbarOffClickEvent : function(){
        $('li.mt').off('click',function(){
            // Sub Folder 지우기
        });
    },

    _AddNewFolderOffClickEvent : function(){
        $('.folder_make_btn').off('click');
    },

    _AddNewFolderClickEvent : function(){
        $('.folder_make_btn').on('click',function(){
            var name;
            bookmarkModel.getName(function(data){
                name=data;
            })
            bookmarkModel.addNewFolderData(name,global_current_path);
        });
    },

    _RenameBtnClickEvent : function(){
        $('.rename_btn').on('click',bookmarkModel.renameFileData);
    },

    _RenameBtnOffClickEvent : function(){
        $('.rename_btn').off('click');
    },

    _DeleteBtnClickEvent : function(){
        $('.delete_btn').on('click',bookmarkModel.deleteFileData);
    },

    _DeleteBtnOffClickEvent : function(){
        $('.delete_btn').off('click');
    },

    _LinkBtnOffClickEvent : function(){
        $('.link_btn').off('click');
    },

    _LinkBtnClickEvent : function(){
        $('.link_btn').on('click',function(){
            window.open($(this).attr('link'),"새 창");
        });
    },

    _FolderRenameBtnClickEvent : function(){
        $('.rename_folder_btn').on('click',bookmarkModel.renameFolderData)
    },

    _FolderRenameBtnOffClickEvent : function(){
        $('.rename_folder_btn').off('click')
    },

    _FolderDeleteBtnClickEvent : function(){
        $('.delete_folder_btn').on('click',bookmarkModel.deleteFolderData)
    },

    _FolderDeleteBtnOffClickEvent : function(){
        $('.delete_folder_btn').off('click')
    },

/*    _DropdownBindingOffEvent : function(){
        var oDropdown = $('.dropdown-menu')[1];
        $('.dropdown_btn').off('click',function(){
            $(this).parent().remove(oDropdown);
        })
    },

    _DropdownBindingEvent : function(){
        var oDropdown = $('.dropdown-menu')[1];
        $('.dropdown_btn').on('click', function(){
            $(this).parent().append(oDropdown);
        })
    },

    _DropdownMenuOffClickEvent : function(){
        $('.rename_folder').off('click')
        $('.delete_folder').off('click')
    },

    _DropdownMenuClickEvent : function(){
        $('.rename_folder').on('click', bookmarkModel.renameFolderData)
        $('.delete_folder').on('click', bookmarkModel.deleteFolderData)
    },*/

    _DraggableBindingEvent : function(){
        $('.draggable_file').draggable({
            revert: true,
            opacity:"0.3",
            helper : function( event ){
                return $( "<div class='ui-widget-header'> <img src='/images/dropping.png'> </img> </div>");
            },
            cursorAt : {top: 10, left: 10}
        });
    },

    _DroppableBindingEvent : function() {
        $('.droppable_binding').droppable({
            drop : function(event, ui) {
                var jquery_obj = $(this).find('a');
                var dragobj = $(ui.draggable);
                var params = {
                    pageInfo: {
                        oldPath: dragobj.find('.file_a_tag_title').data('path'),
                        newPath: jquery_obj.data('path') + jquery_obj.find('span').text().trim(),
                        url: dragobj.find('.link_btn').attr('link')
                    }
                };

                if(jquery_obj.find('span').text().trim()=="미분류") params.pageInfo.newPath="/";

                $.ajax({
                    url: "/ajax/move_entryPath",
                    data: params,
                    success: function (data) {
                        dragobj.remove()
                        bookmarkModel.getContentData(global_current_path);
                    }
                })
            }
        })
    }

};


$(window).load(function(){
    jQuery.ajaxSetup({
        type : 'POST'
    })

    bookmarkModel.setFirstPage();
})
