/** @class document.html Page의 Controller
* @auther EnterKey
* @version 1
* @constructor 뷰 import후 생성
* @description View를 import하고 init 하기 위한 클래스 
*/
var DocumentAppController = Class.extend({
	
	/**
	 * DocumentAppController 초기화 메소드
	 * @param {void}
	 * @returns {void}
	 * @auther EnterKey
	 * @version 1
	 */
	init: function() {
		var documentAppMainContentView = new DocumentAppMainContentView();
		var documentAppCategoryView = new DocumentAppCategoryView();
	}
});

/** @class document.html Document List 관련 뷰 클래스 
* @auther EnterKey
* @version 1
* @description Page의 우측에 작성된 글 목록 관련 뷰를 제어하기 위한 클래스
* */
var DocumentAppMainContentView = Class.extend({
	init : function() { }
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
        sideMenu 					: '.document-sidebar-category'
	},
	
	init : function() {
		this.setEventListener();
	},
	
	setEventListener : function() {
		this.setClickedCategoryAddActiveClass();
		this.addCategory();
	},
	
	setClickedCategoryAddActiveClass : function() {
		var self = this;
		$(self._cacheElement.sideMenu).on('click', 'li', function(e) {
			$(self._cacheElement.sideMenu).children().removeClass('document-active');
			$(this).addClass('document-active');
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
            var categoryName = $(self._cacheElement.titleOfModalForAddCategory).val(),
                appendItem = '<li style="text-align: right;"><a href="#">' + categoryName + '</a></li>';

			$(self._cacheElement.sideMenu).append(appendItem);
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