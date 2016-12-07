'use strict';

const handler = require('../src/handler');
const FB = require('../src/lib/acl/fb');

describe('get', () => {
  it('gets events via FB api', (done) => {
    const someAccessToken = 'foo:bar';
    const somePageId = 12345;
    const data = [{
      id: 987,
      name: 'Great Gig!',
      start_time: '2016-12-09T19:00:00+0100',
      end_time: '2016-12-09T23:00:00+0100',
    }];

    process.env.FACEBOOK_EVENT_PROXY_PAGE_ID = somePageId;

    spyOn(FB, 'setAccessToken');
    spyOn(FB, 'api').and.callFake((endpoint, params, callback) => {
      if (endpoint === 'oauth/access_token') {
        return callback({ access_token: someAccessToken });
      } else if (endpoint === `/${somePageId}/events`) {
        return callback({ data });
      }

      throw new Error(`unexpected endpoint: ${endpoint}`);
    });

    handler.get(null, null, (err, response) => {
      expect(err).toBe(null);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)[0]).toEqual(data[0]);
      done();
    });
  });
});
