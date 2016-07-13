# Cache Meteor
if [ -d ~/.meteor ]; then sudo ln -s ~/.meteor/meteor /usr/local/bin/meteor; fi
if [ ! -e $HOME/.meteor/meteor ]; then curl https://install.meteor.com | sh; fi