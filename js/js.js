function runChat() {
	debug.log('runChat fired');
	if (touchvoteJSON.chat.message) {
		tvChat.receive(touchvoteJSON.chat.message);
	}
	if (touchvoteJSON.chat.cmd) {
		tvChat.cmd(touchvoteJSON.chat.cmd);
	}
};

function tvChat() {

	this.conversation = [];
	this.chatmessage = [];

	this.cmd = cmd;
	function cmd(cm) {
		if (cm == "show") {
			$("#chatdiv").show();
		}
		if (cm == "hide") {
			$("#chatdiv").hide();
		}
		if (cm == "clear") {
			$("#messagewindow").html('');
		}
	}


	this.send = send;
	function send() {
	}


	this.receive = receive;
	function receive(data) {
		rts = $.now();
		// empfangen um
		ts = data.ts;
		// gesendeter timestamp
		t = data.t;
		// Absender
		m = data.m;
		// message
		debug.log(ts + '' + t + ' ' + m);
		console.log(ts + '' + t + ' ' + m);

		if (m) {
			$("#messagewindow").append('' + '<div class="chatprepend2">' + t + ' ,<time class="timeago" datetime="' + new Date().toISOString() + '"></time>:</div>' + '<div class="chatline2">' + m + '</div>');
			setTimeAgo();
			tvChat.conversation.push('{"ts":' + ts + ',"t":"' + t + '","m":"' + m + '"}');
			localStorage.setItem("conversation", tvChat.conversation);
		}
		tvChat.cmd("show");
	}


	this.update = update;
	function update() {
		tvChat.chatmessage.push({
			"ts" : $.now(),
			"t" : "recipient",
			"m" : chatinput
		});
		localStorage.setItem("chatmessage", JSON.stringify(tvChat.chatmessage));
		tvChat.conversation.push('{"ts":' + $.now() + ',"t":"recipient","m":"' + chatinput + '"}');
		localStorage.setItem("conversation", tvChat.conversation);
		resultObject.sms = tvChat.chatmessage;
		tvSetData();
	}


	$("#chatsend").bind('click', function() {
		if ($("#chatinput").val()) {
			chatinput = $("#chatinput").val();
			$("#messagewindow").append('' + '<div class="chatprepend1">Ich, <time class="timeago" datetime="' + new Date().toISOString() + '"></time>:</div>' + '<div class="chatline1">' + chatinput + '</div>');
			setTimeAgo();
			tvChat.update();
			$("#chatinput").val('').text('');
		}
	});

	$("#chatclear").bind('click', function() {
		$("#chatinput").val('').text('');
	});

};

//tvChat = new tvChat();

jQuery.timeago.settings.strings = {
	prefixAgo : "vor",
	prefixFromNow : "in",
	suffixAgo : "",
	suffixFromNow : "",
	seconds : "wenigen Sekunden",
	minute : "etwa einer Minute",
	minutes : "%d Minuten",
	hour : "etwa einer Stunde",
	hours : "%d Stunden",
	day : "etwa einem Tag",
	days : "%d Tagen",
	month : "etwa einem Monat",
	months : "%d Monaten",
	year : "etwa einem Jahr",
	years : "%d Jahren"
};

timeAgoRunning = 0;
function setTimeAgo() {
	if (timeAgoRunning == 0) {
		jQuery("time.timeago").timeago();
		//timeAgoRunning = 1;
	}
};

///////////// chat end  ////////////////////



/////////////////////////////////////////////////////////////////

function runCommando(comm) {
	commando = comm;
	
	$.each(commando, function(key, val) {
		console.log("runCommando: "+key+" "+val);
/*
		var fnc = window[key];
		if(typeof fnc === 'function') {
			fnc(key(value));
		}
*/	
		switch ( key ) {
		    case "goto":
		        gotoSlide.nr(val);
		        break;
		        
		    case "gotoQ":
		        gotoSlide.nr(val);
		        break;
		    
		    case "next":
		        gotoSlide.next();
		        break;
		    
		    case "splash":
		        createSplash(val);
		        break;
		    
		    case "setPortOrient":
	//	    if (typeof this.setPortOrient == 'boolean'": 
		    	settings.orientation = val; // true (Portrait) or false (LS)
		        setPortOrient(val);
	//	    }
		    
		    case "clear":
		       clearTouchvote(val);
		       break;
		    		    
		    case "debug":
				switch ( val ) {
					case "on" : debug.on(); break;
					case "off" : debug.off(); break;
					case "clear" : debug.clear(); break;
					default : debug.off();
				}
				break;
		    
		    case "setResultData":
		        resultObject.setData("storage");
		        break;
		    
		    case "reloadDoc":
		        reloadDoc();
		        break;
		    
		    case "execute":
		        execute( val );
		        break;
		    
		    case "getCurrent":
		        setCurrent();
		        break;
		    
		    case "deleteProject":
		        deleteProject( val );
		        break;
		    
		    case "deleteSlide":
		        deleteSlide( val );
		        break;
		    
		    case "listSlides":
		        listSlides( val );
		        break;
		    
		    case "loadSlide":
		        loadSlide( val );
		        break;
		    
		    case "getSlide":
		        getSlide( val );
		        break;
		    
		    case "getProject":
		        getProject( val );
		        break;

		    case "setBottomNavbar":
		        setBottomNavbar( val );
		        break;

		    case "setTopNavbar":
		        setTopNavbar( val );
		        break;
		    
		    case "autovote":
		    	autoVote( val );
		    	break;

		    case "showscreen":
		    	showScreen( val );
		    	break;
		    
		    case "chat": // verschoben in eigenes chat objekt
		        tvChat.receive( val );
		        break;
		    
		    default:
		    	debug.log("No such commando!");
		    
	  	}
  });
};

