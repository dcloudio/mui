var gulp = require("gulp");
var pkg = require("./package.json");
var uglify = require("gulp-uglify");
var minifycss = require('gulp-minify-css');
var del = require('del');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');

//var banner = ['/**',
//	' * <%= pkg.name %> - <%= pkg.description %>',
//	' * @version v<%= pkg.version %>',
//	' * @link <%= pkg.homepage %>',
//	' * @license <%= pkg.license %>',
//	' */',
//	''
//].join('\r\n');

var picker_banner = ['/**',
	'* 选择列表插件',
	'* varstion 2.0.0',
	'* by Houfeng',
	'* Houfeng@DCloud.io',
	'**/',
	''
].join('\r\n');

gulp.task('clear_picker', function(cb) {
	del(['dist/js/*.js', 'dist/css/*.css'], cb);


	// del(['dist/js/*.js', 'dist/css/*.css']).then(paths => {
	// 	console.log('Deleted files and folders:\n', paths.join('\n'));
	// });

});

gulp.task('build', ["clear_picker"], function() {
	//css
	gulp.src(["./css/mui.picker.css",
			"./css/mui.poppicker.css",
			"./css/mui.dtpicker.css"
		])
		.pipe(concat("mui.picker.all.css"))
		//.pipe(header(picker_banner))
		.pipe(gulp.dest("./dist/css/"))
		.pipe(minifycss())
		.pipe(rename("mui.picker.min.css"))
		.pipe(header(picker_banner))
		.pipe(gulp.dest("./dist/css/"));
	//js
	gulp.src(["./js/mui.picker.js",
			"./js/mui.poppicker.js",
			"./js/mui.dtpicker.js"
		])
		.pipe(concat("mui.picker.all.js"))
		//.pipe(header(picker_banner))
		.pipe(gulp.dest("./dist/js/"))
		.pipe(uglify())
		.pipe(rename("mui.picker.min.js"))
		.pipe(header(picker_banner))
		.pipe(gulp.dest("./dist/js/"));
});

gulp.task('default', ["build"]);