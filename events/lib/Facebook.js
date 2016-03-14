'use strict';

const FB = require('fb');
const limit = 20;
const Promise = require('es6-promise').Promise;

function getToken(clientCredentials) {
  return new Promise((resolve, reject) => {
    FB.api('oauth/access_token', {
      client_id: clientCredentials.id,
      client_secret: clientCredentials.secret,
      grant_type: 'client_credentials',
    }, (res) => {
      if (!res || res.error) {
        return reject(!res ? 'error occurred' : res.error);
      }

      return resolve(res.access_token);
    });
  });
}

function toTs(time) {
  return new Date(time).getTime();
}

class Facebook {
  constructor(clientCredentials) {
    this.authenticated = this.authenticate(clientCredentials);
  }
  authenticate(clientCredentials) {
    return new Promise((resolve, reject) => {
      getToken(clientCredentials).then((token) => {
        FB.setAccessToken(token);
        resolve();
      }, reject);
    });
  }
  getEvents(pageId, after) {
    return this.authenticated.then(() => new Promise((resolve, reject) => {
      const now = new Date().getTime();

      FB.api(
        `/${pageId}/events`,
        {
          limit,
          after,
          since: Math.round(now / 1000),
        },
        (res) => {
          if (!res || res.error) {
            return reject(!res ? 'error occurred' : res.error);
          }

          let allEvents = Promise.resolve(res.data);

          if (res.data.length === limit &&
            res.paging && res.paging.cursors.after
          ) {
            allEvents = this
              .getEvents(pageId, res.paging.cursors.after)
              .then((moreEvents) => moreEvents.concat(res.data));
          }

          return allEvents.then((unfilterdEvents) => {
            const filteredEvents = unfilterdEvents.sort((eventA, eventB) => {
              const tsA = toTs(eventA.start_time);
              const tsB = toTs(eventB.start_time);

              if (tsA > tsB) {
                return 1;
              } else if (tsB > tsA) {
                return -1;
              }

              return 0;
            }).filter(
              (event) => toTs(event.start_time) >= now
            );

            return resolve(filteredEvents);
          }, reject);
        }
      );
    }));
  }
}

module.exports = Facebook;
