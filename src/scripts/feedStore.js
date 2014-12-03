var MAX_ITEMS = 60;

var _ = require('lodash'),
    moment = require('moment'),
    handlers = []
    state = {
      photos: [],
      tweets: [],
    };

var feed = module.exports = {

  /*
   * Tweet = {
   *    service:        'the name of the service, this should have an image in /src/images/icon-{service}.png',
   *    id_str:         'a unique identifier for the message',
   *    text:           'the text of the tweet, preferably a short version (140 chars looks nice)',
   *    profile_image:  'a url to the image of the sender',
   *    username:       'the username of the sender on the service',
   *    screen_name:    'the visible/preferred name of the sender',
   *    time:           'a Date or momentjs object',
   * }
   */

  sendTweet: sendTimed('tweet'),

  /*
   * Photo = {
   *    service:        'the name of the service, this should have an image in /src/images/icon-{service}.png',
   *    id_str:         'a unique identifier for the message',
   *    url:            'the direct link to the image',
   *    time:           'a Date or momentjs object',
   * }
   */

  sendPhoto: sendTimed('photo'),

  send: notify,

  getState: function () {
    return state;
  },

  getSince: function (filter) {
    var ret = {};
    filter = filter || {};
    _.each(state, function (value, key) {
      if (_.isArray(value)) {
        var end = value.length;
        _.each(value, function (item, i) {
          if (item.id_str === filter[key]) {
            end = i;
            return false;
          }
        });
        ret[key] = value.slice(0, end);
      } else {
        ret[key] = _.cloneDeep(value);
      }
    });
    return ret;
  },

  register: function (handler) {
    handlers.push(handler);
  },
}

function ensureMaximums() {
  state.tweets = sortAndLimit(state.tweets, MAX_ITEMS);
  state.photos = sortAndLimit(state.photos, MAX_ITEMS);
}

function sortAndLimit(arr, n) {
  return _.chain(arr).unique('id_str').sortBy(function (item) {return -item.time.unix()}).take(n).value();
}

function notify(name, object) {
  _.each(handlers, function (handler) {
    handler(name, object);
  });
}

function sendTimed(type) {
  var plural = type +'s';
  return function (item) {
    var added = false, inList = false;

    item.time = moment(item.time);
    if (state[plural].length < MAX_ITEMS || _.last(state[plural]).time.isBefore(item.time)) {
      _.each(state[plural], function (savedItem, i) {
        if (item.id_str === savedItem.id_str) {
          inList = true;
          return false;
        }
        if (item.time.isBefore(savedItem.time)) {
          state[plural].splice(i -1, 0, item);
          added = true;
          return false;
        }
      });
      if (!inList) {
        if (!added)
          state[plural].unshift(item);
        added = true;
      }
    }
    ensureMaximums();
    if (added) {
      notify(type, item);
    }
    return added;
  };
}
