'use strict';

require('serverless-helpers-js').loadEnv();

const Facebook = require('../lib').Facebook;
const facebook = new Facebook({
  id: process.env.FACEBOOK_EVENT_PROXY_APP_ID,
  secret: process.env.FACEBOOK_EVENT_PROXY_APP_SECRET,
});
const pageId = process.env.FACEBOOK_EVENT_PROXY_PAGE_ID;

exports.handler = function handler(event, context) {
  facebook.getEvents(pageId).then((allEvents) => {
    context.done(null, allEvents);
  }, (err) => {
    context.done(JSON.stringify(err));
  });
};
