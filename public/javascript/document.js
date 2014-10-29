/**
 * @author dooseong, eom
 */

/** @class document.html Page의 Controller
* @auther EnterKey
* @version 1
* @constructor 뷰 import후 생성
* @description View를 import하고 init 하기 위한 클래스
*/
var DocumentAppController = Class.extend({
	documentAppMainContentView : null,
	documentAppCategoryView : null,

	/**
	 * DocumentAppController 초기화 메소드
	 * @param {void}
	 * @returns {void}
	 * @auther EnterKey
	 * @version 1
	 */
	init: function() {
		this.documentAppMainContentView = new DocumentAppMainContentView();
		this.documentAppCategoryView = new DocumentAppCategoryView();

		this.documentAppMainContentView._categoryApp = this.documentAppCategoryView;
		this.documentAppCategoryView._documentApp = this.documentAppMainContentView;
	}
});

/** @class document.html Document List 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 우측에 작성된 글 목록 관련 뷰를 제어하기 위한 클래스
* */
var DocumentAppMainContentView = Class.extend({
	_categoryApp : null,

	_cacheElement : {
		documentMainContentTableWrapper : '.document-container-tableWrapper',
		documentMainContentTableWrapperInList : '.document-container-tableWrapper-ul',
		documentShowMoreBtn : $('#show-more-group')
	},

	_data : {
		category : 'All',
		documentIndex : 0,
		documentGetListURL : "/ajax/document/get_list",
		documentList : []
	},

	init : function() {
		this.setEventListener();
		this.getDocumentList(this._data.category);
	},

	setValue : function(target, value){
		this._data[target] = value;
	},

	getValue : function(target){
		return this._data[target];
	},

	setEventListener : function() {
		this.showMoreBtn();
	},

	showMoreBtn : function() {
		var self = this;
		this._cacheElement.documentShowMoreBtn.on('click', function(){
			self.getDocumentList();
		})
	},

	setDocumentListData : function(data){
		var self = this;
		this._data.documentList = this._data.documentList .concat(data.docsList);
		this.bulidDocumentListForMainContent(data.docsList);
	},

	getDocumentList : function() {
		var self = this;
		var index = this._data.documentIndex;
		var postData = {
			category : this._data.category,
			index : index
		};

		$.post(this._data.documentGetListURL, postData, function(result) {
			if(result.status){
				if(index == 0 && result.data.docsList.length < 24){
					self._cacheElement.documentShowMoreBtn.css('display', 'none');
				}else if(result.data.docsList.length < 8){
					self._cacheElement.documentShowMoreBtn.css('display', 'none');
				}
				self._data.documentIndex += result.data.docsList.length;
				self.setDocumentListData(result.data);
			}else{
				alert(result.errorMsg);
			}
		});
	},

	bulidDocumentListForMainContent : function(docsList) {
		var documentList = docsList,
			documentListLength = documentList.length,
			documentItem = "";

		for(var i = 0 ; i < documentListLength ; i++ ) {
			var documentTitle = documentList[i].filename,
				documentDate = documentList[i].updateDate.slice(0,10),
				documentImg = '/images/document/document.png';
				documentCategory =  documentList[i].category;
				documentItem +=
					'<li class="list-item col-xs-6 col-sm-3 col-md-2 docs-category docs-category-'+documentCategory+'">' +
						'<a href="/editor/'+documentTitle+'">' +
							'<div class="thum-div"  data-toggle="tooltip" title data-original-title="tooltip" data-placement="top">' +
								'<img class="thum" src= ' + documentImg + ' style="vertical-align: middle;"/>' +
							'</div>' +
							'<div class="info-div">' +
								'<div class="title" data-toggle="tooltip" title data-original-title="타이틀" data-placement="top">' +
									documentTitle +
								'</div>' +
								'<div class="info">' +
									'<span class="date left">' + documentDate + '</span>' +
								'</div>' +
							'</div>' +
						'</a>' +
					'</li>';
		}

		$(this._cacheElement.documentMainContentTableWrapperInList).append(documentItem);
	},

	documentListClear : function(){
		$(this._cacheElement.documentMainContentTableWrapperInList)[0].innerHTML = "";
	}
});

