require 'spaceship'
require 'json'

def getVersionInfo(app)
  
editVersionInfo = app.edit_version
liveVersionInfo = app.live_version

# send app info to stdout as JSON
version = Hash.new

if editVersionInfo
	version["editVersion"] = {
		"name" => app.name,
		"version" => editVersionInfo.version,
		"status" => editVersionInfo.app_status,
		"appId" => app.apple_id,
		"iconUrl" => app.app_icon_preview_url
	}
end

if liveVersionInfo
	version["liveVersion"] = {
		"name" => app.name,
		"version" => liveVersionInfo.version,
		"status" => liveVersionInfo.app_status,
		"appId" => app.apple_id,
		"iconUrl" => app.app_icon_preview_url
	}
end

return version
end

# Constants
itc_username = ENV['itc_username']
itc_password = ENV['itc_password']
bundle_id = ENV['bundle_id']

if (!itc_username)
	puts "did not find username"
	exit
end

if (itc_password)
 Spaceship::Tunes.login(itc_username,itc_password)
else
 Spaceship::Tunes.login(itc_username)
end

# all json data
versions = [] 

# all apps
apps = []

if (bundle_id)
	app = Spaceship::Tunes::Application.find(bundle_id)
	apps.push(app)
else 
	apps = Spaceship::Tunes::Application.all
end

for app in apps do
  version = getVersionInfo(app)
  versions.push(version)
end


puts JSON.dump versions



