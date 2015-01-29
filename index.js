'use strict';

//////////////////////////////
// Exports
//////////////////////////////
module.exports = function (gulp) {
  var settings = {};


  //////////////////////////////
  // Node Dependencies
  //////////////////////////////
  var $ = require('gulp-load-plugins')(),
      paths = require('compass-options').dirs(),
      uglify = require('gulp-uglify'),
      browserSync = require('browser-sync'),
      cp = require('child_process'),
      runSequence = require('run-sequence').use(gulp),
      fs = require('fs'),
      defaultSettings = require('./settings.json'),
      _ = require('underscore');


  _.extend(settings, defaultSettings, paths);

  if (fs.existsSync('./poole.json')) {
    var overrideSettings = require('./poole.json');
    _.extend(settings, overrideSettings);
  }

  // TODO: Remove this, but right now, I am lazy.
  paths = settings;

  //////////////////////////////
  // Sass compile Task
  //////////////////////////////
  gulp.task('sass', function() {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src(paths.sass + '/**/*.scss')
      .pipe($.compass({
        config_file: './config.rb',
        css: paths.css,
        sass: paths.sass,
        bundle_exec: true,
        time: true
      }))
      .pipe($.autoprefixer('last 2 versions', '> 1%'))
      .pipe(gulp.dest(paths.css))
      .pipe(gulp.dest(paths.assets))
      .pipe(browserSync.reload({stream:true}));
  });

  //////////////////////////////
  // Image Task
  //////////////////////////////
  gulp.task('images', function() {
    return gulp.src(paths.imagesSrc + '/**/*')
      // Only grab the images that have changed.
      .pipe($.changed(paths.img))
      // Optimize all the images.
      .pipe($.imagemin({optimizationLevel: 5}))
      // Put them in the images directory.
      .pipe(gulp.dest(paths.img));
  });

  //////////////////////////////
  // Watch Task
  //////////////////////////////
  gulp.task('watch', function() {
    gulp.watch(paths.sass + '/**/*.scss', ['sass']);
    gulp.watch(paths.imagesSrc + '/**/*', function() {
      runSequence(['images'], ['jekyll-rebuild'])
    });
    gulp.watch(paths.jekyll, ['jekyll-rebuild']);
  });


  //////////////////////////////
  // BrowserSync Task
  //////////////////////////////
  gulp.task('browserSync', function() {
    browserSync({
      server: {
        baseDir: '_site'
      }
    });
  });

  //////////////////////////////
  // Jekyll Tasks
  //////////////////////////////
  gulp.task('jekyll-build', function (done) {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
      .on('close', done);
  });

  gulp.task('jekyll', ['jekyll-build']);

  // Jekyll Development server.
  gulp.task('jekyll-dev', function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
      .on('close', done);
  });

  gulp.task('jekyll-rebuild', function() {
    return runSequence(['jekyll-dev'], function () {
        browserSync.reload();
    });
  });

  //////////////////////////////
  // Server Tasks
  //////////////////////////////
  gulp.task('server', function(cb) {
    return runSequence(['images', 'sass'],
      'jekyll-dev',
      ['browserSync', 'watch'],
      cb
    );
  });

  gulp.task('serve', ['server']);

  //////////////////////////////
  // Build Task
  //////////////////////////////
  gulp.task('build', function(cb) {
    return runSequence(['sass', 'images'],
      'jekyll-build',
      cb
    );
  });

  //////////////////////////////
  // Deploy Task
  //////////////////////////////
  gulp.task('deploy', function(cb) {
    return runSequence(
      'build',
      'gh-pages',
      cb
    );
  });

  //////////////////////////////
  // Publishing Task
  //////////////////////////////
  gulp.task('gh-pages', function () {
    gulp.src('./_site/**/*')
      .pipe($.ghPages()).pipe(gulp.dest('/tmp/gh-pages')); ;
  });

}