function switchCommand(comd) {
	var comd = comd;

    try {
        comd = JSON.parse(comd);
    } catch (e) {
    	console.log(e);
        return false;
    }
	
	
	if(typeof comd === "string"){
		console.log("comd is a string:");
		console.log(comd);
	}

	if(comd.commando){
		runCommando(comd.commando);
		return false;
	}
	
	if(comd.agenda){
		agenda = comd.agenda;
		loadScreen("agendaScreen", agenda);
		return false;
	}
	
	if(comd.referenten){
		referenten = comd.referenten;
		console.log(referenten);
		loadScreen("referentenScreen", referenten);
		return false;
	}

	if(comd.slides){
		addSlides(comd.slides);
		loadSlides();
		return false;
	}
	
	console.log(comd);
	
	// TO BE DEPRECATED - FUTURE USE: JSON ONLY!
	debug.log("switchCommand:"+JSON.stringify(comd));
    switch (comd) {
	    case "nextQ":
	        gotoSlide.next();
	        break;
	    case "rotate":
	        setPortOrient();
	        break;
	    case "say":
	        sayfunction();
	        break;
	    case "debugon":
	        debug.on();
	        break;
	    case "debugoff":
	        debug.off();
	        break;
	    case "debugclear":
	        debug.clear();
	        break;
	    case "clear":
	        clearTouchvote();
	        break;
	    case "setResultData":
	        resultObject.setData("storage");
	        break; // file oder storage
	    case "setBottomNavbar":
	        setBottomNavbar(1);
	        break;
	    case "showscreen":
	        showScreen();
	        break; 
		case "chat":
			debug.log("Commando Chat: "+comd.chat);
			tvChat.receive(comd.chat);
			break;
	    default:
	        touchvoteJSON.parse(comd);
    }
}

/////////////////////////////////////////////

function gotoSlide(NR) {
    this.target = NR;

    this.nr = nr;
    function nr(NR) {
        ///aQ = NR;
        setActive(NR);
    };

    this.next = next;
    function next() {
        gotoSlide.nr(nQ);
    };

    this.last = last;
    function last() {
        var cQ = countedQs;
        gotoSlide.nr(cQ);
    };

    this.first = first;
    function first() {
        gotoSlide.nr(fQ);
    }
};
/////////////////////////////////////////////

function debug(dbg) {
	this.status = false;
	
	this.on = on;
	function on() {
		this.status = true;
        $("#debugdiv").show();
	} 
	
	this.off = off;
	function off() {
		this.status = false;
		$("#debugdiv").hide();
	}
	
	this.log = log;
	function log(dbg) {
		if ( this.status == true ) {
			$("#debugdiv").append(dbg+"<br>");
			console.log(dbg);
		}
	}

	this.clear = clear;
	function clear() {
		$("#debugdiv").html("");
		//delete debug;
	}
};
/*
debug = new debug();
debug.off();
*/

/////////////////////////////////////////////////////

function clearTouchvote(xx) {
	
	this.all = all;
	function all() {
		debug.log("clear all fired");
		localStorage.clear();
		resetVars();
    	if (typeof TouchVote != "undefined") {
        	TouchVote.setData(" ");
    	}	
	}
	
	this.screen = screen;
	function screen() {
	    $("#content").html("");		
	}
	
	this.results = results;
	function results() {
	    resultObject.clear();
	    tvSetData();		
	}
	
	this.ls = ls; // Local Storage
	function ls() {
	    localStorage.removeItem(settings.filename);
	    localStorage.removeItem(settings.filename+"-results");
	    localStorage.removeItem(settings.filename+"-settings");
		localStorage.clear();			
	}
	
	if ( xx == "all") {
		this.all();
	}
	if ( xx == "screen" ){
		this.screen();
	}
	if ( xx == "results" ) {
		this.results();
	}
	if ( xx == "LS") { // Local Storage
		this.ls();
	}

    debug.log(xx);
    resetVars();
};


/////////////////////////////////////////////////

function reloadDoc() {
    debug.log("mimi");
    //document.location.reload(true);
    return false;
};

///////////////////////////////////////////////////
function setPortOrient(SP) {
	debug.log("setPortOrient: "+SP);
	if (SP) {
		settings.orientation = SP;
	} 
	
	$("#wrapper").removeClass("portrait");
	$("#wrapper").removeClass("landscape");
	$("#content").removeClass("portrait");
	$("#content").removeClass("landscape");
	
	if (settings.orientation == true) {
		$("#wrapper").addClass("portrait");
		$("#content").addClass("portrait");
	} else {
		$("#wrapper").addClass("landscape");
		$("#content").addClass("landscape");
	}
	
    if (typeof TouchVote != "undefined") {
        TouchVote.setPortOrient(settings.orientation);
    }
};

/////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
function preloader() {	
	this.ready = ready;
	function ready() {
		setTimeout('preloader.hide()', 1000);
	};
	
	this.hide = hide;
	function hide() {
		$("#status").hide();
		$("#preloader").fadeOut(500, function() {
			 $(this).remove();
			 });
	};
};


