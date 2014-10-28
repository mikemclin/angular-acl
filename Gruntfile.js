"use strict";

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    paths: {
      src: './angular-acl.js',
      dist: '.',
      vendor: 'bower_components',
      test: 'test'
    },
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
    ' * <%= pkg.title %> v<%= pkg.version %>\n' +
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

    // Minify JavaScript
    uglify: {
      dist: {
        src: '<%= paths.src %>',
        dest: '<%= paths.dist %>/angular-acl.min.js'
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
        '<%= paths.src %>'
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
    'uglify',
    'notify:default'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:travis',
    'coveralls'
  ]);

};