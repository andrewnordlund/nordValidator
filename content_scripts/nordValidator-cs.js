var nordcmxCS = {
	dbug : nordValidator.dbug,
	loggedIn : false,
	usingTmp : false,
	init : function () {
	}, // End of init
	
	startup : function () {
	}, // End of startup
	notify : function (message) {
		if (nordValidatorCS.dbug) console.log ("cmx::Got a message: " + message["msg"] + ", task: " + message["task"] + "."); // from " + message["pageURL"]);
		/* 
		   // deal with tasks here
		if (message["task"] == "someTask") {
		}
		*/
	}, // End of notify
}

document.addEventListener("DOMContentLoaded", function () {
	if (nordValidatorCS.dbug) console.log ("Content loaded, getting stored stuff.");
	//nordValidator.getSaved(nordValidatorCS.startup, nordValidator.errorFun);

	var getting = browser.storage.local.get("nordValidator-temp");
	getting.then(function (savedObj) {
		if (nordValidatorCS.dbug) console.log ("Got stored stuff from -temp.");
		if (nordburg.countObjs(savedObj) == 0) {
			if (nordValidatorCS.dbug) console.log ("But there ain't no temp info there.");
			nordValidator.getSaved(nordValidatorCS.startup, nordValidator.errorFun);
		} else {
			if (nordValidatorCS.dbug) console.log ("Got savedstuff from -temp.");
			savedObj = savedObj["nordValidator-temp"];
			if (nordValidatorCS.dbug) {
				console.log ("Something (saved information) there.");
				console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
				console.log ("savedObj: " + savedObj + ".");
				for (var k in savedObj) {
					console.log (k + ": " + savedObj[k] +".");
				}
			}
			nordValidatorCS.usingTmp = true;
			nordValidator.getSavedFromJSON(savedObj);
			nordValidatorCS.startup();
		}

	}, nordValidator.errorFun);
		}
}, false);
browser.runtime.onMessage.addListener(nordValidatorCS.notify);
if (nordValidatorCS.dbug) console.log ("nordValidatorCS.js loaded.");
nordValidator.addToPostLoad([function () {
	if (nordValidatorCS.dbug === false && nordValidator.dbug === true) console.log ("turning nordValidatorCS.dbug on.");
	nordValidatorCS.dbug = nordValidator.dbug;
}]);