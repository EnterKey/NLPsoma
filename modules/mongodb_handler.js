var mongoose = require('mongoose');
var Schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/chrome_extension');


var visitPageSchema = new Schema({
	userKey:String,
	date: Date,
	url : String,
	title : String
});

var visitPageModel = mongoose.model('visitpage', visitPageSchema);

exports.set_list = function(req, res){

	var pageInfo = req.body.pageInfo;
	var userKey = req.body.userKey;

	var visitpage = new visitPageModel();

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

	visitPageModel.find({userKey:userKey}, function(err, docs){
		if(err)
			throw err;
		else
			res.json(docs);
	});

};











