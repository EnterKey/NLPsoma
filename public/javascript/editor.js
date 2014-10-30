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
	editorAppMainContentView : null,
	editorAppSideContentView : null,

	init : function() {
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
		categoryList : null,
		previewList : null
	},

	bookmarkData : {
		ajaxURL : {
			get_tree : "/ajax/bookmark/get_tree"
		},
		templete : {
			previewList : '<li><a href="{{tabID}}"><div class="preview-list">{{header}}{{content}}</div></a></li>',
			previewHeader : '<div class="preview-content-header"><div class="preview-content-title ellipsis" data-index="{{index}}" data-previewindex="{{previewIndex}}">{{title}}</div><div class="editor_paste" ></div></div>',
			previewContent : '<div class="preview-content" id="{{tabID}}"><textarea>{{content}}</textarea></div>',
			previewPage : '<div class="panel-heading">{{title}}<a class="preview-page-close glyphicon glyphicon-remove" style="float:right;color:black"></a></div>' +
                            '<div class="panel-body preview-page">' +
                                '<div class="preview-body">{{previewtext}}</div>' +

                                '<form class="form-inline translate-btn-group-wrapper" role="form">' +
                                    '<div class="row translate-btn-group">' +
                                        '<div class="form-group">' +
                                            '<label class="sr-only" for="originalLang">sourceLang</label>' +
                                                '<select id="originalLang" class="form-control">' +
                                                '<option selected value="">자동인식</option><option value="ko">한국어</option><option value="en">English</option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Azerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bs">Bosnian</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="ceb">Cebuano</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="eo">Esperanto</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hmn">Hmong</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="jw">Javanese</option><option value="kn">Kannada</option><option value="km">Khmer</option><option value="lo">Lao</option><option value="la">Latin</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="mt">Maltese</option><option value="mr">Marathi</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="vi">Vietnamese</option></select>' +
                                        '</div>' +
                                    '에서' +
                                        '<div class="form-group">' +
                                            '<label class="sr-only" for="targetLang">targetLang</label>' +
                                            '<select id="targetLang" class="form-control">' +
                                            '<option selected value="ko">한국어</option><option value="en">English</option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Azerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bs">Bosnian</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="ceb">Cebuano</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="eo">Esperanto</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hmn">Hmong</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="jw">Javanese</option><option value="kn">Kannada</option><option value="km">Khmer</option><option value="lo">Lao</option><option value="la">Latin</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="mt">Maltese</option><option value="mr">Marathi</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="vi">Vietnamese</option></select>' +
                                            '</select>' +
                                        '</div>' +
                                    '로' +
                                        '<div class="form-group">' +
                                            '<button class="btn btn-primary" id="translate-btn">번역</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</form>' +

                                '<div class="translateResultWrapper">' +
                                    '<h3>번역 결과</h3>' +
                                    '<pre class="translateResult" ></pre>' +
                                '</div>' +
                            '</div>'
		},
		treeData : {
			pageDir : [],
			pageEntry : []
		},
		checkedList : []
	},

	pageData : {
		snaptextData : [],
		flagCount : 0,
		ajaxURL : {
			snaptext : "/snaptext/{{hashURL}}"
		}
	},

	_cacheElement : {
		writingDocumentTitle 		: $('#writing_title'),
		writingDocumentCategory 	: $('#writing_category'),
		titleOfToggleModal 			: $('#modal-title'),
		categoryOfToggleModal 		: $('#modal-category'),
		editorDiv 					: $('#editor'),
		previewDiv 					: $('#preview'),
		modalForChangeDocumentTitle : $('#modal-edit-writing'),
		previewNewTab 				: 'div.previewTabs ul li',
		viewPreviewBtn 				: $('#view-preview'),
		modalCategory 				: $('#modal-category')[0],
		previewTab 					: $('#tabs'),
		previewTabHeader 			: $('#previewTab-header')[0],
		previewTabContent 			: $('#previewTab-content')[0],
		previewTabHeight 			: '550px',
		jstree 						: $('#jstree')
	},

	init : function() {
		this.setEventListener();
		this.setEditor();
		this.initReviewTab();
		this.initModal();
		this.loadDocument();
		this.setTranslator();
		this.htmlToPdf();
	},

	setEditor : function() {
		var editor = new Editor();
	},

	setTranslator : function() {
        var translate = new Translate();
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
	htmlToPdf : function() {
		var self = this;
		var postData = {
			
		};

		$('#html_to_pdf').on('click', function() {
			var editorIframe = $('#cke_1_contents iframe')[0];

			if (editorIframe) {
				var editorContent = editorIframe.contentWindow.document.body.innerHTML;
				postData.editorContent='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'+editorContent
				$.post("/htmltopdf",postData,function(data){
					alert(data)
					$("body").append("<iframe src='" + '/htmltopdf'+ "' style='display: none;' ></iframe>");
				})
			}
		});
	},
	saveDocumentContent : function() {
		var self = this;
		var postData = {
			docsInfo : {
				filename : null,
				category : null,
				bookmarks : [],
				content : null
			}
		};

		$('#save_writing_button').on('click', function() {
			var editorIframe = $('#cke_1_contents iframe')[0];

			if (editorIframe) {
				var editorContent = editorIframe.contentWindow.document.body.innerHTML;
				postData.docsInfo.filename = self._cacheElement.writingDocumentTitle.html();
				postData.docsInfo.category = self._cacheElement.writingDocumentCategory.html();
				postData.docsInfo.content = editorContent;

				if (self._cacheElement.editorDiv.data('state') == 'edit') {
					$.post(self.editorData.ajaxURL.document.update, postData, self.ajaxSaveHandler);
				} else {
					$.post(self.editorData.ajaxURL.document.insert, postData, self.ajaxSaveHandler);
				}
			}
		});
	},

	ajaxSaveHandler : function(result) {
		if (result.status) {
			alert("Success");
			if (self._cacheElement.editorDiv.data('state') == 'new')
				self._cacheElement.editorDiv.data('state', 'edit');
		} else {
			alert(result.errorMsg);
		}
	},

	setEditorData : function(data) {
		var self = this;

		self._cacheElement.writingDocumentTitle.html(data.filename);
		self._cacheElement.writingDocumentCategory.html(data.category);
		CKEDITOR.instances.editor1.setData(data.content);

	},

	addEditorData : function(data) {
		var self = this;

		var original = CKEDITOR.instances.editor1.getData();
		var original = CKEDITOR.instances.editor1.setData(original + data);

	},

	getPreviewData : function(previewList, callback){
		var self = this;
		var hashURL = this.pageData.ajaxURL.snaptext;
		this.pageData.snaptextData = [];
		this.pageData.flagCount = 0;

		for ( i = 0; i < previewList.length; i++) {
			var requestURL = hashURL.replace("{{hashURL}}", previewList[i].pageEntry.hashurl);
			this.getSnapText(requestURL, i, previewList.length, callback);
		}
	},

	getSnapText : function(requestURL, index, length, callback){
		var self = this;

		$.get(requestURL, function(result){
			self.pageData.snaptextData[index] = result;
			self.pageData.flagCount++;
			if(self.pageData.flagCount = length-1){
				callback();
			}
		})
	},

	setPreviewData : function(previewList) {
		var self = this;
		var listDOM = "";
		var headerDOM = "";
		var contentDOM = "";

		var ListTemplete = this.bookmarkData.templete.previewList;
		var headerTemplete = this.bookmarkData.templete.previewHeader;
		var contentTemplete = this.bookmarkData.templete.previewContent;

		var pageContent = this.pageData.snaptextData;

		var i = 0;
		for ( i = 0; i < previewList.length; i++) {
			var tabID = 'preview-content-' + (i + 1);
			var contentURL = "/snaptext/" + previewList[i].pageEntry.hashurl;
			contentDOM = contentTemplete.replace('{{tabID}}', '#' + tabID).replace('{{content}}', pageContent[i]);
			headerDOM = headerTemplete.replace('{{title}}', previewList[i].pageEntry.title).replace('{{index}}', previewList[i].index).replace('{{previewIndex}}', i);
			listDOM += ListTemplete.replace("{{content}}", contentDOM).replace('{{tabID}}', '#' + tabID).replace('{{header}}', headerDOM);
		}

		$('.slidebar-previewList')[0].innerHTML = listDOM;

		$('.preview-content-title').on('click', function() {
			var target = $(this);
			var index = target.data('index');
			var previewIndex = target.data('previewindex');
			self.setPreviewPage(index, previewIndex);
		});

		$(".editor_paste").on('click', function(e) {
			self.addEditorData($(this).parent().find("textarea").text())
		});
	},

	setPreviewPage : function(index, previewIndex) {

		var pageEntry = this.bookmarkData.treeData.pageEntry;
		var pageContent = this.pageData.snaptextData;
		console.log(pageEntry, index, previewIndex);

		var contentURL = "/snaptext/" + pageEntry[index].hashurl;
		var previewPageDOM = "";

		previewPageDOM = this.bookmarkData.templete.previewPage.replace('{{title}}', pageEntry[index].title).replace('{{previewtext}}', pageContent[previewIndex]);

		$('#previewPage')[0].innerHTML = previewPageDOM;
		$('#preview-container').css('display', 'block');

		$('.preview-page-close').on('click', function() {
			$('#preview-container').css('display', 'none');
		})
	},

	initModal : function() {
		var self = this;
		$.post(self.editorData.ajaxURL.category.getCatagory, function(result) {
			if (result.status) {
				self.editorData.categoryList = result.data.categoryList;
				self.setCategoryList(result.data.categoryList);
			} else {
				alert(result.errorMsg);
			}
		});
	},

	setCategoryList : function(categoryList) {
		var DOM = "";
		var options = "<option value='{{category}}'>{{category}}</option>";
		var i;
		for ( i = 0; i < categoryList.length; i++) {
			DOM += options.replace(/{{category}}/g, categoryList[i]);
		}
		this._cacheElement.modalCategory.innerHTML = DOM;
	},

	loadDocument : function() {

		this.loadEditorData();
		this.loadBookmarkData();
		this.loadPageData();

	},

	loadEditorData : function() {
		var self = this;
		if (self._cacheElement.editorDiv.data('state') == 'edit') {
			var postData = {
				docsInfo : {
					filename : self._cacheElement.editorDiv.data('filename')
				}
			};

			$.post(self.editorData.ajaxURL.document.get_content, postData, function(result) {
				if (result.status) {
					self.setEditorData(result.data);
				} else {
					alert(result.errorMsg);
				}
			});
		}
	},

	loadBookmarkData : function() {
		var self = this;

		$.post(self.bookmarkData.ajaxURL.get_tree, function(result) {
			self.bookmarkData.treeData = result.data;
			self.makeBookmarkTreeView(result.data);
		})
	},

	loadPageData : function() {
		var self = this;
	},

	makeBookmarkTreeView : function(data) {
		var self = this;
		var pageEntry = data.pageEntry;
		var pageDir = data.pageDir;
		var ul_template = "<ul>{{ul_content/}}</ul>"
		var li_template_file = "<li data-jstree='{\"icon\":\"/images/bookmark.png\"}' data-index='{{li_index}}' data-hashurl='{{li_hashurl}}'>{{li_content}}</li>"
		var li_template_dir = "<li data-path='{{li_path}}'>{{li_content}}</li>"
		var treeview_string;

		var is_dir_exist = function(name, check_string) {
			return check_string.indexOf(name) >= 0 ? true : false;
		}
		var add_li_file = function(file_data, original_string, index) {
			var new_string = original_string.replace("{{ul_content" + file_data.path + "}}", li_template_file + "{{ul_content" + file_data.path + "}}")
			new_string = new_string.replace(/{{li_hashurl}}/g, file_data.hashurl);
			new_string = new_string.replace(/{{li_index}}/g, index);
			new_string = new_string.replace(/{{li_content}}/g, file_data.title);
			return new_string
		}
		var add_li_dir = function(dir_data, original_string) {
			var new_string = original_string.replace("{{ul_content" + dir_data.path + "}}", li_template_dir + "{{ul_content" + dir_data.path + "}}")
			new_string = new_string.replace(/{{li_path}}/g, dir_data.path)
			new_string = new_string.replace(/{{li_content}}/g, dir_data.name + ul_template.replace("{{ul_content/}}", "{{ul_content" + dir_data.path + dir_data.name + "/" + "}}"));
			return new_string
		}
		treeview_string = ul_template;

		pageDir.forEach(function(page_dir_element) {
			var split_data = page_dir_element.path.split("/")
			if (split_data > 1) {
				var concat_data = "/"
				split_data.forEach(function(split_elem) {
					if (split_elem != "") {
						concat_data += split_elem + "/"
						if (!is_dir_exist(concat_data, treeview_string)) {
							treeview_string = add_li_dir(page_dir_element, concat_data, treeview_string)
						}
					}
				})
			} else {
				treeview_string = add_li_dir(page_dir_element, treeview_string)
			}
		})

		pageEntry.forEach(function(page_entry_element, index) {
			treeview_string = add_li_file(page_entry_element, treeview_string, index)
		});

		treeview_string = treeview_string.replace(/"<ul><\/ul>"/g, "")
		treeview_string = treeview_string.replace(/{{ul_content[a-zA-Z0-9\/\_\-]*}}/g, "")

		this._cacheElement.jstree.append(treeview_string);
		this._cacheElement.jstree.jstree({
			"core" : {
				// so that create works
				"check_callback" : true
			},
			"checkbox" : {
				"keep_selected_style" : false
			},
			"plugins" : ["checkbox", "contextmenu", "dnd"]
		});

		$(".jstree-icon.jstree-themeicon.jstree-themeicon-custom").css("background-size", "contain")
		this._cacheElement.jstree.on("changed.jstree", function(e, data) {
			$(".jstree-icon.jstree-themeicon.jstree-themeicon-custom").css("background-size", "contain")
			self.setPreviewList(self._cacheElement.jstree.jstree("get_checked",true));
		});
	},

	setPreviewList : function(data) {

		var i;
		var checkedList = [];
		for ( i = 0; i < data.length; i++) {
			var index = data[i].data.index;
			if (index != undefined)
				checkedList.push(index);
		}

		this.bookmarkData.checkedList = checkedList;
	},

	toggleReviewDivision : function() {
		var self = this;
		$('#toggle_preview_btn').on('click', function() {
			var isReviewActive = $("input:checkbox[id='toggle_preview']").is(":checked");
			if (isReviewActive) {
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
		this._cacheElement.previewTab.tabs();
		this._cacheElement.previewTab.height(this._cacheElement.previewTabHeight);
		this._cacheElement.previewTab.hide();
	},

	addNewPreviewTab : function() {

		var self = this;

		self._cacheElement.viewPreviewBtn.on('click', function(e) {

			e.preventDefault();

			var previewList = [];
			var checkedList = self.bookmarkData.checkedList;
			var pageEntry = self.bookmarkData.treeData.pageEntry;

			if(checkedList.length == 0)
				return;

			for ( i = 0; i < checkedList.length; i++) {
				previewList.push({
					pageEntry : pageEntry[checkedList[i]],
					index : checkedList[i]
				});
			}

			self.getPreviewData(previewList, function(){
				self.setPreviewData(previewList);
			});

			$("#wrapper").removeClass("toggled");
		});

		$('#page-content-wrapper').on('click', function() {
			if ($('#preview-container').css('display') == 'none') {
				$("#wrapper").addClass("toggled");
			}
		})
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
		var $body = $('body')[0], $menu_trigger = $('.menu-trigger'), common = new Common();

		if (common.isUsableElement($menu_trigger)) {
			$menu_trigger.on('click', function() {
				$body.className = ($body.className == 'menu-active' ) ? '' : 'menu-active';
			});
		}
	}
});

/** @class editor.html editor 클래스
 * @auther EnterKey
 * @version 1
 * @description 글 쓰기 Editor 클래스
 */
// cf. http://www.autoboy.pe.kr/130
var Editor = Class.extend({
	init : function() {
		CKEDITOR.replace('editor1', {
			height : '500px',
			filebrowserImageUploadUrl: "imageUpload"
		});
	}
});

/** @class editor.html Preview Division에 보여지는 Bookmark의 info 클래스
 * @auther EnterKey
 * @version 1
 * @description Preview Division에 보여지는 Bookmark의 info 클래스
 */
var BookmarkInfo = Class.extend({
	init : function() {
	}
});

/** @class editor.html Preview Division에 보여지는 번역기 클래스
 * @auther EnterKey
 * @version 1
 * @description Preview Division에 보여지는 번역기 클래스
 */
var Translate = Class.extend({
    data : {
        isCORSSupport : 'withCredentials' in new XMLHttpRequest(),
        isIE : typeof XDomainRequest !== "undefined",
        xdr : null,
        interBuffer : [],
        finalBuffer : [],
        bufCnt : 0,
        message : {
            text : null,
            originalLang : null,
            targetlang : null
        }
    },

    _cachedElement : {
        translateViewHeight : '225',
        bookmarkPreviewHeight : '520'
    },

    init : function() {
        this.setEventListener();
    },

    setEventListener : function() {
        this.toggleTranslateWindow();
        this.action();
    },

    dataInit : function() {
        for(var obj in this.data) {
            obj = null;
        }
    },

    toggleTranslateWindow : function() {
        var self = this;
        $('.previewTabs').on('click', 'li', function() {
            $(".translateResult").text("");
            $('.ui-tabs-panel').css('height', self._cachedElement.bookmarkPreviewHeight);
            $('.translateResultWrapper').css('display', 'none');
        });
    },

    action : function() {
        var self = this;

        $('body').on('click', '#translate-btn' ,function(e){
            e.preventDefault();
            var translateForContent = $('.preview-body');

            self.dataInit();

            $('.preview-body').css('height', self._cachedElement.translateViewHeight);
            $('.translateResultWrapper').css('display', 'block');

            self.data.message = {
                text: translateForContent,
                originalLang: $("#originalLang").val(),
                targetlang: $("#targetLang").val()
            };

            self.getJSON(self.setQueryString(self.data.message), self.translateDirectLang);
        });
    },

    getJSON : function(query, callback) {
        if (this.data.isCORSSupport) {
            $.getJSON(query, callback);
        } else if (this.data.isIE) {
            this.data.xdr = new XDomainRequest();
            if (this.data.xdr) {
                this.data.xdr.onload = callback;
                this.data.xdr.open("get", query);
                this.data.xdr.send();
            }
        } else {
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                url: query,
                success: callback
            });
        }
    },

    setQueryString : function(message) {
        var result = "http://goxcors.appspot.com/cors?method=GET" +
            "&url=" + encodeURIComponent("http://translate.google.com/translate_a/t?client=x" +
            "&sl=" + message.originalLang + "&tl=" + message.targetlang+
            "&text=" + encodeURIComponent(message.text));
        return result;
    },

    extractResult : function(data) {
        if (!this.data.isCORSSupport && this.data.isIE) {
            data = $.parseJSON(data.responseText);
        }
        return data && data.sentences && $.map(data.sentences, (function(v) { return v.trans }));
    },

    translateDirectLang : function(data) {
        var self = Translate.prototype;
        var post = self.extractResult(data).join('');

        $('.translateResult').text("");
        $(".translateResult").text(post);
    }
});


// 작업이 안되서 묶어 놓음
$().ready(function() {
    $("#targetLang").val(navigator.userLanguage || navigator.language || "ko");
});

var editorAppController = new EditorAppController();