//////////////////////////////////////////////////////////

function autoVote(val){
	if(val == true){
		settings.autovote = true;
		parseSlides();
		settings.autovote = false;
	} else {
		settings.autovote = false;
	}
};

function setActive(aid) {

	clearTimeout(nextTimer);

	if (aid) {
		if (aid == aQ) {
			console.log("aid: " + aid + " aQ: " + aQ);
			return false;
			// abort if already active
		} else {
			aQ = aid;
		}
	}	

	zeigen = 0;
	nextButton.hide();

	console.log("setActive aQ: " + aQ + " zeigen: " + zeigen);

	starttime = $.now();

	debug.log("setActive: aQ:" + aQ);
	//nQ = next; // next Target
	console.log(slidesJSON[aQ]);
	nQ = slidesJSON[aQ].n[2];
	// next Target
	debug.log("setActive: nQ:" + nQ);

	tvTransitions[tvtrans]();

	if (fitText) {
		$(".frage").fitText(1.2, {
			minFontSize : '18px',
			maxFontSize : '30px'
		});
	}
	
	// remove focus...
	//$("body").focus();
	
	
	if ($("#" + aQ + " input")) {
		console.log("setActive input focus");
		$("#" + aQ + " input").focus();
	}

	if ($("#" + aQ + " textarea")) {
		console.log("setActive textarea focus");
		$("#" + aQ + " textarea").focus();
	}
	

	console.log("setActive: zeigen = " + slidesJSON[aQ].n[0]);
	zeigen = slidesJSON[aQ].n[0];
	debug.log("setActive: zeigen: " + zeigen);

	nextButton.init();
	
	setHistory(aQ);
	
	if(slidesJSON[aQ].status){
		console.log("status found")
		if(slidesJSON[aQ].status.active){
			setStatus.active(slidesJSON[aQ].status.active);
		}
		if(slidesJSON[aQ].status.inactive){
			setStatus.active(slidesJSON[aQ].status.inactive);	
		}
	}

	var fn = window[slidesJSON[aQ].type];
	if ( typeof fn === 'function') {
		fn(slidesJSON[aQ].type);
	};
};

function vote(jid, jvaluearray, starttime, nextcondition) {
	var nextc = 0;
	if(nextcondition){
		nextc = nextcondition;
	}
	
	setResult(jid, jvaluearray, starttime);
	voteDone.push(jid);
	
	setNext(nextc);

	if (zeigen == 2) {
		nextButton.show();
	};
	if (zeigen == 4) {
		nextButton.hide();
		gotoSlide.nr(next);
	};
};

function setResult(jid, jvaluearray, starttime){
	console.log("setResult fired");
	resultObject.result[jid] = {
		"id" : parseInt(jid),
		"pa" : jvaluearray,
		"st" : starttime,
		"et" : $.now()
	};
	tvSetData();
	console.log(JSON.stringify(resultObject.result[jid]));	
};

function setNext(nextc){
	console.log("setNext fired, nextc: "+nextc);
	console.log("slidesJSON[aQ].prev: "+slidesJSON[aQ].prev);
	if ( typeof slidesJSON[aQ].prev != "undefined"){
		prev = slidesJSON[aQ].prev;	
	} else {
		prev = 0;
	}
	
	//next = jthis.n[2];
	next = slidesJSON[aQ].n[2];
	if (nextc != 0) {
		next = nextc;
	};// wenn wert gesetzt, gehe zu target
	nQ = next;	
};

function tvSetData() {
	debug.log("tvSetData fired");

	resultObject.result.inittime = timestamp;

	$("#debugdiv #jsondiv").html(JSON.stringify(resultObject));
	if ( typeof TouchVote != "undefined") {
		TouchVote.setData(JSON.stringify(resultObject));
		// <-- important!
	}
	var cS = localStorage.getItem('currentSlides');
	localStorage.setItem(cS + '_result', JSON.stringify(resultObject));
	project[cS+'_result'] = resultObject;
};
function clearSetData() {
	if ( typeof TouchVote !== 'undefined') {
		TouchVote.setData("");
	}
};

function execute(func) {
	var fne = window[func];
	if ( typeof fne === 'function') {
		fne();
	}
	$("#debugdiv").html(JSON.stringify(TouchVote));
};

frameloader = function(target, source) {
	$("#content").prepend('<div id="flDiv" width:100%; height:100%; background-color:#336699;"></div>');
	$('#flDiv').html('<iframe id="flFrame" style="width:100%; height:100%;" src="' + source + '" seamless></iframe>');
	$('#flDiv').bind('click', function(event) {
		debug.log('ping pong');
	});
};
//frameloader('#wrapper', 'hallo.html');

function whatResponse() {
	//resultObject.result.whatresponse = $.now();
	resultObject.result['999'] = {
		"id" : parseInt('999'),
		"pa" : [$.now()],
		"st" : $.now(),
		"et" : $.now()
	};
	tvSetData();
}

$(function() {
	$('.showWhatButton').click(function() {
		$('#whatModal').modal();
	});

	$('.sendWhatButton').click(function() {
		whatResponse();
		$('#whatModal').modal('hide');
	});
});

// Keyboard:
/*
function showKeyboard(bl) {
var status = bl;
if ( typeof TouchVote !== "undefined") {
TouchVote.showKeyboard(status);
}
return status;
console.log("showKeyboard: " + status);
};
*/

// window reload without cache

function windowReload() {
	window.location.reload(true);
};

