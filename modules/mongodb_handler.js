var mongoose = require('mongoose');
var Schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/chrome_extension');

var userDataSchema = new Schema({
	userKey:String,
	date: Date,
	pageDir : [
		{
			name : String,
			path : String
		}
	],
	pageEntry : [
		{
			path : String,
			url : String,
			title : String,
			content: String,
			status: Boolean
		}
	]
});

var userDataModel = mongoose.model('user', userDataSchema);

var parsePath = function(path){
	var parsePath = "";
	if(path.slice(-1) != '/')
		path += path + '/';

	// parsePath = path.replace(/\//, ",");
	return parsePath;
}

exports.insert_user = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userData = new userDataModel();

	userData.userKey = "TempUserKey";
	userData.date = new Date();

	userData.save(function(err, data){
		callback(err, data);
	})
};

exports.insert_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var pageDir = {};
	pageDir.name = postData.dirInfo.name;
	pageDir.path = pathgParsing(postData.dirInfo.path);

	userDataModel.update({userKey: userKey}, {'$push': { 'pageDir': pageDir}}, function(err, data){
		callback(err, data);
	});
};

exports.insert_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var pageEntry = {};
	pageEntry.title = postData.pageInfo.title;
	pageEntry.url = postData.pageInfo.url;

	if(postData.path == undefined){
		pageEntry.path = "/";
		pageEntry.status = false;
	}else{
		pageEntry.path = parsePath(postData.pageInfo.path);
		pageEntry.status = true;
	}

	userDataModel.update({userKey: userKey}, {'$push': { 'pageEntry': pageEntry}}, function(err, data){
		callback(err, data);
	});
};

exports.get_pageDir_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);

	userDataModel.find({userKey:userKey, "pageDir.path": path}, {"pageDir.$": 1} ,function(err, data){
		callback(err, data);
	});
}

exports.get_pageEntry_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);

	userDataModel.find({userKey:userKey, "pageEntry.path": path}, {"pageEntry.$": 1} ,function(err, data){
		callback(err, data);
	});

}

var get_pageAll_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = "TempUserKey";
	var path = "/";

	userDataModel.find({userKey:userKey, "pageEntry.path": path}, {"pageEntry.$": 1, "pageDir.$": 2} ,function(err, data){
		callback(err, data);
	});
}

var remove_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);
	var title = postData.title;

	userDataModel.remove({userKey:userKey, "pageEntry.path": path, "pageEntry.title": title}, function(err, data){
		callback(err, data);
	});
}

var remove_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);
	var name = postData.name;

	userDataModel.remove({userKey:userKey, "pageDir.path": path, "pageDir.name": name}, function(err, data){
		callback(err, data);
	});
}

exports.move_DirPath = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var pageInfo = postData.pageInfo;
	var userKey = postData.userKey;

	var searchQuery = {
		userKey: userKey,
		"pageDir.path": pageInfo.oldPath,
		"pageDir.title": pageInfo.name
	};

	var updateQuery = {
		"$set": {
			"pageDir.$.path": pageInfo.newPath
		}
	}

	userDataModel.update(searchQuery, updateQuery, function(err, data){
		callback(err, data);
	});
}

exports.move_EntryPath = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var pageInfo = postData.pageInfo;
	var userKey = postData.userKey;

	var searchQuery = {
		userKey: userKey,
		"pageEntry.path": pageInfo.oldPath,
		"pageEntry.title": pageInfo.name
	};

	var updateQuery = {
		"$set": {
			"pageEntry.$.path": pageInfo.newPath
		}
	}

	userDataModel.update(searchQuery, updateQuery, function(err, data){
		callback(err, data);
	});
}

exports.update_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};
};

exports.update_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};
};

function init(){
	console.log('mongo init');
	// insert_user();
};

init();

// exports.set_list = function(postData, callback){

// 	var pageInfo = postData.pageInfo;
// 	var userKey = postData.userKey;

// 	var visitpage = new userDataModel();

// 	visitpage.userKey = userKey;
// 	visitpage.date = new Date();
// 	visitpage.url = pageInfo.url;
// 	visitpage.title = pageInfo.title;
// 	visitpage.save(function (err) {
// 	    if (!err) console.log('Success!');
// 	});
// }

// exports.get_list = function(postData, callback){

// 	var userKey = postData.userKey;

// 	userDataModel.find({userKey:userKey}, function(err, docs){
// 		if(err)
// 			throw err;
// 		else
// 			res.json(docs);
// 	});

// };










