'use strict';

const loadEnv = require('serverless-helpers-js').loadEnv;
const respond = require('../lib').respond;

loadEnv();

exports.handler = function handler(event, context) {
  respond(
    event,
    (err, response) => context.done(err, response)
  );
};
