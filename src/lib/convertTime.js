'use strict';

const moment = require('moment-timezone');

module.exports = function convertTime(events) {
  return events.map((event) => {
    const time = moment(event.start_time).tz('CET');

    return Object.assign({}, event, {
      dateStr: time.format('DD.MM.YYYY'),
      timeStr: time.format('HH:mm'),
    });
  });
};