function resultLog(res) {
	//resultObject.result.whatresponse = $.now();
	resultObject.log = {
		"msg" : res,
		"ts" : $.now()
	};
	tvSetData();
};

function setHistory(aid) {

/*
	if (aid == "undefined") {
		console.log("ERROR: setHistory: no aid parameter!");
		return false;
	}

	if (historyPos > historyIDs.length) {
		console.log("Error: setHistory: invalid historyPos or history.length!");
		return false;
	} else if (historyPos == historyIDs.length) {
		//if (aQ == _.last(historyIDs)) {
		historyIDs.push(aQ);
		historyPos++;
		//}
	} else if (historyPos < historyIDs.length) {
		historyPos++;
	}
*/	

	nextID = 0;
	prevID = 0;
	setNext(0);

	console.log("slidesJSON[aQ].prev: "+slidesJSON[aQ].prev);
	if ( typeof slidesJSON[aQ].prev != "undefined"){
		prev = slidesJSON[aQ].prev;	
	} else {
		prev = 0;
	}
	
	if(prev == 0){
		$(".pager-back").addClass('disabled');
	} else {
		$(".pager-back").removeClass('disabled');
	}
	prevID = prev;
	
	console.log("prevID: "+prevID);
/*
	if (historyPos <= 1) {
		$(".pager-back").addClass('disabled');
		var prevID = historyIDs[0];
	} else {
		if (historyIDs[historyPos - 2]) {
			var prevID = historyIDs[historyPos - 2];
			console.log("prevID: " + prevID);
			$(".pager-back").removeClass('disabled');
			//$(".pager-back").show();
		}
	}


	console.log("historyIDs: " + historyIDs);
	console.log("historyPos: " + historyPos);
	console.log("historyIDs[historyPos-1]: " + historyIDs[historyPos-1]);

*/

	if(zeigen != 0){
		$(".pager-skip").removeClass('disabled');
	} else {
		$(".pager-skip").addClass('disabled');
	}
	//nQ = slidesJSON[aQ].n[2];
	nextID = nQ;
	console.log("nextID: "+nextID);
/*
	if (historyPos == historyIDs.length) {
		if (settings.historySkip){
			if (zeigen == 0){
				nextID = nQ;
			}
			$(".pager-skip").removeClass('disabled');	
		} else {
			$(".pager-skip").addClass('disabled');	
		}
		//$(".pager-skip").hide();
	} else {
		if (historyIDs[historyPos-1]) {
			var nextID = historyIDs[historyPos-1];
			console.log("nextID: " + nextID);
			$(".pager-skip").removeClass('disabled');
		} else {
			console.log("historyIDs[historyPos]: " + historyIDs[historyPos-1]);
		}
	}


	console.log("history after:");
	console.log(historyIDs);
	console.log("historyPos: " + historyPos);

*/


};


$(function(){
	$(".pager-back").click(function(event) {
		event.preventDefault();
		if ($(".pager-back").hasClass('disabled')) {
			return false;
		}
		/*
		historyPos = historyPos - 2;
		if(historyPos < 0){ historyPos = 0; };
		*/
		setActive(prevID);
	});

	$(".pager-skip").click(function(event) {
		event.preventDefault();
		if ($(".pager-skip").hasClass('disabled')) {
			return false;
		}
		/*
		historyPos = historyPos - 1;
		if(historyPos < 1){ historyPos = 1; };
		*/

		setActive(nQ);
	});	
});

setStatus = function(){
	this.active = function(classname){
		_.each(classname, function(val){
			console.log("setStatud active: "+val);
			$('.'+val).removeClass('inactive');
		});
	};
	this.inactive = function(classname){
		_.each(classname, function(val){
			console.log("setStatud inactive: "+val);
			$('.'+val).addClass('inactive');
		});
	};
};
setStatus = new setStatus();

$(function(){
	//setStatus.inactive(['header-logo', 'pager']);
});




if ( typeof TouchVote !== 'undefined') {
	
	TouchVote.tagScanned = function(data) {
		
		console.log("tag scanned data: "+data);
		var data = JSON.parse(data);
		console.log("data.id: "+data.id);
		if (nfcJSON[data.id]) {
			console.log(nfcJSON[data.id]);
			switchCommand(nfcJSON[data.id]);
			
			/*
			var fn = window[nfcJSON[data.id]];
			if ( typeof fn === 'function') {
				fn(nfcJSON[data.id]);
			} else {
				console.log("nfc: no such function");
			}
			*/ 
		}

		resultObject.nfc= {
			"id" : data.id,
			"data": data.data
		};
		tvSetData();
		
	};	
};




function showScreen(screenid){
	
	if(screenid == "agenda"){
		screenid = "agendaScreen";	
	}
	if(screenid == "referenten"){
		screenid = "referentenScreen";	
	}
	
	$('.tvscreen').removeClass('active').addClass('inactive');
	$('#'+screenid).addClass('active');
};

function loadScreen(screenid, content){
	console.log(screenid);
	console.log(content);
	$('#'+screenid).html(content);	
};

$(function(){
	if(typeof agendaJSON != 'undefined'){
		var agendaHtml = agendaJSON.agenda;
		loadScreen("agendaScreen",agendaHtml); 
	}

	if(typeof referentenJSON != 'undefined'){
		var referentenHtml = referentenJSON.referenten;
		loadScreen("referentenScreen",referentenHtml); 
	}	
});

