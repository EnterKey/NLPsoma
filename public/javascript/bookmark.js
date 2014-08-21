global_current_path="/"
function make_new_subfolder(jquery_obj,name){
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
		type:"POST",
		url:"/ajax/insert_pageDir",
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		data:params,
		success : function(data) {
			make_page_dir_list()
			make_page_all_list(path)
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}
function make_new_folder(jquery_obj,name){
	var path=global_current_path
	path=path&&path.trim()!="undefined"?path:"/"
	var params={
		dirInfo:{
			name:name,
			path:path
		}
	}
	$.ajax({
		type:"POST",
		url:"/ajax/insert_pageDir",
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		data:params,
		success : function(data) {
			make_page_dir_list()
			make_page_all_list(path)
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}

function rename_folder(data){

	var params={
		dirInfo:data.dirInfo
	}
	$.ajax({
		type:"POST",
		url:"/ajax/rename_pageDir",
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		data:params,
		success : function(data) {
			make_page_dir_list()
			make_page_all_list()
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}

function rename_file(data){

	var params={
		pageInfo:data.pageInfo
	}
	$.ajax({
		type:"POST",
		url:"/ajax/rename_pageEntry",
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		data:params,
		success : function() {
			make_page_all_list(data.pageInfo.path)
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}

function get_name_by_user(callback){
	$('body').append('<div class="user_name_input_div"><input id="user_name_input_text" type="search" class="user_name_input_text" autofocus></input></div>')
	document.getElementById("user_name_input_text").focus();
	$('.user_name_input_text').keydown(function(e){
        if(e.keyCode == 13){
        	var data=$('.user_name_input_text').val()
        	$('.user_name_input_div').remove()
        	var alphaExp = /^[a-zA-Z_-]+$/;
        	if(data.match(alphaExp))
          		callback(data);
          	else
          		alert("File name contains bad character")
        }
    });
}
function make_html_all_list(data) {
	if(data.status==0){
		alert('last folder');
		return;
	}
	data=data.data;

	$('.dir_with_file_elem').remove();
	var resultDir=data.pageDir;
	var resultEntry=data.pageEntry;
	var innerhtml_str="";
	resultDir.forEach(function(indata){
		innerhtml_str+="<li class='list-group-item droppable_forder dir_with_file_elem' style='color:gray;background-color:whitesmoke'>"+
            "<div class='row'>"+
              "<div class='col-sm-12'>"+
              	"<div>"+
                  "<span class='glyphicon glyphicon-folder-close'> </span>"+
                  "<a class='dir_with_file dir_share long_name_overflow' data-path='&&dirpath&&'>"+
                    "&&dirname&&"+
                  "</a>"+
            	"</div>"+
              "</div>"+
            "</div>"+
        "</li>";
        innerhtml_str=innerhtml_str.replace(/&&dirname&&/g,indata.name).replace(/&&dirpath&&/g,indata.path)
	})
	resultEntry.forEach(function(indata){
		innerhtml_str+="<li class='list-group-item draggable_file dir_with_file_elem' style='color:gray;background-color:whitesmoke'>"+
            "<div class='row'>"+
              "<div class='col-sm-4'>"+
                  "<span class='glyphicon glyphicon-file'> </span>"+
                  "<a class='file_a_tag_title long_name_overflow' href='&&entryurl&&' data-path='&&entrypath&&'>"+
                    "&&title&&"+
                  "</a>"+
              "</div>"+
              "<div class='col-sm-8'>"+
                  "<p class='file_a_tag long_name_overflow' href='&&entryurl&&' data-path='&&entrypath&&'>"+
                    "&&content&&"+
                  "</p>"+
              "</div>"+
            "</div>"+
        "</li>";
        innerhtml_str=innerhtml_str.replace(/&&entryurl&&/g,indata.url).replace(/&&entrypath&&/g,indata.path).replace(/&&title&&/g,indata.title).replace(/&&content&&/g,indata.content)
	})

	document.getElementById("dir_with_file_list").innerHTML=innerhtml_str;
	init();
}
function make_page_all_list(pathdata){
	var jquery_obj= $(this);
	var name=jquery_obj.text().trim();
	var path=jquery_obj.data('path')+(name=="/"?"":name)
	path=path&&path.trim()!="undefined"?path:"/"
	if(path=="/"&& typeof(pathdata)=="string")
		path=pathdata
	global_current_path=path;
	var params={
		path:path
	}
	$.ajax({
		type:"POST",
		url:"/ajax/get_pageAll_list", //dir with file
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : make_html_all_list,
		error : function(xhr, status, error) {
			alert("Error");
		}
	})

}
function make_html_dir_list(data) {
	if(data.status==0){
		alert('last folder');
		return;
	}
	data=data.data;
	$('.dir_only_elem').remove();
	var result=data.pageDir;
	var innerhtml_str=""
	innerhtml_str+="<li class='list-group-item dir_only_elem' style='color:gray;background-color:whitesmoke'>"+
            "<div class='row'>"+
              "<div class='col-sm-12'>"+
              	"<div>"+
                  "<span class='glyphicon glyphicon-folder-close'> </span>"+
                  "<a class='dir_only dir_share' data-path='/'>"+
                    "/"+
                  "</a>"+
            	"</div>"+
              "</div>"+
            "</div>"+
        "</li>";
	result.forEach(function(indata){
		innerhtml_str+="<li class='list-group-item droppable_forder dir_only_elem' style='color:gray;background-color:whitesmoke'>"+
            "<div class='row'>"+
              "<div class='col-sm-12'>"+
              	"<div>"+
                  "<span class='glyphicon glyphicon-folder-close'> </span>"+
                  "<a class='dir_only dir_share' data-path='&&dirpath&&'>"+
                    "&&dirname&&"+
                  "</a>"+
            	"</div>"+
              "</div>"+
            "</div>"+
        "</li>";
        innerhtml_str=innerhtml_str.replace('&&dirname&&',indata.name).replace('&&dirpath&&',indata.path)
	})

	document.getElementById("dir_only_list").innerHTML=innerhtml_str;
	init();
}
function make_page_dir_list(){
	var jquery_obj= $(this);
	var path=jquery_obj.data('path')+jquery_obj.text().trim()
	path=path&&path.trim()!="undefined"?path:"/"
	var params={
		path:path
	}
	$.ajax({
		type:"POST",
		url:"/ajax/get_pageDir_list", //only dir
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : make_html_dir_list,
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}
function make_both_view(path){
	var params={
		path:path
	}
	$.ajax({
		type:"POST",
		url:"/ajax/get_pageDir_list", //only dir
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : make_html_dir_list,
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
	$.ajax({
		type:"POST",
		url:"/ajax/get_pageAll_list", //dir with file
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : make_html_all_list,
		error : function(xhr, status, error) {
			alert("Error");
		}
	})

}
function delete_dir(data){

	var path=data.dirInfo.path;
	var params={
		dirInfo:data.dirInfo
	}
	$.ajax({
		type:"POST",
		url:"/ajax/remove_pageDir", //only dir
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : function(){
			make_both_view(path)
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}
function delete_entry(data){

	var params={
		pageInfo:data.pageInfo
	}
	$.ajax({
		type:"POST",
		url:"/ajax/remove_pageEntry", //only dir
		data:params,
		dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
		success : function (){
			make_page_all_list(data.pageInfo.path)
		},
		error : function(xhr, status, error) {
			alert("Error");
		}
	})
}
function both_context_binding(){
	$.contextMenu({
		selector:"#directory-list-both",
		callback: function(key, options) {
	        if(key=="Newfolder"){
	        	get_name_by_user(function(data){
	        		make_new_folder($(this),data)
	        	})
	        }
	    },
	    items: {
	        "Newfolder": {name: "New folder", icon: "edit"}
	    }
	})
}
function folder_context_binding(){
	$.contextMenu({
		selector:".droppable_forder",
		callback: function(key, options) {
			if(key=="Subdir"){
				var self=$(this)
	        	get_name_by_user(function(data){
	        		make_new_subfolder(self,data)
	        	})
	        }else if(key=='Delete'){
				var a_obj=$(this).find('a')
				var data={};
				data.dirInfo={};
				data.dirInfo.path=a_obj.data('path')
				data.dirInfo.name=a_obj.text()
				if(data.dirInfo.name!="/")
					delete_dir(data)
			}else if(key=='Rename'){
				var a_obj=$(this).find('a')
				var data={};
				data.dirInfo={};
				data.dirInfo.path=a_obj.data('path')
				data.dirInfo.name=a_obj.text()
				if(data.dirInfo.name!="/")
					get_name_by_user(function(new_name){
						data.dirInfo.new_name=new_name
		        		rename_folder(data)
		        	})
			}
	    },
	    items: {
	        "Subdir": {name: "Subdir", icon: "new"},
	        "Delete": {name: "Delete", icon: "delete"},
	        "Rename": {name: "Rename", icon: "edit"}
	    }

	})
}
function file_context_binding(){
	$.contextMenu({
		selector:".draggable_file",
		callback: function(key, options) {
			if(key=='Delete'){
				var a_obj=$(this).find('.file_a_tag_title')
				var data={};
				data.pageInfo={};
				data.pageInfo.url=a_obj.attr('href')
				data.pageInfo.path=a_obj.data('path')
				delete_entry(data)
			}else if(key=='Rename'){
				var a_obj=$(this).find('.file_a_tag_title')
				var data={};
				data.pageInfo={};
				data.pageInfo.url=a_obj.attr('href')
				data.pageInfo.path=a_obj.data('path')
				get_name_by_user(function(new_title){
					data.pageInfo.new_title=new_title;
	        		rename_file(data)
	        	})
			}
	    },
	    items: {
	        "Delete": {name: "Delete", icon: "delete"},
	        "Rename": {name: "Rename", icon: "edit"}
	    }
	})
}
var long_name_hover_animation=function(){
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
}
var init=function(){
		click_event_dir_only();
		click_event_dir_with_file();
		droppable_event();
		draggable_event();
		both_context_binding();
		folder_context_binding();
		file_context_binding();
		long_name_hover_animation();
}
var click_event_dir_only=function(){$('.dir_only').on('click', make_page_all_list)}
var click_event_dir_with_file=function(){$('.dir_with_file').on('click',make_page_all_list)}
var draggable_event=function(){$('.draggable_file').draggable( {
	start:function(e,u){
    },
    drag:function(e,u){
    },
    stop:function(e,u){
    },
    revert: true,
    opacity:"0.3"

});
}
var droppable_event=function(){$('.droppable_forder').droppable({

	drop: function(event, ui) {
		var jquery_obj= $(this).find(".dir_share");

		var dragobj=$(ui.draggable);
		var params={
			pageInfo:{
				oldPath:dragobj.find('.file_a_tag_title').data('path'),
				newPath:jquery_obj.data('path')+jquery_obj.text().trim(),
       			url:dragobj.find('.file_a_tag_title').attr('href')
			}
		};
		$.ajax({
			type:"POST",
			url:"/ajax/move_entryPath",
			dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
			data:params,
			success : function(data) {
				dragobj.remove()
				init();
			},
			error : function(xhr, status, error) {
				alert("Error");
			}
		})
    }

})
}

$( document ).ready(function() {
  init();
});

$(window).load(function(){
  make_both_view();
})
