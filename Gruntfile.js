/*!
 * Mui's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function(string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	var generateNamespace = require('./grunt/mui-namespace-generator.js');
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			libPath: 'lib/',
			distPath: 'dist/',
			jsPath: 'js/',
			sassPath: 'sass/',
			examplesPath: 'examples/hello-mui/'
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * Mui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		clean: {
			all: ['<%= meta.distPath %>'],
			sourceMap: ['<%= meta.distPath %>css/*.map']
		},

		concat: {
			mui: {
				options: {
					banner: '<%= banner %>'
				},
				src: [
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
					'js/mui.progressbar.js',
					'js/input.plugin.js',
					'js/mui.transparent.js',
					'js/mui.number.js'

				],
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.js',
			}
		},

		sass: {
			options: {
				banner: '<%= banner %>',
				style: 'expanded',
				unixNewlines: true
			},
			dist: {
				files: {
					'<%= meta.distPath %>css/<%= pkg.name %>.css': 'sass/mui.scss',
				}
			}
		},

		csscomb: {
			options: {
				config: 'sass/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.distPath %>/css/<%= pkg.name %>.css': '<%= meta.distPath %>/css/<%= pkg.name %>.css'
				}
			},
		},

		copy: {
			fonts: {
				expand: true,
				src: 'fonts/mui*.ttf',
				dest: '<%= meta.distPath %>/'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.distPath %>',
				src: ['**/mui*'],
				dest: '<%= meta.examplesPath %>'
			}
		},

		cssmin: {
			options: {
				banner: '', // set to empty; see bellow
				keepSpecialComments: '*', // set to '*' because we already add the banner in sass
				sourceMap: false
			},
			mui: {
				src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
				dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {},
				mangle: true,
				preserveComments: false
			},
			mui: {
				src: '<%= concat.mui.dest %>',
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
			}
		},

		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			scripts: {
				files: [
					'<%= meta.sassPath %>/**/*.scss',
					'<%= meta.jsPath %>/**/*.js',
				],
				tasks: 'dist'
			}
		},

		jshint: {
			options: {
				jshintrc: 'js/.jshintrc'
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				src: 'js/*.js'
			}
		},

		jscs: {
			options: {
				config: 'js/.jscsrc'
			},
			grunt: {
				src: '<%= jshint.grunt.src %>'
			},
			src: {
				src: '<%= jshint.src.src %>'
			},
			docs: {
				src: '<%= jshint.docs.src %>'
			}
		},

		csslint: {
			options: {
				csslintrc: 'sass/.csslintrc'
			},
			src: [
				'<%= meta.distPath %>/css/<%= pkg.name %>.css',
			]
		},
		sed: {
			versionNumber: {
				pattern: (function() {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				})(),
				replacement: grunt.option('newver'),
				recursive: true
			}
		}
	});
	// Load the plugins
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	require('time-grunt')(grunt);
	// Default task(s).
	grunt.registerTask('cleanAll', ['clean']);
	grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin', 'clean:sourceMap']);
	grunt.registerTask('dist-js', ['concat', 'build-namespace', 'uglify']);
	grunt.registerTask('dist', ['clean:all', 'dist-css', 'dist-js', 'copy']);
	grunt.registerTask('build', ['dist']);
	grunt.registerTask('default', ['dist']);


	grunt.registerTask('build-namespace', generateNamespace);

	grunt.registerTask('server', ['dist','watch']);



	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};