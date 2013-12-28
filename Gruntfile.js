module.exports = function(grunt) {

  var srcFiles = ['Gruntfile.js', 'karma.conf.js', './lib/**/*.js', './specs/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      build: {
        src: srcFiles
      },
      dev: {
        src: srcFiles,
        options: {
          force: true  
        }
      }
    },

    browserify: {
      build: {
        options: { 
          standalone: "plog"
        },
        src: './lib/index.js',
        dest: './dist/plog.js'
      }
    },

    karma: {
      build: {
        configFile: 'karma.conf.js',
        options: {
          singleRun: true
        }
      },
      dev: {
        configFile: 'karma.conf.js',
        options: {
          background: true,
          autoWatch: false
        }
      }
    },

    watch: {
      dev: {
        files: srcFiles,
        tasks: ['jshint:dev', 'browserify', 'karma:dev:run']
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'browserify', 'karma']);
  grunt.registerTask('dev', ['karma:dev:start', 'watch']);

};