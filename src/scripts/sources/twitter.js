
var _ = require('lodash'),
    moment = require('moment'),
    Twit = require('twit');

module.exports = function (app, feed) {
  var twitter = new Twit({
      consumer_key:         process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
      access_token:         process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  var stream = twitter.stream('statuses/filter', {
    // follow: process.env.TWITTER_ACCOUNT_IDS,
    track: process.env.HASHTAGS
  });

  function emitTweet(tweet) {
    var message = {
      id_str: tweet.id_str,
      text: _.unescape(tweet.text),
      // _reasonably_small is 128x128 and seemingly undocumented
      profile_image: tweet.user.profile_image_url_https.replace('_normal', '_reasonably_small'),
      username: tweet.user.screen_name,
      screen_name: tweet.user.name,
      time: moment(tweet.created_at),
      service: 'twitter',
    };

    feed.sendTweet(message);

    // the streaming api uses extended_entities whereas the search api uses just entities
    var media = tweet.extended_entities && tweet.extended_entities.media || tweet.entities && tweet.entities.media;
    if (media) {
      _.chain(media).map(function (media) {
        return {
          id_str: media.id_str,
          url: media.media_url_https,
          time: moment(tweet.created_at),
          service: 'twitter',
        };
      }).each(feed.sendPhoto);
    }
  }

  stream.on('tweet', emitTweet)
    .on('connect reconnect reconnect', function (req) {
      console.log('twitter stream connect: ', req);
    })
    .on('error', function (err) {
      console.log('twitter stream error: ', err);
    })
    .on('warning', function (err) {
      console.log('twitter stream warning: ', err);
    })
  ;


  twitter.get('search/tweets', { 
    q: process.env.HASHTAGS.split(',').join(' OR '),
    count: 200,
  }, function(err, data, response) {
    if (err) {
      console.log('twitter err: ', err);
    } else {
      _.each(data.statuses, emitTweet);
      console.log('loaded '+ data.statuses.length +' tweets');
    }
  });

  function prependHashtag(str) {
    return '#'+ str;
  }
};
