echo "Sourcing ./bin/env/testing.sh as environment …"
source ./bin/env/testing.sh
export MONGO_URL="mongodb://localhost:27017/cache"
echo "Running meteor with --settings ../config/testing.json …"
node ./bin/_helpers/cache_build_and_dependencies.js