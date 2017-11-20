var gulp = require("gulp");
gulp.concat = require("gulp-concat");
gulp.ejs = require("gulp-ejs");
gulp.util = require("gulp-util");
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");

var express = require("express");
var livereload = require("./livereload");

var http = require("http");
var chokidar = require("chokidar");
var WebSocket = require("ws");

var reloadWatchGlobs = [
	"./lew42.github.io",
	"./simple/docs",
	"./Module/docs",
	"!**/*.css",
	"!.git", "!**/.git"
];

var server = function(){

	var app = express();
	app.use(express.static(__dirname + "/lew42.github.io"));

	app.use("/Module/", express.static(__dirname + "/Module/docs"));
	app.use("/simple/", express.static(__dirname + "/simple/docs"));

	var server = http.createServer(app);
	var wss = new WebSocket.Server({
		perMessageDeflate: false,
		server: server
	});

	wss.on("connection", function(ws){
		console.log("connected");

		chokidar.watch(reloadWatchGlobs).on("change", (e) => {
			console.log(e, "changed, sending reload message");
			ws.send("reload", (err) => {
				if (err) console.log("livereload transmit error");
				else console.log("reload message sent");
			});
		});
	});

	server.listen(80, function(){
		console.log("Listening..");
	});
};


// gulp.task("default", function(){
// 	return gulp.src("./lew42.github.io/lew42.ejs")
// 		.pipe(gulp.ejs({
// 			msg: "hello world"
// 		}, {}, { ext: ".js" }).on("error", gulp.util.log))
// 		.pipe(gulp.dest("./lew42.github.io"))
// });

var moduleGlobs = [
	__dirname + "/Module/docs/Module.js"
];

var simpleModule = function(name){
	return __dirname + "/simple/docs/modules/" + name + "/" + name + ".js";
};

var simpleGlobs = [
	__dirname + "/lew42.github.io/Module.js",
	simpleModule("docReady"),
	simpleModule("is"),
	simpleModule("Base"),
	__dirname + "/simple/docs/modules/mixin/events.js",
	simpleModule("mixin"),
	simpleModule("Base2"),
	simpleModule("View"),
	simpleModule("Test"),
	simpleModule("server"),
	simpleModule("simple")
];

gulp.task("watch", function(){
    gulp.watch(moduleGlobs, ['build-module']);
	gulp.watch(simpleGlobs, ['build-simple'])
});

gulp.task("build-module", function(){
	return gulp.src(moduleGlobs)
		.pipe(concat("Module.js"))
		.pipe(gulp.dest(__dirname + "/lew42.github.io/"));
});

gulp.task("build-simple", ["build-module"], function(){
	return gulp.src(simpleGlobs)
		.pipe(concat("simple.js"))
		.pipe(gulp.dest(__dirname + "/lew42.github.io/"));
});

gulp.task("default", ["build-simple", "watch"], function(){
	server();
});