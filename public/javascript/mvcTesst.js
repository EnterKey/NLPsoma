/**
 * @author dooseong, eom
 */

/** @class editor.html Page의 Controller
* @auther EnterKey
* @version 1
* @constructor 뷰 import후 생성
* @description View를 import하고 init 하기 위한 클래스
*/
var EditorAppController = Class.extend({
  editorAppModel: null,
  editorAppSideContentView : null,

  init: function() {
    this.editorAppModel = new EditorAppModel(this);
    this.editorAppSideContentView = new EditorAppSideContentView();
    this.setEventListener();
  },

  setEventListener : function() {
    this.toggleModalForChangeDocumentTitle();
    this.changeDocumentTitle();
    this.saveDocumentContent();
    this.toggleReviewDivision();
    this.addNewPreviewTab();
    $('#save_writing_button').on('click', this.save);
  },

  toggleModalForChangeDocumentTitle : function() {
    var self = this;
    var writingDocumentTitle = this.editorAppModel._cacheElement["writingDocumentTitle"];

    writingDocumentTitle.on('click', function() {
      var documentTitle = writingDocumentTitle.text();
      self._cacheElement.titleOfToggleModal.val(documentTitle);
      self._cacheElement.modalForChangeDocumentTitle.modal('toggle');
    });
  },

  changeDocumentTitle : function() {
    var self = this;
    $('#btn-done').on('click', function() {
      var title = self._cacheElement.titleOfToggleModal.val();
      var category = self._cacheElement.categoryOfToggleModal.val();
      self._cacheElement.writingDocumentTitle.html(title);
      self._cacheElement.writingDocumentCategory.html(category);
    });
  },

  save : function() {
    var postData = {
      docsInfo: {
        filename: null,
        category: null,
        bookmarks: [],
        content : null
      }
    };

    var editorIframe = $('#cke_1_contents iframe')[0];

    if(editorIframe){
      var editorContent = editorIframe.contentWindow.document.body.innerHTML;
      postData.docsInfo.filename = self._cacheElement.writingDocumentTitle.html();
      postData.docsInfo.category = self._cacheElement.writingDocumentCategory.html();
      postData.docsInfo.content = editorContent;

      if(self._cacheElement.editorDiv.data('state')=='edit'){
        $.post(self.editorData.ajaxURL.document.update, postData, self.ajaxSaveHandler);
      }else{
        $.post(self.editorData.ajaxURL.document.insert, postData, self.ajaxSaveHandler);
      }
    }
  },

  ajaxSaveHandler : function(result) {
    if(result.status){
      alert("Success");
      if(self._cacheElement.editorDiv.data('state')=='new')
        self._cacheElement.editorDiv.data('state', 'edit');
    }else{
      alert(result.errorMsg);
    }
  }

});

