

var redirect_uri = "http://aedilis5.vps.phps.kr:4000/main";
var client_id = "994714572327-1rt0im4unhkai7brfp5mk904llu1kd3p.apps.googleusercontent.com"

if(location.hostname == 'localhost'){
	redirect_uri = "http://localhost:4000/main";
	client_id = "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com";
}

jso_configure({

	"google": {
		client_id: client_id,
		redirect_uri: redirect_uri,
		authorization: "https://accounts.google.com/o/oauth2/auth",
		isDefault: true
	}

});

// Make sure that you have
jso_ensureTokens({
	// "facebook": ["read_stream"],
	"google": ["https://www.googleapis.com/auth/userinfo.email"],
	// "instagram": ["basic", "likes"]
});

jso_dump();

$.oajax({
	url: "https://www.googleapis.com/oauth2/v2/userinfo",
	jso_provider: "google",
	jso_allowia: true,
	jso_scopes: ["https://www.googleapis.com/auth/userinfo.email"],
	dataType: 'json',
	success: function(data) {
		console.log(data);
		global_user.email = data.email;
		global_user.name = data.name;
		global_user.picture = data.picture;
		make_page_dir_list()
		make_page_all_list()
	}
});
