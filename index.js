/*jshint node:true */

"use strict";

var map = require('map-stream'),
	gutil = require('gulp-util'),
	exec = require('child_process').exec;

module.exports = function(command, opt){
	var counter = 0;

	// if path to codecept bin not supplied, use default vendor/bin path
	if (!command) {
		command = './vendor/bin/codecept run';
	}
	if (!opt) {
		opt = {};
	}

	if(typeof opt.testSuite === 'undefined') {
		opt.suite = '';
	}

	if (typeof opt.silent === 'undefined') {
		opt.silent = false;
	}

	if (typeof opt.debug === 'undefined'){
		opt.debug = false;
	}

	if(typeof opt.clear === 'undefined'){
		opt.clear = false;
	}

	if(typeof opt.testClass === 'undefined'){
		opt.testClass = '';
	}

	if(typeof opt.flags === 'undefined'){
		opt.flags = '';
	}

	if(typeof opt.notify === 'undefined'){
		opt.notify = false;
	}

	return map(function (file, cb) {
		var cmd = opt.clear ? 'clear && ' + command : command;

		if(opt.testSuite)
			cmd += ' ' + opt.testSuite;

		if(opt.testClass)
			cmd += ' ' + opt.testClass;

		// attach any flags
		cmd += ' ' + opt.flags;

		if(counter == 0) {
			counter++;
			if (opt.debug) console.log('Debug Cmd: ' + cmd);
			exec(cmd, function (error, stdout, stderr) {
				if (!opt.silent && stderr) {
					gutil.log(stderr);
				}
				if (stdout) {
					stdout = stdout.trim(); // Trim trailing cr-lf
				}
				if (!opt.silent && stdout) {
					gutil.log(stdout);
				}
				if(opt.debug && error) {
					console.log(error);
				}
				if(opt.notify) {
					cb(error, file);
				}
			});
		}
	});

};
