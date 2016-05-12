module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/d3/d3.min.js',
        'bower_components/d3/d3.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-hotkeys/build/hotkeys.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/bootstrap-tour/build/js/bootstrap-tour.min.js',
        'bower_components/jsog/lib/JSOG.js',

        'other/annotationStructures.js',
        'other/xml2json.js',

        'components/**/*.js',
        'modules/*.js',
        'services/dataServices.js',
        'controllers/*.js',
        'controllers/**/*.js',
        'directives/*.js',
        'tests/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : [
        'Chrome',
        'Firefox'
    ],

    plugins : [
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-jasmine',
        'karma-junit-reporter'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
