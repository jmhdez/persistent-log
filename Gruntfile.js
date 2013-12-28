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
    }



  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);

};