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
			title : String
		}
	]		
});

var userDataModel = mongoose.model('user', userDataSchema);



var pathParsing = function(path){
	var parsePath = "";
	if(path.slice(-1) != '/')
		path += path + '/';

	parsePath = path.replace(/\//, ",");
	return parsePath;
}

exports.insert_user = function(){
	var userData = new userDataModel();

	userData.userKey = "TempUserKey";
	userData.date = new Date();
	userData.pageDir = [];
	userData.pageDir.push({
		name : "root",
		path : null
	});

	userData.save(function(err){
		if(err){
			console.log(err);
			res.json("fail");
		}
		else{
			res.json("success");
		}
	})
};

exports.insert_pageDir = function(req, res){

	var userKey = req.body.userKey;
	var pageDir = {};
	pageDir.name = req.body.dirInfo.name;
	pageDir.path = pathgParsing(req.body.dirPath.path);

	userDataModel.update({userKey: userKey}, {'$push': { 'pageDir': pageDir}}, function(err, data){
		if(err){
			console.log(err);
			res.json("fail");
		}
		else{
			res.json("success");
		}
	});
};

exports.insert_pageEntry = function(req, res){
	var userKey = req.body.userKey;
	var pageEntry = {};
	pageEntry.title = req.body.pageInfo.title;
	pageEntry.url = req.body.pageInfo.url;
	pageEntry.path = pathParsing(req.body.pageInfo.url);
	userDataModel.update({userKey: userKey}, {'$push': { 'pageEntry': pageEntry}}, function(err, data){
		if(err){
			console.log(err);
			res.json("fail");
		}
		else{
			res.json("success");
		}
	});
};


var get_pageDir_list = function(req, res){
	var userKey = req.body.userKey;
	var path = pathParsing(req.body.path);

	userDataModel.find({userKey:userKey, "pageDir.path": path}, {"pageDir.$": 1} ,function(err, docs){
		if(err)
			console.log(err);
		console.log(docs);
	});
}

var get_pageEntry_list = function(req, res){
	var userKey = req.body.userKey;
	var path = pathParsing(req.body.path);

	userDataModel.find({userKey:userKey, "pageEntry.path": path}, {"pageEntry.$": 1} ,function(err, docs){
		if(err)
			console.log(err);
		console.log(docs);
	});

}


var get_pageAll_list = function(req, res){
	var userKey = "TempUserKey";
	var path = ",root,";

	userDataModel.find({userKey:userKey, "pageEntry.path": path}, {"pageEntry.$": 1, "pageDir.$": 2} ,function(err, docs){
		if(err)
			console.log(err);
		console.log(docs);
	});
}

function init(){
	console.log('mongo init');
	get_pageAll_list();
};






exports.update_pageEntry = function(req, res){

};

exports.update_pageDir = function(req, res){
	
};

exports.set_list = function(req, res){

	var pageInfo = req.body.pageInfo;
	var userKey = req.body.userKey;

	var visitpage = new userDataModel();

	visitpage.userKey = userKey;
	visitpage.date = new Date();
	visitpage.url = pageInfo.url;
	visitpage.title = pageInfo.title;
	visitpage.save(function (err) {
	    if (!err) console.log('Success!');
	});
}

exports.get_list = function(req, res){

	var userKey = req.body.userKey;

	userDataModel.find({userKey:userKey}, function(err, docs){
		if(err)
			throw err;
		else
			res.json(docs);
	});

};

init();









