/**
 * Utility module to send standardized error and success responses to the client.
 * Prefer these methods over invoking functions on httpResponse directly.
 */

'use strict';

var _ = require('lodash');

function respond(response, body) {
  response.json(body);
  response.status(body.statusCode);
}

var responseHandler = {
  success: function (payload, response) {
    respond(response, payload);
  },

  error: function (error, response, statusCode) {
    if (!_.isUndefined(statusCode)) {
      response.statusCode = statusCode;
    } else {
      response.statusCode = 400;
    }
    respond(response, error);
  },

  send: function (error, payload, res, options) {
    if (error) {
      responseHandler.error(error, res, options);
    } else {
      responseHandler.success(payload, res, options);
    }
  }
};

module.exports = responseHandler;
