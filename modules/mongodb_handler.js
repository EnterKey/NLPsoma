var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var crypto = require('crypto');
var settings = require('../setting');

mongoose.connect('mongodb://localhost/chrome_extension');

var userDataSchema = new Schema({
	userEmail:String,
	userName:String,
	picture:String,
	fingerprint:String,
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
			hashurl : String,
			title : String,
			content: String,
			status: Boolean
		}
	],
	docsData : [
		{
			filename : String,
			updateDate : Date,
			category : String,
			bookmarks : [
				{
					url : String
				}
			],
			content : String
		}
	],
	categoryList : [
	]
});

var userDataModel = mongoose.model('user', userDataSchema);

var parsePath = function(path){
	if(typeof(path)=='string' && path.slice(-1) != '/')
		path = path + '/';

	return path;
}


var isPageExist =  function(userEmail, url, callback){
	if(!userEmail){
		return callback("userEmail none", null);
	}
	userDataModel.find({userEmail: userEmail}, {"pageEntry": {"$elemMatch": {url:url}}}, function(err, data){
		if(err){
			callback(err, null);
		}else{
			if(data[0].pageEntry != undefined && data[0].pageEntry.length > 0)
				callback(null, true);
			else
				callback(null, false);
		}
	});
}

var isDirExist = function(userEmail, name, path, callback){
	if(!userEmail){
		return callback("userEmail none", null);
	}

	userDataModel.find({userEmail: userEmail}, {"pageDir": {"$elemMatch": {name:name, path:path}}}, function(err, data){
		if(err){
			callback(err, null);
		}else{
			if(data[0].pageDir != undefined && data[0].pageDir.length > 0)
				callback(null, true);
			else
				callback(null, false);
		}
	})
}

var isDocsExist = function(userEmail, name, callback){
	if(!userEmail){
		return callback("userEmail none", null);
	}

	userDataModel.find({userEmail: userEmail}, {"docsData": {"$elemMatch": {filename:name}}}, function(err, data){
		if(err){
			callback(err, null);
		}else{
			if(data[0].docsData != undefined && data[0].docsData.length > 0)
				callback(null, true);
			else
				callback(null, false);
		}
	})
}


