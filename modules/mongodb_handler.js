var mongoose = require('mongoose');
var Schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/chrome_extension');

var userDataSchema = new Schema({
	userEmail:String,
	userName:String,
	picture:String,
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
	if(path.slice(-1) != '/')
		path = path + '/';

	// parsePath = path.replace(/\//, ",");
	return path;
}

var push_pageDir = function(userEmail, dirInfo, callback){
	var pageDir = {};
	pageDir.name = dirInfo.name;
	pageDir.path = parsePath(dirInfo.path);

	userDataModel.update({userEmail: userEmail}, {'$push': { 'pageDir': pageDir}}, function(err, data){
		callback(err, data);
	});
}

var isPageExist =  function(userEmail, url, callback){
	if(!userEmail){
		return callback("userEmail none", null);
	}
	userDataModel.find({userEmail: userEmail}, {"pageEntry": {"$elemMatch": {url:url}}}, function(err, data){
		if(err){
			// console.log('isPageExist err', err, data.pageEntry==undefined);
			callback(err, null);
		}else{
			if(data[0].pageEntry != undefined && data[0].pageEntry.length > 0)
				callback(null, true);
			else
				callback(null, false);
		}
	});
}

var push_pageEntry = function(userEmail, pageInfo, callback){
	var self = this;
	var pageEntry = {};
	pageEntry.title = pageInfo.title;
	pageEntry.url = pageInfo.url;
	pageEntry.content = pageInfo.content;

	isPageExist(userEmail, pageEntry.url, function(err, isExist){
		if(isExist){
			callback("PageExist", null);
		}else if(err){
			callback(err, null);
		}else{
			if(pageInfo.path == undefined){
				pageEntry.path = parsePath("/");
				pageEntry.status = false;
			}else{
				pageEntry.path = parsePath(pageInfo.path);
				pageEntry.status = true;
			}
			userDataModel.update({userEmail: userEmail}, {'$push': { 'pageEntry': pageEntry}}, function(err, data){
				callback(err, data);
			});
		}
	})
}

module.exports = {

	isUserExist: function(userEmail, callback){
		if(!userEmail){
			return false;
		}

		userDataModel.find({userEmail: userEmail}, function(err, data){
			if(err){
				console.log('isUserExist err', err);
				callback(false);
			}else{
				if(data.length > 0)
					callback(true);
				else
					callback(false);
			}
		});
	},

	insert_user: function(userInfo, callback){
		if(typeof(callback) != "function") callback = function(){};
		var userData = new userDataModel();

		if(!userInfo)
			callback("no user Data");

		userData.userEmail = userInfo.email;
		userData.userName = userInfo.name;
		userData.picture = userInfo.picture;
		userData.date = new Date();

		userData.save(function(err, data){
			callback(err, data);
		})
	},

	insert_pageDir: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		if(!postData.userInfo || !postData.dirInfo){
			callback('query error', []);
			return;
		}

		var self = this;
		var userEmail = postData.userInfo.email;

		self.isUserExist(userEmail, function(isExist){
			if(isExist){
				push_pageDir(userEmail, postData.dirInfo, callback);
			}else{
				self.insert_user(postData.userInfo, function(err, data){
					if(err){
						callback(err, data);
					}
					else{
						push_pageDir(userEmail, postData.dirInfo, callback);
					}
				});
			}
		});
	},

	 insert_pageEntry: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var self = this;
		var userEmail = postData.userInfo.email;

		self.isUserExist(userEmail, function(isExist){
			if(isExist){
				push_pageEntry(userEmail, postData.pageInfo, callback);
			}else{
				self.insert_user(postData.userInfo, function(err, data){
					if(err){
						callback(err, data);
					}
					else{
						push_pageEntry(userEmail, postData.pageInfo, callback);
					}
				});
			}
		});
	},

	get_pageDir_list: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var path = postData.path == undefined ? "/" : parsePath(postData.path);

		// userDataModel.aggregate()
		userDataModel.aggregate({$match: {userEmail:userEmail, pageDir: {$elemMatch:{path:path}}}}, {$unwind: "$pageDir"}, {$match: {"pageDir.path": path}},{$group: {_id: "$_id", pageDir: { $push: "$pageDir"}}}, function(err, data){
			if(typeof(data) != "object")
				data = [];
			callback(err, data[0]);
		});
	},

	get_pageEntry_list: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var path = postData.path == undefined ? "/" : parsePath(postData.path);

		userDataModel.aggregate({$match: {userEmail:userEmail, pageEntry: {$elemMatch:{path:path}}}}, {$unwind: "$pageEntry"}, {$match: {"pageEntry.path": path}},{$group: {_id: "$_id", pageEntry: { $push: "$pageEntry"}}}, function(err, data){
			if(typeof(data) != "object")
				data = [];
			callback(err, data[0]);
		});
	},

	get_pageAll_list: function(postData, callback){
		var self = this;

		if(typeof(callback) != "function") callback = function(){};

		var result = {
			pageDir : [],
			pageEntry : [],
			status: false
		};

		self.get_pageDir_list(postData, function(err, data){
			if(err){
				callback(err, result);
			}else{
				result.pageDir = data ? data.pageDir : [];

				self.get_pageEntry_list(postData, function(err, data){
					if(!err)
						result.status = true;
					result.pageEntry = data ? data.pageEntry : [];
					callback(err, result);
				});
			}
		});
	},

	remove_pageDir: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var path = postData.path == undefined ? null : parsePath(postData.path);
		path = path + postData.name + '/';
		path = new RegExp('^' + path);
		userDataModel.update({userEmail:userEmail},{"$pull":{"pageDir":{"path":path}}}, function(err, data){
			callback(err, data);
		});
	},

	remove_pageEntry: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var path = postData.path == undefined ? null : parsePath(postData.path);
		path = new RegExp('^' + path);

		userDataModel.update({userEmail:userEmail},{"$pull":{"pageEntry":{"path":path}}}, function(err, data){
			callback(err, data);
		});
	},

	move_dirPath: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var pageInfo = postData.pageInfo;

		var searchQuery = {
			userEmail: userEmail,
		};

		userDataModel.find(searchQuery, function(err, data){
			if(err){
				callback(err, data);
				return;
			}

			data[0].pageEntry.forEach(function(item){
				item.path = item.path.replace(pageInfo.oldPath+pageInfo.name+'/', pageInfo.newPath+pageInfo.name+'/');
			})
			data[0].pageDir.forEach(function(item){
				item.path = item.path.replace(pageInfo.oldPath+pageInfo.name+'/', pageInfo.newPath+pageInfo.name+'/');
				if(item.name == pageInfo.name && item.path.indexOf(pageInfo.oldPath)==0)
					item.path = item.path.replace(pageInfo.oldPath, pageInfo.newPath);
			})

			userDataModel.update(searchQuery, {pageDir: data[0].pageDir, pageEntry: data[0].pageEntry}, function(err, data){
				callback(err, data);
			});
		});
	},

	move_entryPath: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var pageInfo = postData.pageInfo;
		var userEmail = postData.userInfo.email;

		var searchQuery = {
			userEmail: userEmail,
		};


		userDataModel.find(searchQuery, function(err, data){
			if(err){
				callback(err, data);
				return;
			}

			data[0].pageEntry.forEach(function(item){
				if(item.title == pageInfo.title && item.path.indexOf(pageInfo.oldPath)==0)
					item.path = item.path.replace(pageInfo.oldPath, pageInfo.newPath);
			})

			userDataModel.update(searchQuery, {pageEntry: data[0].pageEntry}, function(err, data){
				callback(err, data);
			});
		});
	},

	update_pageEntry: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};
	},

	update_pageDir: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};
	}

}


function init(){
	console.log('mongo init');
};

init();



// db.users.aggregate({$match: {userEmail:"TempuserEmail", pageDir: {$elemMatch:{path:"/"}}}}, {$unwind: "$pageDir"}, {$match: {"pageDir.path": "/"}}, {$group: {_id: "$_id", pageDir: {$push: "$pageDir"}}}).pretty();
// get_pageDir_list({userEmail:"TempuserEmail", path: "/"}, function(err, result){
// 	console.log(result);
// })
// move_EntryPath({userEmail:"TempuserEmail", pageInfo:{oldPath: "/myDir", newPath: "/myDir2/" ,title: "youtube"}}, function(err, data){
// 	console.log(err, data);
// })







