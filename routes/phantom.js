var system = require('system');
var args = system.args;
var url=args[1];
var path=args[2];
var page = require('webpage').create();
page.viewportSize = {width: 1920, height: 1080};
page.open(args[1], function() {
	page.render(path);
	phantom.exit();
});