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
            path = jquery_obj.data('path');
            if (path == null) path = "/";
            path = path + (name == "/" ? "" : name);
            path = path && path.trim() != "undefined" ? path : "/"
        }
        else
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

    renameFileData : function(_data){
        console.log("clicked")
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
        innerhtml_str+="<button type='button' class='btn btn-theme folder_make_btn' style=''>"+
            "새 폴더"+
            "</button>";

        result.forEach(function(indata){
            innerhtml_str+="<li class='mt droppable_binding'>"+
                "<a data-path='&&dirpath&&'>"+
                "<span>"+
                "&&dirname&&"+
                "</span>"+
                "<div class='btn-group' style='float:right'>"+
                "<button type='button' class='btn btn-theme dropdown-toggle dropdown_btn' data-toggle='dropdown'>"+
                "관리"+ "<span class='caret'>"+"</span>"+
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
        console.log(this.contents_data)
        var resultEntry = this.contents_data.data.pageEntry;

        var innerhtml_str="";

        resultEntry.forEach(function(indata){
            innerhtml_str+="<div class='list-group draggable_file'>"+
                "<a class='list-group-item file_a_tag_title' data-path='&&entrypath&&'>"+
                "<h3 class='list-group-item-heading'>"+
                "&&title&&"+
                "<button type='button' class='btn btn-theme delete_btn' style='float:right'>"+
                "지우기"+
                "</button>"+
                "<button type='button' class='btn btn-theme rename_btn' style='float:right'>"+
                "새 이름"+
                "</button>"+
                "<button type='button' class='btn btn-theme link_btn' style='float:right' link='&&entryurl&&'>"+
                "링크"+
                "</button>"+
                "</h3>"+
                "<p class='list-group-item-text'>"+
                "&&content&&"+
                "</p>"+
                "</a>"+
                "</div>";
            innerhtml_str=innerhtml_str.replace(/&&entryurl&&/g,indata.url).replace(/&&entrypath&&/g,indata.path).replace(/&&title&&/g,indata.title).replace(/&&content&&/g,indata.content.substring(0,200));
        })

        document.getElementById("bookmark_menu").innerHTML=innerhtml_str;

        this.init();

       // this.addSubFolderViewerUI(path);

    },

/*    addSubFolderViewerUI : function(path){
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
    },*/

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
        this._DropdownBindingOffEvent();
        this._DropdownBindingEvent();
        this._DraggableBindingEvent();
        this._DroppableBindingEvent();
    },

    _NavbarClickEvent : function(){
        $('li.mt').on('click', function(){
            bookmarkModel.getContentData(this);
        });

    },

    _NavbarOffClickEvent : function(){
        $('li.mt').off('click');
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
            console.log($(this).attr('link'))
            window.open($(this).attr('link'),"새 창");
        });
    },

    _DropdownBindingOffEvent : function(){
    },

    _DropdownBindingEvent : function(){
         var oDropdown = $("#fragment.dropdown-menu");
         $('.dropdown_btn').on('click', function(){
            $(this).parent().append(oDropdown);
            oDropdown.show();
         })
    },

    _DraggableBindingEvent : function(){
        $('.draggable_file').draggable({
            start:function(e,u){
                //save dragged item
            },
            drag:function(e,u){
            },
            stop:function(e,u){
                //check on the folder or not

                //if on the folder
                    //remove dragged item
                    //change path of item
            },
            revert: true,
            opacity:"0.3"
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
