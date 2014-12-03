
var _ = require('lodash'),
    moment = require('moment'),
    superagent = require('superagent');
var last = moment().subtract(1, 'week');

// ?orderBy=recent&query=hackagong&alt=json&key=

module.exports = function (app, feed) {

  function pullThings() {
    _.each(process.env.HASHTAGS.split(','), function (tag) {
      superagent.get('https://www.googleapis.com/plus/v1/activities')
      .query({
        orderBy: 'recent',
        query: tag,
        alt: 'json',
        key: process.env.GOOGLE_APIKEY,
      })
      .end(function (result) {
        if (result.ok) {
          var newItems = 0;
          _.each(result.body.items, function (item) {
            item.updated = moment(item.updated);
            if (item.updated.isAfter(last)) {
              var message = {
                id_str: item.id,
                text: item.title +" "+ item.object.url,
                profile_image: item.actor.image.url,
                username: item.actor.displayName,
                screen_name: item.actor.displayName,
                time: item.updated,
                service: 'gplus',
              };

              feed.sendTweet(message);

              _.chain(item.object.attachments).filter(function (img) {
                return !!img.image;
              }).map(function (media) {
                return {
                  id_str: media.id + media.image.url,
                  url: media.image.url,
                  time: item.updated,
                  service: 'gplus',
                };
              }).each(feed.sendPhoto);

              newItems++;
            }
          });

          last = (result.body.items[0] || {}).updated;
          if (newItems) {
            console.log('pushed '+ newItems + '/' + result.body.items.length +' pluses for '+ tag);
          }
        } else {
          console.log('gplus failure: ', result.status, result.body);
        }
      });
    });
  }

  setInterval(pullThings, 10000);
  pullThings();
};