/** @class editor.html Page의 Editor와 Preview 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 Editor와 Preview Division을 제어하기 위한 클래스
*/
var EditorAppModel = Class.extend({
  _controller : null,

  editorModel : null,
  bookmarkModel : null,

  _cacheElement : {
    writingDocumentTitle    : $('#writing_title'),
    writingDocumentCategory : $('#writing_category'),
    titleOfToggleModal      : $('#modal-title'),
    categoryOfToggleModal   : $('#modal-category'),
    previewDiv            : $('#preview'),
    modalForChangeDocumentTitle : $('#modal-edit-writing'),
    previewNewTab         : 'div.previewTabs ul li',
    addPreviewBtn         : $('button#add-preview-btn'),
    modalCategory         : $('#modal-category')[0],
    previewTab            : $('div.previewTabs')[0],
    previewTabHeader      : $('#previewTab-header')[0],
    previewTabContent     : $('#previewTab-content')[0],
    previewTabHeight      : '550px'
  },

  init : function(controller) {
    this._controller = controller;
    this.initModel();
    this.initReviewTab();
  },

  initModel : function() {
    this.editorModel = new EditorModel();
    this.bookmarkModel = new BookmarkModel();
  },

  initReviewTab : function() {
    $("#tabs").tabs();
    $('#tabs').height(this._cacheElement.previewTabHeight);
  },

  setEditorData : function(data){
    var self = this;

    self._cacheElement.writingDocumentTitle.html(data.filename);
    self._cacheElement.writingDocumentCategory.html(data.category);
    CKEDITOR.instances.editor1.setData(data.content);

  },

  setPreviewData : function(previewList){
/*    var headerDOM = "";
    var contentDOM = "";

    var headerTemplete = this.bookmarkData.templete.previewTabHeader;
    var contentTemplete = this.bookmarkData.templete.previewTabContent;

    var i = 0;
    for(i=0;i<previewList.length;i++){
      var tabID = 'preview-content-'+(i+1);
      var contentURL = "/snaptext/" + previewList[i].hashurl;
      headerDOM += headerTemplete.replace('{{tabID}}', '#'+tabID).replace('{{tabTitle}}', previewList[i].title);
      contentDOM += contentTemplete.replace('{{tabID}}', tabID).replace('{{contentURL}}', contentURL);
    }

    this._cacheElement.previewTabHeader.innerHTML = headerDOM;
    this._cacheElement.previewTabContent.innerHTML = contentDOM;

    $("div.previewTabs").tabs("refresh");
    var previewHeight = this._cacheElement.previewTabHeader.parent().height() - this._cacheElement.previewTabHeader.height();

    this._cacheElement.previewTabContent.height(previewHeight);*/

  },

  viewCategoryList : function(categoryList){
    var DOM = "";
    var options = "<option value='{{category}}'>{{category}}</option>";
    var i;
    for(i=0;i<categoryList.length;i++){
      DOM+=options.replace(/{{category}}/g, categoryList[i]);
    }
    this._cacheElement.modalCategory.innerHTML = DOM;
  },

  makeBookmarkTreeView: function(data){

    var pageEntry= data.pageEntry;
    var pageDir=data.pageDir;
    var ul_template="<ul>{{ul_content/}}</ul>"
    var li_template_file="<li data-jstree='{\"icon\":\"glyphicon glyphicon-leaf\"}' data-hashurl='{{li_hashurl}}'>{{li_content}}</li>"
    var li_template_dir="<li data-path='{{li_path}}'>{{li_content}}</li>"
    var treeview_string;

    var is_dir_exist=function(name,check_string){
      return check_string.indexOf(name)>=0?true:false;
    }

    var add_li_file=function(file_data,original_string){
        var new_string=original_string.replace("{{ul_content"+file_data.path+"}}",li_template_file+"{{ul_content"+file_data.path+"}}")
        new_string=new_string.replace(/{{li_hashurl}}/g,file_data.hashurl)
        new_string=new_string.replace(/{{li_content}}/g,file_data.title)
        return new_string
    }
    var add_li_dir=function(dir_data,original_string){
        var new_string=original_string.replace("{{ul_content"+dir_data.path+"}}",li_template_dir+"{{ul_content"+dir_data.path+"}}")
        new_string=new_string.replace(/{{li_path}}/g,dir_data.path)
        new_string=new_string.replace(/{{li_content}}/g,dir_data.name+ul_template.replace("{{ul_content/}}","{{ul_content"+dir_data.path+dir_data.name+"/"+"}}"));
        return new_string
    }

    treeview_string=ul_template;

    pageDir.forEach(function(page_dir_element){
      var split_data= page_dir_element.path.split("/")
      if(split_data>1){
        var concat_data="/"
        split_data.forEach(function(split_elem){
          if(split_elem!=""){
             concat_data+=split_elem+"/"
             if(!is_dir_exist(concat_data,treeview_string)){
                treeview_string=add_li_dir(page_dir_element,concat_data,treeview_string)
             }
          }
        })
      }else{
        treeview_string=add_li_dir(page_dir_element,treeview_string)
      }
    })
    pageEntry.forEach(function(page_entry_element){
      treeview_string=add_li_file(page_entry_element,treeview_string)
    })
    treeview_string=treeview_string.replace(/"<ul><\/ul>"/g,"")
    treeview_string=treeview_string.replace(/{{ul_content[a-zA-Z0-9\/\_\-]*}}/g,"")
    $("#jstree").append(treeview_string);
    $('#jstree').jstree({
      "core" : {
        // so that create works
        "check_callback" : true
      },
      "checkbox" : {
        "keep_selected_style" : false
      },
      "plugins" : ["checkbox", "contextmenu", "dnd"]
    });

    $('#jstree').on("changed.jstree", function(e, data) {
      console.log(data.selected);
    });
  },


  toggleReviewDivision : function() {
    var self = this;
    $('#toggle_preview_btn').on('click', function() {
      var isReviewActive = $("input:checkbox[id='toggle_preview']").is(":checked");
      if(isReviewActive) {
        self._cacheElement.editorDiv.removeClass('col-sm-6').addClass('col-sm-12');
        self._cacheElement.previewDiv.removeClass('col-sm-6').addClass('col-sm-12');
        self._cacheElement.previewDiv.hide();
      } else {
        self._cacheElement.editorDiv.removeClass('col-sm-12').addClass('col-sm-6');
        self._cacheElement.previewDiv.removeClass('col-sm-12').addClass('col-sm-6');
        self._cacheElement.previewDiv.show();
      }
    });
  },

  addNewPreviewTab : function() {
    var self = this;
    self._cacheElement.addPreviewBtn.click(function() {
        var tabsCnt = $(self._cacheElement.previewNewTab).length + 1;

        $("div.previewTabs ul").append(
            "<li><a href='#tab" + tabsCnt + "'>#" + tabsCnt + "</a></li>"
        );
      $("div.previewTabs").append(
            "<div id='tab" + tabsCnt + "'>#" + tabsCnt + "</div>"
        );
        $("div.previewTabs").tabs("refresh");
    });
  }
});

