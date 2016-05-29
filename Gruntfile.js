module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' + src;
                },
            },
            dist: {
                src: ['../deriver-master/src/*.js'],
                dest: 'lib/js/deriver.js'
            }
        },
        copy: {
            js: {
                files: [{
                    src: './bower_components/jquery/dist/jquery.min.js',
                    dest: 'lib/js/jquery.min.js'
                }]
            },
            css: {
                files: [{
                    src: './bower_components/bootstrap/dist/css/bootstrap.css',
                    dest: 'lib/css/bootstrap.css'
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    grunt.registerTask('default', ['concat', 'copy']);

};
