module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        options: { 
          standalone: "plog"
        },
        src: './lib/index.js',
        dest: './dist/plog.js'
      }
    },

    karma: {
      all: {
        configFile: 'karma.conf.js',
        options: {
          singleRun: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['browserify', 'karma']);

};