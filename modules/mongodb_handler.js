var mongoose = require('mongoose');
var Schema=mongoose.Schema;

mongoose.connect('mongodb://localhost/chrome_extension');


var visitPageSchema = new Schema({
	userKey:String,
	visitedCnt : Number,
	date: Date,
	url : String,
	title : String
});

var visitPageModel = mongoose.model('visitpage', visitPageSchema);

exports.set_list = function(req,res){

	var visitpage = new visitPageModel();
	var item = req.body.data.item; //maybe req.body.item
	visitpage.userKey  = item.userKey;
	visitpage.date= item.item.date;
	visitpage.visitedCnt = item.visitedCnt;
	visitpage.title = item.title;
	visitpage.save(function (err) {
	    if (!err) console.log('Success!');
	});
}

exports.get_list = function(req,res){
	var data= req.body.data;
	userKey=data.userKey;
	visitPageModel.find({userKey:userKey},function(err,docs){
		if(err)
			throw err;
		else
			console.log(docs);
	})

}











