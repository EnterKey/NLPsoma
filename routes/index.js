var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */

var insertTestData = function(){
  var  userInfo= {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      };

  var testDirData = [
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir2",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "childDir1",
        path: "/myDir/"
      }
    }
  ];

  var testEntryData = [
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "google",
        path: "/",
        content: "google page",
        url: "http://www.google.co.kr",
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "naver",
        path: "/",
        content: "naver page",
        url: "http://www.naver.com",
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "daum",
        path: "/myDir/",
        content: "daum page",
        url: "http://www.daum.net",
      }
    }
  ];
  mongodb_handler.insert_user(userInfo,function(){
    var i;
    for(i in testDirData){
      mongodb_handler.insert_pageDir(testDirData[i],function(err, data){
        var result = dbResult_handler(err, data);
        // console.log(i,'insert Dir',result);
      });
    }

    for(i in testEntryData){
      mongodb_handler.insert_pageEntry(testEntryData[i],function(err, data){
        var result = dbResult_handler(err, data);
        // console.log(i,'insert Entry',result);
      });
    }
  });
}


// insertTestData();
mongodb_handler.move_dirPath({
  userInfo: {
    email: "widianpear@gmail.com"
  },
  pageInfo: {
    oldPath: "/",
    newPath: "/hellllo/",
    name: "myDir"
  }
})
var dbError_handler = function(err){
  // error handler
  // Have to change.
  console.log('mongo db error :', err);
  return {status: false};
};


var dbResult_handler = function(err, data){
  if(err)
    return dbError_handler(err);

  var result = {};
  result.data = data;

  result.status = data ? true : false

  // console.log(result);
  return result;
};

exports.main = function(req, res){
  console.log(req.query);
	//mocking

	// var path = "/"
	// var postData={
	// 	userInfo: {
 //      email: userEmail,
 //      name: 'bbu',
 //      picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
 //    },
	// 	path:path
	// }
	// mongodb_handler.get_pageAll_list(postData, function(err, data){

	// });
  res.render('main', {pageDir: [], pageEntry:[]});
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
    data = data ? data : {pageDir:[],status:1};
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
