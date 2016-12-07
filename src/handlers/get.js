'use strict';

const getToken = require('../lib/getToken');
const authenticate = require('../lib/authenticate');
const getEvents = require('../lib/getEvents');

const pageId = process.env.FACEBOOK_EVENT_PROXY_PAGE_ID;

module.exports = function get(event, context, callback) {
  const clientCredentials = {
    id: process.env.FACEBOOK_EVENT_PROXY_APP_ID,
    secret: process.env.FACEBOOK_EVENT_PROXY_APP_SECRET,
  };

  Promise.resolve()
    .then(getToken(clientCredentials))
    .then(authenticate)
    .then(getEvents(pageId))
    .then((allEvents) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(allEvents),
      });
    })
    .catch((err) => {
      callback(JSON.stringify(err));
    });
};
