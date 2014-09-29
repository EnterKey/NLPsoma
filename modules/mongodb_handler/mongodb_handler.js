var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var _bookmark = require('./bookmark');
var _document = require('./document');

mongoose.connect('mongodb://localhost/chrome_extension');

var userDataSchema = new Schema({
  userEmail:String,
  userName:String,
  picture:String,
  fingerprint:String,
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
      title : String,
      content: String,
      status: Boolean
    }
  ],
  docsData : [
    {
      filename : String,
      updateDate : Date,
      category : String,
      bookmarks : [
        {
          url : String
        }
      ],
      content : String
    }
  ],
  categoryList : [
  ]
});

var userDataModel = mongoose.model('user', userDataSchema);

var parsePath = function(path){
  if(typeof(path)=='string' && path.slice(-1) != '/')
    path = path + '/';

  return path;
}


var isPageExist =  function(userEmail, url, callback){
  if(!userEmail){
    return callback("userEmail none", null);
  }
  userDataModel.find({userEmail: userEmail}, {"pageEntry": {"$elemMatch": {url:url}}}, function(err, data){
    if(err){
      callback(err, null);
    }else{
      if(data[0].pageEntry != undefined && data[0].pageEntry.length > 0)
        callback(null, true);
      else
        callback(null, false);
    }
  });
}

var isDirExist = function(userEmail, name, path, callback){
  if(!userEmail){
    return callback("userEmail none", null);
  }

  userDataModel.find({userEmail: userEmail}, {"pageDir": {"$elemMatch": {name:name, path:path}}}, function(err, data){
    if(err){
      callback(err, null);
    }else{
      if(data[0].pageDir != undefined && data[0].pageDir.length > 0)
        callback(null, true);
      else
        callback(null, false);
    }
  })
}

var isDocsExist = function(userEmail, name, callback){
  if(!userEmail){
    return callback("userEmail none", null);
  }

  userDataModel.find({userEmail: userEmail}, {"docsData": {"$elemMatch": {filename:name}}}, function(err, data){
    if(err){
      callback(err, null);
    }else{
      if(data[0].docsData != undefined && data[0].docsData.length > 0)
        callback(null, true);
      else
        callback(null, false);
    }
  })
}


var push_pageEntry = function(userEmail, pageInfo, callback){
  var self = this;
  var pageEntry = {};
  pageEntry.title = pageInfo.title;
  pageEntry.url = pageInfo.url;
  pageEntry.content = pageInfo.content;

  isPageExist(userEmail, pageEntry.url, function(err, isExist){
    if(err){
      callback(err, null);
    }else if(isExist){
      var updateEntry = {
        "pageEntry.$.title" : pageEntry.title,
        "pageEntry.$.url" : pageEntry.url,
        "pageEntry.$.content" : pageEntry.content,
        "pageEntry.$.path" : parsePath("/"),
        "pageEntry.$.status" : false
      }
      userDataModel.update({userEmail:userEmail, "pageEntry.url":pageInfo.url}, {"$set": updateEntry}, function(err, data){
        callback(err, data);
      });
    }else{
      if(pageInfo.path == undefined){
        pageEntry.path = parsePath("/");
        pageEntry.status = false;
      }else{
        pageEntry.path = parsePath(pageInfo.path);
        pageEntry.status = true;
      }
      userDataModel.update({userEmail: userEmail}, {'$push': { 'pageEntry': pageEntry}}, function(err, data){
        callback(err, data);
      });
    }
  })
}

var push_pageDir = function(userEmail, dirInfo, callback){
  var pageDir = {};
  pageDir.name = dirInfo.name;
  pageDir.path = parsePath(dirInfo.path);

  isDirExist(userEmail, pageDir.name, pageDir.path, function(err, isExist){
    if(err){
      callback(err, data);
    }else if(isExist){
      callback("DirExist", null);
    }else{
      userDataModel.update({userEmail: userEmail}, {'$push': { 'pageDir': pageDir}}, function(err, data){
        callback(err, data);
      });
    }
  });
}


exports.document = _document;
exports.bookmark = _bookmark;

function init(){
  console.log('mongo init');
};

init();
