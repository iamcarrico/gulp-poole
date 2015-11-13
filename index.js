/**
 * A collection of gulp tasks to help make developing Jekyll sites easy.
 * @module gulp/mr.poole
 */
/* globals require module */

'use strict';

module.exports = function (gulp) {
  var settings = {};

  // Load required components.
  var $ = require('gulp-load-plugins')();
  var paths = require('compass-options').dirs();
  var uglify = require('gulp-uglify');
  var browserSync = require('browser-sync');
  var cp = require('child_process');
  var runSequence = require('run-sequence').use(gulp);
  var fs = require('fs');
  var defaultSettings = require('./settings.json');
  var _ = require('underscore');
  var Eyeglass = require("eyeglass").Eyeglass;
  var sassOptions = {
  };
  var eyeglass = new Eyeglass(sassOptions);

  // Merge settings objects.
  _.extend(settings, defaultSettings, paths);

  // If project contains a poole.json file, over-ride settings object.
  if (fs.existsSync('./poole.json')) {
    var overrideSettings = require('./poole.json');
    _.extend(settings, overrideSettings);
  }

  // TODO: Remove this, but right now, I am lazy.
  paths = settings;

  /**
   * Gulp task that compiles sass files.
   */
  gulp.task('sass', function () {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src(paths.sass + '/**/*.scss')
      .pipe($.sass(eyeglass.sassOptions()).on("error", $.sass.logError))
      .pipe($.autoprefixer('last 2 versions', '> 1%'))
      .pipe(gulp.dest(paths.css))
      .pipe(gulp.dest(paths.assets))
      .pipe(browserSync.reload({stream: true}));
  });

  /**
   * Gulp task that optimizes images.
   */
  gulp.task('images', function () {
    return gulp.src(paths.imagesSrc + '/**/*')
      // Only grab the images that have changed.
      .pipe($.changed(paths.img))
      // Optimize all the images.
      .pipe($.imagemin({optimizationLevel: 5}))
      // Put them in the images directory.
      .pipe(gulp.dest(paths.img));
  });


  /**
   * Gulp task that minify html.
   */
  gulp.task('htmlmin', function() {
    return gulp.src('./_site/**/*.html')
      .pipe($.htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./_site/'))
  });


  /**
   * Gulp task that listenes to file change events,
   * and runs other tasks accordingly.
   *
   * @see sass gulp task.
   * @see images gulp task.
   * @see jekyll-rebuild gulp task.
   */
  gulp.task('watch', function () {
    gulp.watch(paths.sass + '/**/*.scss', ['sass']);
    gulp.watch(paths.imagesSrc + '/**/*', function() {
      runSequence(['images'], ['jekyll-rebuild'])
    });
    gulp.watch(paths.jekyll, ['jekyll-rebuild']);
  });

  /**
   * Gulp task that runs browserSync.
   */
  gulp.task('browserSync', function () {
    browserSync({
      server: {
        baseDir: '_site'
      }
    });
  });

  /**
   * Gulp task that runs bundle exec, and jekyll build.
   */
  gulp.task('jekyll-build', function (cb) {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
      .on('close', cb);
  });

  /**
   * Alias for 'jekyll-build' gulp task.
   */
  gulp.task('jekyll', ['jekyll-build']);

  /**
   * Gulp task that runs bundle exec, and jekyll build for a dev server.
   */
  gulp.task('jekyll-dev', function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config=_config.yml,_config.dev.yml'], {stdio: 'inherit'})
      .on('close', cb);
  });

  /**
   * Gulp task that rebuilds a jekyll server.
   */
  gulp.task('jekyll-rebuild', function () {
    return runSequence(['jekyll-dev'], function () {
        browserSync.reload();
    });
  });

  /**
   * Gulp task that runs a jekyll server.
   *
   * @see images gulp task.
   * @see sass gulp task.
   */
  gulp.task('server', function (cb) {
    return runSequence(['images', 'sass'],
      'jekyll-dev',
      ['browserSync', 'watch'],
      cb
    );
  });

  gulp.task('serve', ['server']);

  /**
   * Gulp task that runs a jekyll build.
   */
  gulp.task('build', function (cb) {
    return runSequence(['sass', 'images'],
      'jekyll-build',
      'htmlmin',
      cb
    );
  });

  /**
   * Gulp task that runs a jekyll build and gh-pages subtasks.
   *
   * @see build gulp task.
   * @see gh-pages gulp task.
   */
  gulp.task('deploy', function (cb) {
    return runSequence(
      'build',
      'gh-pages',
      cb
    );
  });

  /**
   * Gulp task that deploys /_site directory to Github Pages.
   */
  gulp.task('gh-pages', function () {
    gulp.src('./_site/**/*')
      .pipe($.ghPages()).pipe(gulp.dest('/tmp/gh-pages')); ;
  });
}
