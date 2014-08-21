
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
app.get('/document', checkSession, routes.document);
app.get('/bookmark', checkSession, routes.bookmark);
app.get('/editor', checkSession, routes.editor);

app.post('/ajax/insert_user', checkSession, routes.insert_user);
app.post('/ajax/insert_pageEntry', checkSession, routes.insert_pageEntry);
app.post('/ajax/insert_pageDir', checkSession, routes.insert_pageDir);
app.post('/ajax/get_pageEntry_list', checkSession, routes.get_pageEntry_list);
app.post('/ajax/get_pageDir_list', checkSession, routes.get_pageDir_list);
app.post('/ajax/get_pageAll_list', checkSession, routes.get_pageAll_list);
app.post('/ajax/remove_pageEntry', checkSession, routes.remove_pageEntry);
app.post('/ajax/remove_pageDir', checkSession, routes.remove_pageDir);
app.post('/ajax/move_dirPath', checkSession, routes.move_dirPath);
app.post('/ajax/move_entryPath', checkSession, routes.move_entryPath);
app.post('/ajax/rename_pageDir', checkSession, routes.rename_pageDir);
app.post('/ajax/rename_pageEntry', checkSession, routes.rename_pageEntry);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function checkSession(req, res, next){

  if(!req.session || !req.user){
    res.redirect('/');
    return;
  }else{
    var userInfo = {
      email:req.user._json.email,
      name:req.user._json.name,
      pciture:req.user._json.picture
    }

    req.body.userInfo = userInfo;
  }

  next();
}

