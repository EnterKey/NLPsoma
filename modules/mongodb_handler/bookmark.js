
module.exports = {
  userDataModel,

  init: function(){

  },

  isUserExist: function(userEmail, callback){
    if(!userEmail){
      return false;
    }

    self.userDataModel.find({userEmail: userEmail}, function(err, data){
      if(err){
        console.log('isUserExist err', err);
        callback(false);
      }else{
        if(data.length > 0)
          callback(true);
        else
          callback(false);
      }
    });
  },

  insert_user: function(userInfo, callback){
    if(typeof(callback) != "function") callback = function(){};
    var userData = new self.userDataModel();

    if(!userInfo){
      callback("no user Data");
      return;
    }

    userData.userEmail = userInfo.email;
    userData.userName = userInfo.name;
    userData.picture = userInfo.picture;
    userData.fingerprint = userInfo.fingerprint;
    userData.date = new Date();
    userData.categoryList = ['All'];

    userData.save(function(err, data){
      callback(err, data);
    })
  },

  insert_pageDir: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    if(!postData.userInfo || !postData.dirInfo){
      callback('query error', []);
      return;
    }

    var self = this;
    var userEmail = postData.userInfo.email;

    self.isUserExist(userEmail, function(isExist){
      if(isExist){
        push_pageDir(userEmail, postData.dirInfo, callback);
      }else{
        self.insert_user(postData.userInfo, function(err, data){
          if(err){
            callback(err, data);
          }
          else{
            push_pageDir(userEmail, postData.dirInfo, callback);
          }
        });
      }
    });
  },

   insert_pageEntry: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var self = this;
    var userEmail = postData.userInfo.email;

    self.isUserExist(userEmail, function(isExist){
      if(isExist){
        push_pageEntry(userEmail, postData.pageInfo, callback);
      }else{
        self.insert_user(postData.userInfo, function(err, data){
          if(err){
            callback(err, data);
          }
          else{
            push_pageEntry(userEmail, postData.pageInfo, callback);
          }
        });
      }
    });
  },

  get_pageDir_list: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var path = postData.path == undefined ? "/" : parsePath(postData.path);

    // self.userDataModel.aggregate()
    self.userDataModel.aggregate({$match: {userEmail:userEmail, pageDir: {$elemMatch:{path:path}}}}, {$unwind: "$pageDir"}, {$match: {"pageDir.path": path}},{$group: {_id: "$_id", pageDir: { $push: "$pageDir"}}}, function(err, data){
      if(typeof(data) != "object")
        data = [];
      callback(err, data[0]);
    });
  },

  get_pageEntry_list: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var path = postData.path == undefined ? "/" : parsePath(postData.path);

    self.userDataModel.aggregate({$match: {userEmail:userEmail, pageEntry: {$elemMatch:{path:path}}}}, {$unwind: "$pageEntry"}, {$match: {"pageEntry.path": path}},{$group: {_id: "$_id", pageEntry: { $push: "$pageEntry"}}}, function(err, data){
      if(typeof(data) != "object")
        data = [];
      callback(err, data[0]);
    });
  },

  get_pageAll_list: function(postData, callback){
    var self = this;
    var path = postData.path == undefined ? "/" : parsePath(postData.path);
    if(typeof(callback) != "function") callback = function(){};

    var result = {
      pageDir : [],
      pageEntry : [],
      status: false
    };

    var searchQuery = {
      userEmail: postData.userInfo.email
    };

    self.userDataModel.find(searchQuery, function(err, data){
      if(err){
        callback(err, result);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", result);
        return;
      }

      data[0].pageDir.forEach(function(item){
        if(typeof(item.path)=='string' && item.path == path)
          result.pageDir.push(item);
      });

      data[0].pageEntry.forEach(function(item){
        if(typeof(item.path)=='string' && item.path == path)
          result.pageEntry.push(item);
      });
      callback(err, result);
    })
  },


  remove_pageDir: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var path = postData.dirInfo.path == undefined ? null : parsePath(postData.dirInfo.path);
    var dirPath = path + postData.dirInfo.name + '/';
    dirPath = new RegExp('^' + dirPath);

    console.log(dirPath);
    self.userDataModel.update({userEmail:userEmail},{"$pull":{"pageEntry":{"path":dirPath}}}, function(err, data){
      if(err)
        callback('delete entry error', data);

      self.userDataModel.update({userEmail:userEmail},{"$pull":{"pageDir":{"path":dirPath}}}, function(err, data){
        if(err)
          callback('delete dir error', data);

        self.userDataModel.update({userEmail:userEmail}, {"$pull":{"pageDir":{"path":path, "name":postData.dirInfo.name}}}, function(err, data){
          callback(err, data);
        });
      });
    });
  },

  remove_pageEntry: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var email = postData.userInfo.email;
    var url = postData.pageInfo.url;
    self.userDataModel.update({userEmail:email},{"$pull":{"pageEntry":{"url":url}}}, function(err, data){
      callback(err, data);
    });
  },

  move_dirPath: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var dirInfo = postData.dirInfo;
    dirInfo.oldPath = dirInfo.oldPath == undefined ? null :parsePath(dirInfo.oldPath);
    dirInfo.newPath = dirInfo.newPath == undefined ? null :parsePath(dirInfo.newPath);

    var searchQuery = {
      userEmail: userEmail
    };

    isDirExist(userEmail, dirInfo.name, dirInfo.newPath, function(err, isExist){
      if(err){
        callback(err, data);
      }else if(isExist){
        callback("DirExist", null);
      }else{
        self.userDataModel.find(searchQuery, function(err, data){
          if(err){
            callback(err, data);
            return;
          }

          data[0].pageEntry.forEach(function(item){
            item.path = item.path.replace(dirInfo.oldPath+dirInfo.name+'/', dirInfo.newPath+dirInfo.name+'/');
          })
          data[0].pageDir.forEach(function(item){
            item.path = item.path.replace(dirInfo.oldPath+dirInfo.name+'/', dirInfo.newPath+dirInfo.name+'/');
            if(item.name == dirInfo.name && item.path.indexOf(dirInfo.oldPath)==0)
              item.path = item.path.replace(dirInfo.oldPath, dirInfo.newPath);
          })

          self.userDataModel.update(searchQuery, {pageDir: data[0].pageDir, pageEntry: data[0].pageEntry}, function(err, data){
            callback(err, data);
          });
        });
      }
    });
  },

  move_entryPath: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var pageInfo = postData.pageInfo;
    var userEmail = postData.userInfo.email;
    pageInfo.oldPath = pageInfo.oldPath == undefined ? null :parsePath(pageInfo.oldPath);
    pageInfo.newPath = pageInfo.newPath == undefined ? null :parsePath(pageInfo.newPath);

    var searchQuery = {
      userEmail: userEmail
    };

    self.userDataModel.find(searchQuery, function(err, data){
      if(err){
        callback(err, data);
        return;
      }

      data[0].pageEntry.forEach(function(item){
        if(item.url == pageInfo.url && item.path.indexOf(pageInfo.oldPath)==0)
          item.path = item.path.replace(pageInfo.oldPath, pageInfo.newPath);
      })

      self.userDataModel.update(searchQuery, {pageEntry: data[0].pageEntry}, function(err, data){
        callback(err, data);
      });
    });
  },

  rename_pageDir: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var dirInfo = postData.dirInfo;
    dirInfo.path = parsePath(dirInfo.path);

    var searchQuery = {
      userEmail: postData.userInfo.email
    };

    isDirExist(postData.userInfo.email, dirInfo.new_name, dirInfo.path, function(err, isExist){
      if(err){
        callback(err, null);
      }else if(isExist){
        callback("Already Exist name", null);
      }else{
        self.userDataModel.find(searchQuery, function(err, data){
          if(err){
            callback(err, data);
            return;
          }

          data[0].pageEntry.forEach(function(item){
            item.path = item.path.replace(dirInfo.path+dirInfo.name+'/', dirInfo.path+dirInfo.new_name+'/');
          })

          data[0].pageDir.forEach(function(item){
            item.path = item.path.replace(dirInfo.path+dirInfo.name+'/', dirInfo.path+dirInfo.new_name+'/');
            if(item.name == dirInfo.name && item.path == dirInfo.path)
              item.name = dirInfo.new_name;
          })

          self.userDataModel.update(searchQuery, {pageDir: data[0].pageDir, pageEntry: data[0].pageEntry}, function(err, data){
            callback(err, data);
          });
        });
      }
    });
  },

  rename_pageEntry: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var pageInfo = postData.pageInfo;

    self.userDataModel.update({userEmail:postData.userInfo.email, "pageEntry.url":pageInfo.url}, {"$set":{"pageEntry.$.title":pageInfo.new_title}}, function(err, data){
      callback(err, data);
    });
  },

}







