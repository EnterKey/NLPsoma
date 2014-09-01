
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
app.get('/document', checkSession_get, routes.document);
app.get('/bookmark', checkSession_get, routes.bookmark);
app.get('/editor', checkSession_get, routes.editor);
app.get('/snapshot/:hashurl', checkSession_get, routes.snapshot);

app.post('/ajax/insert_user', checkSession_post, routes.insert_user);
app.post('/ajax/insert_pageEntry', checkSession_post, routes.insert_pageEntry);
app.post('/ajax/insert_pageDir', checkSession_post, routes.insert_pageDir);
app.post('/ajax/get_pageEntry_list', checkSession_post, routes.get_pageEntry_list);
app.post('/ajax/get_pageDir_list', checkSession_post, routes.get_pageDir_list);
app.post('/ajax/get_pageAll_list', checkSession_post, routes.get_pageAll_list);
app.post('/ajax/remove_pageEntry', checkSession_post, routes.remove_pageEntry);
app.post('/ajax/remove_pageDir', checkSession_post, routes.remove_pageDir);
app.post('/ajax/move_dirPath', checkSession_post, routes.move_dirPath);
app.post('/ajax/move_entryPath', checkSession_post, routes.move_entryPath);
app.post('/ajax/rename_pageDir', checkSession_post, routes.rename_pageDir);
app.post('/ajax/rename_pageEntry', checkSession_post, routes.rename_pageEntry);
app.post('/ajax/auth/extension/google', extensionCheckSession);


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
