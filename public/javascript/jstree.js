$(function() {
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
});
