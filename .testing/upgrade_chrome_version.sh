# Update Chrome version
# Taken from: https://discuss.circleci.com/t/circle-fails-to-run-e2e-tests-using-grunt-protractor/2068/3
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install google-chrome-stable