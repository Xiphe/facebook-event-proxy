'use strict';

const FB = require('./acl/fb');

module.exports = function authenticate(token) {
  FB.setAccessToken(token);
};