function teleprompter(){
	//#teleprompterScreen
};

var settings = {
	zipname : "none",
	filename : [],
	slides : []

	// predefining values:
	//zipname;

	/*
	 this.orientation = true; // false
	 this.storage = "keep"; // "clear" / "keep"
	 this.debug = "off"; // "on"
	 this.preloader = true; // false
	 this.path = "touchvote.json";
	 this.source = "touchvote.json"; // "none"
	 this.zipname;
	 //this.projectname;
	 this.filename = [];
	 this.slides = [];
	 this.bottomnavbar = 1;
	 this.topnavbar = 1;
	 */
};

function getSettings(){
	project.settings = _.assign(settings, settingsJSON.settings);
};

function setSettings() {

	// clear local storage
	console.log(JSON.stringify(project.settings.storage));
	if (project.settings.storage == "clear") {
		//localStorage.removeItem(settings.filename);
		localStorage.clear();
		console.log("settings: local storage cleared");
		debug.log("settings: local storage cleared");
	}

/* MOVED TO project.js
	localStorage.setItem("currentProject", settings.projectname);
*/

	// load theme
	if (project.settings.theme) {
		var themeUrl = 'css/themes/'+project.settings.theme+'.min.css';
		console.log("project.settings.theme $rofl: "+themeUrl);
		$.rofl(themeUrl);
	}

	// set device detection
	if ( typeof project.settings.device != 'undefined' || project.settings.device != "auto") {
		device.device = project.settings.device;
		console.log("device from project.settings.device: "+project.settings.device);
		console.log("fire settings loadDeviceCss");
		loadDeviceCss();
	}

	// set debug state:
	if (project.settings.debug == "on") {
		debug = new debug();
		debug.on();	
	} else {
		debug = new debug();
		debug.off();
	}

	// set preloader:
	if (project.settings.preloader == true) {
		preloader = new preloader();
		preloader.ready();
	}	

	// set data source, if not touchvote.json
	debug.log("project.settings.source: " + project.settings.source);
	if (project.settings.source) {
		if (project.settings.source == project.settings.path) {
			debug.log("fired touchvoteJSON.load: " + project.settings.path);
			touchvoteJSON.load(project.settings.path);
		} else {
			debug.log("fired loadSlide: " + project.settings.source);
			//project.loadSlide(settings.source);
		}
	}

	// set orientation
	setPortOrient(project.settings.orientation);

	// applyDomSettings();
}

function parseSettings() {
	debug.log("parseSettings fired | touchvote.js:167");
	if (touchvoteJSON.settings.storage) {
		project.settings.storage = touchvoteJSON.settings.storage;
		if (project.settings.storage == "clear") {
			localStorage.clear();
			debug.log("parseSettings: local storage cleared");
			console.log("parseSettings: local storage cleared");
		}
		saveProject;
	};
	if (touchvoteJSON.settings.rebuild) {
		rebuild = touchvoteJSON.settings.rebuild;
	};
	if ( typeof touchvoteJSON.settings.orientation == 'boolean') {
		settings.orientation = touchvoteJSON.settings.orientation;
		setPortOrient(settings.orientation);
	};
	if (touchvoteJSON.settings.nextbutton) {
		nextButtonSetting = touchvoteJSON.settings.nextbutton;
		nextButton.init();
	};
	if (touchvoteJSON.settings.theme) {
		theme = touchvoteJSON.settings.theme;
	};
	if (touchvoteJSON.settings.filename) {
		settings.filename = touchvoteJSON.settings.filename;
		settingsToLocalStorage();
	};
	if (touchvoteJSON.settings.topnavbar) {
		console.log("settings.topnavbar " + touchvoteJSON.settings.topnavbar);
		settings.topnavbar = touchvoteJSON.settings.topnavbar;
		setTopNavbar(settings.topnavbar);
	};
	if (touchvoteJSON.settings.bottomnavbar) {
		console.log("settings.bottomnavbar " + touchvoteJSON.settings.bottomnavbar);
		settings.bottomnavbar = touchvoteJSON.settings.bottomnavbar;
		setBottomNavbar(settings.bottomnavbar);
	};
};

function setTopNavbar(i) {
	// 0 = ausgeblendet
	// 1 = ohne menu
	// 2 = mit menu

	console.log("setTopNavbar: " + i);

	if (i == 0) {
		$('body').removeClass('navbar-top-correction');
		$('.navbar-fixed-top').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pager').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pagination').removeClass('active').addClass('inactive');
		$('#nextwrapper').removeClass('inactive').addClass('active');
	} else if (i == 1) {
		$('body').addClass('navbar-top-correction');
		$('.navbar-fixed-top').removeClass('inactive').addClass('active');
		$('.navbar-fixed-top .navbar-collapse').removeClass('active').addClass('inactive');
		$('.navbar-fixed-top .navbar-toggle').removeClass('active').addClass('inactive');
	} else if (i == 2) {
		$('body').addClass('navbar-top-correction');
		$('.navbar-fixed-top').removeClass('inactive').addClass('active');
		$('.navbar-fixed-top .navbar-collapse').removeClass('inactive').addClass('active');
		$('.navbar-fixed-top .navbar-toggle').removeClass('inactive').addClass('active');
	}
};

