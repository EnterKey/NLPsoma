var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */


var dbError_handler = function(err){
  // error handler
  // Have to change.
  console.log(err);
}

exports.main = function(req, res){
	//mocking
	var pageDir=[
			{
				name : 'testDir1',
				path : '/'
			}
		];

	var pageEntry=[
		{
			path : '/',
      url: 'http://www.naver.com',
      title: 'naver',
      content: 'naver is so useful'
		},
		{
			path : '/testDir1/',
			url : 'http://www.google.co.kr',
			title : 'google',
      content: 'I love google'
		}
	]
	//

  res.render('main',{dir_list: pageDir, entry_list: pageEntry});
};

exports.insert_user = function(req, res){
  mongodb_handler.insert_user(req.body, function(err, data){
    if(err){
      dbError_handler(err);
    }
    else{
      var result = {}
      if(data==1)
        result.status = true;
      else
        result.status = false;
      res.json(result);
    }
  });
};

exports.insert_pageEntry = function(req, res){
  mongodb_handler.insert_pageEntry(req.body, function(err, data){
    if(err){
      dbError_handler(err);
    }
    else{
      var result = {}
      if(data==1)
        result.status = true;
      else
        result.status = false;
      res.json(result);
    }
  });
};

exports.insert_pageDir = function(req, res){
  mongodb_handler.insert_pageDir(req.body, function(err, data){
    if(err){
      dbError_handler(err);
    }
    else{
      var result = {}
      if(data==1)
        result.status = true;
      else
        result.status = false;
      res.json(result);
    }
  });
};

exports.get_pageEntry_list = function(req, res){
  mongodb_handler.get_pageEntry_list(req.body, function(err, data){
    if(err)
      dbError_handler(err);
    else
      res.json(data);
  });
};

exports.get_pageDir_list = function(req, res){
  mongodb_handler.get_pageDir_list(req.body, function(err, data){
    if(err)
      dbError_handler(err);
    else
      res.json(data);
  });
};

exports.get_pageAll_list = function(req, res){
  mongodb_handler.get_pageAll_list(req.body, function(err, data){
    if(err)
      dbError_handler(err);
    else
      res.json(data);
  });
};

exports.remove_pageEntry = function(req, res){
  mongodb_handler.remove_pageEntry(req.body, function(err, data){
    if(err)
      dbError_handler(err);
    else
      res.json(data);
  });
};

exports.remove_pageDir = function(req, res){
  mongodb_handler.remove_pageDir(req.body, function(err, data){
    if(err)
      dbError_handler(err);
    else
      res.json(data);
  });
};

// exports.set_list = function(req, res){
// 	mongodb_handler.set_list(req,res);
// };

// exports.get_list = function(req, res){
// 	mongodb_handler.get_list(req,res);
// };
