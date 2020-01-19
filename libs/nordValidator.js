if (typeof (nordValidator) == "undefined") {
	var nordValidator = {};
}
var nordValidator = {
	dbug : false,
	loaded : false,
	postLoad : [],
	options : {
		"member" : false,
		"cfid" : null,
		"syncFormURL" : nordburg.cloudSyncURL,
		"dbug": nordValidator.dbug
	},
	init : function () {

	}, // End of init
	save : function (callback) {
		var saving = browser.storage.local.set({"nordValidator": nordValidator./*something*/});
		if (nordValidator.dbug) console.log ("Saved.  Gonna handle promises now.  Callback: "  + callback + ", typeof callback: " + typeof(callback) + ".");
		if (callback) saving.then(callback, nordValidator.errorFun);
	}, // End of save
	getSaved : function (success, failure) {
		var getting = browser.storage.local.get("nordValidator");
		getting.then(function (savedObj) {
			if (nordValidator.dbug) console.log ("Got stored stuff.");
			if (nordburg.countObjs(savedObj) == 0) {
				var msgCentre = null;
				msgCentre = document.getElementById("msgCentre");
				if (msgCentre) {
					nordburg.createHTMLElement(document, "p", {"parentNode":msgCentre, "textNode" : "Sorry. It appears you have nothing saved."});
				}
			} else {
				if (nordValidator.dbug) console.log ("Got savedstuff.");
				savedObj = savedObj["nordValidator"];
				if (nordValidator.dbug) {
					console.log ("Something (saved information) there.");
					console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
					console.log ("savedObj: " + typeof(savedObj["lastRead"]) + ".");
					for (var k in savedObj["lastRead"]) {
						console.log (k + ": " + savedObj["lastRead"][k] +".");
					}
				}
				nordValidator.getSavedFromJSON(savedObj);
			}
			if (success) success();
		}, failure);
	}, // End of getSaved
	getSavedFromJSON : function (savedObj) {
		var callback = null;
		if (arguments.length > 1 ) callback = arguments[1];

		/* Something */ = savedObj;
		
		if (callback && typeof callback != "undefined") callback();
	}, // End of getSavedFromJSON
	downloadAndOverwrite : function () {
		var callback = null;
		if (arguments.length > 0) callback = arguments[0];
		var syncformURL = nordburg.cloudSyncURL;
		syncformURL = syncformURL.replace(/\.php?.*$/, ".php?cloud_files_ID=" + nordValidator.options.cfid + "&task=download&hijax=true");
		if (nordValidator.dbug) console.log ("Downloading from " + syncformURL + ".");
		nordburg.getRemoteFile(syncformURL, function (responseText) {
			var cloudFile = responseText.replace("/\n/g", "");
			if (typeof(cloudFile) == "string") cloudFile = JSON.parse(cloudFile);
			if (typeof(cloudFile) == "string") cloudFile = JSON.parse(cloudFile);
			if (nordValidator["options"].dbug) {
				console.log("Got cloudFile...");
				console.log(cloudFile);
				console.log("Of type " + typeof(cloudFile) + ".");
			}
			}
			nordValidator.getSavedFromJSON(cloudFile, function () {
				if (nordValidator.dbug) console.log ("Saving in nordValidator-temp.");
				var saving = browser.storage.local.set({"nordValidator-temp": nordValidator.cmx});
				if (callback) saving.then(callback, nordValidator.errorFun);
			});
		}, true);
	}, // End of downloadAndOverwrite
	downloadAndSync : function () {
		var callback = null;
		if (arguments.length > 0) callback = arguments[0];
		var syncformURL = nordburg.cloudSyncURL;
		syncformURL = syncformURL.replace(/\.php?.*$/, ".php?cloud_files_ID=" + nordValidator.options.cfid + "&task=download&hijax=true");
		nordburg.getRemoteFile(syncformURL, function (responseText) {
			var cloudFile = responseText.replace("/\n/g", "");
			if (cloudFile.match(/\<\?xml .*version="1\.0".*\?\>/)) {
				cloudFile = nordValidatorOpts.XMLtoJSON(cloudFile);
			} else {
				if (typeof(cloudFile) == "string") cloudFile = JSON.parse(cloudFile);
				if (nordValidator.dbug) {
					console.log("Got cloudFile...");
					console.log(cloudFile);
					console.log("Of type " + typeof(cloudFile) + ".");
				}
				if (typeof(cloudFile) == "string") cloudFile = JSON.parse(cloudFile);
				// Oh man....how do we sync?
				// Welp, figure it out here.
			}
		}, true);
	}, // End of downloadAndSync
	loadOptions : function (success, failure) {
		if (nordValidator.dbug) console.log ("Loading Options.");
		var theThen = function (savedObj) {
			if (nordValidator.dbug) console.log ("Got stored options.");
			if (nordburg.countObjs(savedObj) == 0) {
				if (nordValidator.dbug) console.log ("There ain't no options there.  This is normal if it's your first time running this.");
			} else {
				if (nordValidator.dbug) console.log ("Got saved options.");
				if (savedObj.hasOwnProperty("nordValidatorOptions")) savedObj = savedObj["nordValidatorOptions"];
				if (nordValidator.dbug) {
					console.log ("Something (options) there.");
					console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
					console.log ("savedObj: " + nordburg.objToString(savedObj) + ".");
				}
				for (var opt in nordValidator.options) {
					if (savedObj.hasOwnProperty(opt)) {
						nordValidator.options[opt] = savedObj[opt];
						if (opt == "dbug") {
							if (nordValidator.dbug === false && nordValidator.options[opt] === true) console.log ("loadOptions::Turning nordValidator.dbug on.");
							nordValidator.dbug = nordValidator.options[opt];
						} else if (opt == "syncFormURL") {
							nordburg.syncFormURL = nordValidator.options[opt];
						}
					}
				}
			}
			nordValidator.setLoaded();
			if (success) success();
		}
		try {
			var getting = browser.storage.local.get("nordValidatorOptions");
			if (nordValidator.dbug) console.log ("Loaded Options. Gonna deal with promises.");
			getting.then(theThen, failure);
		}
		catch(ex) {
			console.log ("Caught something! " + ex.toString());
		}

	}, // End of loadOptions
	setLoaded : function () {
		nordValidator.loaded = true;
		nordValidator.afterLoad();
	}, // End of setLoaded
	afterLoad : function () {
		for (var i = 0; i < nordValidator.postLoad.length; i++) {
			nordValidator.postLoad[i]();
		}
	}, // End of afterLoad
	addToPostLoad : function (funcs) {
		nordValidator.postLoad = Object.assign(nordValidator.postLoad, funcs);
		if (nordValidator.loaded) {
			nordValidator.afterLoad();
		}
	}, // End of addToPostLoad
	errorFun : function (e) {
		console.error ("Error! " + e);
	}, // End of errorFun
}

if (nordValidator.dbug) console.log ("lib::nordValidator loaded.");
nordValidator.loadOptions(nordValidator.init, nordValidator.errorFun);