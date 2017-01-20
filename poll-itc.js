var poster = require('./post-update.js');
var dirty = require('dirty');
var db = dirty('kvstore.db');
var pollIntervalSeconds = 120
var debug = false

function checkAppStatus() {
	console.log("Fetching latest app status...")

    // invoke ruby script to grab latest app status
	var exec = require("child_process").exec;
	exec('ruby get-app-status.rb', function (err, stdout, stderr) {
		if (stdout) {
			// compare new app info with last one (from database)
			var currentAppInfo = JSON.parse(stdout);
			var lastAppInfo = db.get('appInfo');

			if (!lastAppInfo || lastAppInfo.status != currentAppInfo.status || debug) {
	    		poster.slack(currentAppInfo, db.get('submissionStart'));

	    		// store submission start time
		    	if (currentAppInfo.status == "Waiting For Review") {
					db.set('submissionStart', new Date());
		    	}
	    	}
	    	else if (currentAppInfo) {
	    		console.log(`Current status \"${currentAppInfo.status}\" matches previous status`);
	    	}
	    	else {
	    		console.log("Could not fetch app status");
	    	}

	    	// store latest app info in database
	    	db.set('appInfo', currentAppInfo);
		}
		else {
			console.log("There was a problem fetching the status of the app!");
		}
	});
}

setInterval(checkAppStatus, pollIntervalSeconds * 1000);
checkAppStatus();
