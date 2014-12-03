
var _ = require('lodash'),
    moment = require('moment'),
    superagent = require('superagent'),
    ID = process.env.INSTAGRAM_ID,
    SECRET = process.env.INSTAGRAM_SECRET,
    maxId = {};

module.exports = function (app, feed) {

  app.get('/source/instagram', function (req, res) {
    //TODO: This should only respond for the correct hashtags
    res.send(req.param('hub.challenge'));
  });

  app.post('/source/instagram', function (req, res) {
    console.log('instagram', req.body);
    res.send({});

    _.chain(req.body).filter({item: 'object'}).map(function (change) {
      loadTag(change.object_id);
    });
  });

  function loadTag(tag) {
    superagent.get('https://api.instagram.com/v1/tags/'+ tag +'/media/recent')
    .query({
      client_id: ID,
      client_secret: SECRET,
      max_tag_id: maxId[tag] || '0',
    })
    .end(function (result) {
      if (result.ok) {
        maxId[tag] = result.body.pagination.next_max_tag_id;
        _.each(result.body.data, function (media) {
          pushTweet(media);
          pushMedia(media);
        });
        console.log('loaded '+ result.body.data.length +' instagrams')
      }
    });
  }

  function pushTweet(media) {
    var tweet = {
      id_str: media.id,
      text: media.caption.text,
      profile_image: media.caption.from.profile_picture,
      username: media.caption.from.username,
      screen_name: media.caption.from.full_name,
      time: moment.unix(media.created_time),
      service: 'instagram',
    };

    feed.sendTweet(tweet);
  }

  function pushMedia(media) {
    var pic = {
      id_str: media.id,
      url: media.images.standard_resolution.url,
      time: moment.unix(media.created_time),
      service: 'instagram',
    };

    feed.sendPhoto(pic);
  }

  superagent.post('https://api.instagram.com/v1/subscriptions/')
    .send('client_id='+ ID)
    .send('client_secret='+ SECRET)
    .send('object=tag')
    .send('aspect=media')
    .send('object_id=hackagong')
    .send('callback_url='+ process.env.URL +'source/instagram')
    .end(function (res) {
      if (res.ok) {
        console.log('registered for instagram');
      } else {
        console.warn('bad instagram register ', res.body);
      }
    });

    loadTag('hackagong');
};
