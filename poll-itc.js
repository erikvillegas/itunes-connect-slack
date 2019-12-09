var poster = require('./post-update.js');
var dirty = require('dirty');
var db = dirty('kvstore.db');
var debug = false
var pollIntervalSeconds = process.env.POLL_TIME

function checkAppStatus() {
	console.log("Fetching latest app status...")

	// invoke ruby script to grab latest app status
	var exec = require("child_process").exec;
	exec('ruby get-app-status.rb', function (err, stdout, stderr) {
		if (stdout) {
			// compare new app info with last one (from database)
			console.log(stdout)
			var versions = JSON.parse(stdout);

			for(let version of versions) {
  				_checkAppStatus(version);
			}			
		}
		else {
			console.log("There was a problem fetching the status of the app!");
			console.log(stderr);
		}
	});
}

function _checkAppStatus(version) {
	// use the live version if edit version is unavailable
	var currentAppInfo = version["editVersion"] ? version["editVersion"] : version["liveVersion"];

	var appInfoKey = 'appInfo-' + currentAppInfo.appId;
	var submissionStartkey = 'submissionStart' + currentAppInfo.appId;

	var lastAppInfo = db.get(appInfoKey);
	if (!lastAppInfo || lastAppInfo.status != currentAppInfo.status || debug) {
		poster.slack(currentAppInfo, db.get(submissionStartkey));

	    // store submission start time`
		if (currentAppInfo.status == "Waiting For Review") {
			db.set(submissionStartkey, new Date());
		}
	}
	else if (currentAppInfo) {
		console.log(`Current status \"${currentAppInfo.status}\" matches previous status. AppName: \"${currentAppInfo.name}\"`);
	}
	else {
		console.log("Could not fetch app status");
	}

	// store latest app info in database
	db.set(appInfoKey, currentAppInfo);
}

if(!pollIntervalSeconds) {
	pollIntervalSeconds = 60 * 2;
}

setInterval(checkAppStatus, pollIntervalSeconds * 1000);
checkAppStatus();