var push_pageEntry = function(userEmail, pageInfo, callback){
	var self = this;
	var pageEntry = {};
	pageEntry.title = pageInfo.title;
	pageEntry.url = pageInfo.url;
	pageEntry.hashurl = crypto.createHmac('md5', settings.data.hashkey).update(pageInfo.url).digest('hex');
	pageEntry.content = pageInfo.content;

	isPageExist(userEmail, pageEntry.url, function(err, isExist){
		if(err){
			callback(err, null);
		}else if(isExist){
			var updateEntry = {
				"pageEntry.$.title" : pageEntry.title,
				"pageEntry.$.url" : pageEntry.url,
				"pageEntry.$.content" : pageEntry.content,
				"pageEntry.$.path" : parsePath("/"),
				"pageEntry.$.status" : false
			}
	    userDataModel.update({userEmail:userEmail, "pageEntry.url":pageInfo.url}, {"$set": updateEntry}, function(err, data){
	      callback(err, data);
	    });
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

var push_pageDir = function(userEmail, dirInfo, callback){
	var pageDir = {};
	pageDir.name = dirInfo.name;
	pageDir.path = parsePath(dirInfo.path);

	isDirExist(userEmail, pageDir.name, pageDir.path, function(err, isExist){
		if(err){
			callback(err, data);
		}else if(isExist){
			callback("DirExist", null);
		}else{
			userDataModel.update({userEmail: userEmail}, {'$push': { 'pageDir': pageDir}}, function(err, data){
				callback(err, data);
			});
		}
	});
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

		if(!userInfo){
			callback("no user Data");
			return;
		}

		userData.userEmail = userInfo.email;
		userData.userName = userInfo.name;
		userData.picture = userInfo.picture;
		userData.fingerprint = userInfo.fingerprint;
		userData.date = new Date();
		userData.categoryList = ['All'];

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
		var path = postData.path == undefined ? "/" : parsePath(postData.path);
		if(typeof(callback) != "function") callback = function(){};

		var result = {
			pageDir : [],
			pageEntry : [],
			status: false
		};

		var searchQuery = {
			userEmail: postData.userInfo.email
		};

		userDataModel.find(searchQuery, function(err, data){
			if(err){
				callback(err, result);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", result);
				return;
			}

			data[0].pageDir.forEach(function(item){
				if(typeof(item.path)=='string' && item.path == path)
					result.pageDir.push(item);
			});

			data[0].pageEntry.forEach(function(item){
				if(typeof(item.path)=='string' && item.path == path)
					result.pageEntry.push(item);
			});
			callback(err, result);
		})
	},


	remove_pageDir: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var path = postData.dirInfo.path == undefined ? null : parsePath(postData.dirInfo.path);
		var dirPath = path + postData.dirInfo.name + '/';
		dirPath = new RegExp('^' + dirPath);

		console.log(dirPath);
		userDataModel.update({userEmail:userEmail},{"$pull":{"pageEntry":{"path":dirPath}}}, function(err, data){
			if(err)
				callback('delete entry error', data);

			userDataModel.update({userEmail:userEmail},{"$pull":{"pageDir":{"path":dirPath}}}, function(err, data){
				if(err)
					callback('delete dir error', data);

				userDataModel.update({userEmail:userEmail}, {"$pull":{"pageDir":{"path":path, "name":postData.dirInfo.name}}}, function(err, data){
					callback(err, data);
				});
			});
		});
	},

	remove_pageEntry: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var email = postData.userInfo.email;
		var url = postData.pageInfo.url;
		userDataModel.update({userEmail:email},{"$pull":{"pageEntry":{"url":url}}}, function(err, data){
			callback(err, data);
		});
	},

	move_dirPath: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var userEmail = postData.userInfo.email;
		var dirInfo = postData.dirInfo;
		dirInfo.oldPath = dirInfo.oldPath == undefined ? null :parsePath(dirInfo.oldPath);
		dirInfo.newPath = dirInfo.newPath == undefined ? null :parsePath(dirInfo.newPath);

		var searchQuery = {
			userEmail: userEmail
		};

		isDirExist(userEmail, dirInfo.name, dirInfo.newPath, function(err, isExist){
			if(err){
				callback(err, data);
			}else if(isExist){
				callback("DirExist", null);
			}else{
				userDataModel.find(searchQuery, function(err, data){
					if(err){
						callback(err, data);
						return;
					}

					data[0].pageEntry.forEach(function(item){
						item.path = item.path.replace(dirInfo.oldPath+dirInfo.name+'/', dirInfo.newPath+dirInfo.name+'/');
					})
					data[0].pageDir.forEach(function(item){
						item.path = item.path.replace(dirInfo.oldPath+dirInfo.name+'/', dirInfo.newPath+dirInfo.name+'/');
						if(item.name == dirInfo.name && item.path.indexOf(dirInfo.oldPath)==0)
							item.path = item.path.replace(dirInfo.oldPath, dirInfo.newPath);
					})

					userDataModel.update(searchQuery, {pageDir: data[0].pageDir, pageEntry: data[0].pageEntry}, function(err, data){
						callback(err, data);
					});
				});
			}
		});
	},

	move_entryPath: function(postData, callback){
		if(typeof(callback) != "function") callback = function(){};

		var pageInfo = postData.pageInfo;
		var userEmail = postData.userInfo.email;
		pageInfo.oldPath = pageInfo.oldPath == undefined ? null :parsePath(pageInfo.oldPath);
		pageInfo.newPath = pageInfo.newPath == undefined ? null :parsePath(pageInfo.newPath);

		var searchQuery = {
			userEmail: userEmail
		};

		userDataModel.find(searchQuery, function(err, data){
			if(err){
				callback(err, data);
				return;
			}

			data[0].pageEntry.forEach(function(item){
				if(item.url == pageInfo.url && item.path.indexOf(pageInfo.oldPath)==0)
					item.path = item.path.replace(pageInfo.oldPath, pageInfo.newPath);
			})

			userDataModel.update(searchQuery, {pageEntry: data[0].pageEntry}, function(err, data){
				callback(err, data);
			});
		});
	},

  rename_pageDir: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var dirInfo = postData.dirInfo;
    dirInfo.path = parsePath(dirInfo.path);

		var searchQuery = {
			userEmail: postData.userInfo.email
		};

    isDirExist(postData.userInfo.email, dirInfo.new_name, dirInfo.path, function(err, isExist){
      if(err){
        callback(err, null);
      }else if(isExist){
        callback("Already Exist name", null);
      }else{
				userDataModel.find(searchQuery, function(err, data){
					if(err){
						callback(err, data);
						return;
					}

					data[0].pageEntry.forEach(function(item){
						item.path = item.path.replace(dirInfo.path+dirInfo.name+'/', dirInfo.path+dirInfo.new_name+'/');
					})

					data[0].pageDir.forEach(function(item){
						item.path = item.path.replace(dirInfo.path+dirInfo.name+'/', dirInfo.path+dirInfo.new_name+'/');
						if(item.name == dirInfo.name && item.path == dirInfo.path)
							item.name = dirInfo.new_name;
					})

					userDataModel.update(searchQuery, {pageDir: data[0].pageDir, pageEntry: data[0].pageEntry}, function(err, data){
						callback(err, data);
					});
				});
      }
    });
  },

  rename_pageEntry: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var pageInfo = postData.pageInfo;

    userDataModel.update({userEmail:postData.userInfo.email, "pageEntry.url":pageInfo.url}, {"$set":{"pageEntry.$.title":pageInfo.new_title}}, function(err, data){
      callback(err, data);
    });
  },

  insert_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    if(!postData.userInfo || typeof(postData.docsInfo)!= "object"){
    	callback("Insert Document Fail : argument error", null);
    	return;
    }

    var docsData = {
    	filename : postData.docsInfo.filename,
    	category : postData.docsInfo.category,
    	updateDate : new Date(),
    	bookmarks : postData.docsInfo.bookmarks,
    	content : postData.docsInfo.content
    };

    var userEmail = postData.userInfo.email;

		isDocsExist(userEmail, docsData.filename, function(err, isExist){
			if(err){
				callback(err, data);
			}else if(isExist){
				callback("Document already Exist", null);
			}else{
				userDataModel.update({userEmail: userEmail}, {'$push': { 'docsData': docsData}}, function(err, data){
					callback(err, data);
				});
			}
		});

  },

  update_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    if(!postData.userInfo || typeof(postData.docsInfo)!= "object"){
    	callback("Update Document Fail : argument error", null);
    	return;
    }

    var docsData = {
    	filename : postData.docsInfo.filename,
    	category : postData.docsInfo.category,
    	updateDate : new Date(),
    	bookmarks : postData.docsInfo.bookmarks,
    	content : postData.docsInfo.content
    };

    var userEmail = postData.userInfo.email;

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, data);
				return;
			}

			data[0].docsData.forEach(function(item, index, array){
				if(item.filename == docsData.filename)
					array[index] = docsData;
			})

			userDataModel.update({userEmail:userEmail}, {docsData: data[0].docsData}, function(err, data){
				callback(err, data);
			});
		});
  },

  remove_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var docsData = postData.docsInfo;
    var userEmail = postData.userInfo.email;

    if(!userEmail || typeof(docsData)!= "object"){
    	callback("Remove Document Fail : argument error", null);
    	return;
    }

		isDocsExist(userEmail, docsData.filename, function(err, isExist){
			if(err){
				callback(err, data);
			}else if(isExist){
				userDataModel.update({userEmail:userEmail},{"$pull":{"docsData":{"filename":docsData.filename}}}, function(err, data){
					callback(err, data);
				});
			}else{
				callback("Document None Exist", null);
			}
		});
  },

  get_all_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
		var result = {
			docsList : []
		}

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, result);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", result);
				return;
			}

			result.docsList = data[0].docsData;

			callback(err, result);
		});
  },

  get_document_content: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};
    var userEmail = postData.userInfo.email;
    var filename = postData.docsInfo.filename;

		var result = {}

		userDataModel.find({userEmail:userEmail}, {"docsData": {"$elemMatch": {filename:filename}}},function(err, data){
			if(err){
				callback(err, result);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", null);
				return;
			}

			if(data[0].docsData.length == 0){
				console.log('none document data');
				callback("None document data", null);
				return;
			}

			result = data[0].docsData[0];

			callback(err, result);
		});

  },

  insert_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var newCategory = postData.newCategory;

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, null);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", null);
				return;
			}

			if(data[0].categoryList.indexOf(newCategory)>=0){
				callback("Category already Exist", null);
				return;
			}

			userDataModel.update({userEmail: userEmail}, {'$push': { 'categoryList': newCategory}}, function(err, data){
				callback(err, data);
			});
		});

  },

  update_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var oldCategory = postData.oldCategory
    var newCategory = postData.newCategory;

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, null);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", null);
				return;
			}

			if(oldCategory == 'All'){
				callback("Cannot update this category", null);
				null;
			}

			var index = data[0].categoryList.indexOf(oldCategory);
			if(index>=0){
				data[0].categoryList[index] = newCategory;
			}

			userDataModel.update({userEmail: userEmail}, {categoryList: data[0].categoryList}, function(err, data){
				callback(err, data);
			});
		});
  },

  remove_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var deleteCategory = postData.deleteCategory;

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, null);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", null);
				return;
			}

			if(data[0].categoryList.indexOf(deleteCategory)==-1){
				callback("Category doesn't Exist", null);
				return;
			}

			if(deleteCategory == 'All'){
				callback("Cannot remove this category", null);
				null;
			}

			userDataModel.update({userEmail:userEmail},{"$pull":{"categoryList": deleteCategory}}, function(err, data){
				callback(err, data);
			});
		});
  },

  get_category_list : function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
		var result = {
			categoryList : []
		}

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, result);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", result);
				return;
			}

			result.categoryList = data[0].categoryList;

			callback(err, result);
		});
  },

  get_bookmark_tree : function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var result = {
    	pageDir : [],
    	pageEntry : []
    }

		userDataModel.find({userEmail:userEmail}, function(err, data){
			if(err){
				callback(err, result);
				return;
			}

			if(data.length == 0){
				console.log('none user');
				callback("None user data", result);
				return;
			}

			result.pageDir = data[0].pageDir;
			result.pageEntry = data[0].pageEntry;

			callback(err, result);
		});
  }
}


function init(){
	console.log('mongo init');
};

init();