function setBottomNavbar(i) {
	// 0 = ausgeblendet
	// 1 = Weiter-Button
	// 2 = Pager
	// 3 = Pagination

	console.log("setBottomNavbar: " + i);

	if (i == 0) {
		$('body').removeClass('navbar-bottom-correction');
		$('.navbar-fixed-bottom').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pager').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pagination').removeClass('active').addClass('inactive');
		$('#nextwrapper').removeClass('inactive').addClass('active');
	} else if (i == 1) {
		$('body').removeClass('navbar-bottom-correction');
		$('.navbar-fixed-bottom').removeClass('inactive').addClass('active navbartrans');
		$('.navbar-fixed-bottom .pager').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pagination').removeClass('active').addClass('inactive');
		$('#nextwrapper').removeClass('inactive').addClass('active');
	} else if (i == 2) {
		$('body').addClass('navbar-bottom-correction');
		$('.navbar-fixed-bottom').removeClass('inactive navbartrans').addClass('active');
		$('.navbar-fixed-bottom .pager').removeClass('inactive').addClass('active');
		$('.navbar-fixed-bottom .pagination').removeClass('active').addClass('inactive');
		$('#nextwrapper').removeClass('active').addClass('inactive');
	} else if (i == 3) {
		$('body').addClass('navbar-bottom-correction');
		$('.navbar-fixed-bottom').removeClass('inactive navbartrans').addClass('active');
		$('.navbar-fixed-bottom .pager').removeClass('active').addClass('inactive');
		$('.navbar-fixed-bottom .pagination').removeClass('inactive').addClass('active');
		$('#nextwrapper').removeClass('active').addClass('inactive');
	}
};


function getZipname() {
	path = window.location.pathname.split('/');
	zname = path[path.length - 2];
	project.settings.zipname = zname;
	project.settings.filename.push(zname);
	localStorage.setItem("currentZip", zname);
};

function applyDomSettings(){
	// set top navbar
	setTopNavbar(project.settings.topnavbar);

	// set bottom navbar
	setBottomNavbar(project.settings.bottomnavbar);	
};


function getSlides() {
	console.log("loadSlides fired");
	console.log(project.settings.filename);
	if (localStorage.getItem(project.settings.filename)) {// check for local storage
		console.log("loadSlides: local found");
		project.loadSlide();
		jsonlocal = localStorage.getItem(project.settings.filename);
		slidesJSON = JSON.parse(jsonlocal);
		console.log(slidesJSON);
		parseSlides();
		return false;
	} else if (touchvoteJSON.slides){
		console.log("loadSlides: touchvoteJSON.slides found");
		//slidesJSON = touchvoteJSON.slides;
		addSlides(touchvoteJSON.slides);
		return false;
	} else {
		console.log("loadSlides: WARNING - no slides found!");
		return false;
	}
};

function parseSlides() {
	
	var ids = [];
	
	debug.log("parseSlides fired");
	
	if(!slidesJSON){
		console.log("no slides found");
		return false;
	}
	
	nfcJSON = {};

	$.each(slidesJSON, function(key, val) {
		
		ids.push(key);
    	
    	if (!resultObject.result[key]) {
			resultObject.result[key] = {"id": parseInt(key) ,"pa": [] , "st": 0, "et": 0};
		}
		
		// rebuild the nfcJSON
		var nfc = val.nfc;
		var nfcl = val.nfcl;
		nfcJSON[nfc] = '{\"commando\":{\"goto\":\"'+key+'\"}}';
    	
        var jtype = val.type;
        
        debug.log("parseSlides found key: "+key);
		debug.log("parseSlides found type: "+jtype);
		
        switch ( jtype ) {
	        case "slider1":
	            createSlider1(key);
	            break;
	        case "einsausx":
	            createEinsAusX(key);
	            break;
	        case "einsausdrei":
	            createEinsAusDrei(key);
	            break;
	        case "einsausvier":
	            createEinsAusVier(key);
	            break;
	        case "einsausfunf":
	            createEinsAusFunf(key);
	            break;
	        case "einsaussechs":
	            createEinsAusSechs(key);
	            break;
	        case "einsaussieben":
	            createEinsAusSieben(key);
	            break;
	        case "einsausacht":
	            createEinsAusAcht(key);
	            break;
	        case "xausx":
	            createXausX(key);
	            break;
	        case "starrating":
	            createStarRating(key);
	            break;
	        case "blankslide":
	            createBlankSlide(key);
	            break;
	        case "janein":
	            createJaNein(key);
	            break;
	        case "inputurl":
	            createInputUrl(key);
	            break;
	        case "sortierliste":
	            createSortierListe(key);
	            break;
	        case "inputword":
	            createInputWord(key);
	            break;
	        case "picture":
	            createPicture(key);
	            break;
	        case "wtd-picture":
	            createWtdPicture(key);
	            break;
	        case "wtdpicture":
	            createWtdPicture(key);
	            break;
	        case "htmlcontent":
	            createHtmlContent(key);
	            break;
	        case "smilieslider":
	            createSmilieSlider(key);
	            break;
	        case "freetext":
	            createFreeText(key);
	            break;
	        case "textlabelslider":
	            createTextLabelSlider(key);
	            break;
	        case "textlabelslidervertical":
	            createTextLabelSliderVertical(key);
	            break;
	        case "multiratingdrei":
	            createMultiRatingDrei(key);
	            break;
	        case "textvalueslider":
	            createTextValueSlider(key);
	            break;
	        case "textcontent":
	            createTextContent(key);
	            break;
	        case "videostream":
	            createVideoStream(key);
	            break;
	        case "sonntagsfrage":
	            createSonntagsfrage(key);
	            break;
	        case "inputnumber":
	            createInputNumber(key);
	            break;
	        case "wtdjanein":
	            createwtdJaNein(key);
	            break;
	        case "videoplayer":
	            createVideoPlayer(key);
	            break;
	        case "slidefunction":
	            createSlideFunction(key);
	            break;
			case "htmlframe":
	            createHtmlFrame(key);
	            break;
			case "ajaxframe":
	            createAjaxFrame(key);
	            break;
			case "windowlink":
	            createWindowLink(key);
	            break;
			case "likebutton":
	            createLikeButton(key);
	            break;
			case "nativeinputtext":
	            createNativeInputText(key);
	            break;
	        case "whatresponse":
	        	console.log("whatresponse found in slides.json");
	        	break;
	        default:
	            debug.log("Ups!");
	        }
    });

    localStorage.removeItem(localStorage.getItem("currentSlides")+"_result");
    timestamp = $.now();
    tvSetData();
    /*
    aQ = 0; // to enable setActive again
	startslide = parseInt(ids[0]);
	*/
	console.log("startslide: "+startslide);
	debug.log("Startslide: "+startslide);
	// changed and moved to touchvote.js
    //setActive(startslide);
};

