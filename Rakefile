require "erb"
require "pathname"

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

def run_locally(cmd, explanation)
  puts ">>> #{explanation} <<<"
  puts "executing: #{cmd}"
  system cmd
  puts
end


task "build" do

  run_locally "r.js -o config/production.build.js", "Running requirejs optimizer"
  run_locally "rm -Rf ./public && mkdir -p public", "Clean release directory"
  run_locally "cp ./build/release ./public/release -Rp", "copy release files"
  run_locally "mv ./public/release ./public/debuggify", "Renaming directory"

end

task "deploy" do
  run_locally "cap deploy", "Deploying using capistrano"
end

task "test" do
  ENV["JASMINE_HOST"] = "http://local.debuggify.net"
  ENV["JASMINE_BROWSER"] = "firefox"
  Rake::Task["jasmine:ci"].invoke
end
