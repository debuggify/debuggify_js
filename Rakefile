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


# task "check_dependency" do
#   if(!ENV['git'])
#     abort "Git not found"

#   end
# end

def run_locally(cmd, explanation, ignore=false)
  puts ">>> #{explanation} <<<"
  puts "executing: #{cmd}"
  success = system( cmd )

  if !ignore && !success
    abort
  end

  puts
end


# task "build" do
#   run_locally "r.js -o config/production.build.js", "Running requirejs optimizer"
#   run_locally "rm -Rf ./public/js", "Remove js directory"
#   run_locally "cp ./build/release ./public/js -Rp", "copy release files"
# end

desc "Generic build task"
task "build", :key, :dir do |t, args|

  args.with_defaults(:key => "development")
  args.with_defaults(:dir => args.key)

  # checkout all the dependency
  run_locally "git checkout #{args.key}", "Checked out #{args.key}"

  # #build the files
  run_locally "rm -Rf ./build", "Remove build directory"
  run_locally "r.js -o config/production.build.js", "Running requirejs optimizer"

  # copy the files to the branch/tag/hash directory
  run_locally "rm -Rf ./public/#{args.dir}", "Remove #{args.dir} directory"
  run_locally "cp ./build/release ./public/#{args.dir} -Rp", "copy release files"

  puts "Build successful, Check the path public/#{args.dir} "

end

desc "build the file for latest release"
task "build:release" do

  Rake::Task[:build].invoke("master","latest")
  Rake::Task[:build].invoke("development")
end


desc "Deploy using capistrano"
task "deploy" do
  run_locally "cap deploy", "Deploying using capistrano"
end

desc "Deploy using s3cmd command line utility"
task "deploy:s3cmd" do
  run_locally "s3cmd sync  public/ s3://cdn.debuggify.net --acl-public", "Deploying using s3cmd"
end

desc "Run all test cases"
task "test" do
  ENV["JASMINE_HOST"] = "http://local.debuggify.net"
  ENV["JASMINE_BROWSER"] = "firefox"
  Rake::Task["jasmine:ci"].invoke
end

