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
	}
});

/** @class document.html Document List 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 우측에 작성된 글 목록 관련 뷰를 제어하기 위한 클래스
* */
var DocumentAppMainContentView = Class.extend({
	_cacheElement : {
		documentMainContentTableWrapper : '.document-container-tableWrapper',
		documentMainContentTableWrapperInList : '.document-container-tableWrapper-ul',
	},

	requestData : {
		documentGetListURL : "/ajax/document/get_list",
		documentList : null
	},

	init : function() {
		this.getDocumentList();
	},

	setDocumentListData : function(data){
		var self = this;
		this.requestData.documentList = data.docsList;
		this.bulidDocumentListForMainContent();
	},

	getDocumentList : function() {
		var self = this;
		$.post(this.requestData.documentGetListURL ,function(result) {
			if(result.status){
				self.setDocumentListData(result.data);
			}else{
				alert(result.errorMsg);
			}
		});

		// this.requestData.documentList =	[
		// 	{
		// 		id: 1,
		// 		title : 'NodeJs',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 2,
		// 		title : 'MongoDB',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 3,
		// 		title : 'MySQL',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 4,
		// 		title : 'Javascript',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 5,
		// 		title : 'Test',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 6,
		// 		title : 'Example',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	},
		// 	{
		// 		id: 7,
		// 		title : 'Blabla',
		// 		date : '2014/8/28',
		// 		img : '/images/document/document.png'
		// 	}
		// ];

		// this.bulidDocumentListForMainContent();
	},

	bulidDocumentListForMainContent : function() {
		var documentList = this.requestData.documentList,
			documentListLength = documentList.length,
			documentItem = "";

		for(var i = 0 ; i < documentListLength ; i++ ) {
			var documentTitle = documentList[i].filename,
				documentDate = documentList[i].updateDate.slice(0,10),
				documentImg = '/images/document/document.png';
				documentCategory =  documentList[i].category;
				documentItem +=
					'<li class="list-item col-xs-12 col-sm-6 col-md-3 docs-category docs-category-'+documentCategory+'">' +
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
	}
});

/** @class document.html Category List 관련 뷰 클래스
* @auther EnterKey
* @version 1
* @description Page의 좌측 카테고리 메뉴 관련 뷰를 제어하기 위한 클래스
* */
var DocumentAppCategoryView = Class.extend({
	_cacheElement : {
		addCategoryBtn 				: '#add-category',
		addCategoryDoneBtn 			: '#add-categoty-btn-done',
        modalForAddCategory 		: '#modal-edit-category',
        titleOfModalForAddCategory 	: '#add-category-modal-title',
        sideMenu 					: '.document-sidebar-category',
        categoryItemConfigBtn 		: '#category-item-config',
    	modalForModifyCategoryItem 	: '#modalForModifyCategoryItem'
	},

	requestData : {
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
		this.toggleModalForChangeCategoryItemInfo();
	},

	setCategoryListData : function(data){
		this.requestData.categoryList = data.categoryList;
		this.bulidCategoryListForSideMenu();
	},

	setClickedCategoryAddActiveClass : function() {
		var self = this;
		$(self._cacheElement.sideMenu).on('click', 'li', function(e) {
			$(self._cacheElement.sideMenu).children().removeClass('document-active');
			$('.category-li-menu-show').addClass('category-li-menu-hide').removeClass('category-li-menu-show');
			$(this).addClass('document-active');
			$(this).find('a').eq(0).removeClass('category-li-menu-hide').addClass('category-li-menu-show');
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
			$.post(self.requestData.addCategory, postData, function(result){
				console.log(result);
				if(result.status){
					self.updateCategoryListDOM(categoryName);
				}else{
					alert(result.errorMsg);
				}
			})
		});
	},

	updateCategoryListDOM : function(categoryName) {
            var appendItem = '<li style="text-align: right;">' +
							'<a class="left category-li-menu-hide" href="#" id="category-item-config">' +
								'<span class="glyphicon glyphicon-cog"></span>' +
							'</a>' +
							'<a href="#"> ' + categoryName + '</a>' +
						'</li>';

		$(this._cacheElement.sideMenu).append(appendItem);
	},

	getCategoryList : function() {

		var self = this;
		$.post(this.requestData.getCategory ,function(result) {
			if(result.status){
				self.setCategoryListData(result.data);
			}else{
				alert(result.errorMsg);
			}
		});
	},

	bulidCategoryListForSideMenu : function() {
		var categoryList = this.requestData.categoryList,
			categoryListLength = categoryList.length,
			category = "",
			categoryItem = "";

		for(var i = 0 ; i < categoryListLength ; i++ ) {
			category = categoryList[i];
			categoryItem += '<li style="text-align: right;">' +
								'<a class="left category-li-menu-hide" href="#" id="category-item-config">' +
									'<span class="glyphicon glyphicon-cog" id="category-item-config"></span>' +
								'</a>' +
								'<a href="#"> ' + category + '</a>' +
							'</li>';
		}

		$(this._cacheElement.sideMenu).append(categoryItem);
		$(this._cacheElement.sideMenu).find('li').eq(0).addClass('document-active');
		$('.document-active').find('a').eq(0).removeClass('category-li-menu-hide').addClass('category-li-menu-show');
	},

	toggleModalForChangeCategoryItemInfo : function() {
		var self = this;
		$(self._cacheElement.sideMenu).on('click', '#category-item-config', function(e) {
			e.preventDefault();
			$(self._cacheElement.modalForModifyCategoryItem).modal('toggle');
		});
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