require 'spaceship'
require 'json'

# Constants
itc_username = ENV["itc_username"]
bundle_id = ENV["bundle_id"]

if (!itc_username || !bundle_id)
	puts "did not find username and bundle id"
	exit
end

Spaceship::Tunes.login(itc_username)
app = Spaceship::Tunes::Application.find(bundle_id)
editVersionInfo = app.edit_version
liveVersionInfo = app.live_version

# send app info to stdout as JSON
versions = Hash.new

if editVersionInfo
	versions["editVersion"] = {
		"name" => app.name,
		"version" => editVersionInfo.version,
		"status" => editVersionInfo.app_status,
		"appId" => app.apple_id,
		"iconUrl" => app.app_icon_preview_url
	}
end

if liveVersionInfo
	versions["liveVersion"] = {
		"name" => app.name,
		"version" => liveVersionInfo.version,
		"status" => liveVersionInfo.app_status,
		"appId" => app.apple_id,
		"iconUrl" => app.app_icon_preview_url
	}
end

puts JSON.dump versions
