var connect = require('connect'),
	io = require('socket.io').listen(9001),
	port = 9000,
	fs = require('fs');

connect.createServer(
	connect.static(__dirname + '/public') // two underscores
).listen(port);
var isReady = false;
var that;
var fileArray = [];
io.sockets.on('connection', function(socket) {
	console.log('I got connection');
	if(isReady) {
		socket.emit('stuff', fileArray);
	}
});

var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + '/' + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
};

walk('../../../', function(err, results) {
	if (err) throw err;
	// console.log(results);
	// result is an array
	// search for how many file extension we have
	results.forEach(function(item) {
		var filename = item.substring(item.lastIndexOf('/') + 1, item.length);
		// var myRegexp = /.\.\w+$/;

		// var output1 = myRegexp.exec(filename);
		// console.log(filename);
		if(filename.match(/.\.\w+$/)) {
			fileArray.push({
				filename: filename.substring(0, filename.lastIndexOf('.')),
				extension: filename.substring(filename.lastIndexOf('.') + 1, filename.length)
			});
		}
	});
	isReady = true;
	console.log('--------------DONE---------------');
});