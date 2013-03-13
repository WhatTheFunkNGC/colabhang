(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
  }	
    //--------------------Global VARS -------------------------	
		var totalTime;		// glabal var - how long user has been connected
		var speakTime;		// global var - how long user has spoken for total
		var userData;		// global object - hold all local users key data
		var userDataPos;	// golbal var - marks the position that the local users data is stored in "userData"		
		var refreshUserList = 1000; // refresh rate of main display
		var refreshUserListHolder = 1000; // refresh rate of main display Holder
		var speakingFreshold = 8;
		var chatIntervalCounter;
		var chatIntervalTotal;
		var dTimer; // hold the timer object for refreshing the display
		var sTimer; // hold the timer object for refreshing the speaker
		var dataDisplay;	
		var optionsDisplay;
		var currentUserProfileChecker; 	// changes each time a user changes profile. used for re-drawing display
		var shaperMuteOverlay; 			//  Stores muted overlay
		var handUpOverlay;				// Stores hands up overlay
		
		
	//-------------------- Convo Type settings -------------------------
		var currentProfileLoaded;
		var currentUserProfileLoaded;
		var allowButtingIn; // Allow users to speak over eachover
		var muteIfSpeaker; // All users bar speaker muted
		var notifyChatLength; // if enabled the system displays notes to the user baised on the amount they have been speaking
		var muteChatOnTimer; // if enabled, if user chats for too long they will be muted
		var highlightControl; // if enabled, displays the lister highlight buttons to the user
		
		
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");				
			startSystem();	
			document.getElementById("optionDisplayToggle").onclick = this.toggleOptionDisplay.bind(this); // bind data display button
			document.getElementById("dataDisplayToggle").onclick = this.toggleDataDisplay.bind(this); // bind data display button
			document.getElementById("handUpBtn").onclick = this.toggleHandUp.bind(this); // bind data display button
			
		};	
		// initilise global vars 
		totalTime = 1;
		speakTime = 0;
		chatIntervalCounter = 0;
		chatIntervalTotal = 0;
		dataDisplay = false;
		optionsDisplay = false;
		var handUpOverlayImg = gapi.hangout.av.effects.createImageResource("https://raw.github.com/WhatTheFunkNGC/colabhang/master/commStruct/img/handUpOverlayWantsToSpeak.png");
		handUpOverlay = handUpOverlayImg.createOverlay(); // create overlay for user
		
		var shaperMuteOverlayImg = gapi.hangout.av.effects.createImageResource("https://raw.github.com/WhatTheFunkNGC/colabhang/master/commStruct/img/shaperMuteOverlay.png");
		shaperMuteOverlay = handUpOverlayImg.createOverlay(); // create overlay for user

		// setup timers
		//var tTimer = setInterval(function() {userTimer()},1000);			// setup connection timer		
		var uTimer = setInterval(function() {userTimer(); updateTimer();},1000);			// setup update timer	
		var cTimer;		
		var nTimer;		
		setTimeout(function (){ cTimer = setInterval(function() {userChatCounter()},100);},1500);			// setup chat update timer after a 1.5 sec wait
		setTimeout(function (){ nTimer = setInterval(function() {userNotifyer()},10000);},60000);			// setup notification checker

		
  };	
  	
	//-------------------- Setup Functions -------------------------
	
	
	// on new user joining - refresh display
	function startSystem(){
		var jsonLoader, jsonTxt, alreadyExsists;
		console.log("user data initilisation " + (gapi.hangout.getLocalParticipantId()).substring(7,15));	
		//userDataPos = checkDataExsistanceInArray("userData",(gapi.hangout.getLocalParticipantId()).substring(7,15));	// check if user already exsists
		console.log("dat pos got " + userDataPos);	
		
		alreadyExsists = false;
		for (var i = 1; i <= gapi.hangout.data.getValue("userData"); i++){
			var userDataHolder = eval( "(" + gapi.hangout.data.getValue("userData" + i) + ")");				
			if(gapi.hangout.getLocalParticipantId() == userDataHolder.id){ 
				userDataPos = i;
				alreadyExsists = true;
				};
			};
		
		//console.log("dat pos got " + userDataPos + " so " + alreadyExsists);	
		if (alreadyExsists == false){															// if false create new user data	
			console.log("make new user profile info"); 		
			var userData = { };															// create new user data object
			userData.id = gapi.hangout.getLocalParticipantId();							// fill with data
			userData.name = gapi.hangout.getLocalParticipant().person.displayName;
			userData.hasMic = gapi.hangout.getLocalParticipant().person.hasMicrophone;
			userData.connectionLength = "1";
			userData.commLength = "0";
			//userDataPos = findAndAddNewItemToSharedList("userData",JSON.stringify(userData));
			userDataPos = addNewItemToSharedList ("userData",-1,JSON.stringify(userData))
		}
		//console.log("dat pos got " + userDataPos);
		if (!currentUserProfileLoaded) { currentUserProfileLoaded = "0";};
		
		if (!gapi.hangout.data.getValue("timerHasControl")){						// checks control params are loaded
			gapi.hangout.data.setValue("timerHasControl", "false");
			gapi.hangout.data.setValue("timerHasControlMute", "false");
			gapi.hangout.data.setValue("timerHasControlMuteReturn", "false");
		};
		
		currentUserProfileChecker = (gapi.hangout.data.getValue("currentUserProfileChecker") || "0");			// setup profile display checker
		if (currentUserProfileChecker == "0" ){gapi.hangout.data.setValue("currentUserProfileChecker","0");};
		if (!gapi.hangout.data.getValue("currentConvoMode")){
			console.log("no current convo mode ");
			currentProfileLoaded = "0";
			gapi.hangout.data.setValue("currentConvoMode","0");
			currentUserProfileLoaded = "0";
			resetUserProfileTypeLimits();	
			loadOptions(true);
			loadControlBtns();
			console.log("convo mode set");
		};
		console.log("user data complete");
	};	
	
	//-------------------- Display Functions -------------------------
	
	
	// toggles the options display
	commStruct.prototype.toggleOptionDisplay = function () {
		var div;
		if (!optionsDisplay){ 
			displayOptions();
		optionsDisplay = true;
		} else { 
		div = document.getElementById("optionsList");
		div.innerHTML = "";	
		optionsDisplay = false;
		};
	
	};
	
	// a button fuction that enables and disables the data display
	commStruct.prototype.toggleDataDisplay = function () {
		var div;
		if (!dataDisplay){ 
		console.log("clicked when false");
		dTimer = setInterval(function() {listUsers()},refreshUserList);		// setup refresh rate of user display
		sTimer = setInterval(function() {displaySpeakerInfo()},1000);
		
		dataDisplay = true;
		} else { 
		console.log("clicked when true");
		clearInterval(dTimer);
		clearInterval(sTimer);
		div = document.getElementById("userDetailsList");
		div.innerHTML = "";	
		div = document.getElementById("speakerlist");
		div.innerHTML = "";	
		dataDisplay = false;
		};
	};
	
	// a button fuction that toggles if the user is waiting to speak or not
	commStruct.prototype.toggleHandUp = function () {
		if (!checkDataExsistanceInArray("speakQueue",userData.id)){ // if user not inchat queue
			findAndAddNewItemToSharedList("speakQueue",userData.id);	// add them
			handUpOverlay.setVisible(true);
		} else { 
			findAndRemoveItemFromSharedList("speakQueue",userData.id);		// if not remove them
			handUpOverlay.setVisible(false);
		};
	};
	
	// sets up the button display for the possible convo profiles
	function displayOptions() {
		//console.log("log");	
		var div, ul, tr,c1,c2, e, i,profName,numIn, limit,thresholdEdit;	
		div = document.getElementById("optionsList");
		div.innerHTML = "";	
		ul = document.createElement("table");				// create table for users waiting to chat
		ul.appendChild(makeSettingsLayout("Convo Mode :",addDDBconvoProfile()));
		ul.appendChild(makeSettingsLayout("User Mode :",addDDBUserProfile()));
		tr = document.createElement("tr");
		c1 = tr.insertCell(-1);
		c1.innerHTML = "Mode Details :";
		c1.style.align ="left"
		c2 = tr.insertCell(-1);
		c2.innerHTML = convoProfiles[gapi.hangout.data.getValue("currentConvoMode")].discription;
		c2.style.fontSize = "x-small";
		c2.style.align ="left"
		ul.appendChild(tr);
		thresholdEdit = document.createElement("input"); 					
		thresholdEdit.type = "number";											
		thresholdEdit.size = "2";
		thresholdEdit.value = speakingFreshold; 	
		thresholdEdit.onchange = function() { 									
			speakingFreshold = thresholdEdit.value; 
		}; 
		ul.appendChild(makeSettingsLayout("Active Speaker threshold :",thresholdEdit));
		div.appendChild(ul);	
	};
	
	function makeSettingsLayout(txt,btn){
		var tr, c1, c2;
		tr = document.createElement("tr");
		c1 = tr.insertCell(-1);
		c1.innerHTML = txt;
		c1.style.align ="left"
		c2 = tr.insertCell(-1);
		c2.appendChild(btn);
		c2.style.align ="left"
		//c2.style.width = "100%";
		return tr;
	};
	
	
	function addDDBconvoProfile(){
		var dDBconvoProfile = document.createElement("select");
		for (var i = 0; i < convoProfiles.length; i++) {						// loop through all users in data array and display in table format					
			dDBconvoProfile.add(createProfileButton(i));
		};
		dDBconvoProfile.onchange = function() {
			//console.log("set to = " + dDBconvoProfile.selectedIndex + " so " + convoProfiles[dDBconvoProfile.selectedIndex].userTypes[currentUserProfileLoaded].name);
			if (!document.getElementById("userNotification")){
				div = document.getElementById("userNotification");
				div.innerHTML = "";	
			};
			if(currentUserProfileLoaded == "pie"){
				var oldTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals" + currentUserProfileLoaded)) - 1).toString();
				var newTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals0")) + 1).toString();
				var oldTotalNum = "userProfileTotals" + currentUserProfileLoaded;
				var newTotalNum = "userProfileTotals0";			
				gapi.hangout.data.setValue(oldTotalNum,oldTotal);
				gapi.hangout.data.setValue(newTotalNum,newTotal);
				currentUserProfileLoaded = "0";			
			};
			gapi.hangout.data.setValue("currentConvoMode", (dDBconvoProfile.selectedIndex).toString());
		};
		//dDBconvoProfile.style.width = "100%";
		dDBconvoProfile.selectedIndex = currentProfileLoaded;
		return dDBconvoProfile;
	};
	
	function addDDBUserProfile(){
		var dDBUserProfile = document.createElement("select");
		for (var i = 0; i < convoProfiles[currentProfileLoaded].userTypes.length; i++) {				// loop through all users in data array and display in table format					
			dDBUserProfile.add(createUserProfileButton(currentProfileLoaded,i));
		};
		dDBUserProfile.onchange = function() {
			//console.log("USER PROFILE BUT PRESS " + dDBUserProfile.selectedIndex);	
			var oldTotal, oldTotalNum ,newTotalNum, newTotal;
			var limit = convoProfiles[currentProfileLoaded].userTypes[dDBUserProfile.selectedIndex].limit;
			//console.log("limit = " + limit + " and current numbers = " + gapi.hangout.data.getValue("userProfileTotals" + btn.id.substring(20)));	
			if(limit > gapi.hangout.data.getValue("userProfileTotals" + dDBUserProfile.selectedIndex) || limit == "-1"){
			//console.log("doing if limit not reached " + currentUserProfileLoaded);	
			
			oldTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals" + currentUserProfileLoaded)) - 1).toString();
			newTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals" + dDBUserProfile.selectedIndex)) + 1).toString();
			oldTotalNum = "userProfileTotals" + currentUserProfileLoaded;
			newTotalNum = "userProfileTotals" + dDBUserProfile.selectedIndex;			
			gapi.hangout.data.setValue(oldTotalNum,oldTotal);
			gapi.hangout.data.setValue(newTotalNum,newTotal);
			
			currentUserProfileLoaded = dDBUserProfile.selectedIndex;
			loadOptions();
			gapi.hangout.data.setValue("currentUserProfileChecker",(parseInt(gapi.hangout.data.getValue("currentUserProfileChecker")) + 1).toString());
			//console.log("currne loaded = " + currentUserProfileLoaded);
			};
		
		};
		//dDBUserProfile.style.width = "100%";
		dDBUserProfile.selectedIndex = currentUserProfileLoaded;
		return dDBUserProfile;
	};
		
		
	// creates a button for a profile type
	function createProfileButton(num) {
		var btn = document.createElement("option");
		btn.text = convoProfiles[num].profileName;
		return btn;			
	};
	
	// creates a button for a user profile type
	function createUserProfileButton(profile,userProfile) {
		var btn, profName, numIn, limit;
		btn = document.createElement("option");
		profName = convoProfiles[currentProfileLoaded].userTypes[userProfile].name; 						// get main bits of statistical data to display
		numIn = (gapi.hangout.data.getValue("userProfileTotals" + userProfile) || "0");
		limit  = convoProfiles[currentProfileLoaded].userTypes[userProfile].limit;
		if ( limit == "-1"){limit = "X"};
		btn.text = convoProfiles[profile].userTypes[userProfile].name + " (" + numIn + " / " + limit+ ")";
	return btn;			
	};
	
	function loadControlBtns(){
		var div, htmlString;	
		div = document.getElementById("controls");
		htmlString = "";
		if (highlightControl){
			htmlString = "List Highlight : ";			
		};
		div.innerHTML = htmlString;
		if (highlightControl){
			div.appendChild(createListNavBtnUp());
			div.appendChild(createListNavBtnDown());
			div.appendChild(createListNavBtnRemove());
		};
	};
	
		
	// display list of partisipants with relivant time stats
	function displaySpeakerInfo() {	
		var div, ul, tr, i, e, userD, userDString;	
		div = document.getElementById("speakerlist");
		div.innerHTML = (gapi.hangout.data.getValue("currentSpeaker") || "no one" ) + " is Current Speaker";		
		ul = document.createElement("table");				// create table for users waiting to chat
		for (i = 1; i <= gapi.hangout.data.getValue("speakQueue"); i++) {						// loop through all users in data array and display in table format
			tr = document.createElement("tr");
			e = document.createElement("td");	
			e.innerHTML = gapi.hangout.data.getValue("speakQueue"+ i);
			tr.appendChild(e);
			ul.appendChild(tr);	
		};
		div.appendChild(ul);
	};
	
	// display list of partisipants with relivant time stats
	function listUsers() {	
		var div, ul, tr, i, e1, e2, e3, userD, userDString;	
		ul = document.createElement("table");
		for (i = 1; i <= gapi.hangout.data.getValue("userData"); i++) {						// loop through all users in data array and display in table format
			userDString = gapi.hangout.data.getValue("userData" + i);
			userD = eval( "(" + userDString + ")");
			tr = document.createElement("tr");
			e1 = document.createElement("td");	
			e1.innerHTML = userD.name;
			tr.appendChild(e1);
			e2 = document.createElement("td");	
			e2.innerHTML = displayTimerString(userD.connectionLength);
			tr.appendChild(e2);
			e3 = document.createElement("td");	
			e3.innerHTML = displayTimerString(userD.commLength);
			tr.appendChild(e3);
			ul.appendChild(tr);	
		}	
		div = document.getElementById("userDetailsList");
		div.innerHTML = "";	
		div.innerHTML = "<u>Name : connection time : chat Time</u>";			
		div.appendChild(ul);	
		//console.log("Displayed"); 
	};
  
	// a button for navigating which list item is highlighted
	function createListNavBtnDown() {
		var btn = document.createElement("button");
		btn.innerHTML = "&#9660";
		btn.id = "listHighlightDownBtn";
		btn.onclick = function() {
			if(gapi.hangout.data.getValue("currentHighlightedItem") != gapi.hangout.data.getValue("listTxt")){
			var newVal = (parseInt(gapi.hangout.data.getValue("currentHighlightedItem")) + 1).toString();
			gapi.hangout.data.setValue("currentHighlightedItem",newVal);	
			};
		};
	return btn;			
	};
	// a button for navigating which list item is highlighted
	function createListNavBtnUp() {
		var btn = document.createElement("button");
		btn.innerHTML = "&#9650";
		btn.id = "listHighlightUpBtn";
		btn.onclick = function() {
			if(gapi.hangout.data.getValue("currentHighlightedItem") != "0"){
				var newVal = (parseInt(gapi.hangout.data.getValue("currentHighlightedItem")) - 1).toString();
				gapi.hangout.data.setValue("currentHighlightedItem",newVal);	
			}else {gapi.hangout.data.setValue("currentHighlightedItem","1"); };
		};
	return btn;			
	};
	// a button for navigating which list item is highlighted
	function createListNavBtnRemove() {
		var btn = document.createElement("button");
		btn.innerHTML = "&nbsp X &nbsp";
		btn.id = "listHighlightremoveBtn";
		btn.onclick = function() {
			gapi.hangout.data.setValue("currentHighlightedItem","0");	
		};
	return btn;			
	};
  
  
  //-------------------- Functions -------------------------
  
  
	// loads profile variables into local user
    function loadOptions(setupNeeded) {
		
		var profileNum = gapi.hangout.data.getValue("currentConvoMode");
		if (setupNeeded) { profileNum = "0";};
		console.log("load options " + profileNum + "  and " + currentUserProfileLoaded);
		allowButtingIn = convoProfiles[profileNum].userTypes[currentUserProfileLoaded].allowButtingIn;
		if(allowButtingIn == "false"){allowButtingIn = false };
		muteIfSpeaker = convoProfiles[profileNum].userTypes[currentUserProfileLoaded].muteIfSpeaker;
		if(muteIfSpeaker == "false"){muteIfSpeaker = false };
		notifyChatLength = convoProfiles[profileNum].userTypes[currentUserProfileLoaded].notifyChatLength;
		if(notifyChatLength == "false"){notifyChatLength = false };
		muteChatOnTimer = convoProfiles[profileNum].userTypes[currentUserProfileLoaded].muteChatOnTimer;
		if(muteChatOnTimer == "false"){muteChatOnTimer = false };
		highlightControl = convoProfiles[profileNum].userTypes[currentUserProfileLoaded].highlightControl;
		if(highlightControl == "false"){highlightControl = false };
		
		
	};
  
  
	/* Displays an enterd second count in time format
	- rawTime : number of seconds
	- return : string "00:00:00" format */
	function displayTimerString(rawTime){
		var hours, minutes, seconds;
		hours = parseInt(rawTime / 3600);				// Mod to get hours
		rawTime %= 3600;								// get remaineder
		minutes = parseInt(rawTime / 60);				// Mod to get mins
		rawTime %= 60;									// get remainder
		seconds = rawTime;								// remainder = secs
		if (seconds < 10) { seconds = "0" + seconds;};	// add leading 0s
		if (minutes < 10) { minutes = "0" + minutes;};
		if (hours < 10) { hours = "0" + hours;};
		
		
		return hours + ":" + minutes + ":" + seconds;	// return in time format string
	}
  
	// timer function called on interval incrimenting counter each time
	function userTimer() {
		totalTime = totalTime + 1 ;
	}
	
	function userChatCounter() {
		if (!gapi.hangout.av.getMicrophoneMute()){ // only do counting if user isnt muted.
			if (chatIntervalCounter == 10){	
				if (chatIntervalTotal >= speakingFreshold){
					speakTime = speakTime + 1;				
					leadSpeaker();			
				} else if ( gapi.hangout.data.getValue("currentSpeaker") == userData.id) {gapi.hangout.data.setValue("currentSpeaker","no one");};
				chatIntervalCounter = 0; 
				chatIntervalTotal = 0;
			} else {
				chatIntervalTotal = chatIntervalTotal + gapi.hangout.av.getParticipantVolume(userData.id); // get current user vol
				chatIntervalCounter = chatIntervalCounter + 1;
			};
		};
	};
	
	function resetUserProfileTypeLimits(){
		var i, j, numProfiles;
		var profile = (gapi.hangout.data.getValue("currentConvoMode") || "0");
		for ( i = 0; i < convoProfiles[currentProfileLoaded].userTypes.length; i++){
			gapi.hangout.data.clearValue("userProfileTotals" + i);
		};
		var numUsers = (gapi.hangout.data.getValue("userData") || "1");
		console.log("num of reg users = " + gapi.hangout.data.getValue("userData"));
		gapi.hangout.data.setValue("userProfileTotals0",numUsers);
		for ( j = 1; j < convoProfiles[profile].userTypes.length; j++){
			gapi.hangout.data.setValue("userProfileTotals" + j, "0");
		};
		numProfiles = (convoProfiles[profile].userTypes.length).toString();
		currentUserProfileLoaded = "0";
		gapi.hangout.data.setValue("userProfileTotals",numProfiles);
	};
	
	// sends updates from local user to shared state
	function updateTimer() {	
		// main data update
		var userDataString = gapi.hangout.data.getValue("userData" + userDataPos);
		userData = eval( "(" + userDataString + ")");						// convert to JS object
		userData.connectionLength = totalTime;
		userData.commLength = speakTime;
		gapi.hangout.data.setValue("userData" + userDataPos, JSON.stringify(userData));	// return JSON string of object
		
		// profile update 
		if (currentProfileLoaded != gapi.hangout.data.getValue("currentConvoMode")){
			console.log(" diffrence found " + currentProfileLoaded + " and " + gapi.hangout.data.getValue("currentConvoMode"));
			currentProfileLoaded = gapi.hangout.data.getValue("currentConvoMode");
			resetUserProfileTypeLimits();
			loadOptions();
			loadControlBtns();
			displayOptions();
		};
		// user profile update 
		if (currentUserProfileChecker != gapi.hangout.data.getValue("currentUserProfileChecker")){		// checker detects if a user has chnaged profile 
			loadControlBtns();
			if(optionsDisplay){displayOptions();};														// and re-displays options acordingly			
			currentUserProfileChecker = gapi.hangout.data.getValue("currentUserProfileChecker");
		}
		
		// un mutes all users after timer controler actions
		if ((gapi.hangout.data.getValue("timerHasControlMute") == "false") && (gapi.hangout.data.getValue("timerHasControlMuteReturn") == "true")) {
		gapi.hangout.data.setValue("timerHasControlMuteReturn", "false");
		gapi.hangout.av.setMicrophoneMute(false);
		};

		
		// check if to unmute
		if((gapi.hangout.data.getValue("currentSpeaker") == "no one") && (gapi.hangout.data.getValue("timerHasControlMute") == "false")){
			if (gapi.hangout.av.getMicrophoneMute()){ 
				console.log(" UN MUTING");				
				gapi.hangout.av.setMicrophoneMute(false); 
			};
		};
	};
	
	// A function to sort the current spekaer state
	function leadSpeaker(){
		if ((gapi.hangout.data.getValue("currentSpeaker") != userData.id ) && (gapi.hangout.data.getValue("currentSpeaker") != "no one")){	  // if other user speaking --------------
			if (allowButtingIn){
				gapi.hangout.data.setValue("currentSpeaker",userData.id); 	// if allowed to butt in, local user become active speaker
			} else {
				console.log("MUTING " + allowButtingIn);
				gapi.hangout.av.setMicrophoneMute(true);
			handUpOverlay.setVisible(true);
			findAndAddNewItemToSharedList("speakQueue",userData.id); 	// else set user to be "wants to speak"
			};						
		} else if ( gapi.hangout.data.getValue("currentSpeaker") == userData.id){ 			// if THIS user speaking --------------
			findAndRemoveItemFromSharedList("speakQueue",userData.id);
			handUpOverlay.setVisible(false);
		
		} else { 																			// if no one speaking --------------
			console.log("No current speaker");
			gapi.hangout.data.setValue("currentSpeaker",userData.id);
			if ((muteIfSpeaker == "true") && (gapi.hangout.data.getValue("timerHasControl") == "false")){	// if muteSpeaker setting, mute all users when speaking starts
				console.log("MUTE ALL BAR SPEAKER");
				console.log("num users " + gapi.hangout.data.getValue("userData"));
				for (var i = 1; i <= gapi.hangout.data.getValue("userData"); i++){
					var userDataHolder = eval( "(" + gapi.hangout.data.getValue("userData" + i) + ")");				
					if(userData.id != userDataHolder.id){ 
						console.log("user id " + userDataHolder.id);
						 gapi.hangout.av.muteParticipantMicrophone(userDataHolder.id); 					
					};
				};
			};
		};	
	};
	
	//------------------------------------ NOTIFICATION / time muter FUNCTIONS ---------------------------------------------------------
	
	// a function to orginise user notifications and Mutes baised on amount of time spoken
	 function userNotifyer(){
		var totalTalkTime, userPercent, avgTalkTime, noUsers, div, lowLevelLimit, highLevelLimit, minLevelLimit, maxLevelLimit;
		if((notifyChatLength == "true") && (gapi.hangout.data.getValue("timerHasControl") == "false")){
			totalTalkTime = 0;
			noUsers = gapi.hangout.data.getValue("userData");
			for (var i = 1; i <= noUsers; i++){
				var userDataHolder = eval( "(" + gapi.hangout.data.getValue("userData" + i) + ")");
				totalTalkTime = totalTalkTime + parseInt(userDataHolder.commLength);
			};
			userPercent = userData.commLength / (totalTalkTime / 100);
			//console.log("local user contribruted " + userPercent + "% of the convosation");
			avgTalkTime = totalTalkTime / noUsers;
			//console.log("Average talk time =  " + avgTalkTime);
			
			div = document.getElementById("userNotification");
			div.innerHTML = "";	
			// CRAZY MATHS TIME!!!!!!!!!!!!!!!!!!!!!!!!!
			// the level is the avrage + the percantage limit from that avrage. (e.g. if limit is 10%. and the avrage is 30, then the limit is 33)
			lowLevelLimit = avgTalkTime + ((avgTalkTime/100) * (parseInt(convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].lowMsgLevel)));
			
			highLevelLimit = avgTalkTime + ((avgTalkTime/100) * (parseInt(convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].highMsgLevel)));
			
			//console.log("low lev limit = " + lowLevelLimit + "high limit  = " + highLevelLimit);
			
			if(userData.commLength <= lowLevelLimit) {
				console.log("display message");
				div.style.backgroundColor="#3399FF";
				div.innerHTML = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].lowMsg;	
			} else if (userData.commLength >= highLevelLimit) {
				//console.log("display message");
				div.style.backgroundColor="#FF6666";
				div.innerHTML = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].highMsg;	
			} else {
				div.style.backgroundColor = "transparent";
			
			};
			//console.log(" muter = " + muteChatOnTimer + " and " + gapi.hangout.data.getValue("timerHasControl"));
			if ((muteChatOnTimer == "true") && (gapi.hangout.data.getValue("timerHasControl") == "false")) {
				console.log("inside muter if");
				minLevelLimit = avgTalkTime + ((avgTalkTime/100) * (parseInt(convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].minMsgLevel)));
			
				maxLevelLimit = avgTalkTime + ((avgTalkTime/100) * (parseInt(convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].maxMsgLevel)));
				//console.log("min lev limit = " + minLevelLimit + "high limit  = " + maxLevelLimit);
				if(userData.commLength <= minLevelLimit) {
					console.log("display message");
					div.style.backgroundColor="#3399FF";
					div.innerHTML = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].minMsg;
					minChatTimeMuter();	
				} else if (userData.commLength >= maxLevelLimit) {
					console.log("display message");
					div.style.backgroundColor="#3399FF";
					div.innerHTML = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].maxMsg;
					maxChatTimeMuter();	
				};
				
			};
		};
	};
	
	// a function to control the muting of users while the least spoken takes the stand
	function minChatTimeMuter(){
		var countdown = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].muteCountdownMsgLength;
		var controlLength = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].controlMsgLength;
		gapi.hangout.data.setValue("timerHasControl", "true");
		console.log("COUNTDOWN");
		setTimeout(function (){
			console.log("MUTING FROM CONUTDOWN");
			gapi.hangout.data.setValue("timerHasControlMute", "true");
			gapi.hangout.data.setValue("timerHasControlMuteReturn", "true");
			for (var i = 1; i <= gapi.hangout.data.getValue("userData"); i++){
				var userDataHolder = eval( "(" + gapi.hangout.data.getValue("userData" + i) + ")");				
				if(userData.id != userDataHolder.id){ 
					//console.log("user id " + userDataHolder.id);
					 gapi.hangout.av.muteParticipantMicrophone(userDataHolder.id); 					
				};
			}; 
		},countdown);		
		setTimeout(function (){
			console.log("MUTE ENDING");
			gapi.hangout.data.setValue("timerHasControl", "false");
			gapi.hangout.data.setValue("timerHasControlMute", "false");
		},controlLength);
	};
	
	// a function to control the muting of the local user if dominating convosation
	function maxChatTimeMuter() {
		var countdown = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].muteCountdownMsgLength;
		var controlLength = convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].controlMsgLength;
		gapi.hangout.data.setValue("timerHasControl", "true");
		console.log("COUNTDOWN");
		setTimeout(function (){
			console.log("MUTING FROM CONUTDOWN");
			gapi.hangout.data.setValue("timerHasControlMute", "true");
			shaperMuteOverlay.setVisible(true);
			gapi.hangout.av.setMicrophoneMute(true); 
		},countdown);
		setTimeout(function (){
			console.log("MUTE ENDING");
			gapi.hangout.data.setValue("timerHasControl", "false");
			gapi.hangout.data.setValue("timerHasControlMute", "false");
			gapi.hangout.av.setMicrophoneMute(false); 
			shaperMuteOverlay.setVisible(false);
		},controlLength);
	};
  	
  var commStruct = new commStruct();	
}(window));