'use strict';

const getToken = require('../lib/getToken');
const authenticate = require('../lib/authenticate');
const getEvents = require('../lib/getEvents');

module.exports = function get(event, context, callback) {
  const pageId = process.env.FACEBOOK_EVENT_PROXY_PAGE_ID;
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
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(allEvents),
      });
    })
    .catch((err) => {
      callback(JSON.stringify(err));
    });
};