/** @class editor.html Page의 좌측 side menu 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 side menu를 제어하기 위한 클래스
*/
var EditorAppSideContentView = Class.extend({
  init : function() {
    this.setEventListener();
  },

  setEventListener : function() {
    this.toggleSideMenu();
  },

  toggleSideMenu : function() {
    var $body = $('body')[0],
      $menu_trigger = $('.menu-trigger'),
      common = new Common();

    if (common.isUsableElement($menu_trigger)) {
      $menu_trigger.on('click', function() {
        $body.className = ( $body.className == 'menu-active' )? '' : 'menu-active';
      });
    }
  }
});

/** @class editor.html editor 클래스
* @auther EnterKey
* @version 1
* @description 글 쓰기 Editor 클래스
*/
var EditorModel = Class.extend({
  ajaxURL : {
    document : {
      get_content : "/ajax/document/get_content",
      insert : "/ajax/document/insert",
      update : "/ajax/document/update",
    },
    category : {
      getCatagory : "/ajax/category/get_list"
    }
  },

  _data : {
    categoryList : null
  },

  _cacheElement : {
    editorDiv               : $('#editor'),

  },

  editor : null,

  init : function() {
    this.initEditor();
    this.loadData();
  },

  initEditor : function() {
    this.editor = CKEDITOR;
    this.editor.replace('editor1', {
      height : '500px'
    });
  },

  loadData : function(){
    this.loadEditorData();
    this.loadCategoryData();
  },

  loadEditorData : function() {
    var self = this;
    if(self._cacheElement.editorDiv.data('state') == 'edit'){
      var postData = {
        docsInfo: {
          filename: self._cacheElement.editorDiv.data('filename')
        }
      };

      $.post(self._ajaxURL.document.get_content, postData, function(result){
        if(result.status){
          self.setEditorData(result.data);
        }else{
          alert(result.errorMsg);
        }
      });
    }
  },

  loadCategoryData : function() {
    var self = this;
    $.post(self._ajaxURL.category.getCatagory, function(result){
      if(result.status){
        self._data.categoryList = result.data.categoryList;
        self.viewCategoryList(result.data.categoryList);
      }else{
        alert(result.errorMsg);
      }
    });
  }
});

/** @class editor.html Preview Division에 보여지는 Bookmark의 클래스
* @auther EnterKey
* @version 1
* @description Preview Division에 보여지는 Bookmark의 info 클래스
*/
var BookmarkModel = Class.extend({
  _ajaxURL : {
    get_tree : "/ajax/bookmark/get_tree"
  },

  _templete : {
    previewTabHeader : '<li><a href="{{tabID}}">{{tabTitle}}</a></li>',
    previewTabContent : '<div class="preview-content" id="{{tabID}}"><iframe class="preview-iframe" src="{{contentURL}}"></iframe></div>'
  },

  _data : {
    treeData : null
  },

  init : function() {
    loadData();
  },

  loadData : function(){
    loadTreeData();
  }

  loadTreeData : function(){
    var self = this;

    $.post(self._ajaxURL.get_tree, function(result){
      self._data.treeData = result;
      self.makeBookmarkTreeView(result.data);
    });
  }

});

var editorAppController = new EditorAppController();
