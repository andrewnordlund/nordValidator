if (typeof (nordValidatorBG) == "undefined") {
	var nordValidatorBG = {};
}

var nordValidatorBG = {
	dbug : nordValidator.dbug,
	init : function () {
	} // End of init
	notify : function (message, sender, sendResponse) {
		if (nordValidatorBG.dbug) console.log ("nordValidator-bg::Got a message: " + (message.hasOwnProperty("msg") ? message["msg"] : "[no msg]") + " with task: " + message["task"] + " with sender " + sender + " and sendResponse " + sendResponse + ".");
		if (message["task"] == "someTask") {
			if (nordValidatorBG.dbug) console.log ("nordValidator-bg::Gonna find a comic on " + message["pageURL"] + ".");
		} else if (message["task"] == "updateOptions") {
			nordValidator.options = message["options"];
			nordValidatorBG.dbug = nordValidator.options["dbug"];
			nordValidator.dbug = nordValidator.options["dbug"];
		} else if (message["task"] == "close") {
			// close the window
			var q = browser.tabs.query({title : "/* Some title */"});
			q.then(function (tabs) {
				if (nordValidatorBG.dbug) console.log ("nordValidator-bg::tabs: " + tabs.length + ".");
				for (var t = 0; t < tabs.length; t++) {
					if (nordValidatorBG.dbug) console.log ("nordValidator-bg::Closing " + tabs[t].url + ".");
					browser.tabs.remove(tabs[t].id);
				}
			}, nordValidator.errorFun);
		} else {
			// Some default thing
		}
	} // End of notify
}

browser.browserAction.onClicked.addListener(nordValidatorBG.initTab);
browser.runtime.onMessage.addListener(nordValidatorBG.notify);
nordValidator.addToPostLoad([function () {
	if (nordValidatorBG.dbug) console.log ("setting nordValidatorBG.dbug to " + nordValidator.dbug + ".");
	nordValidatorBG.dbug = nordValidator.dbug;}]
);