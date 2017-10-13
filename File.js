var fs = require("fs");
var chokidar = require("chokidar");
var Base = require("./Base");
var is = require("./is");
var glob = require("glob");

// var File = require("../File");

// File("./define.js")
// 	.concat(File("./log.js"))
// 	.concat(");")
// 	.concat(File("./auto/*").join())
// 	.write("../lew42.github.io/simple.js");

var File = Base.extend({
	instantiate: function(){
		this.globCallback = this.globCallback.bind(this);
		glob.apply(null, [].slice.call(arguments).concat([this.globCallback]));

		this.unready();
	},
	unready: function(){
		this.ready = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	},
	then: function(cb, eb){
		return this.ready.then(cb.bind(this), eb.bind(this));
	},
	globCallback: function(err, files){
		if (err){
			this.reject(err);
		}
		this.list = files;
		this.initialize();
	},
	initialize: function(){

	},
	concat: function(fileOrStr){
		if (is.str(fileOrStr)){

		}
	},
	write: function(path){
		if (!path){
			if (!this.path){
				throw "This file has no path";
			} else {
				path = this.path;
			}
		}

		fs.writeFile(this.path, this.data(), (err) => {
			if (err) throw err;
			console.log("save successful", this.path);
		});
	}
});