if (typeof(nordValidatorOpts) == undefined) {
	var nordValidatorOpts = {}
}

var nordValidatorOpts = {
	dbug : false,
	defaults : {"validatorURL" : "https://validator.w3.org/nu/",
		"waitTime" : 5000,
		"htmlText" : false,
		"htmlCommennts" : false,
		"cdata" :  false,
		"dbug": nordValidator.dbug
	},
	downkeys : {"d" : null,
		"n" : null},
	usingTmp : false,
	controls : {
		"validatorURLTxt" : null,
		"waitTimeTxt" : null,
		"devSection" : null,
		"dbugChk" : null,
		"saveBtn" : null,
		"cancelBtn" : null,
		"restoreDefaultsBtn" : null
	},
	init : function () {

		for (var control in nordValidatorOpts.controls) {
			nordValidatorOpts.controls[control] = document.getElementById(control);
		}
		nordValidator.addToPostLoad([nordValidatorOpts.fillValues]);
		nordValidatorOpts.controls["restoreDefaultsBtn"].addEventListener("click", nordValidatorOpts.restoreDefaults,false);
		nordValidatorOpts.controls["saveBtn"].addEventListener("click", nordValidatorOpts.save,false);
		nordValidatorOpts.controls["cancelBtn"].addEventListener("click", nordValidatorOpts.cancel,false);

		document.addEventListener("keydown", nordValidatorOpts.checkKeys, false);
		if (nordValidatorOpts.usingTmp) {
			if (nordValidatorOpts.dbug) console.log ("usingTmp is true.  Creating Undo button.");
			nordValidatorOpts.createUndoBtn();
		} else {
			if (nordValidatorOpts.dbug) console.log ("usingTmp is false.  Not creating Undo button.");
		}
		
	}, // End of init
	createUndoBtn : function () {
		var undoBtn = null;
		undoBtn = document.getElementById("undoBtn");
		if (!undoBtn) {
			if (nordValidatorOpts.dbug) console.log ("Creating Undo button.");
			var loggedInButtonsHolderDiv = document.getElementById("loggedInButtonsHolderDiv");
			undoBtn = nordburg.createOptionsHTMLElement(document, "button", {"id":"undoBtn", "parentNode":"loggedInButtonsHolderDiv", "textNode":"Undo", "insertBefore":"downloadOverwriteBtn"});
			undoBtn.addEventListener("click", function() {
				var removing = browser.storage.local.remove("nordcmx-temp");
				removing.then(function () {
					nordValidatorOpts.usingTmp = false;
					// Need a way to tell the user that, and maybe reload the page
					undoBtn.setAttribute("disabled", "disabled");
					nordValidatorOpts.createComicList();
				}, nordValidator.errorFun);
			}, false);
		} else {
			if (nordValidatorOpts.dbug) console.log ("Not creating Undo button.");
		}
	}, // End of createUndoBtn
	save : function () {
		// Gather stuff somehow, then save it.
		nordValidatorOpts.saveOptions();
		if (nordValidatorOpts.usingTmp) {
			var removing = browser.storage.local.remove("nordValidator-temp");
			removing.then(function () {
				nordValidatorOpts.usingTmp = false;
				// Need a way to tell the user that, and maybe reload the page
				undoBtn.setAttribute("disabled", "disabled");
				//var msg = nordburg.createHTMLElement(document, "p", {"id":"msgP", "parentNode":dateSelectorDiv, "tabindex":"-1", "textNode":"Changes have been undone.  Refresh the screen for change to take effect."});
			}, nordValidator.errorFun);
		}
	}, // End of save
	saveOptions : function () {
		// Gather options from the form
		nordValidator.options["validatorURL"] = nordValidatorOpts.controls["validatorURLTxt"].value;
		nordValidator.options["waitTime"] = nordValidatorOpts.controls["waitTimeTxt"].value;
		nordValidator.options["htmlText"] = nordValidatorOpts.controls["htmlTextChk"].checked;
		nordValidator.options["htmlComments"] = nordValidatorOpts.controls["htmlCommentsChk"].checked;
		nordValidator.options["cdata"] = nordValidatorOpts.controls["cdataChk"].checked;
		nordValidator.options["dbug"] = nordValidatorOpts.controls["dbugChk"].checked;

		browser.storage.local.set({"nordValidatorOptions": nordValidator.options}).then(function () { if (nordValidator.options["dbug"]) console.log ("Saved!");}, nordValidator.errorFun);
		browser.runtime.sendMessage({"msg":"Updating options", "task" : "updateOptions", "options" : nordValidator.options});
	}, // End of saveOptions
	fillValues : function () {
		//if (nordValidatorOpts.dbug) //
			console.log ("Filling form values: " + nordValidator.options.waitTime.toString() + "ms");
		// Fill the forms and stuff
		nordValidatorOpts.controls["validatorURLTxt"].setAttribute("value", nordValidator.options.validatorURL);
		nordValidatorOpts.controls["waitTimeTxt"].setAttribute("value", nordValidator.options.waitTime);
		if (nordValidator.options["htmlText"]) nordValidatorOpts.controls["htmlTextChk"].setAttribute("checked", "checked");
		if (nordValidator.options["htmlComments"]) nordValidatorOpts.controls["htmlCommentsChk"].setAttribute("checked", "checked");
		if (nordValidator.options["cdata"]) nordValidatorOpts.controls["cdataChk"].setAttribute("checked", "checked");
		nordValidatorOpts.dbug = nordValidator.options.dbug;
		if (nordValidator.options.dbug === true) {
			nordValidatorOpts.controls["dbugChk"].setAttribute("checked", "checked");
			nordValidatorOpts.showDevSection();
		}
	}, // End of fillValues
	restoreDefaults : function () {
		/* Do stuff to restore defaults */
		if (nordValidatorOpts.dbug) console.log ("Restoring defaults.");
		for (var opt in nordValidator.options) {
			if (opt == "dbug") {
				nordValidatorOpts.controls["dbugChk"].checked = nordValidatorOpts.defaults[opt];
			} else {
				if (opt.match(/(validatorURL|waitTime)/i)) {
					nordValidatorOpts.controls[opt + "Txt"].value = nordValidatorOpts.defaults[opt];
				} else if (opt.match(/(html(Text|Comments)|cdata)/i)) {
					nordValidatorOpts.controls[opt + "Chk"].checked = nordValidatorOpts.defaults[opt];
				}
			}
		}
	}, // End of restoreDefaults
	cancel : function () {
		/* put stuff back */
		if (nordValidatorOpts.dbug) console.log ("Cancelling and setting stuff back to original values.");
		for (var opt in nordValidator.options) {
			if (opt.match(/(dbug|cdata|html(Comments|Text))/i)) {
				nordValidatorOpts.controls[opt + "Chk"].checked = nordValidator.dbug;
			} else {
				nordValidatorOpts.controls[opt + "Txt"].value = nordValidatorOpts.options[opt];
			}
		}
	}, // End of cancel
	checkKeys : function (e) {
		if (nordValidatorOpts.dbug) console.log ("Key down: " + e.keyCode + ".");
		if (e.keyCode == 68 || e.keyCode == 78) {
			document.removeEventListener("keypressed", nordValidatorOpts.checkKeys);
			document.addEventListener("keyup", nordValidatorOpts.checkUpKey, false);

			if (e.keyCode == 68) {
				if (!nordValidatorOpts.downkeys["d"]) {
					nordValidatorOpts.downkeys["d"] = (new Date()).getTime();
				}
			}
		}
	}, // End of checkKeys
	checkUpKey : function (e) {
		if (nordValidatorOpts.dbug) console.log ("Key up: " + e.keyCode + ".");
		if (e.keyCode == 68 || e.keyCode == 78) {
			document.removeEventListener("keyup", nordValidatorOpts.checkUpKey);
			document.addEventListener("keypressed", nordValidatorOpts.checkKeys, false);
			
			var keyUpTime = (new Date()).getTime();
			if (e.keyCode == 68) {
				var eTime = keyUpTime - nordValidatorOpts.downkeys["d"];
				if (eTime > 900) {
					// toggle devSection
					nordValidatorOpts.showDevSection();
				}
				nordValidatorOpts.downkeys["d"] = null;
			}
		}
		
	}, // End of checkUpKey
	showDevSection : function () {
		if (nordValidatorOpts.controls["devSection"].style.display == "none" || nordValidatorOpts.controls["devSection"].style.display == "") {
			nordValidatorOpts.controls["devSection"].style.display = "block";
		} else {
			nordValidatorOpts.controls["devSection"].style.display = "none";
		}
	}, // End of showDevSection
}
if (nordValidatorOpts.dbug) console.log ("nordValidatorOpts loaded.");

nordValidator.addToPostLoad([function () {
	nordValidatorOpts.dbug = nordValidator.dbug;
	if (nordValidatorOpts.dbug) nordValidatorOpts.controls["devSection"].style.display = "block";
}]);
nordValidatorOpts.init();
