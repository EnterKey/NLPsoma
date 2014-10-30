
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var passport = require('passport');
var app = express();
// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
  key    : 'sid',
  secret : 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
  oauth setting
*/

require('./modules/oauth')(app);

app.get('/', routes.main);
app.get('/main', checkSession_get, routes.userChecking);
app.get('/document', checkSession_get, routes.document);
app.get('/bookmark', checkSession_get, routes.bookmark);
app.get('/editor', checkSession_get, routes.editor);
app.get('/editor/:documentName', checkSession_get, routes.documentEdit);
app.get('/snapshot/:hashurl', checkSession_get, routes.snapshot);
app.get('/snaptext/:hashurl', checkSession_get, routes.snaptext);
/*http://localhost:4000/abc?CKEditor=editor1&CKEditorFuncNum=1&langCode=en*/
app.post('/imageUpload', checkSession_post, routes.imageupload);
// app.post('/htmltopdf', checkSession_post, routes.html_to_pdf);
// app.get('/htmltopdf', checkSession_get, routes.html_to_pdf_view);
app.get('/imageUpload/:email/:originalFilename', routes.imageuploadview);

app.post('/ajax/insert_user', checkSession_post, routes.insert_user);
app.post('/ajax/insert_pageEntry', checkSession_post, routes.insert_pageEntry);			//extension 에서 page를 추가할 때 쓰는 요청을 받는 부분입니다.
app.post('/ajax/insert_pageDir', checkSession_post, routes.insert_pageDir);			//extension 에서 directory를 추가할 때 쓰는 요청을 받는 부분입니다.
app.post('/ajax/get_pageEntry_list', checkSession_post, routes.get_pageEntry_list);		//Bookmark view에서 Entry list를 전부 가져올때 쓰는 부분입니다.
app.post('/ajax/get_pageDir_list', checkSession_post, routes.get_pageDir_list);			//Bookmark view에서 directory list를 전부 가져올때 쓰는 부분입니다.
app.post('/ajax/get_pageAll_list', checkSession_post, routes.get_pageAll_list);			//Bookmark view에서 directorym, entry list를 전부 가져올때 쓰는 부분입니다.
app.post('/ajax/remove_pageEntry', checkSession_post, routes.remove_pageEntry);			//Bookmark view에서 entry를 지울 때 쓰는 부분입니다.
app.post('/ajax/remove_pageDir', checkSession_post, routes.remove_pageDir);			//Bookmark view에서 Directory를 지울 때 쓰는 부분입니다.
app.post('/ajax/move_dirPath', checkSession_post, routes.move_dirPath);				//Bookmark view에서 Directory위치를 변경할 때 쓰는 부분입니다.
app.post('/ajax/move_entryPath', checkSession_post, routes.move_entryPath);			//Bookmark view에서 Entry위치를 변경할 때 쓰는 부분입니다.
app.post('/ajax/rename_pageDir', checkSession_post, routes.rename_pageDir);			//Bookmark view에서 Directory 이름을 변경할 때 쓰는 부분입니다.
app.post('/ajax/rename_pageEntry', checkSession_post, routes.rename_pageEntry);			//Bookmark view에서 Entry 이름을 변경할 때 쓰는 부분입니다.
app.post('/ajax/auth/extension/google', extensionCheckSession);					//outh를 관장하는 부분입니다.

app.post('/ajax/document/insert', checkSession_post, routes.insert_document);
app.post('/ajax/document/update', checkSession_post, routes.update_document);
app.post('/ajax/document/remove', checkSession_post, routes.remove_document);
app.post('/ajax/document/get_list', checkSession_post, routes.get_document_list);
app.post('/ajax/document/get_content', checkSession_post, routes.get_document_content);

app.post('/ajax/category/get_list', checkSession_post, routes.get_category_list);
app.post('/ajax/category/insert', checkSession_post, routes.insert_category);
app.post('/ajax/category/update', checkSession_post, routes.update_category);
app.post('/ajax/category/remove', checkSession_post, routes.remove_category);
app.post('/ajax/bookmark/get_tree', checkSession_post, routes.get_bookmark_tree);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function checkSession_get(req, res, next){

  if(!req.session || !req.user){
    res.redirect('/');
    return;
  }else{
    var userInfo = {
      email:req.user._json.email,
      name:req.user._json.name,
      picture:req.user._json.picture
    }

    req.body.userInfo = userInfo;
  }

  next();
}

function checkSession_post(req, res, next){
  if(typeof(next) != "function") next = function(){};

  if(!req.session || !req.user){
    res.json({status: false, errorMsg: "Need Login"});
    return;
  }else{
    var userInfo = {
      email:req.user._json.email,
      name:req.user._json.name,
      picture:req.user._json.picture
    }

    req.body.userInfo = userInfo;
  }

  next();
}

function extensionCheckSession(req, res){
  if(typeof(next) != "function") next = function(){};

  if(!req.session || !req.user){
    res.json({status: false, errorMsg: "Need Login"});
  }else{
    res.json({status: true, errorMsg: null});
  }
}