/** @class document.html Category List 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 좌측 카테고리 메뉴 관련 뷰를 제어하기 위한 클래스
* */
var DocumentAppCategoryView = Class.extend({
	_documentApp : null,
	_cacheElement : {
		addCategoryBtn 				: '#add-category',
		addCategoryDoneBtn 			: '#add-categoty-btn-done',
		editCategoryDoneBtn 			: '#edit-categoty-btn-done',
        modalForAddCategory 		: '#modal-add-category',
				modalForEditCategory 		: '#modal-edit-category',
        titleOfModalForAddCategory 	: '#add-category-modal-title',
        titleOfModalForEditCategory : '#edit-category-modal-title',
        sideMenu 					: '.document-sidebar-category',
        categoryItemConfigBtn 		: '#category-item-config',
    	modalForModifyCategoryItem 	: '#modalForModifyCategoryItem'
	},
	_template : {
		category :
		'<li class="category-item" data-name={{category}} style="text-align: left;">' +
			'<div class="btn-group right category-item-config">' +
				'<a class="right category-li-menu-hide dropdown-toggle" data-toggle="dropdown" href="#">' +
			    '<span class="glyphicon glyphicon-cog"></span>' +
				'</a>' +
	      '<ul class="dropdown-menu" role="menu">' +
	        '<li data-name={{category}}><a href="#" class="category-item-rename">Rename</a></li>' +
	        '<li data-name={{category}}><a href="#" class="category-item-delete">Delete</a></li>' +
	      '</ul>' +
      '</div>' +
			'<a href="#" class="category-name"> {{category}} </a>' +
		'</li>'
	},

	_data : {
		getCategory : "/ajax/category/get_list",
		addCategory : "/ajax/category/insert",
		updateCategory : "/ajax/category/update",
		removeCategory :"/ajax/category/remove",
		categoryList : null
	},

	init : function() {
		this.setEventListener();
		this.getCategoryList();
	},

	setEventListener : function() {
		this.setClickedCategoryAddActiveClass();
		this.addCategory();
		this.renameCategory();
		this.deleteCategory();
	},

	setCategoryListData : function(data){
		this._data.categoryList = data.categoryList;
		this.bulidCategoryListForSideMenu();
	},

	setClickedCategoryAddActiveClass : function() {
		var self = this;
		$(self._cacheElement.sideMenu).on('click', '.category-item', function(e) {
			$(self._cacheElement.sideMenu).children().removeClass('document-active');
			$('.category-li-menu-show').removeClass('category-li-menu-show').addClass('category-li-menu-hide');
			$(this).addClass('document-active');
			$(this).find('a').eq(0).removeClass('category-li-menu-hide').addClass('category-li-menu-show');

			self.getDocsListwithCategory($(this).data('name'));
		});
	},

	addCategory : function() {
    var self = this;
		$(this._cacheElement.addCategoryBtn).on('click', function(e) {
			e.preventDefault();
			$(self._cacheElement.modalForAddCategory).modal('toggle');
			$(self._cacheElement.titleOfModalForAddCategory).val('');
		});

		$(this._cacheElement.addCategoryDoneBtn).on('click', function(e) {
      var categoryName = $(self._cacheElement.titleOfModalForAddCategory).val();
      var postData = {
      	newCategory : categoryName
      }
			$.post(self._data.addCategory, postData, function(result){
				if(result.status){
					self.addCategoryListDOM(categoryName);
				}else{
					alert(result.errorMsg);
				}
			})
		});
	},

	renameCategory : function() {
		var self = this;
		var originName = "";

		$(self._cacheElement.sideMenu).on('click', '.category-item-rename', function(e) {
			e.preventDefault();
			var name = $(this).parent().data('name');
			originName = name
			$(self._cacheElement.modalForEditCategory).modal('toggle');
			$(self._cacheElement.titleOfModalForEditCategory).val(name);
			$(self._cacheElement.titleOfModalForEditCategory).text(name);
		});

		$(this._cacheElement.editCategoryDoneBtn).on('click', function(e) {
      var categoryName = $(self._cacheElement.titleOfModalForEditCategory).val();
      var postData = {
      	oldCategory : originName,
      	newCategory : categoryName
      }
      console.log(postData);
			$.post(self._data.updateCategory, postData, function(result){
				if(result.status){
					self.setCategoryListData(result.data);
				}else{
					alert(result.errorMsg);
				}
			})
		});
	},

	deleteCategory : function() {
		var self = this;
		$(self._cacheElement.sideMenu).on('click', '.category-item-delete', function(e) {
			e.preventDefault();
			var categoryName = $(this).parent().data('name');
      var postData = {
      	deleteCategory : categoryName
      }
			$.post(self._data.removeCategory, postData, function(result){
				if(result.status){
					self.getCategoryList();
				}else{
					alert(result.errorMsg);
				}
			})
		});
	},

	getDocsListwithCategory : function(category) {
		this._documentApp.setValue('category', category);
		this._documentApp.setValue('documentIndex', 0);
		this._documentApp.documentListClear();
		this._documentApp.getDocumentList();
	},

	addCategoryListDOM : function(categoryName) {
    var appendItem = this._template.category.replace(/{{category}}/g, categoryName);

		$(this._cacheElement.sideMenu).append(appendItem);
	},

	getCategoryList : function() {

		var self = this;
		$.post(this._data.getCategory ,function(result) {
			if(result.status){
				self.setCategoryListData(result.data);
			}else{
				alert(result.errorMsg);
			}
		});
	},

	bulidCategoryListForSideMenu : function() {
		var categoryList = this._data.categoryList,
			categoryListLength = categoryList.length,
			category = "",
			categoryItem = "";

		for(var i = 0 ; i < categoryListLength ; i++ ) {
			category = categoryList[i];
			categoryItem += this._template.category.replace(/{{category}}/g, category);
		}

		$(this._cacheElement.sideMenu)[0].innerHTML = categoryItem;
		$(this._cacheElement.sideMenu).find('.category-item').eq(0).addClass('document-active');
		$('.document-active').find('a').eq(0).removeClass('category-li-menu-hide').addClass('category-li-menu-show');
	}
});

/** @class document.html 작성 글 클래스
* @auther EnterKey
* @version 1
* @description 메인 화면에 보여지는 글 객체
* */
var Document = Class.extend({
	init : function(id, title, date) {
		this.id = id,
		this.title = title,
		this.date = date;
	},

	setDocumentInfo : function(id, title, date) {
		this.id = id,
		this.title = title,
		this.date = date;
	},

	getDocumentInfo : function() {
		var result = {
			id : this.id,
			title : this.title,
			date : this.date
		};

		return result;
	}
});

/** @class document.html Category 클래스
* @auther EnterKey
* @version 1
* @description 좌측에 보여지는 Category 클래스
* */
var Category = Class.extend({
	init : function(name) {
		this.name = name;
	},

	setCategoryName : function(name) {
		this.name = name;
	},

	getCategoryName : function() {
		return this.name;
	}
});

var documentAppController = new DocumentAppController();