function getPrototype(jid) {
	var jst = slidesJSON[jid].type;
	debug.log("getPrototype: id: " + jid + " jst: " + jst);
	if ($("#" + jid).length) {// check if div exists
		$("#" + jid).html("");
		$("#" + jid).html($('#prototypes .' + jst).html());
	} else {
		$('#prototypes .' + jst).attr('id', jid);
		$('#prototypes .' + jst).clone().appendTo('#content');
	}
};
function touchvoteJSON_old(URL, JSOND, JSC) {
    this.json;
    this.jsond = JSOND;
    this.jsonlocal;
    this.jsonstring;
    this.parsedjson;
    this.url = URL;
    this.commando;
	this.chat;
    this.settings;
    this.slides;
	this.agenda;

    this.load = load;
    function load(URL) {
        var scriptUrl;
        if (URL == "local") {
            scriptUrl = "touchvote.json";
        } else {
            scriptUrl = URL;
        }
        var head = document.getElementsByTagName("head")[0];
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
        script.onload = function () {
			//
        };
        script.onerror = function (e) {
            //console.log("failed: " + JSON.stringify(e));
        };
        head.appendChild(script);
    };

    this.callback = callback;
    function callback(JSC) {
        debug.log("callback fired");
        if (localStorage.getItem(settings.filename)) { // check for local storage 
            debug.log("callback: yep, local found");
            jsonlocal = localStorage.getItem(settings.filename);
            touchvoteJSON.parse(JSON.stringify(jsonlocal));
        } else {
            debug.log("callback: no local found");
            touchvoteJSON.parse(JSON.stringify(JSC));
        }
    };

    this.parse = parse;
    function parse(JSOND) {
        debug.log("touchvoteJSON.parse fired");
        
        this.jsond = JSOND;

        if (typeof this.jsond == 'string' || this.jsond instanceof String) { // check if string
			debug.log("JSON still a string");
            this.jsond = $.parseJSON(this.jsond);
        }

        touchvoteJSON.json = this.jsond;
        touchvoteJSON.init();
    }

    this.rebuildJson = rebuildJson;
    function rebuildJson() {
        debug.log("rebuildJson fired");
        touchvoteJSON.init();
    };

    this.init = init;
    function init() {
        debug.log("touchvoteJSON.init fired");
        if (touchvoteJSON.json.commando) {
            commandoJSON = touchvoteJSON.json.commando; 
            runCommando( commandoJSON );
        }
        if (touchvoteJSON.json.chat) {
            touchvoteJSON.chat = touchvoteJSON.json.chat; 
            runChat();
        }
        if (touchvoteJSON.json.agenda) {
            touchvoteJSON.agenda = touchvoteJSON.json.agenda; 
            runAgenda();
        }
        if (touchvoteJSON.json.settings) {
            touchvoteJSON.settings = touchvoteJSON.json.settings; 
            parseSettings();
        }
        if (touchvoteJSON.json.slides) {
        	debug.log("touchvoteJSON.json.slides found");
        	
            slidesJSON = touchvoteJSON.json.slides;
            
            if ( loadSlideStorage == 0 ) {
	            ssli = (settings.slides.length + 1);
	            //slidesID = localStorage.getItem("currentZip")+'_slides'+ssli;
	            slidesID = localStorage.getItem("currentProject")+'_slides'+ssli;
	            settings.slides.push( slidesID );
	            settings.source = slidesID;
	            localStorage.setItem( settings.projectname+'_settings', JSON.stringify(settings) );
	            localStorage.setItem( settings.projectname+'_slides', JSON.stringify(settings.slides) );
	            localStorage.setItem( slidesID, '{"slides":' + JSON.stringify(slidesJSON) + '}');
	            localStorage.setItem( 'currentSlides', slidesID);
	        } else {
	        	settings.source = loadSlideStorage;
	        	localStorage.setItem( 'currentSlides', loadSlideStorage);
	        }
            debug.log("storage set");
            //console.log(slidesJSON);
            debug.log("touchvoteJSON parsing slides");
            parseSlides();
            settingsToLocalStorage();
            loadSlideStorage = 0;
        }
    };
};


/////////////////////////////////////////////

