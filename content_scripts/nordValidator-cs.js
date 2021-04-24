if (typeof (nordValidatorCS) == "undefined") {
	var nordValidatorCS = {};
}
var start = Date.now();
var nordValidatorCS = {
	dbug : nordValidator.dbug,
	stat : null,
	errCnt : 0,
	warningCnt : 0,
	hash : null,
	returnFun : null,
	timeoutID : null,
	workerWorking : null,
	init : function () {
		// Should I do something here?
		nordValidatorCS.startProcess();
	}, // End of init
	startProcess : function () {
		// gather contents
		// Two options here:
		// Do like the bookmarklet and create a textarea and form to submit to the validator, or
		// Gather the contents into a variable, send to the BG script, and have it send the data.  This one may be the necessary one.
		if (nordValidatorCS.dbug) console.log ("Starting process.  timeoutID is now: " + nordValidatorCS.timeoutID + ".");
		nordValidatorCS.stat = "waiting";

		var body, validForm, showSource, out, contentTA = null;
		var contents = "";
		contents = nordValidatorCS.gatherContent();
		
		//body = document.getElementsByTagName("body")[0];

		//nordValidatorCS.sendForm(contents);
	}, // End of startProcess
	sendForm : function (contents) {
		
		// Just send form data randomly.  For some reason the json part isn't working.
		if (nordValidatorCS.dbug) console.log ("Creating a faux-form and submitting it. (" + document.location.href + ")");
		if (nordValidatorCS.dbug) console.log ("to: " + nordValidator.options.validatorURL);
		var http = new XMLHttpRequest();
		http.open("POST", nordValidator.options.validatorURL, true);
		var fd = new FormData();
		fd.append("out", "json");
		fd.append("showsource","yes");
		fd.append("content", contents);
		//fd.append("showoutline","yes");
		
		http.onload = function () {
			if (nordValidatorCS.dbug) console.log ("used http.onload.");
			nordValidatorCS.dealWithResults(http.responseText);
		}
		//http.addEventListener("load", function () {console.log ("used http.addEventListener.");nordValidatorCS.dealWithResults(http.responseText);}, false);
		http.send(fd);
		//clearTimeout(nordValidatorCS.timeoutID);
		//nordValidatorCS.timeoutID = null;
	}, // End of sendForm
	makeAndSendForm : function (contents) {
		// Create a form and submit
		validForm = document.getElementById("validForm");
		showSource = document.getElementById("showSource");
		contentTA = document.getElementById("contentTA");
		out = document.getElementById("out");
		//browser.runtime.sendMessage({"msg":"Please validate this.","task":"validate","content":contents});

		if (!validForm) validForm = nordburg.createHTMLElement(document, "form", {"method":"POST", "action":nordValidator.options.validatorURL, "enctype":"multipart/form-data", "acceptCharset":"utf-8","parentNode":body, "id":"validForm"});
		if (!showSource) showSource = nordburg.createHTMLElement(document, "input", {"type":"hidden", "id":"showSource", "name":"showsource", "value":"yes", "parentNode":validForm});
		if (!out) out = nordburg.createHTMLElement(document, "input", {"type":"hidden", "id":"out", "name":"out", "value":"json", "parentNode":validForm});
		if (!contentTA) contentTA = nordburg.createHTMLElement(document, "textarea", {"textNode":contents, "parentNode":validForm, "name":"content", "id":"contentTA"});
		

		//var sBoundary = "---------------------------" + Date.now().toString(16);

		//http.setRequestHeader("Content-type","text/html; charset=UTF-8");
		//http.setRequestHeader("enctype","multipart/form-data");
		//http.setRequestHeader("acceptCharset","utf-8");
		/*
		var params = contents + "&showsource=yes";
		//params = params.replace(/%20/g, '+');
		http.send(params);
		*/


		// Submit the above form
		var http = new XMLHttpRequest();
		http.open("POST", nordValidator.options.validatorURL, true);
		http.send(new FormData(validForm));



		if (nordValidatorCS.dbug) console.log ("Just posted to nuValidator.");
		if (nordValidatorCS.dbug) console.log ("Contents: " + contents);
		//if (nordValidatorCS.dbug) console.log ("With params: " + params + ".");
		http.onload = function () {
			nordValidatorCS.dealWithResults(http.responseText);
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
	}, // End of makeAndSendForm
	dealWithResults : function (results) {
		if (nordValidatorCS.dbug) console.log("with results: " + results);
		results = JSON.parse(results);
		var badErrors = ["tag seen","Stray end tag","Bad start tag","violates nesting rules","Duplicate ID","first occurrence of ID","Unclosed element","not allowed as child of element", "must not appear as a descendant of","unclosed elements","not allowed on element","unquoted attribute value","Duplicate attribute"];
		var badErrorsRS = badErrors.join("|");
		var realErrors = [];
		var warnings = [];

		for (var i = 0; i < results.messages.length; i++) {
			if (results.messages[i]["type"] == "error") {
				if (results.messages[i]["message"].match(badErrorsRS)) {
					if (nordValidatorCS.dbug) console.log ("Adding " + results.messages[i]["message"] + "to realErrors.");
					realErrors.push(results.messages[i]);
				}
			} else if (results.messages[i]["type"] == "info" && results.messages[i]["subType"] == "warning") {
				warnings.push(results.messages[i]);
			}
		}
		if (realErrors.length > 0) {
			if (nordValidatorCS.dbug) console.log ("Hey it's not valid! with an error count of " + realErrors.length +  " and a warning count of " + warnings.length + ".");
			nordValidatorCS.stat = "invalid";
		} else {
			if (nordValidatorCS.dbug) console.log ("Hey it's valid!");
			nordValidatorCS.stat = "valid";
		}
		nordValidatorCS.errCnt = realErrors.length;
		nordValidatorCS.warningCnt = warnings.length;

		/*
		 javascript:(function(){var%20filterStrings=
["tag seen",
"Stray end tag",
"Bad start tag",
"violates nesting rules",
"Duplicate ID",
"first occurrence of ID",
"Unclosed element",
"not allowed as child of element",
"unclosed elements",
"not allowed on element",
"unquoted attribute value",
"Duplicate attribute"];
var%20filterRE=filterStrings.join("|");var%20root=document.getElementById("results");if(!root){return;}%20var%20results=root.getElementsByTagName("li");var%20result,resultText;for(var%20i=0;i<results.length;i++){result=results[i];if(results[i].className!==""){resultText=(result.innerText!==undefined?result.innerText:result.textContent)+"";if(resultText.match(filterRE)===null){result.style.display="none";result.className=result.className+"%20steveNoLike";}}}})();

			javascript:(function(){var%20removeNg=true;var%20filterStrings=["tag%20seen","Stray%20end%20tag","Bad%20start%20tag","violates%20nesting%20rules","Duplicate%20ID","first%20occurrence%20of%20ID","Unclosed%20element","not%20allowed%20as%20child%20of%20element","unclosed%20elements","not%20allowed%20on%20element","unquoted%20attribute%20value","Duplicate%20attribute"];var%20filterRE,root,results,result,resultText,i,cnt=0;filterRE=filterStrings.join("|");root=document.getElementById("results");if(!root){alert("No%20results%20container%20found.");return}results=root.getElementsByTagName("li");for(i=0;i<results.length;i++){result=results[i];if(result.className!==""){resultText=(result.innerText!==undefined?result.innerText:result.textContent)+"";if(resultText.match(filterRE)===null){result.style.display="none";result.className=result.className+"%20steveNoLike";cnt++}else%20if(removeNg==true){if(resultText.indexOf("not%20allowed%20on%20element")!==-1&&resultText.indexOf("ng-")!==-1){result.style.display="none";result.className=result.className+"%20steveNoLike";cnt++}}}}alert("Complete.%20"+cnt+"%20items%20removed.")})();
		 */
		if (nordValidatorCS.returnFun) nordValidatorCS.returnFun();
	}, // End of dealWithResults
	gatherContent : function () {
		var doctype = "<!DOCTYPE ";
		doctype += document.doctype.name + ">\n";// + document.documentElement.outerHTML;
		//return contents;
		
		var contents = document.documentElement.outerHTML;

		// At this point, if you traverse the html tag, malformed tags may be returned as proper tags, thus passing validation, when it shouldn't.  Something to try!
		// Instead, we'll use regex to grab tags, comments, etc.
		//console.log ("Contents starting as: " + contents + ".");
		if (!nordValidator.options["scriptSrc"]) contents = contents.replace(/(<script[^>]+?src)\s*=\s*("[^"]*"|'[^']*'|`[^`]*`|\w*)/ig, "$1=\"dummyvalue.js\"");

		// Gonna break the page up into tags, comments, cdata, and text, then remove all that needs removing.
		// Nope.  This way slows things right the cripes down.

		/*
		contents = contents.replace(/[\n\f\t\s ]+/g, " ");
		contents = contents.split(/(<!--(?:.|\n)*?-->|<!\[CDATA\[.*?\]\]>|<\/?[^>]+?(?:\s*\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|\w*))?)*>)/);

		if (nordValidatorCS.dbug) console.log ("Contents now: " + contents.length + ".");

		for (var i = 0; i < contents.length; i++) {
			if (contents[i].match(/^<!\[CDATA\[.*\]\]>$/i) && !nordValidator.options["cdata"]) {
				contents[i] = "";
			} else if (contents[i].match(/^<!--(.|\n)*?-->$/i) && !nordValidator.options["htmlComments"]) {
				contents[i] = "";
			} else if (!contents[i].match(/^<\/?[^>]+?(\s*\w+(\s*=\s*("[^"]*"|'[^']*'|`[^`]*`|\w*))?)*>$/i) && !nordValidator.options["htmlText"]) {
				if (!contents[i].match(/^\s*$/)) {
					if (nordValidatorCS.dbug) console.log ("Changing " + contents[i] + " to abc.");
					contents[i] = "abc";
				}
			}
			//console.log (i + ": " + contents[i] + ".");
		}
		contents = contents.join("\n");
		*/
		contents = contents.replace(/[\n\f\t\s ]+/g, " ");

		if (nordValidator.options["htmlComments"] && nordValidator.options["htmlText"] && nordValidator.options["cdata"]) {
			if (nordValidatorCS.dbug) console.log("Include everything.  Sending the whole document.");
			// Just friggin' validate the whole thing with nothing removed
			return doctype + contents;
		} else {
			// Okay.  Something has to be removed.  Maybe all but the tags? That would be recommended
			//if (!nordValidator.options["htmlComments"] && !nordValidator.options["htmlText"] && !nordValidator.options["cdata"]) {
			//	if (nordValidatorCS.dbug) console.log("Include only the tags.");
				// Only do tags....but we gotta leave some data in some tags, like <title> and <options>
				//try this:
				/*
				contents = nordValidatorCS.removeComments(contents);
				contents = nordValidatorCS.removeCDATA(contents);
				contents = contents.replace(/>.*?</g, ">\n<");
				*/
				/*
				var tags = contents.match(/<\/?[^!>]+?(\s*\w+(\s*=\s*("[^"]*"|'[^']*'|`[^`]*`|\w*))?)*>/g);
				tags = tags.slice(1);
				contents = tags.join("\n");
				*/
			var workerFun = `self.onmessage = function(e) {
					postMessage({msg: "working"});
					//console.log ("workerFun::Got message " + e.data + ".");
					var contents = e.data["contents"];
					var dbug = e.data["dbug"];
					contents = contents.split (/(<!--(?:.|\\n)*?-->|<!\\[CDATA\\[(?:.|\\n)*\\]\\]>|<(?:\\/?[^!>]+\\s*(?:\\w+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|\`[^\`]*\`|\\w*))?)*)>)/i);
					if (dbug) console.log ("Got " + contents.length + " sections.");
					for (var i = 0; i < contents.length; i++) {
						//if (dbug) console.log ("Before: " + i + ": " + contents[i] + ".");
						if (contents[i].match(/<!--(.|\\n)*?-->/)) {
							if (!e.data["htmlComments"]) {
								//contents[i] = "";
								contents.splice(i, 1);
								i--;
								//console.log ("And contents now have " + contents.length + " elements.");
							}
						} else if (contents[i].match(/<!\\[CDATA\\[.*\\]\\]>/i)) {
							if (!e.data["cdata"]) {
								//contents[i] = "";
								contents.splice(i, 1);
								i--;
								//console.log ("And contents now have " + contents.length + " elements.");
							}
						} else if (contents[i].match(/<(?:\\/?[^!>]+\\s*(?:\\w+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|\`[^\`]*\`|\\w*))?)*)>/)) {
							// It's a tag.  Do nothing
						} else {
							// Okay, it's not a comment, cdata, or tag.  Must be text
							if (!e.data["htmlText"]) {
								if (contents[i].match(/\\S/)) {
									// There's some text there.  Replace with abc
									contents[i] = "abc";
								} else {
									//console.log (i + ": It's a blank line.  Get rid of it.");
									contents.splice(i, 1);
									i--;
									//console.log ("And contents now have " + contents.length + " elements.");
								}
							}
						}
						/*
						if (!contents[i].match(/^<(?:[^!>]+\\s*\\w+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|\`[^\`]*\`|\\w*))?)*>$/)) {
							if (!contents[i].match(/^ $/)) {
								//console.log ("Changing " + contents[i] + " to abc.");
								contents[i] = "abc";
							}
						}
						*/
						//if (dbug) console.log ("After: " +i + ": " + contents[i] + ".");
					}
					contents = contents.join("\\n");
					//self.postMessage('Done my thang with new contents: ' + contents);
					//console.log ("Sending contents back as " + contents + ".");
					postMessage({msg : "contents", contents : e.data["doctype"] + contents});
				};
				//console.log ("workerFun::Running workerFun.");`

			var blob = new Blob([workerFun]);
				//contents = contents.split (/(<(?:[^!>]+\s*\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|\w*))?)*>)/);
				//console.log ("Contents now: " + contents.length + ".");
				//for (var i = 0; i < contents.length; i++) {
				//	if (!contents[i].match(/^<(?:[^!>]+\s*\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|\w*))?)*>$/)) {
				//		if (!contents[i].match(/^ $/)) {
				//			console.log ("Changing " + contents[i] + " to abc.");
				//			contents[i] = "abc";
				//		}
				//	}
					//console.log (i + ": " + contents[i] + ".");
				//}
				//contents = contents.join("\n");
				//"onmessage = function(e) { postMessage('msg from worker'); }"
			//]);

			// Obtain a blob URL reference to our worker 'file'.
			var blobURL = window.URL.createObjectURL(blob);
	
			var worker = null;
			worker = new Worker(blobURL);
			worker.onmessage = function(e) {
				if (e.data["msg"] == "working") {
					nordValidatorCS.workerWorking = true;
				} else if (e.data["msg"] == "contents") {
					//console.log ("worker.onMessage::Got worker message " + e.data + ".");
					nordValidatorCS.sendForm(e.data["contents"]);
					//contents = e.data;
					// e.data == 'msg from worker'
				}
			};

			worker.postMessage({"doctype" : doctype, "contents" : contents, "htmlComments" : nordValidator.options["htmlComments"], "cdata" : nordValidator.options["cdata"], "htmlText" : nordValidator.options["htmlText"], dbug: nordValidatorCS.dbug}); // Start the worker.

			setTimeout(function () {
				if (nordValidatorCS.workerWorking) {
					if (nordValidatorCS.dbug) console.log ("Worker working.  Don't do anything further.");
				} else {
					if (nordValidatorCS.dbug) console.log ("Uh oh.  Time for Plan B.");
					
					if (!nordValidator.options["htmlComments"]) {
					contents = nordValidatorCS.removeComments(contents);
					}
					if (!nordValidator.options["cdata"]) {
						contents = nordValidatorCS.removeCDATA(contents);
					}
					if (!nordValidator.options["htmlText"]) {
						contents = nordValidatorCS.removeText(contents);
					}

					
					nordValidatorCS.sendForm(doctype + contents);

				}
			}, 500);
				
				/*
			} else {
				// Okay, so somethings are being removed, but not all.  Now comes the tough part.
				if (nordValidatorCS.dbug) console.log("Include some things.  Strip out the unwanted parts one by one.");
				if (!nordValidator.options["htmlComments"]) {
					contents = nordValidatorCS.removeComments(contents);
				}
				if (!nordValidator.options["cdata"]) {
					contents = nordValidatorCS.removeCDATA(contents);
				}
				if (!nordValidator.options["htmlText"]) {
					contents = nordValidatorCS.removeText(contents);
				}
			}
			*/
		}
		//contents = doctype + contents;


		//var tags = [];
		//console.log ("firstSibling: "  + document.firstChild.nodeType +", and childNodes[0]: " + document.childNodes[0].nodeType + " with length: " + document.childNodes.length + ".");
		//for (var i = 0; i < document.childNodes.length; i++) {
		/*
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
		 
		 */
		/*
		var a = document;
		for (var b="",a=a.firstChild; a; ) {
			console.log ("a: nodeType: " + a.nodeType + " <" + a.nodeName + ">");
			if (a.nodeType == Node.ELEMENT_NODE) {
				contents.push(a.outerHTML);
				tags.push(a.outerHTML);
			} else if (a.nodeType == Node.TEXT_NODE) {
				console.log ("Textnode found, and htmlText option is: " + nordValidator.options["htmlText"] + ".");
				if (nordValidator.options["htmlText"]) contents.push(a.nodeValue);
			} else if (a.nodeType == Node.CDATA_SECTION_NODE) {
				if (nordValidator.options["cdata"]) contents.push("<!CDATA[" + a.nodeValue + "]]\>");
			} else if (a.nodeType == Node.COMMENTS_NODE) {
				if (nordValidator.options["cdata"]) contents.push("<\!--" + a.nodeValue + "--\>");
			}
			/* 
			 	case Node.CDATA_SECTION_NODE:b+="<![CDATA["+a.nodeValue+"]]\>";break;
				case Node.COMMENT_NODE:b+="<\!--"+a.nodeValue+"--\>";break;
			 
			 * else if (document.childNodes[i].nodeType == 10) {
				console.log ("Found doctype!");
				contents.push("<!DOCTYPE "+document.childNodes[i].name+">");
			}* /
			a=a.nextSibling;
		}
		*/
		//contents = document.innerHTML;
		//console.log ("contents: "  + contents +".");
		//console.log ((body && contents
		//if (nordValidatorCS.dbug) console.log ("Got contents: " + contents + ".");

		//return contents;
		

	}, // End of gatherContent
	removeComments : function (contents) {
		if (nordValidatorCS.dbug) console.log ("Removing comments:");
		contents = contents.replace(/<!--(.|\n)*?-->/g, "");
		//console.log ("Contents now: " + contents + ".");
		return contents;
	}, // End of removeComments
	removeCDATA : function (contents) {
		if (nordValidatorCS.dbug) console.log ("Removing cdata:");
		contents = contents.replace(/<!\[CDATA\[.*\]\]>/ig, "");
		//console.log ("Contents now: " + contents + ".");
		return contents;
	}, // End of removeCDATA
	removeText : function (contents) {
		if (nordValidatorCS.dbug) console.log ("Removing text:");
		var tags = contents.match(/(<\/?!?[^>]+(\s*\w+(\s*=\s*("[^"]*"|'[^']*'\w*))?)*>|<!--(.|\n)*?-->)/ig);
		//var tags = contents.match(/(<\/?!?[^>]+(\s*\w+(\s*=\s*("[^"]*"|'[^']*'\w*))?)*>/ig);
		tags.slice(1);
		contents = tags.join("\n");
		//console.log ("Contents now: " + contents + ".");
		return contents;
	}, // End of removeText
	startup : function () {
	}, // End of startup
	notify : function (message, sender, sendMessage) {
		if (nordValidatorCS.dbug) console.log ("nordValidator-cs::Got a task: " + message["task"] + "."); // from " + message["pageURL"]);
		
		   // deal with tasks here
		if (message["task"] == "getStatus" || message["task"] == "retry") {
			if (nordValidatorCS.stat == null || message["task"] == "retry") nordValidatorCS.init();
			if (nordValidatorCS.dbug) console.log ("nordValidator-cs::sending back a stat of " + nordValidatorCS.stat + ".");
			sendMessage({"task":"updateIcon", "status":nordValidatorCS.stat, "errorCount" : nordValidatorCS.errCnt, "warningCount" : nordValidatorCS.warningCnt});
			if (nordValidatorCS.stat == "waiting" || nordValidatorCS.stat === null) {
				nordValidatorCS.returnFun = function () {
					if (nordValidatorCS.dbug) console.log ("Unilaterally sending message to -bg of status" + nordValidatorCS.stat + ", erorCount: " + nordValidatorCS.errCnt + ", and warningCount of " + nordValidatorCS.warningCnt + ".");
					browser.runtime.sendMessage({"msg":"Please validate this.", "task":"changeIcon", "status":nordValidatorCS.stat, "errorCount" : nordValidatorCS.errCnt, "warningCount" : nordValidatorCS.warningCnt});
					nordValidatorCS.returnFun = null;
				}
			}

		} else {
			sendMessage({"task":"updateIcon", "status":"error", "errorCount" : nordValidatorCS.errCnt, "warningCount" : nordValidatorCS.warningCnt});
		}
		
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
//if (nordValidatorCS.dbug)

nordValidator.addToPostLoad([function () {
	if (nordValidatorCS.dbug === false && nordValidator.dbug === true) console.log ("turning nordValidatorCS.dbug on.");
	nordValidatorCS.dbug = nordValidator.dbug;
	//nordValidatorCS.init();
}]);

       	//console.log ("nordValidatorCS.js loaded in " +document.location.href + ": " + new Date().toString());
//if (document.location.href.match(/^http/i)) 
/*
document.addEventListener("readystatechange", function () {
	//console.log ("readystate: " + document.readyState)
	if (document.readyState == "complete") console.log ("document.readystate is complete: " + Math.floor(Date.now() - start/1000)); //setTimeout (nordValidatorCS.init, 100);
}, false);
*/
//if (document.location.href.match(/^http/i)) setTimeout (nordValidatorCS.init, 100);

/*
 * This doesn't work
document.onload = function () {console.log("document.onload: " + Math.floor(Date.now() - start/1000))}; //nordValidatorCS.init;
document.addEventListener("load", function () {
	//if (nordValidatorCS.dbug) 
		console.log ("document loaded: " + Math.floor(Date.now() - start/1000));
	//if (document.location.href.match(/http/i)) nordValidatorCS.init();
}, false);
*/

//window.onload = function () {console.log("window.onload: " + Math.floor(Date.now() - start/1000))}; //nordValidatorCS.init;
/*
window.addEventListener("load", function () {
	if (nordValidatorCS.dbug) 
		console.log ("window loaded: " + Math.floor(Date.now() - start/1000));
	nordValidatorCS.init();
}, false);
*/
// For some reason, this doesn't seem to work.  Maybe because the script is injected too late.
/*
document.addEventListener("DOMContentLoaded", function () {
	//if (nordValidatorCS.dbug) 
		console.log ("DOMContentLoaded: " + Math.floor(Date.now() - start/1000));
	//if (document.location.href.match(/http/i)) nordValidatorCS.init();
}, false);
*/
