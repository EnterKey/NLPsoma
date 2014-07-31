var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */

var insertTestData = function(){
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

  mongodb_handler.insert_user({userKey:"TempUserKey"}, function(err, data){
    if(!err){
      var i;
      for(i in testDirData){
        mongodb_handler.insert_pageDir(testDirData[i],function(err, data){
          var result = dbResult_handler(err, data);
          console.log(i,'insert Dir',result);
        });
      }
      
      for(i in testEntryData){
        mongodb_handler.insert_pageEntry(testEntryData[i],function(err, data){
          var result = dbResult_handler(err, data);
          console.log(i,'insert Entry',result);
        });
      }      
    }
  });
}


// insertTestData();

var dbError_handler = function(err){
  // error handler
  // Have to change.
  console.log(err);
  return {status: false};
};


var dbResult_handler = function(err, data){
  if(err)
    return dbError_handler(err);

  var result = {};
  result.data = data;

  result.status = data ? true : false

  console.log(result);
  return result;
};

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
	];
	var userKey=req.body.userKey?req.body.userKey:"TempUserKey";
	var path = "/"
	var postData={
		userKey:userKey,
		path:path
	}
	mongodb_handler.get_pageAll_list(postData, function(err, data){
		res.render('main', {pageDir: data.pageDir, pageEntry:data.pageEntry});
	});
}


exports.insert_user = function(req, res){
  mongodb_handler.insert_user(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.insert_pageEntry = function(req, res){
  mongodb_handler.insert_pageEntry(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.insert_pageDir = function(req, res){
  mongodb_handler.insert_pageDir(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.get_pageEntry_list = function(req, res){
  mongodb_handler.get_pageEntry_list(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.get_pageDir_list = function(req, res){
  mongodb_handler.get_pageDir_list(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.get_pageAll_list = function(req, res){
  mongodb_handler.get_pageAll_list(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.remove_pageEntry = function(req, res){
  mongodb_handler.remove_pageEntry(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.remove_pageDir = function(req, res){
  mongodb_handler.remove_pageDir(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.move_dirPath = function(req, res){
  mongodb_handler.move_dirPath(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.move_entryPath = function(req, res){
  mongodb_handler.move_entryPath(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};
