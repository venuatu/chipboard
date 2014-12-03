/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var moment = require('moment');

if (typeof window === 'object') {// client side things
  window.React = React;
  var io = require('socket.io-client');
  // CSS
  require('../styles/normalize.css');
  require('../styles/main.css');
}

var SOURCES = {
  'twitter': 'images/icon-twitter.png',
  'instagram': 'images/icon-instagram.png',
  'flickr': 'images/icon-flickr.png',
  'gplus': 'images/icon-gplus.png',
};

var TweetsApp = React.createClass({
  getInitialState: function () {
    return {tweets: [], photos: [], song: ''};
  },

  componentWillMount: function (props) {
    var newState = {};

    _.each(this.props, function (value, key) {
      if (!this.state[key] || !this.state[key].length) {
        newState[key] = value;
      }
      if (_.isArray(newState[key]))
        _.each(newState[key], this.ensureMomentTime);
    }.bind(this));
    this.setState(newState);
  },

  componentDidMount: function () {
    this.socket = io.connect();
    this.socket.on('tweet', this.newTweet);
    this.socket.on('photo', this.onPhoto);
    this.socket.on('song', this.onSong);
    this.socket.on('reload', function () {
      console.log('reloading');
      window.location.reload();
    });
    this.socket.on('state', this.setState);
    this.socket.on('connected', function () {
      socket.emit('since', {
        media: (_.first(this.state.media) || {}).id_str,
        tweets: (_.first(this.state.tweets) || {}).id_str,
      });
    });
    (window !== window.top ? window.top : window).socket = this.socket;

    this.intervalTicket = setInterval(function () {
      this.setState({tweets: this.state.tweets.slice()});
    }.bind(this), 1000);

    this.onResize = _.debounce(this.onResize, 250);

    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  componentWillUnmount: function () {
    this.socket.close();
    clearInterval(this.intervalTicket);
    window.removeEventListener('resize', this.onResize);
  },

  onResize: function () {
    var livestream = this.getDOMNode().querySelector('#livestream');
    // livestream.height = livestream.style.height = livestream.scrollWidth / 9 * 16;
  },

  newTweet: function (tweet) {
    // if (_.contains(tweet.text, 'Red Bull')) {
    //   console.log('JSON.stringify(tweet)');
    //   console.log(JSON.stringify(tweet));
    // }

    this.ensureMomentTime(tweet);
    this.pushMessage(tweet);
  },

  onPhoto: function (media) {
    // console.log(media.url);
    this.ensureMomentTime(media);
    this.pushPhoto(media);
  },

  pushMessage: function (message) {
    var tweets = this.state.tweets.slice();

    tweets.unshift(message);
    tweets = _.chain(tweets).unique('id_str').sortBy(t => -t.time.unix()).take(100).value();
    while (tweets.length > 100)
      tweets.pop();
    this.setState({tweets: tweets});
  },

  pushPhoto: function (item) {
    var photos = this.state.photos.slice();

    photos.unshift(item);
    photos = _.chain(photos).unique('id_str').sortBy(t => -t.time.unix()).take(100).value();
    this.setState({photos: photos});
  },

  onSong: function (song) {
    this.setState({song: song});
  },

  ensureMomentTime: function (item) {
    item.time = moment(item.time);
  },

  render: function() {
    return (
      <div>
        <div className='main'>
          {this.state.song && <div className="song">
            {this.state.song}
          </div>}
          {_.map(this.state.tweets.slice(0, 50), function (tweet) {
            return (
              <div className="tweet flexer" key={tweet.id_str}>
                <img className="avatar" src={tweet.profile_image} />
                <div className="flex">
                  <div className="flexer">
                    <span className="author">{tweet.screen_name}
                      <span className="handle"> @{tweet.username} <img className="service" src={SOURCES[tweet.service]} /></span>
                    </span>
                    <span className="flex"></span>
                    <span className="time">{tweet.time.fromNow()}</span>
                  </div>
                  <div className="message">
                    {tweet.text}
                  </div>
                </div>
              </div>
            );
          })}
          {!this.state.tweets.length && <div className="tweet">
            <h2>I has no tweets!</h2>
          </div>}
        </div>
        <div className="media">
          {_.chain(this.state.photos).map(function (media) {
            return <img key={media.id_str} src={media.url} />;
          }).value()}
        </div>
      </div>
    );
  }
});

module.exports = TweetsApp;
