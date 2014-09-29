module.exports = {

  insert_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    if(!postData.userInfo || typeof(postData.docsInfo)!= "object"){
      callback("Insert Document Fail : argument error", null);
      return;
    }

    var docsData = {
      filename : postData.docsInfo.filename,
      category : postData.docsInfo.category,
      updateDate : new Date(),
      bookmarks : postData.docsInfo.bookmarks,
      content : postData.docsInfo.content
    };

    var userEmail = postData.userInfo.email;

    isDocsExist(userEmail, docsData.filename, function(err, isExist){
      if(err){
        callback(err, data);
      }else if(isExist){
        callback("Document already Exist", null);
      }else{
        userDataModel.update({userEmail: userEmail}, {'$push': { 'docsData': docsData}}, function(err, data){
          callback(err, data);
        });
      }
    });

  },

  update_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    if(!postData.userInfo || typeof(postData.docsInfo)!= "object"){
      callback("Update Document Fail : argument error", null);
      return;
    }

    var docsData = {
      filename : postData.docsInfo.filename,
      category : postData.docsInfo.category,
      updateDate : new Date(),
      bookmarks : postData.docsInfo.bookmarks,
      content : postData.docsInfo.content
    };

    var userEmail = postData.userInfo.email;

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, data);
        return;
      }

      data[0].docsData.forEach(function(item, index, array){
        if(item.filename == docsData.filename)
          array[index] = docsData;
      })

      userDataModel.update({userEmail:userEmail}, {docsData: data[0].docsData}, function(err, data){
        callback(err, data);
      });
    });
  },

  remove_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var docsData = postData.docsInfo;
    var userEmail = postData.userInfo.email;

    if(!userEmail || typeof(docsData)!= "object"){
      callback("Remove Document Fail : argument error", null);
      return;
    }

    isDocsExist(userEmail, docsData.filename, function(err, isExist){
      if(err){
        callback(err, data);
      }else if(isExist){
        userDataModel.update({userEmail:userEmail},{"$pull":{"docsData":{"filename":docsData.filename}}}, function(err, data){
          callback(err, data);
        });
      }else{
        callback("Document None Exist", null);
      }
    });
  },

  get_all_docsData: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var result = {
      docsList : []
    }

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, result);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", result);
        return;
      }

      result.docsList = data[0].docsData;

      callback(err, result);
    });
  },

  get_document_content: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};
    var userEmail = postData.userInfo.email;
    var filename = postData.docsInfo.filename;

    var result = {}

    userDataModel.find({userEmail:userEmail}, {"docsData": {"$elemMatch": {filename:filename}}},function(err, data){
      if(err){
        callback(err, result);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", null);
        return;
      }

      if(data[0].docsData.length == 0){
        console.log('none document data');
        callback("None document data", null);
        return;
      }

      result = data[0].docsData[0];

      callback(err, result);
    });

  },

  insert_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var newCategory = postData.newCategory;

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, null);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", null);
        return;
      }

      if(data[0].categoryList.indexOf(newCategory)>=0){
        callback("Category already Exist", null);
        return;
      }

      userDataModel.update({userEmail: userEmail}, {'$push': { 'categoryList': newCategory}}, function(err, data){
        callback(err, data);
      });
    });

  },

  update_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var oldCategory = postData.oldCategory
    var newCategory = postData.newCategory;

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, null);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", null);
        return;
      }

      if(oldCategory == 'All'){
        callback("Cannot update this category", null);
        null;
      }

      var index = data[0].categoryList.indexOf(oldCategory);
      if(index>=0){
        data[0].categoryList[index] = newCategory;
      }

      userDataModel.update({userEmail: userEmail}, {categoryList: data[0].categoryList}, function(err, data){
        callback(err, data);
      });
    });
  },

  remove_categoryList: function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var deleteCategory = postData.deleteCategory;

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, null);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", null);
        return;
      }

      if(data[0].categoryList.indexOf(deleteCategory)==-1){
        callback("Category doesn't Exist", null);
        return;
      }

      if(deleteCategory == 'All'){
        callback("Cannot remove this category", null);
        null;
      }

      userDataModel.update({userEmail:userEmail},{"$pull":{"categoryList": deleteCategory}}, function(err, data){
        callback(err, data);
      });
    });
  },

  get_category_list : function(postData, callback){
    if(typeof(callback) != "function") callback = function(){};

    var userEmail = postData.userInfo.email;
    var result = {
      categoryList : []
    }

    userDataModel.find({userEmail:userEmail}, function(err, data){
      if(err){
        callback(err, result);
        return;
      }

      if(data.length == 0){
        console.log('none user');
        callback("None user data", result);
        return;
      }

      result.categoryList = data[0].categoryList;

      callback(err, result);
    });

  }
}







