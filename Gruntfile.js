'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,**/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            compass: {
                files: ['app/scss/{,**/}*.{scss,sass}'],
                tasks: ['compass']
            }
        },
        compass: {
            options: {
                sassDir: 'app/scss',
                cssDir: 'www/stylesheets',
                imagesDir: 'www/images',
                fontsDir: 'app/scss/fonts',
                httpImagesPath: '/images',
                importPath: 'www/components/bootstrap-sass/vendor/assets/stylesheets/bootstrap',
                relativeAssets: false,
                debugInfo: false
            },
            dist: {}
        }
    });

    grunt.registerTask('default', [
        'steroids-make',
        // 'steroids-compile-sass',
        'compass'
        // 'watch'
    ]);
};
