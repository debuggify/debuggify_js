require 's3-static-site'

set :bucket, ENV['DEBUGGIFY_CDN']
set :access_key_id,  ENV['DEBUGGIFY_AWS_ACCESS_KEY_ID']
set :secret_access_key, ENV['DEBUGGIFY_AWS_SECRET_ACCESS_KEY']