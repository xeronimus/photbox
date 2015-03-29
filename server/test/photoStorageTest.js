'use strict';

var photoStorage = require('../lib/photoStorage');

describe('photoStorage', function () {

  describe('#storePicture()', function () {

    it('should store picture', function (done) {
      photoStorage.storePicture('testSergio')
        .then(function () {
          done();
        }, function (err) {
          console.log(err);
        });
    });
  });
});