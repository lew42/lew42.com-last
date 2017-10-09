var fs = require("fs");
var chokidar = require("chokidar");
var Base = require("./Base");
var is = require("./is");
var glob = require("glob");

var File = Base.extend({
	instantiate: function(){
		// array of matches
		this.list = globule.find.apply(globule, arguments);

	},

	initialize: function(path){

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