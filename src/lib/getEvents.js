'use strict';

const Deferred = require('./Deferred');
const FB = require('./acl/fb');

const LIMIT = 20;

function toTs(time) {
  return new Date(time).getTime();
}

const getEvents = (pageId, after) => () => {
  const d = new Deferred();
  const now = new Date().getTime();

  FB.api(
    `/${pageId}/events`,
    {
      limit: LIMIT,
      since: Math.round(now / 1000),
      after,
    },
    (res) => {
      if (!res || res.error) {
        return d.reject(!res ? 'error occurred' : res.error);
      }

      let allEvents = Promise.resolve(res.data);

      if (res.data.length === LIMIT &&
        res.paging && res.paging.cursors.after
      ) {
        allEvents = Promise.resolve()
          .then(getEvents(pageId, res.paging.cursors.after))
          .then(moreEvents => moreEvents.concat(res.data));
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
        }).filter(event => toTs(event.start_time) >= now);

        return d.resolve(filteredEvents);
      }, d.reject);
    }
  );

  return d.promise;
};

module.exports = getEvents;
