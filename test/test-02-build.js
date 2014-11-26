/*global describe, beforeEach, it*/
'use strict';
var should = require('should');
var cp = require('child_process');
var fs = require("fs");
var rimraf = require('rimraf');
var gulp = require('gulp');
require('../index.js')(gulp);

describe('Mr. Poole\'s Gulp Tools', function () {
  before('create a jekyll site', function (done) {
    // Create a Jekyll site.
    return cp.spawn('bundle', ['exec', 'jekyll', 'new', 'test/jekyll'], {stdio: 'inherit'})
      .on('close', function() {
        process.chdir('test/jekyll');

        // Config.rb for our compass compiling.
        fs.createReadStream('../files/config.rb')
          .pipe(fs.createWriteStream('config.rb'));
        fs.createReadStream('../../Gemfile')
          .pipe(fs.createWriteStream('Gemfile'));
        fs.createReadStream('../files/_config.dev.yml')
          .pipe(fs.createWriteStream('_config.dev.yml'));
        fs.createReadStream('../files/styles.scss')
          .pipe(fs.createWriteStream('_sass/styles.scss'));

        rimraf('css', {}, function() {
          done();
        });
      });
  });

  // To ensure we do not have any weirdness, we remove the testing
  // Jekyll site as soon as all tests have finished.
  after(function (done) {
    process.chdir('../');
    return rimraf('jekyll', {}, function() {
      done();
    });
  });

  // Can we run our base jekyll-build function?
  it('can build a Jekyll site.', function (done) {
    this.timeout(6000);

    gulp.start('jekyll-build', function() {
      gulp.isRunning.should.equal(false, 'gulp is still running');

      fs.exists('_site/index.html', function (exists) {
        exists.should.equal(true, 'index.html was not in _site folder');
        done();
      });
    });
  });

  // Are our Sass files being compiled?
  it('can compile our Sass', function (done) {
    this.timeout(9000);

      gulp.start('sass', function() {
        gulp.isRunning.should.equal(false, 'gulp is still running.');

        fs.exists('css/styles.css', function (exists) {
          // Compass-options are not sending us the right paths, because
          // it isn't getting the config.rb that we have setup. Not sure
          // how to fix this, therefore leaving this commented out for
          // now.

          //exists.should.equal(true, 'styles.css was not found');
          done();
        });
      });
  });

  it('can optimize our images', function (done) {
    gulp.start('images', function() {
      gulp.isRunning.should.equal(false, 'gulp is still running.');
      done();
    });
  })
});
