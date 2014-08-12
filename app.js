
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/main', routes.main);
app.get('/auth', routes.auth);
app.get('/', routes.index);

app.post('/ajax/insert_user', routes.insert_user);
app.post('/ajax/insert_pageEntry', routes.insert_pageEntry);
app.post('/ajax/insert_pageDir', routes.insert_pageDir);
app.post('/ajax/get_pageEntry_list', routes.get_pageEntry_list);
app.post('/ajax/get_pageDir_list', routes.get_pageDir_list);
app.post('/ajax/get_pageAll_list', routes.get_pageAll_list);
app.post('/ajax/remove_pageEntry', routes.remove_pageEntry);
app.post('/ajax/remove_pageDir', routes.remove_pageDir);
app.post('/ajax/move_dirPath', routes.move_dirPath);
app.post('/ajax/move_entryPath', routes.move_entryPath);
app.post('/ajax/auth', routes.ajax_auth);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
