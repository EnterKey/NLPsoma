var mongodb_handler = require('../modules/mongodb_handler');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var spawn = require('child_process').spawn
var settings = require('../setting');
var mkdirp = require("mkdirp")
var getDirName = require("path").dirname

var editorRenderInfo = {
  userInfo : {},
  documentName : null,
  editorState : null
}


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

var save_htmldata = function(pageInfo, email, callback){
  if(pageInfo == null || !pageInfo.url || !pageInfo.htmldata)
    callback(false);
  var hashurl = crypto.createHmac('md5', settings.data.hashkey).update(pageInfo.url).digest('hex');
  var filename=path.join(__dirname,'..','snapshot', email, hashurl + '.html');
  console.log(filename);
  function writeFile (path, contents, cb) {
    mkdirp(getDirName(path), function (err) {
      if (err) return cb(err)
      fs.writeFile(path, contents, cb)
    })
  }
  writeFile(filename, pageInfo.htmldata, function(err){
    if(!err){
      callback(true)
    }else{
      callback(false)
    }
  })
}

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
  }else{

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
  var renderInfo = {
    pageDir: [],
    pageEntry: []
  }
  renderInfo.userInfo = req.body.userInfo;
  res.render('bookmark', renderInfo);
}

exports.document = function(req, res){
  var renderInfo = {}
  renderInfo.userInfo = req.body.userInfo;
  res.render('document', renderInfo);
}

exports.editor = function(req, res){
  var renderInfo = editorRenderInfo;
  renderInfo.userInfo = req.body.userInfo;
  renderInfo.editorState = 'new';

  res.render('editortest', renderInfo);
}

exports.insert_user = function(req, res){
  mongodb_handler.insert_user(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
};
exports.snapshot=function(req, res){
  var useremail= req.body.userInfo.email;
  var hashurl=req.params.hashurl;
  var imagePath =  path.join(__dirname,'..','snapshot', useremail,hashurl+'.png')
  fs.readFile(imagePath, function(err, data){
    if(err) {
      res.writeHead(501);
      res.end();
    }else{

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': data.length
      });
      res.end(data, 'binary');
    }
  })
}

exports.snaptext=function(req, res){
  var useremail= req.body.userInfo.email;
  var hashurl=req.params.hashurl;
  var htmlPath =  path.join(__dirname,'..','snapshot', useremail,hashurl+'.html')
  var childArgs = [
    path.join(__dirname, 'crawltext.py'),
    htmlPath
  ];

  var ps = spawn("python", childArgs);
  var snaptext = "";
  ps.stdout.on("data", function(data){
    snaptext+=data;
  });

  ps.stdout.on("end", function(err){
    if(err) {
      console.log("snaptext err : ", err);
      res.writeHead(501);
      res.end();
    }else{
      res.writeHead(200, {
        'Content-Type': 'text/plain;charset=utf-8'
      });
      res.end(snaptext);
    }
  });

}


exports.insert_pageEntry = function(req, res){
    mongodb_handler.insert_pageEntry(req.body, function(err, data){
      var result = insertEntry_handler(err, data);
      if(!err){
        save_htmldata(req.body.pageInfo,req.body.userInfo.email, function(){
          res.json(result);
        })
      }
      else{
        res.json(result);
      }
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

exports.insert_document = function(req, res){
  mongodb_handler.insert_docsData(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.update_document = function(req, res){
  mongodb_handler.update_docsData(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.remove_document = function(req, res){
  mongodb_handler.remove_docsData(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.get_document_list = function(req, res){
  mongodb_handler.get_docsData_with_index(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.get_document_content = function(req, res){
  mongodb_handler.get_document_content(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.insert_category = function(req, res){
  mongodb_handler.insert_categoryList(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.update_category = function(req, res){
  mongodb_handler.update_categoryList(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.remove_category = function(req, res){
  mongodb_handler.remove_categoryList(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.get_category_list = function(req, res){
  mongodb_handler.get_category_list(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  });
}

exports.documentEdit = function(req, res){
  var renderInfo = editorRenderInfo;

  renderInfo.userInfo = req.body.userInfo;
  renderInfo.documentName = req.params.documentName;
  renderInfo.editorState = 'edit';

  res.render('editortest', renderInfo);
}

exports.userChecking = function(req, res){
  var userInfo = req.body.userInfo;

  mongodb_handler.isUserExist(userInfo.email, function(isExist){
    if(isExist){
      res.redirect('/document');
    }else{
      mongodb_handler.insert_user(userInfo, function(err, data){
        if(err)
          console.log(err);
        res.redirect('/document');
      })
    }
  });
}

exports.get_bookmark_tree= function(req, res){
  mongodb_handler.get_bookmark_tree(req.body, function(err, data){
    var result = dbResult_handler(err, data);
    res.json(result);
  })
}
