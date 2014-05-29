var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.set_list = function(req, res){
	mongodb_handler.set_list(req,res);
};

exports.get_list = function(req, res){
	mongodb_handler.get_list(req,res);
};