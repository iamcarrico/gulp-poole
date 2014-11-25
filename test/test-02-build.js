/*global describe, beforeEach, it*/
'use strict';
var should = require('should');
var cp = require('child_process');
var rimraf = require('rimraf');
var gulp = require('gulp');
require('../index.js')(gulp);

describe('Mr. Poole\'s Gulp Tools', function () {
  before(function (done) {
    // Create a Jekyll site.
    return cp.spawn('bundle', ['exec', 'jekyll', 'new', 'test/jekyll'], {stdio: 'inherit'})
      .on('close', function() {
        process.chdir('test/jekyll');
        done();
      });
  });

  after(function (done) {
    // Remove the Jekyll site to cleanup.
    process.chdir('../');
    return rimraf('jekyll', {}, function() {
      done();
    })
  });



  it('can build a Jekyll site.', function (done) {
    this.timeout(90000);




    gulp.start('build', function() {
      gulp.isRunning.should.equal(false);
      done();
    });
  });
});
