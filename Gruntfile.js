module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
        files: ['./lib/**/*.js', './specs/**/*.js'],
        tasks: ['browserify', 'karma:dev:run']
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify', 'karma']);
  grunt.registerTask('dev', ['karma:dev:start', 'watch']);

};