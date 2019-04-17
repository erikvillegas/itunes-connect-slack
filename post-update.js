var moment = require('moment')

function postToSlack(appInfo, submissionStartDate) {
    var WebClient = require('@slack/client').WebClient;
	var client = new WebClient(process.env.BOT_API_TOKEN);

	var message = `The status of your app *${appInfo.name}* has been changed to *${appInfo.status}*`
	var attachment = slackAttachment(appInfo, submissionStartDate)
	var params = {
		"attachments" : [attachment],
		"as_user" : "true"
	}

	var channel = process.env.SLACK_CHANNEL_NAME;
	if(!channel) {
		channel = '#ios-app-updates';
	}

	client.chat.postMessage(channel, message, params, function(err, res) {
	    if (err) {
	        console.log('Error:', err);
	    }
	});
}

function slackAttachment(appInfo, submissionStartDate) {
	var attachment = {
     	"fallback": `The status of your app ${appInfo.name} has been changed to ${appInfo.status}`,
        "color": colorForStatus(appInfo.status),
        "title": "iTunes Connect",
        "author_name": appInfo.name,
        "author_icon": appInfo.iconUrl,
        "title_link": `https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/${appInfo.appId}`,
        "fields": [
            {
                "title": "Version",
                "value": appInfo.version,
                "short": true
            },
            {
                "title": "Status",
                "value": appInfo.status,
                "short": true
            }
        ],
        "footer": "iTunes Connect",
        "footer_icon": "https://devimages.apple.com.edgekey.net/app-store/marketing/guidelines/images/app-store-icon.png",
        "ts": new Date().getTime() / 1000
    }

    // set elapsed time since "Waiting For Review" start
    if (submissionStartDate && appInfo.status != "Prepare for Submission" && appInfo.status != "Waiting For Review") {
    	var elapsedHours = moment().diff(moment(submissionStartDate), 'hours')

    	attachment["fields"].push({
			"title": "Elapsed Time",
			"value": `${elapsedHours} hours`,
			"short": true
    	})
    }

    return attachment
}

function colorForStatus(status) {
	var infoColor = "#8e8e8e"
	var warningColor = "#f4f124"
	var successColor1 = "#1eb6fc"
	var successColor2 = "#14ba40"
	var failureColor = "#e0143d"

	var colorMapping = {
		"Prepare for Submission" : infoColor,
		"Waiting For Review" : infoColor,
		"In Review" : successColor1,
		"Pending Contract" : warningColor,
		"Waiting For Export Compliance" : warningColor,
		"Pending Developer Release" : successColor2,
		"Processing for App Store" : successColor2,
		"Pending Apple Release" : successColor2,
		"Ready for Sale" : successColor2,
		"Rejected" : failureColor,
		"Metadata Rejected" : failureColor,
		"Removed From Sale" : failureColor,
		"Developer Rejected" : failureColor,
		"Developer Removed From Sale" : failureColor,
		"Invalid Binary" : failureColor
	}

	return colorMapping[status]
}

module.exports = {
  slack: postToSlack
};