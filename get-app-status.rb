require 'Spaceship'
require 'json'

# Constants
itc_username = ENV["itc_username"]
bundle_id = ENV["bundle_id"]

if (!itc_username || !bundle_id)
	exit
end

Spaceship::Tunes.login(itc_username)
app = Spaceship::Tunes::Application.find(bundle_id)
appInfo = app.edit_version

# send app info to stdout as JSON
if appInfo
	output = {
		"name" => app.name,
		"version" => appInfo.version,
		"status" => appInfo.app_status,
		"appId" => app.apple_id,
		"iconUrl" => app.app_icon_preview_url
	}

	puts JSON.dump output
end
