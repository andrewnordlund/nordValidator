var nordValidatorCS = {
	dbug : nordValidator.dbug,
	loggedIn : false,
	usingTmp : false,
	stat : null,
	init : function () {
		// Should I do something here?
		//
		nordValidatorCS.startProcess();
	}, // End of init
	startProcess : function () {
		// gather contents
		// Two options here:
		// Do like the bookmarklet and create a textnode and form to submit to the validator, or
		// Gather the contents into a variable, send to the BG script, and have it send the data.  This one may be the necessary one.
		
		var body, validForm, showSource, out, contentTA = null;
		var contents = "";
		contents = nordValidatorCS.gatherContent();
		
		body = document.getElementsByTagName("body")[0];

		/*		
		validForm = document.getElementById("validForm");
		showSource = document.getElementById("showSource");
		contentTA = document.getElementById("contentTA");
		out = document.getElementById("out");
		browser.runtime.sendMessage({"msg":"Please validate this.","task":"validate","content":contents});

		if (!validForm) validForm = nordburg.createHTMLElement(document, "form", {"method":"POST", "action":nordValidator.options.validatorURL, "enctype":"multipart/form-data", "acceptCharset":"utf-8","parentNode":body, "id":"validForm"});
		if (!showSource) showSource = nordburg.createHTMLElement(document, "input", {"type":"hidden", "id":"showSource", "name":"showsource", "value":"yes", "parentNode":validForm});
		if (!out) out = nordburg.createHTMLElement(document, "input", {"type":"hidden", "id":"out", "name":"out", "value":"json", "parentNode":validForm});
		if (!contentTA) contentTA = nordburg.createHTMLElement(document, "textarea", {"textNode":contents, "parentNode":validForm, "name":"content", "id":"contentTA"});
		*/
		
		var http = new XMLHttpRequest();
		http.open("POST", nordValidator.options.validatorURL, true);
		var fd = new FormData();
		fd.append("content", contents);
		fd.append("showsource","yes");
		fd.append("showoutline","yes");
		
		
		http.send(fd);
		//var sBoundary = "---------------------------" + Date.now().toString(16);

		//http.setRequestHeader("Content-type","text/html; charset=UTF-8");
		//http.setRequestHeader("enctype","multipart/form-data");
		//http.setRequestHeader("acceptCharset","utf-8");
		/*
		var params = contents + "&showsource=yes";
		//params = params.replace(/%20/g, '+');
		http.send(params);
		*/
		//http.send(new FormData(validForm));
		if (nordValidatorCS.dbug) console.log ("Just posted to nuValidator.");
		//if (nordValidatorCS.dbug) console.log ("With params: " + params + ".");
		http.onload = function() {
			if (nordValidatorCS.dbug) console.log("with results: " + http.responseText);
			//if (callback) callback(http.responseText);
		}
		
		/*
		(function() { 
			function c(a,b) { 
				var c=document.createElement("textarea");
				c.name=a;
				c.value=b;
				d.appendChild(c)
			}
			var e=function(a) {
				for(var b="",a=a.firstChild;a;) {
					switch(a.nodeType) {
						case Node.ELEMENT_NODE:b+=a.outerHTML;break;case Node.TEXT_NODE:b+=a.nodeValue;break;case Node.CDATA_SECTION_NODE:b+="<![CDATA["+a.nodeValue+"]]\>";break;case Node.COMMENT_NODE:b+="<\!--"+a.nodeValue+"--\>";break;
						case Node.DOCUMENT_TYPE_NODE:b+="<!DOCTYPE "+a.name+">\n"
					}
				a=a.nextSibling
				}
				return b
			}(document),
				d=document.createElement("form");
			d.method="POST";
			d.action="https://validator.w3.org/nu/";
			d.enctype="multipart/form-data";
			d.target="_blank";
			d.acceptCharset="utf-8";
			c("showsource","yes");c("out","json");c("content",e);
			document.body.appendChild(d);d.submit()})();

		*/
		// Note:  You cannot do this.  It will trigger an infinite loop of checking
		// validForm.submit();
		
/*
(function(){
	function c(a,b) {
		var c=document.createElement("textarea");
		c.name=a;
		c.value=b;
		d.appendChild(c)
	}
	var e=function(a) { 
		for (var b="",a=a.firstChild; a; ) {
			switch (a.nodeType) {
				case Node.ELEMENT_NODE:b+=a.outerHTML;break;
				case Node.TEXT_NODE:b+=a.nodeValue;break;
				case Node.CDATA_SECTION_NODE:b+="<![CDATA["+a.nodeValue+"]]\>";break;
				case Node.COMMENT_NODE:b+="<\!--"+a.nodeValue+"--\>";break;
				case Node.DOCUMENT_TYPE_NODE:b+="<!DOCTYPE "+a.name+">\n"
			}
			a=a.nextSibling
		}return b
	}(document),d=document.createElement("form");

	d.method="POST";
	d.action="https://validator.w3.org/nu/";
	d.enctype="multipart/form-data";
	d.target="_blank";
	d.acceptCharset="utf-8";

	c("showsource","yes");
	c("content",e);
	document.body.appendChild(d);d.submit();d.parentNode.removeChild(d);})();
		*/
		// Send for Validation
		
		// Set stat
		
		// Tell the boss to change the icon
	}, // End of startProcess
	gatherContent : function () {
		var contents=[];
		console.log ("firstSibling: "  + document.firstChild.nodeType +", and childNodes[0]: " + document.childNodes[0].nodeType + ".");
		for (var i = 0; i < document.childNodes.length; i++) {
			if (i == 0) console.log ("i:0 nodeType: " + document.childNodes[i].nodeType);
			if (document.childNodes[i].nodeType == Node.ELEMENT_NODE) {
				contents.push(document.childNodes[i].outerHTML);
			} else if (document.childNodes[i].nodeType == Node.TEXT_NODE) {
				contents.push(document.childNodes[i].nodeValue);
			} else if (document.childNodes[i].nodeType == 10) {
				console.log ("Found doctype!");
				contents.push("<!DOCTYPE "+document.childNodes[i].name+">");
			}
		}
		//contents = document.innerHTML;
		//console.log ("contents: "  + contents +".");
		//console.log ((body && contents
		//if (nordValidator.dbug) console.log ("Got contents: " + contents + ".");

		return contents.join("\n");

	}, // End of gatherContent
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
/*
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
*/
browser.runtime.onMessage.addListener(nordValidatorCS.notify);
if (nordValidatorCS.dbug) console.log ("nordValidatorCS.js loaded.");
nordValidator.addToPostLoad([function () {
	if (nordValidatorCS.dbug === false && nordValidator.dbug === true) console.log ("turning nordValidatorCS.dbug on.");
	nordValidatorCS.dbug = nordValidator.dbug;
}]);

if (document.location.href.match(/http/i)) nordValidatorCS.init();
