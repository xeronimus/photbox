var
  expect = require('expect.js'),
  photoStorage = require('../lib/photoStorage');

describe('photoStorage', function () {

  describe('#storePicture()', function () {

    it('should store picture', function (done) {
      photoStorage.storePicture('testSergio')
        .then(function (a) {
          done();
        }, function (err) {
          console.log(err);
        });
    });
  });
});