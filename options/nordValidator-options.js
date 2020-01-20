if (typeof(nordValidatorOpts) == undefined) {
	var nordValidatorOpts = {}
}

var nordValidatorOpts = {
	dbug : true,
	downkeys : {"d" : null,
		"n" : null},
	usingTmp : false,
	controls : {
		"validatorURLTxt" : null,
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
	disableDownloadButtons : function () {
		var downloadOverwriteBtn, downloadSyncBtn = null;
		try {
			downloadOverwriteBtn = document.getElementById("downloadOverwriteBtn");
			downloadOverwriteBtn.setAttribute("disabled", true);
			downloadSyncBtn = document.getElementById("downloadSyncBtn");
			downloadSyncBtn.setAttribute("disabled", true);
		}
		catch (ex) {
			console.warn(ex.message);
		}
	}, // End of disableDownloadButtons
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
		nordValidator.options["member"] = nordValidatorOpts.controls["memberChk"].checked;
		nordValidator.options["cfid"] = nordValidatorOpts.controls["cfIDtxt"].value;
		nordValidator.options["dbug"] = nordValidatorOpts.controls["dbugChk"].checked;
		nordValidator.options["syncFormURL"] = nordValidatorOpts.controls["syncURL"].value;


		browser.storage.local.set({"nordValidatorOptions": nordValidator.options}).then(function () { if (nordValidator.options["dbug"]) console.log ("Saved!");}, nordValidator.errorFun);
		browser.runtime.sendMessage({"msg":"Updating options", "task" : "updateOptions", "options" : nordValidator.options});
	}, // End of saveOptions
	fillValues : function () {
		if (nordValidatorOpts.dbug) console.log ("Filling form values.");
		// Fill the forms and stuff
		nordValidatorOpts.controls["validatorURLTxt"].setAttribute("value", nordValidator.options.validatorURL);
		nordValidatorOpts.dbug = nordValidator.options.dbug;
		if (nordValidator.options.dbug === true) {
			nordValidatorOpts.controls["dbugChk"].setAttribute("checked", "checked");
			nordValidatorOpts.showDevSection();
		}
	}, // End of fillValues
	restoreDefaults : function () {
		/* Do stuff to restore defaults */
		if (nordValidatorOpts.dbug) console.log ("Restoring defaults.");
	}, // End of restoreDefaults
	cancel : function () {
		/* put stuff back */
		if (nordValidatorOpts.dbug) console.log ("Cancelling and setting stuff back to original values.");
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
			} else if (e.keyCode == 78) {
				if (!nordValidatorOpts.downkeys["n"]) {
					nordValidatorOpts.downkeys["n"] = (new Date()).getTime();
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
			} else if (e.keyCode == 78) {
				var eTime = keyUpTime - nordValidatorOpts.downkeys["n"];
				if (eTime > 900) {
					// toggle member section
					nordValidatorOpts.showMembersSection();
				}
				nordValidatorOpts.downkeys["n"] = null;
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
	showMembersSection : function () {
		if (nordValidatorOpts.controls["membersSection"].style.display == "none" || nordValidatorOpts.controls["membersSection"].style.display == "") {
			nordValidatorOpts.controls["membersSection"].style.display = "block";
		} else {
			nordValidatorOpts.controls["membersSection"].style.display = "none";
		}
	}, // End of showMemberSection
}
if (nordValidatorOpts.dbug) console.log ("nordValidatorOpts loaded.");

nordValidator.addToPostLoad([function () {nordValidatorOpts.dbug = nordValidator.dbug;}]);
nordValidatorOpts.init();
