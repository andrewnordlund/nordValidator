if (typeof (nordValidatorBG) == "undefined") {
	var nordValidatorBG = {};
}

var nordValidatorBG = {
	dbug : nordValidator.dbug,
	init : function () {
	}, // End of init
	changeIcon : function (stat, errs, warnings) {
		/*
		var statii = {"waiting":{"icon" : "icons/waiting-19.png", "title" : browser.i18n.getMessage("waitingMessage")},
			"valid" :{"icon" : "icons/nordValidator-19.png", "title" : browser.i18n.getMessage("validMessage") + " (" + warnings + browser.i18n.getMessage("warningLetter") + ")"},
			"invalid" : {"icon" : "icons/notvalid-19.png", "title" : errs + "E" + " (" + warnings + browser.i18n.getMessage("warningLetter") + ")"},
			"error" : {"icon" : "icons/err-19.png", "title" : browser.i18n.getMessage("errorMessage")},
			"inactive" : {"icon" : "icons/inactive-19.png", "title" : browser.i18n.getMessage("defaultTitle")}
		}*/

		//if (nordValidatorBG.dbug) console.log ("changeIcon::About to change the icon to " + stat +" " +  errs + "/" + warnings + ".");
		browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		
			//browser.browserAction.setTitle({title: browser.i18n.getMessage("defaultTitle"), tabId: tabs[0].id});
			//browser.browserAction.setIcon({path : statii[stat]["icon"], tabId: tabs[0].id});
			
			switch (stat) {
				case "waiting":
					browser.browserAction.setIcon({path: "icons/waiting-19.png", tabId: tabs[0].id});
					browser.browserAction.setTitle({title: browser.i18n.getMessage("waitingMessage"), tabId: tabs[0].id});
					break;
				case "valid":
					browser.browserAction.setIcon({path: "icons/nordValidator-19.png", tabId: tabs[0].id});
					browser.browserAction.setTitle({title: browser.i18n.getMessage("validMessage") + " (" + warnings + browser.i18n.getMessage("warningLetter") + ")", tabId: tabs[0].id});
					break;
				case "invalid":
					browser.browserAction.setIcon({path: "icons/notValid-19.png", tabId: tabs[0].id});
					browser.browserAction.setTitle({title:  errs + "E" + " (" + warnings + browser.i18n.getMessage("warningLetter") + ")", tabId: tabs[0].id});
					break;
				case "error":
					browser.browserAction.setIcon({path: "icons/err-19.png", tabId: tabs[0].id});
					browser.browserAction.setTitle({title: browser.i18n.getMessage("errorMessage"), tabId: tabs[0].id});
					break;
				case "inactive":
					browser.browserAction.setIcon({path: "icons/inactive-19.png", tabId: tabs[0].id});
					browser.browserAction.setTitle({title: browser.i18n.getMessage("defaultTitle"), tabId: tabs[0].id});
					break;

			}
			
		});
	}, // End of changeIcon
	getStatus : function () {
		browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
			//if (tabs[0]) {
				if (tabs[0].url.match(/^https?:\/\//)) {
					if (nordValidatorBG.dbug) console.log ("nordValidatorBG::sending message to " + tabs[0].title + " to get Status.");
					browser.tabs.sendMessage(tabs[0].id, {task: "getStatus"}).then(function (msg) {
						if (nordValidatorBG.dbug) console.log ("Promise fulfilled.");
						nordValidatorBG.changeIcon(msg["status"], msg["errorCount"], msg["warningCount"]);
					}, nordValidator.errorFun).catch(function (x) {
						if (nordValidatorBG.dbug) console.log ("Caught something: " + x.toString());
						if (x.toString() == "Error: Could not establish connection. Receiving end does not exist." || x.toString() == "TypeError: msg is undefined") {
							browser.tabs.executeScript(tabs[0].id, {file : "/libs/nordburg.js"}).then (function () {
								browser.tabs.executeScript(tabs[0].id, {file : "/libs/nordValidator.js"}).then(function () {
									browser.tabs.executeScript(tabs[0].id, {file : "/content_scripts/nordValidator-cs.js"}).then(function () {
										browser.tabs.sendMessage(tabs[0].id, {task : "getStatus"}).then(function (msg) {
											if (nordValidatorBG.dbug) console.log ("Promise eventually fulfilled.");
											nordValidatorBG.changeIcon(msg["status"], msg["errorCount"], msg["warningCount"]);
										}, nordValidator.errorFun);
									}, nordValidator.errorFun);
								}, nordValidator.errorFun);
							}, nordValidator.errorFun);
						}
					});
				} else {
					nordValidatorBG.changeIcon("inactive", "0", "0");
				}
			//}
		}, nordValidator.errorFun);
	}, // End of getStatus
	notify : function (message, sender, sendResponse) {
		if (nordValidatorBG.dbug) console.log ("nordValidatorBG::Got a message: " + (message.hasOwnProperty("msg") ? message["msg"] : "[no msg]") + " with task: " + message["task"] + " with sender " + sender + " and sendResponse " + sendResponse + ".");
		if (message["task"] == "changeIcon") {
			if (nordValidatorBG.dbug) console.log ("nordValidatorBG::Gonna change icon to " + message["status"] + " from " + sender + ".");
			nordValidatorBG.changeIcon(message["status"], message["errorCount"], message["warningCount"]);
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
	if (nordValidatorBG.dbug) console.log ("nordValidator-bg::tab " + nordburg.getKeys(activeInfo).join(", ") + "."); //"(" + changeInfo.url + "/" + changeInfo.title + "(" + changeInfo.status + ")) has been updated to " + tabInfo.url +"/"+tabInfo.title +"(" + tabInfo.status + ").");
	browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
		if (tabs[0]) {
			nordValidatorBG.changeIcon("waiting", 0, 0);
			nordValidatorBG.getStatus();
		/*
			if (tabs[0].url.match(/^https?:\/\//)) {
				if (nordValidatorBG.dbug) console.log ("nordValidatorBG::sending message to get validity.");
				browser.tabs.sendMessage(tabs[0].id, {"task": "getStatus"}).then(function (msg) {
					nordValidatorBG.changeIcon(msg["status"]);
				}, nordValidator.errorFun);
			} else {
				nordValidatorBG.changeIcon("inactive");
			}
		*/
		}
	}, nordValidator.errorFun);
	
}

var updateListenerFun = function (tabId, changeInfo, tabInfo) {
	//if (nordValidatorBG.dbug) console.log ("nordValidator-bg::tab " + tabId + "(" + changeInfo.url + "/" + changeInfo.title + "(" + changeInfo.status + ")) has been updated to " + tabInfo.url +"/"+tabInfo.title +"(" + tabInfo.status + ").");
	if (tabInfo.url.match(/^https?:\/\//i)) {
		if (tabInfo.status == "complete" && changeInfo.status == "complete") {
			if (nordValidatorBG.dbug) console.log ("nordValidator-bg::Finally complete.  Hopefully thing should be done by now.  Sending to tabId: " + tabId);
			nordValidatorBG.changeIcon("waiting", 0, 0);
			nordValidatorBG.getStatus();
			//browser.tabs.sendMessage(tabId, {task: "getStatus"});.then(function (msg) {
			//	nordValidatorBG.changeIcon(msg["status"]);
			//}, nordValidator.errorFun);*/
		} else {
			nordValidatorBG.changeIcon("waiting", 0, 0);
		}
	} else {
		nordValidatorBG.changeIcon("inactive", 0, 0);
	}
}

browser.tabs.onActivated.addListener(activeListenerFun);

browser.tabs.onUpdated.addListener(updateListenerFun);


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
