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
	editorAppMainContentView: null,
	editorAppSideContentView : null,

	init: function() {
		this.editorAppMainContentView = new EditorAppMainContentView();
		this.editorAppSideContentView = new EditorAppSideContentView();
	}
});

/** @class editor.html Page의 Editor와 Preview 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 Editor와 Preview Division을 제어하기 위한 클래스
*/
var EditorAppMainContentView = Class.extend({
	editorData : {
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
		categoryList : null
	},

	bookmarkData : {
		ajaxURL : {
			get_tree : "/ajax/bookmark/get_tree"
		},
		templete : {
			previewTabHeader : '<li><a href="{{tabID}}">{{tabTitle}}</a></li>',
			previewTabContent : '<div class="preview-content" id="{{tabID}}"><iframe class="preview-iframe" src="{{contentURL}}"></iframe></div>'
		},
		treeData : null
	},

	pageData : {
		ajaxURL : {

		}
	},

	_cacheElement : {
		writingDocumentTitle 		: $('#writing_title'),
		writingDocumentCategory : $('#writing_category'),
		titleOfToggleModal 			: $('#modal-title'),
		categoryOfToggleModal		: $('#modal-category'),
    editorDiv 							: $('#editor'),
    previewDiv 						: $('#preview'),
    modalForChangeDocumentTitle : $('#modal-edit-writing'),
    previewNewTab 				: 'div.previewTabs ul li',
    addPreviewBtn 				: $('button#add-preview-btn'),
    modalCategory 				: $('#modal-category')[0],
    previewTab 						: $('div.previewTabs')[0],
    previewTabHeader			: $('#previewTab-header')[0],
    previewTabContent			: $('#previewTab-content')[0],
    previewTabHeight 			: '550px'
	},

	init : function() {
		this.setEventListener();
		this.setEditor();
		this.initReviewTab();
		this.initModal();
		this.loadDocument();
	},

	setEditor : function() {
		var editor = new Editor();
	},

	setEventListener : function() {
		this.toggleModalForChangeDocumentTitle();
		this.changeDocumentTitle();
		this.saveDocumentContent();
		this.toggleReviewDivision();
		this.addNewPreviewTab();
	},

	toggleModalForChangeDocumentTitle : function() {
		var self = this;
		$(this._cacheElement.writingDocumentTitle).on('click', function() {
			var documentTitle = self._cacheElement.writingDocumentTitle.text();
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

	saveDocumentContent : function() {
		var self = this;
		var postData = {
			docsInfo: {
				filename: null,
				category: null,
				bookmarks: [],
				content : null
			}
		};

		$('#save_writing_button').on('click', function(){
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
		});
	},

	ajaxSaveHandler : function(result) {
		console.log(result);
		if(result.status){
			alert("Success");
			if(self._cacheElement.editorDiv.data('state')=='new')
				self._cacheElement.editorDiv.data('state', 'edit');
		}else{
			alert(result.errorMsg);
		}
	},

	setEditorData : function(data){
		var self = this;

		self._cacheElement.writingDocumentTitle.html(data.filename);
		self._cacheElement.writingDocumentCategory.html(data.category);
		CKEDITOR.instances.editor1.setData(data.content);

	},

	setPreviewData : function(previewList){
		var headerDOM = "";
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

		this._cacheElement.previewTabContent.height(previewHeight);

	},

	initModal : function(){
		var self = this;
		$.post(self.editorData.ajaxURL.category.getCatagory, function(result){
			if(result.status){
				self.editorData.categoryList = result.data.categoryList;
				self.setCategoryList(result.data.categoryList);
			}else{
				alert(result.errorMsg);
			}
		});
	},

	setCategoryList : function(categoryList){
		var DOM = "";
		var options = "<option value='{{category}}'>{{category}}</option>";
		var i;
		for(i=0;i<categoryList.length;i++){
			DOM+=options.replace(/{{category}}/g, categoryList[i]);
		}
		this._cacheElement.modalCategory.innerHTML = DOM;
	},

	loadDocument : function(){

		this.loadEditorData();
		this.loadBookmarkData();
		this.loadPageData();

	},

	loadEditorData : function(){
		var self = this;
		if(self._cacheElement.editorDiv.data('state') == 'edit'){
			var postData = {
				docsInfo: {
					filename: self._cacheElement.editorDiv.data('filename')
				}
			};

			$.post(self.editorData.ajaxURL.document.get_content, postData, function(result){
				if(result.status){
					self.setEditorData(result.data);
				}else{
					alert(result.errorMsg);
				}
			});
		}
	},

	makeBookmarkTreeView: function(data){
		/*
		data.pageData[]
		data.pageDir[]
		path

		*/

	},

	loadBookmarkData : function(){
		var self = this;

		$.post(self.bookmarkData.ajaxURL.get_tree, function(result){
			console.log(result);
			self.bookmarkData.treeData = result;
			self.makeBookmarkTreeView(result.data);
			// show mock Data
			self.setPreviewData(result.data.pageEntry);
		})
	},

	loadPageData : function(){
		var self = this;
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

	initReviewTab : function() {
		$("#tabs").tabs();
		$('#tabs').height(this._cacheElement.previewTabHeight);
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
var Editor = Class.extend({
	init : function() {
		CKEDITOR.replace('editor1', {
			height : '500px'
		});
	}
});

/** @class editor.html Preview Division에 보여지는 Bookmark의 info 클래스
* @auther EnterKey
* @version 1
* @description Preview Division에 보여지는 Bookmark의 info 클래스
*/
var BookmarkInfo = Class.extend({
	init : function() { }
});

var editorAppController = new EditorAppController();
