'use strict';

const FB = require('fb');
const Deferred = require('./Deferred');

module.exports = clientCredentials => () => {
  const d = new Deferred();

  FB.api('oauth/access_token', {
    client_id: clientCredentials.id,
    client_secret: clientCredentials.secret,
    grant_type: 'client_credentials',
  }, (res) => {
    if (!res || res.error) {
      return d.reject(!res ? 'error occurred' : res.error);
    }

    return d.resolve(res.access_token);
  });

  return d.promise;
};
