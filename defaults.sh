# A file to place in /etc/default/chipboard

export PORT=3001

# if this isn't set all files in ./src/scripts/sources are loaded
export SOURCES=flickr,gplus,instagram,reload,song,twitter

# A comma separated list used by flickr, gplus, instagram and twitter modules
export HASHTAGS=hackagong

# this will watch all tweets by the account id
export TWITTER_ACCOUNT_IDS=803728303

# Instagram (and maybe others) need a correct URL to send live update notifications
export URL=http://hacktweets.venuatu.me/

# Twitter things
#   create an app in https://apps.twitter.com/
#   generate access tokens in https://apps.twitter.com/app/$YOUR_APP_ID/keys
export TWITTER_CONSUMER_KEY=secret!
export TWITTER_CONSUMER_SECRET=secret!
export TWITTER_ACCESS_TOKEN=secret!
export TWITTER_ACCESS_TOKEN_SECRET=secret!

# Instagram things http://instagram.com/developer/clients/manage/
export INSTAGRAM_ID=secret!
export INSTAGRAM_SECRET=secret!

# Google+ things
#   create a project in https://console.developers.google.com/project
#   create a server key in https://console.developers.google.com/project/$PROJECT_NAME/apiui/credential
#   enable google+ access in https://console.developers.google.com/project/$PROJECT_NAME/apiui/api
export GOOGLE_APIKEY=secret!

# flickr things https://www.flickr.com/services/apps/create/
export FLICKR_APIKEY=secret!
export FLICKR_SECRET=secret!
export FLICKR_USER_ID=secret!
export FLICKR_ACCESS_TOKEN=secret!
export FLICKR_ACCESS_TOKEN_SECRET=secret!

export SONG_PASSWORD=areallystrongpassword

# reload
export RELOAD_PASSWORD=areallystrongpassword
