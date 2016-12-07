'use strict';

function leftPad(thing) {
  if (`${thing}`.length === 1) {
    return `0${thing}`;
  }

  return thing;
}

module.exports = function convertTime(events) {
  return events.map((event) => {
    const time = new Date(event.start_time);
    const date = leftPad(time.getDate());
    const month = leftPad(time.getMonth() + 1);
    const year = time.getFullYear();

    const dateStr = `${date}.${month}.${year}`;
    const timeStr = `${leftPad(time.getHours())}:${leftPad(time.getMinutes())}`;

    return Object.assign({}, event, {
      dateStr,
      timeStr,
    });
  });
};
