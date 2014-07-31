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

var testDirData = [
	{
		userKey: "TempUserKey",
		dirInfo: {
			name: "myDir",
			path: "/"
		}
	},
	{
		userKey: "TempUserKey",
		dirInfo: {
			name: "myDir2",
			path: "/"
		}
	},
	{
		userKey: "TempUserKey",
		dirInfo: {
			name: "childDir1",
			path: "/myDir/"
		}
	}
];

var testEntryData = [
	{
		userKey: "TempUserKey",
		pageInfo: {
			title: "google",
			content: "google page",
			url: "http://www.google.co.kr",
		}
	},
	{
		userKey: "TempUserKey",
		pageInfo: {
			title: "naver",
			path: "/",
			content: "naver page",
			url: "http://www.naver.com",
		}
	},
	{
		userKey: "TempUserKey",
		pageInfo: {
			title: "youtube",
			path: "/myDir/",
			content: "youtube page",
			url: "http://www.youtube.com",

		}
	},
	{
		userKey: "TempUserKey",
		pageInfo: {
			title: "yahoo",
			path: "/myDir/childDir1/",
			content: "yahoo page",
			url: "http://www.yahoo.com",

		}
	},
	{
		userKey: "TempUserKey",
		pageInfo: {
			title: "soma",
			path: "/myDir2/",
			content: "soma page",
			url: "http://www.soma.com",
		}
	},				
];


var userDataModel = mongoose.model('user', userDataSchema);

var parsePath = function(path){
	if(path.slice(-1) != '/')
		path = path + '/';

	// parsePath = path.replace(/\//, ",");
	return path;
}

var insert_user = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userData = new userDataModel();

	userData.userKey = "TempUserKey";
	userData.date = new Date();

	userData.save(function(err, data){
		callback(err, data);
	})
};

var insert_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var pageDir = {};
	pageDir.name = postData.dirInfo.name;
	pageDir.path = parsePath(postData.dirInfo.path);

	userDataModel.update({userKey: userKey}, {'$push': { 'pageDir': pageDir}}, function(err, data){
		callback(err, data);
	});
};

 var insert_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var pageEntry = {};
	pageEntry.title = postData.pageInfo.title;
	pageEntry.url = postData.pageInfo.url;
	pageEntry.content = postData.pageInfo.content;

	if(postData.pageInfo.path == undefined){
		pageEntry.path = parsePath("/");
		pageEntry.status = false;
	}else{
		pageEntry.path = parsePath(postData.pageInfo.path);
		pageEntry.status = true;
	}

	userDataModel.update({userKey: userKey}, {'$push': { 'pageEntry': pageEntry}}, function(err, data){
		callback(err, data);
	});
};

 // db.users.aggregate({$match: {userKey:"TempUserKey", pageDir: {$elemMatch:{path:"/"}}}}, {$unwind: "$pageDir"}, {$match: {"pageDir.path": "/"}}, {$group: {_id: "$_id", pageDir: {$push: "$pageDir"}}}).pretty();

var get_pageDir_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? "/" : parsePath(postData.path);

	// userDataModel.aggregate()
	userDataModel.aggregate({$match: {userKey:userKey, pageDir: {$elemMatch:{path:path}}}}, {$unwind: "$pageDir"}, {$match: {"pageDir.path": path}},{$group: {_id: "$_id", pageDir: { $push: "$pageDir"}}}, function(err, data){
		callback(err, data[0]);
	});
};

var get_pageEntry_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? "/" : parsePath(postData.path);

	userDataModel.aggregate({$match: {userKey:userKey, pageEntry: {$elemMatch:{path:path}}}}, {$unwind: "$pageEntry"}, {$match: {"pageEntry.path": path}},{$group: {_id: "$_id", pageEntry: { $push: "$pageEntry"}}}, function(err, data){
		callback(err, data[0]);
	});
};

var get_pageAll_list = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var result = {
		pageDir : [],
		pageEntry : [],
		status: false
	};

	get_pageDir_list(postData, function(err, data){
		if(err){
			callback(err, result);
		}else{
			result.pageDir = data.pageDir;
			get_pageEntry_list(postData, function(err, data){
				if(!err)
					result.status = true;
				result.pageEntry = data.pageEntry;
				callback(err, result);
			});
		}
	});
};

var remove_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);
	var name = postData.name;

	userDataModel.remove({userKey:userKey, "pageDir.path": path, "pageDir.name": name}, function(err, data){
		callback(err, data);
	});
};

var remove_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var userKey = postData.userKey;
	var path = postData.path == undefined ? null : parsePath(postData.path);
	var title = postData.title;

	userDataModel.remove({userKey:userKey, "pageEntry.path": path, "pageEntry.title": title}, function(err, data){
		callback(err, data);
	});
};

var move_DirPath = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var pageInfo = postData.pageInfo;
	var userKey = postData.userKey;

	var searchQuery = {
		userKey: userKey,
		"pageDir.path": parsePath(pageInfo.oldPath),
		"pageDir.title": pageInfo.name
	};

	var updateQuery = {
		"$set": {
			"pageDir.$.path": parsePath(pageInfo.newPath)
		}
	}

	userDataModel.update(searchQuery, updateQuery, function(err, data){
		callback(err, data);
	});
};

var move_EntryPath = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};

	var pageInfo = postData.pageInfo;
	var userKey = postData.userKey;

	var searchQuery = {
		userKey: userKey,
		"pageEntry.path": parsePath(pageInfo.oldPath),
		"pageEntry.title": pageInfo.title
	};

	var updateQuery = {
		"$set": {
			"pageEntry.$.path": parsePath(pageInfo.newPath)
		}
	}

	console.log(searchQuery, updateQuery);
	userDataModel.update(searchQuery, updateQuery, function(err, data){
		callback(err, data);
	});
};

exports.update_pageEntry = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};
};

exports.update_pageDir = function(postData, callback){
	if(typeof(callback) != "function") callback = function(){};
};

function init(){
	console.log('mongo init');

	// get_pageAll_list({userKey:"TempUserKey", path: "/"}, function(err, result){
	// 	console.log(result);
	// })
	// move_EntryPath({userKey:"TempUserKey", pageInfo:{oldPath: "/myDir", newPath: "/myDir2/" ,title: "youtube"}}, function(err, data){
	// 	console.log(err, data);
	// })

	// insert_user();
	// var i;
	// for(i in testDirData){
	// 	insert_pageDir(testDirData[i],function(err, data){
	// 		console.log(i, data);
	// 	});
	// }
	// for(i in testEntryData){
	// 	insert_pageEntry(testEntryData[i],function(err, data){
	// 		console.log(i, data);
	// 	});
	// }	
};

init();











