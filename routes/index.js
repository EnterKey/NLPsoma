var mongodb_handler = require('../modules/mongodb_handler');
/*
 * GET home page.
 */

var dbError_handler = function(err){
  // error handler
  // Have to change.
  console.log('mongo db error :', err);

  return {status: false, errorMsg: err};
};


var dbResult_handler = function(err, data){
  if(err)
    return dbError_handler(err);

  var result = {};
  result.data = data;

  result.status = data ? true : false;

  // console.log(result);
  return result;
};

var insertEntry_handler = function(err, data){
  var result = {
    data: data,
    errorMsg: null,
    status: data ? true: false
  };

  if(err){
    console.log('Insert Entry Error', err);
    result.errorMsg="데이터 저장 실패";
    if(err=="PageExist")
      result.errorMsg += ":중복";
    result.status = false;
  }

  return result;
}

exports.main = function(req, res){

  if(!req.session || !req.user){
    res.render('login');
  }else{
    res.redirect('/document');
  }
}

exports.bookmark = function(req, res){
  res.render('bookmark', {pageDir: [], pageEntry:[]});
}

exports.document = function(req, res){
  res.render('document');
}

exports.editor = function(req, res){
  res.render('editor', {pageDir: [], pageEntry:[]});
}

exports.insert_user = function(req, res){
  mongodb_handler.insert_user(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.insert_pageEntry = function(req, res){
  mongodb_handler.insert_pageEntry(req.body, function(err, data){
    var result = insertEntry_handler(err, data);
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

exports.rename_pageDir = function(req, res){
  mongodb_handler.rename_pageDir(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};

exports.rename_pageEntry = function(req, res){
  mongodb_handler.rename_pageEntry(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};
