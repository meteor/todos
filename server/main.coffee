# This defines a starting set of data to be loaded if the app is loaded with an empty db.
require '../imports/startup/server/fixtures.coffee'

# This file configures the Accounts package to define the UI of the reset password email.
require '../imports/startup/server/reset-password-email.coffee'

# Set up some rate limiting and other important security settings.
require '../imports/startup/server/security.coffee'

# This defines all the collections, publications and methods that the application provides
# as an API to the client.
require '../imports/startup/server/register-api.coffee'
