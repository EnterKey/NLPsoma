var system = require('system');
var args = system.args;
var url=args[1];
var path=args[2];
var page = require('webpage').create();
page.viewportSize = {width: 1920, height: 1080};
page.open(args[1], function() {
	if (status !== 'success') {
        console.log('Unable to load the address!');
    } else {
        window.setTimeout(function () {
            var bb = page.evaluate(function () { 
                return document.getElementsById("cke_1_contents")[0].getBoundingClientRect(); 
            });

            page.clipRect = {
                top:    bb.top,
                left:   bb.left,
                width:  bb.width,
                height: bb.height
            };

            page.render(path);
            phantom.exit();
        }, 200);
    }
});