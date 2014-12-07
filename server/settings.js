var path = require('path');

module.exports = {
  "logging": {
    "level": "debug"
  },
  "storage": path.join(__dirname, "./photos"),
  "useMockGphoto": true
};