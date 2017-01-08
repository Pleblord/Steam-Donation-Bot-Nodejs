var SteamCommunity = require('steamcommunity');
var SteamTotp = require("steam-totp");
var steam = new SteamCommunity();
var TradeOfferManager = require('steam-tradeoffer-manager');
var manager = new TradeOfferManager({
  "language": "en",
  "pollInterval": 30000
});

var logOnOptions = {
	"accountName"   : "", // Bot username
	"password"      : "", // Bot password
	'twoFactorCode': SteamTotp.generateAuthCode("") // shared_secret
};

var identitySecret = ""; // identitySecret

//logs in via browser
steam.login(logOnOptions, function(err, sessionID, cookies, steamguard) {
	if (err) {
		console.log("[Bot] There was an error logging in! Error details: " + err.message);
		process.exit(1); //terminates program
	} else {
		console.log("[Bot] Successfully logged in as " + logOnOptions.accountName);
		steam.chatLogon();
		manager.setCookies(cookies, function(err) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});
	}
	steam.startConfirmationChecker(10000, identitySecret); //Auto-confirmation enabled!
});

manager.on('newOffer', processTrade);

function processTrade(offer) {
	console.log("[Bot] New trade from " + offer.partner);
	if(offer.itemsToGive.length!=0)
		{
			proceed=false;
			offer.decline(function(err)
			{
				console.log("[Bot] Declined offer from " + offer.partner + ", Asked for item(s) from the bot.");
				if (err)
				{
					console.log("[Bot] Decline error: " + err.message);
				}
			});	
				return;
				}
				else
			offer.accept(function(err) {
		if (err) {
			console.log("[Bot] Error accepting offer: " + err.message);
		} else {
			console.log("[Bot] Successfully accepted an offer from " + offer.partner);
		}
	})
}