///////////////////////////////////////////////
var nextTimer;
function nextButton() {
    $("#nextButton").click(function () {
        nextButton.hide();
        gotoSlide.next();
        $(this).removeClass('active');
    });

    this.init = init;
    function init(nbst) {
		debug.log("nextButton.init fired: "+nbst);
		debug.log("nextButton.init zeigen: "+zeigen);
        switch (zeigen) {
        case 0:
            nextButton.hide();
            zeigen = 0;
            break;
        case 1:
			debug.log("nextButton.init zeit: "+slidesJSON[aQ].n[1]);
			nextButton.show(slidesJSON[aQ].n[1]);
            zeigen = 1;
            break;
        case 2:
            zeigen = 2;
            break;
        case 3:
			nextButton.hide();
			timev = slidesJSON[aQ].n[1] * 1000;
			nextTimer = setTimeout(function () {
				gotoSlide.nr(nQ);
			}, timev);
            zeigen = 3;
            break;
        case 4:
        	nextButton.hide();
        	// interim für RTL:
        	//nextButton.hide()
        	//nextButton.show(slidesJSON[aQ].n[1]);
			// ende
            zeigen = 4;
            break;
        };
    }
	
    this.show = show;
    function show(time) {
        var timev = 0;
        if (time) {
            timev = time * 1000;
        }

        nextTimer = setTimeout(function () {
            $("#nextWrapper").removeClass("bhide");
            $("#nextWrapper").addClass("bshow");
        }, timev);
    }

    this.hide = hide;
    function hide() {
        $("#nextWrapper").addClass("bhide");
        $("#nextWrapper").removeClass("bshow");
    }
};

////////////////////////////////////////////////////////////////////////////////

function hashJumper(e) {
    $(window).on('hashchange', function () {
        var urlcmd = window.location.hash.split('#');
        if (urlcmd[1]) {
            urlcmd = window.location.hash.split('#');
            var cmd = urlcmd[1];
            if (urlcmd[2]) {
                var urlcmd2 = "#" + urlcmd[2];
                cmd = urlcmd[1] + urlcmd2;
            }
            //				debug.log( cmd );
            var gtD = cmd.split("#");
            switch (gtD[0]) {
            case "gotoQ":
                gotoSlide.nr(gtD[1]);
                break;
            default:
                switchCommand(gtD[0]);
            }
        }
    });
};

////////////////////////////////////////////////

function localData(J,R) {
	this.j = J;
	this.r = R;
	
	this.get = get;
	function get() {
		localStorage.getItem(settings.filename);
		}
};

/////////////////////////////////////////////



///////////// Agenda Start //////////////
tvAgenda;
function runAgenda() {
	if( typeof tvAgenda.agenda == undefined ) {
		tvAgenda = new tvAgenda();
	} 

	if ( touchvoteJSON.agenda ) {
		tvAgenda.build( touchvoteJSON.agenda );
	}
};

function tvAgenda() {
	this.agenda = {};
	
	this.show = show;
	function show() {
		$("#agendadiv").show();
		}
		
	this.hide = hide;
	function hide() {
		$("#agendadivdiv").hide();
		}
		
	this.clear = clear;
	function clear() {
		$("#agendadiv").html('');
		}
	
	this.popup = popup;
	function popup() {
		}
	
	this.build = build;
	function build( agendaJSON ) {
		//$.each( agendaJSON, function( key, value ) {
		$( agendaJSON ).each( function ( index ) {
			
			tvAgenda.agenda.i = index;
			tvAgenda.agenda.ts = $.now();
			debug.log("tvAgenda.agenda: "+tvAgenda.agenda);
			agendaentry = ''
				+ '<div class="agendarow" id="' + this.p + '">'
				+ '<div class="agendanumber">' + this.p + '</div>'
				+ '<div class="agendacontent">' + this.d + '</div>'
				+ '</div>';
			$("#agendadiv").append( agendaentry );			
		});
	}
};
tvAgenda = new tvAgenda();

///////////// Agenda end //////////////


var device = {};

window.checkDevice = function() {

	device = {};

	if (localStorage.getItem("device")) {
		device.device = localStorage.getItem("device");
		console.log("device from ls: " + device.device);
		return false;
	}

	// check if mobile:
	var mobile = false;
	(function(a) {
		if (/(android|bb\d+|meego).+mobile|android|ipad|playbook|silk|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
			mobile = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	device.mobile = mobile;

	//return mobile;

	// check width & height & orientation
	device.bodyWidth = $('body').width();
	device.bodyHeight = $('body').height();
	device.orientation = "portrait";
	if (device.bodyWidth > device.bodyHeight) {
		device.orientation = "landscape";
	};

	// check if touchvote device...
	device.touchvote = false;
	device.device = "mobile";
	if (!device.mobile) {
		device.device = "desktop";
	}

	if ( typeof TouchVote !== 'undefined') {
		device.touchvote = true;

		// ...and set vendor
		if (device.bodyWidth < 481 || device.bodyHeight < 481) {
			device.device = "odys7";
		} else {
			device.device = "nexus7";
		}
	}
};

function loadDeviceCss() {
	if ( typeof settings.device !== 'undefined' && settings.device != "auto") {
		device.device = settings.device;
	} else {
		checkDevice();
	}
	
	$('body').addClass(device.device);
	localStorage.setItem("device", device.device);
	$.rofl('css/devices/' + device.device + '.css');
};

