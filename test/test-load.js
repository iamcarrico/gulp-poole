/*global describe, beforeEach, it*/
'use strict';
var should = require('should');

describe('Mr. Poole\'s Gulp Tools', function () {
  it('can be imported without blowing up', function () {
    var gulp = require('gulp');
    require('../index.js')(gulp);
    // Grabbing a test that we know exists.
    should.exist(gulp.tasks.serve);
  });
});
