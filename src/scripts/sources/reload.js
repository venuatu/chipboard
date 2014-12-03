/*
 * This was used to trigger a reload of any active pages rather than using meta=refresh or manually doing an F5
 */

module.exports = function (app, feed) {
  app.post('/reload', function (req, res) {
    if (req.param('secret') === process.env.RELOAD_PASSWORD) {
      res.send({status: 'awesome!'});
      feed.send('reload', {});
    } else {
      res.status(401);
      res.send({status: 'denied'});
    }
  });
};
