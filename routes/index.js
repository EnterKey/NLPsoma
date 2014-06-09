var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */


exports.main = function(req, res){
	//mocking
	var dir_list=[
			{
				name : '/',
				path : '/'
			}
		];
	var all_list=[
		{
			type:'dir',
			name : '/',
			path : '/'
		},
		{
			type:'page',
			path : '/',
			url : 'http://google.co.kr',
			title : 'google'
		}
	]
	//

  res.render('main',{all_list:all_list, dir_list:dir_list});
};

exports.insert_user = function(req, res){
  mongodb_handler.insert_user(req, res);
};

exports.insert_pageEntry = function(req, res){
  mongodb_handler.insert_pageEntry(req, res);
};

exports.insert_pageDir = function(req, res){
  mongodb_handler.insert_pageDir(req, res);
};

exports.get_pageEntry_list = function(req, res){
  mongodb_handler.get_pageEntry_list(req, res);
};

exports.get_pageDir_list = function(req, res){
  mongodb_handler.get_pageDir_list(req, res);
};

exports.get_pageAll_list = function(req, res){
  mongodb_handler.get_pageAll_list(req, res);
};

exports.remove_pageEntry = function(req, res){
  mongodb_handler.remove_pageEntry(req, res);
};

exports.remove_pageDir = function(req, res){
  mongodb_handler.remove_pageDir(req, res);
};

// exports.set_list = function(req, res){
// 	mongodb_handler.set_list(req,res);
// };

// exports.get_list = function(req, res){
// 	mongodb_handler.get_list(req,res);
// };
