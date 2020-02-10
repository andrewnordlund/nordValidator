if (typeof (nordValidator) == "undefined") {
	var nordValidator = {};
}
var nordValidator = {
	dbug : false,
	loaded : false,
	postLoad : [],
	options : {
		"validatorURL" : "https://validator.w3.org/nu/",
		"htmlText" : false,
		"htmlComments" : false,
		"scriptSrc" : false,
		"cdata" :  false,
		"dbug": nordValidator.dbug
	},
	init : function () {

	}, // End of init
	save : function (callback) {
		//var saving = browser.storage.local.set({"nordValidator": nordValidator./*something*/});
		//if (nordValidator.dbug) console.log ("Saved.  Gonna handle promises now.  Callback: "  + callback + ", typeof callback: " + typeof(callback) + ".");
		//if (callback) saving.then(callback, nordValidator.errorFun);
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

		// /* Something */ = savedObj;
		
		if (callback && typeof callback != "undefined") callback();
	}, // End of getSavedFromJSON
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
						if (nordValidator.dbug) console.log ("Just set " + opt + " to " + nordValidator.options[opt] + ".");
						if (opt == "dbug") {
							if (nordValidator.dbug === false && nordValidator.options[opt] === true) console.log ("loadOptions::Turning nordValidator.dbug on.");
							nordValidator.dbug = nordValidator.options[opt];
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
			console.error ("Caught something! " + ex.toString());
		}

	}, // End of loadOptions
	setLoaded : function () {
		nordValidator.loaded = true;
		nordValidator.afterLoad();
	}, // End of setLoaded
	afterLoad : function () {
		console.log ("Now that the page is loaded, I'll now execute " + nordValidator.postLoad.length + " postload functions.");
		for (var i = 0; i < nordValidator.postLoad.length; i++) {
			nordValidator.postLoad[i]();
		}
	}, // End of afterLoad
	addToPostLoad : function (funcs) {
		//nordValidator.postLoad = Object.assign(nordValidator.postLoad, funcs);
		//nordValidator
		for (var f in funcs) {
			nordValidator.postLoad.push(funcs[f]);
		}
		if (nordValidator.loaded) {
			console.log ("page is already loaded, I'll now execute " + nordValidator.postLoad.length + " postload functions.");
			nordValidator.afterLoad();
		}
	}, // End of addToPostLoad
	errorFun : function (e) {
		console.error ("Error! " + e);
	}, // End of errorFun
}

if (nordValidator.dbug) console.log ("lib::nordValidator loaded.");
nordValidator.loadOptions(nordValidator.init, nordValidator.errorFun);
