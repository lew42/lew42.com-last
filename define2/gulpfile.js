var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("default", function(){
	gulp.src(["one", "two"])
		.pipe(concat("three", { newLine: "\r\n" }))
		.pipe(gulp.dest("./"))
});