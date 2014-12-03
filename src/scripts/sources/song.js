/*
 * This was used in combination with a Spotify applescript[1] and some curl magic to show the currently playing song
 * [1]: https://github.com/davidvanleeuwen/hubot-spotify/blob/master/current_song.scpt
 */

var song = '';

module.exports = function (app, feed) {
  app.post('/song', function (req, res) {
    if (req.param('password') === process.env.SONG_PASSWORD) {
      if (song !== req.param('song')) {
        song = req.param('song');
        console.log('song', song);
        feed.send('song', song);
        res.send({status: 'success'});
      } else {
        res.send({status: 'same'});
      }
    } else {
      res.status(401);
      res.send({status: 'failure'});
    }
  });
};
