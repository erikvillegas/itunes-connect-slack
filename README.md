itunes-connect-slack
--------------------

These scripts fetch app info directly from iTunes Connect and posts changes in Slack as a bot. Since iTC doesn't provide any fancy webhooks, these scripts use polling with the help of Fastlane's [Spaceship](https://github.com/fastlane/fastlane/tree/master/spaceship).

![](https://raw.githubusercontent.com/erikvillegas/itunes-connect-slack/master/example.png)

# Set up

### Environment Variables

These scripts read specific values from the bash environment. Be sure to set these to the appropriate values:
```bash
export BOT_API_TOKEN="xoxb-asdfasdfasfasdfasdfsd" # The API Token for your bot, provided by Slack
export itc_username="email@email.com" # The email you use to log into iTunes Connect
export bundle_id="com.best.app" # The bundle ID of the app you want these scripts to check
```

### Install node modules
```bash
sudo gem install fastlane # Spaceship is bundled with Fastlane tools
npm install @slack/client --save # Slack's node.js SDK
npm install dirty --save # quick and dirty key/value store
npm install moment --save # simple date parsing/formatting
```

### Running the scripts
```bash
node poll-itc.js
```

### Channel info
Set the specific channel you'd like the bot to post to in `post-update.js`. By default, it posts to `#ios-app-updates`.

### Polling interval
In `poll-itc.js`, set the `pollIntervalSeconds` value to whatever you like.

# Files

### get-app-status.rb
Ruby script that uses Spaceship to connect to iTunes Connect. It then stdouts a JSON blob with your app info. It only looks for apps that aren't yet live.

### poll-itc.js
Node script to invoke the ruby script at certain intervals. It uses a key/value store to check for changes, and then invokes `post-update.js`.

### post-update.js
Node script that uses Slack's node.js SDK to send a message as a bot. It also calculates the number of hours since submission.
