
var _ = require('lodash'),
    moment = require('moment'),
    Flickr = require('flickrapi');
var last = 0;

module.exports = function (app, feed) {

  var flickr;

  Flickr.authenticate({
    api_key: process.env.FLICKR_APIKEY,
    secret: process.env.FLICKR_SECRET,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  }, function(error, flick) {
    flickr = flick;
    setInterval(pullThings, 20000);
    pullThings();
  });

  function pullThings() {
    flickr.photos.search({
      text: process.env.HASHTAGS.split(',').join(' OR '),
      page: 1,
      per_page: 100,
      extras: 'date_upload',
      sort: 'date-posted-desc',
      min_upload_date: moment().subtract(1, 'day').unix() * 1000,
    }, function(err, result) {
      var newItems = 0;
      _.each(result.photos.photo, function (photo) {
        photo.dateupload = parseInt(photo.dateupload, 10);
        if (photo.dateupload > last) {
          var media = {
            id_str: photo.id,
            url: 'https://farm'+ photo.farm +'.staticflickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'.jpg',
            time: moment.unix(photo.dateupload),
            service: 'flickr',
          };

          if (feed.sendPhoto(media))
            newItems++;
        }
      });
      last = _.max(_.pluck(result.photos.photo, 'dateupload'));
      if (newItems) {
        console.log('pushed '+ newItems +' flickrs');
      }
    });
  }
};
