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
  success: function (payload, response, options) {
    respond(response, payload, options);
  },

  error: function (error, response, options) {
    if (!_.isUndefined(options) && !_.isUndefined(options.statusCode)) {
      response.statusCode = options.statusCode;
    } else {
      response.statusCode = 400;
    }
    respond(response, error, options);
  },

  notFound: function (response) {
    this.error('Not found', response, { statusCode: 404 });
  },

  notAuthorized: function (response) {
    this.error('Not authorized', response, { statusCode: 401 });
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
