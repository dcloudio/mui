'use strict';

var path    = require('path');
var del     = require('del');

var runSequence = require('run-sequence');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var pkg = require('./package.json');

// 路径配置信息
var config = {
  path: {
    less: [
      './less/mui.less',
    ],
    fonts: './fonts/*',
    js: [
        'js/mui.js',
        'js/mui.detect.js',
        'js/mui.detect.5+.js',
        'js/mui.event.js',
        'js/mui.target.js',
        'js/mui.fixed.js',
        'js/mui.fixed.bind.js',
        'js/mui.fixed.classlist.js',
        'js/mui.fixed.animation.js',
        'js/mui.fixed.fastclick.js',
        'js/mui.fixed.keyboard.js',
        'js/mui.namespace.js',
        'js/mui.gestures.js',
        'js/mui.gestures.flick.js',
        'js/mui.gestures.swipe.js',
        'js/mui.gestures.drag.js',
        'js/mui.gestures.tap.js',
        'js/mui.gestures.longtap.js',
        'js/mui.gestures.hold.js',
        'js/mui.gestures.pinch.js',
        'js/mui.init.js',
        'js/mui.init.5+.js',
        'js/mui.back.js',
        'js/mui.back.5+.js',
        'js/mui.init.pullrefresh.js',
        'js/mui.ajax.js',
        'js/mui.ajax.5+.js',
        'js/mui.layout.js',
        'js/mui.animation.js',
        'js/mui.class.js',
        'js/mui.pullRefresh.js',
        'js/mui.class.scroll.js',
        'js/mui.class.scroll.pullrefresh.js',
        'js/mui.class.scroll.slider.js',
        'js/pullrefresh.5+.js',
        'js/mui.offcanvas.js',
        'js/actions.js',
        'js/modals.js',
        'js/popovers.js',
        'js/segmented-controllers.js',
        'js/switches.js',
        'js/tableviews.js',
        'js/mui.dialog.alert.js',
        'js/mui.dialog.confirm.js',
        'js/mui.dialog.prompt.js',
        'js/mui.dialog.toast.js',
        'js/mui.popup.js',
        'js/input.plugin.js',
        'js/mui.number.js'

      ]
  },
  dist: {
    js: './dist/js',
    css: './dist/css',
    fonts: './dist/fonts'
  },
  uglify: {
    compress: {
      warnings: false
    },
    output: {
      ascii_only: true
    }
  }
};

var dateFormat = 'isoDateTime';

var banner = [
    '/*!',
    ' * =====================================================',
    ' * Mui v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Licensed under <%= pkg.license %> | ' + $.util.date(Date.now(), dateFormat),
    ' * =====================================================',
    ' */\n'
].join('\n');

// clean
gulp.task('build:clean', function() {
  return del([
    config.dist.css,
    config.dist.js
  ]);
});

// build less
gulp.task('build:less', function() {
  gulp.src(config.path.less)
    .pipe($.header(banner, {pkg: pkg, ver: ''}))
    .pipe($.plumber({errorHandler: function(err) {
      console.log(err);
      this.emit('end');
    }}))
    .pipe($.less({ 
        paths: [ path.join(__dirname, 'less') ]
    }))
    .pipe($.csscomb({configPath: path.join(__dirname, ".csscomb.json")}))
    .pipe(gulp.dest(config.dist.css))
    .pipe($.size({showFiles: true, title: 'source'}))
    .pipe($.minifyCss({noAdvanced: true}))
    .pipe($.rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(config.dist.css))
    .pipe($.size({showFiles: true, title: 'minified'}))
    .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}));
});

// build fonts
gulp.task('build:fonts', function() {
  gulp.src(config.path.fonts)
    .pipe(gulp.dest(config.dist.fonts));
});

// build js
gulp.task('build:js', function() {
  gulp.src(config.path.js)
    .pipe($.concat('mui.js'))
    .pipe($.header(banner, {pkg: pkg, ver: ''}))
    .pipe(gulp.dest(config.dist.js))
    .pipe($.size({showFiles: true, title: 'source'}))
    .pipe($.uglify(config.uglify))
    .pipe($.header(banner, {pkg: pkg, ver: ''}))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist.js))
    .pipe($.size({showFiles: true, title: 'minified'}))
    .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}));
});

// build
gulp.task('build', function(cb) {
  runSequence(
    'build:clean',
    ['build:less', 'build:fonts', 'build:js'],
    cb);
});

// watch
gulp.task('watch', function() {
  gulp.watch(['js/*.js'], ['build:js']);
  gulp.watch(['less/**/*.less'], ['build:less']);
});

// default
gulp.task('default', ['build']);