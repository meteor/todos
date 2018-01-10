# Cache npm deps
if [ ! -e /opt/circleci/nodejs/v8.9.3/lib/node_modules/chimp/bin/chimp.js ]; then npm install -g chimp; fi
if [ ! -e /opt/circleci/nodejs/v8.9.3/lib/node_modules/spacejam/bin/spacejam ]; then npm install -g spacejam; fi
npm install
