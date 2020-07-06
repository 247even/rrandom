function resetVars() {
	startslide = 0;
	ids = [];
	historyIDs = [];
	historyPos = 0;
	aQ = 1;
	nQ = 1;
	DC = 0;
	next = 1;
	prev = 0;
	prevID = 0;
	nextID = 0;
	theme = 0;
	// tba
	//var tvtrans = "imageblend";
	//tvtrans = "slideVertical";
	tvtrans = "xfade";
	bigtext = false;
	// deactivated!
	fitText = false;
	// deactivated!
	rebuild = 0;
	// 0 = alles neu, 1 = vergleichen + anfügen, 2 = vergleichen + löschen
	resArr = [];
	countedQs = 0;
	timestamp = $.now();
	starttime = $.now();
	zeigen = 0;
	// 0 = immer aus; 1 = default; 2 = force vote
	nextButtonSetting = 0;
	voteDone = [];
};

function initTouchVote() {
	/* Done via settings.js
	debug = new debug();
	debug.off();
	*/
	//debug.log("initTouchVote fired");
	resetVars();
	
	resultObject = new resultObject();
	gotoSlide = new gotoSlide();
	nextButton = new nextButton();
	//voteObject = new voteObject();
	tvChat = new tvChat();
	prototypesJSON = new prototypesJSON();
	tvTransitions = new tvTransitions();

	// clear setdata:
	clearSetData();
	
	// now that DOM is loaded, apply dom related settings
	applyDomSettings();
	
	// splitted up to load project before DOM
	// initProject();
	// project should be initialized before proceeding with:
	loadSlides();

	console.log("device: " + JSON.stringify(device.device));
	debug.log("device: " + JSON.stringify(device.device));
	debug.log("width: " + JSON.stringify(device.bodyWidth));
	debug.log("height: " + JSON.stringify(device.bodyHeight));

	debug.log("Init fired");

	jQuery("time.timeago").timeago();
	// jQ zeit helfer plugin

	/*
	 $(".frage").fitText(1.2, {
	 minFontSize: '18px',
	 maxFontSize: '48px'
	 });
	 */

	nextButton.init();
	hashJumper();
	
//	setCurrent();
	//localStorage.setItem(settings.projectname + '_slides', JSON.stringify(settings.slides));

	if (project.settings.wsc) {
		wscInit();
	};
	//createSlideshow();
	
	// jump to first slide:
	setActive(parseInt(ids[0]));
	//setHistory(parseInt(ids[0]));

	// NFC Test:
	if ( typeof TouchVote !== 'undefined') {
		console.log("tagscanned fired");
		TouchVote.tagScanned("{\"id\":\"1234567890\",\"data\":\"Hello World\"}");
	}
};

if ( typeof TouchVote != 'undefined') {
	TouchVote.getData = function(data) {
		debug.log("getData:");
		debug.log(JSON.stringify(data));
		resultLog("data received");
		switchCommand(data);
	};
};

$(function(){
	initTouchVote();
});
