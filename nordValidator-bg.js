if (typeof (nordValidatorBG) == "undefined") {
	var nordValidatorBG = {};
}

var nordValidatorBG = {
	dbug : nordValidator.dbug,
	init : function () {
	}, // End of init
	changeIcon : function (stat) {
		if (nordValidatorBG.dbug) console.log ("changeIcon::About to change the icon.");
		browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		
			switch (stat) {
				case "waiting":
					browser.browserAction.setIcon({path: "icons/waiting-19.png", tabId: tabs[0].id});
					break;
				case "valid":
					browser.browserAction.setIcon({path: "icons/nordValidator-19.png", tabId: tabs[0].id});
					break;
				case "invalid":
					browser.browserAction.setIcon({path: "icons/notValid-19.png", tabId: tabs[0].id});
					break;
				case "error":
					browser.browserAction.setIcon({path: "icons/err-19.png", tabId: tabs[0].id});
					break;
			}
		});
	}, // End of changeIcon
	notify : function (message, sender, sendResponse) {
		if (nordValidatorBG.dbug) console.log ("nordValidatorBG::Got a message: " + (message.hasOwnProperty("msg") ? message["msg"] : "[no msg]") + " with task: " + message["task"] + " with sender " + sender + " and sendResponse " + sendResponse + ".");
		if (message["task"] == "changeIcon") {
			if (nordValidatorBG.dbug) console.log ("nordValidatorBG::Gonna change icon to " + message["status"] + ".");
			nordValidatorBG.changeIcon(message["status"]);
		} else if (message["task"] == "updateOptions") {
			nordValidator.options = message["options"];
			nordValidatorBG.dbug = nordValidator.options["dbug"];
			nordValidator.dbug = nordValidator.options["dbug"];
		} else if (message["task"] == "validate") {
			if (nordValidatorBG.dbug) console.log ("Validating: " + message["content"]);
		}/*else if (message["task"] == "close") {
			// close the window
			var q = browser.tabs.query({title : "/* Some title * /"});
			q.then(function (tabs) {
				if (nordValidatorBG.dbug) console.log ("nordValidator-bg::tabs: " + tabs.length + ".");
				for (var t = 0; t < tabs.length; t++) {
					if (nordValidatorBG.dbug) console.log ("nordValidator-bg::Closing " + tabs[t].url + ".");
					browser.tabs.remove(tabs[t].id);
				}
			}, nordValidator.errorFun);
		} else {
			// Some default thing
		} */
	} // End of notify
}

var activeListenerFun = function (activeInfo) {
	console.log ("Active!");
	nordValidatorBG.changeIcon("waiting");
}

browser.tabs.onActivated.addListener(activeListenerFun);

//browser.tabs.onActivated.addListener(function (activeInfo) {
	//nordValidatorBG.changeIcon("waiting");
	/*if (dbug) console.log ("nordValidatorBG::tab (" + activeInfo.tabId + "/" + activeInfo.windowId + ") has been activated.");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			if (dbug) console.log ("nordValidatorBG::sending message to get validity.");
			browser.tabs.sendMessage(tabs[0].id, {"task": "getStatus"}).then(changeTitle, null);
		}
	});
		//run();
	*/
//});

browser.browserAction.onClicked.addListener(nordValidatorBG.init);
browser.runtime.onMessage.addListener(nordValidatorBG.notify);
nordValidator.addToPostLoad([function () {
	if (nordValidatorBG.dbug) console.log ("setting nordValidatorBG.dbug to " + nordValidator.dbug + ".");
	nordValidatorBG.dbug = nordValidator.dbug;}]
);
