"use strict";

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    paths: {
      src: 'src',
      dist: '.',
      vendor: 'bower_components',
      test: 'test'
    },
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
    ' * <%= pkg.name %> v<%= pkg.version %>\n' +
    ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' */\n',

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        interrupt: false,
        livereload: true
      },
      src: {
        files: [
          'Gruntfile.js',
          '<%= paths.src %>',
          '<%= paths.test %>/unit/*.js'
        ],
        tasks: ['default']
      }
    },

    'strip_code': {
      options: {
        'start_comment': 'start-test-block',
        'end_comment': 'end-test-block'
      },
      stripTestCode: {
        src: '<%= paths.src %>/<%= pkg.name %>.js',
        dest: '<%= paths.dist %>/<%= pkg.name %>.js'
      }
    },

    // Minify JavaScript
    uglify: {
      dist: {
        src: '<%= paths.dist %>/<%= pkg.name %>.js',
        dest: '<%= paths.dist %>/<%= pkg.name %>.min.js'
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= paths.src %>/*.js'
      ]
    },

    // JavaScript unit tests
    karma: {
      options: {
        configFile: '<%= paths.test %>/unit/karma.conf.js',
        singleRun: true
      },
      unit: {},
      travis: {
        browsers: ['PhantomJS']
      }
    },

    coveralls: {
      options: {
        'coverage_dir': './coverage'
      }
    },

    // Create OS notifications alerting progress
    notify: {
      default: {
        options: {
          title: '<%= pkg.title %>',
          message: 'SUCCESS: Grunt Complete'
        }
      }
    }

  });

  grunt.registerTask('default', [
    'jshint',
    'karma:unit',
    'strip_code',
    'uglify',
    'notify:default'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:travis',
    'coveralls'
  ]);

};
