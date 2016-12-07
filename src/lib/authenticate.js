'use strict';

const FB = require('fb');

module.exports = function authenticate(token) {
  FB.setAccessToken(token);
};
