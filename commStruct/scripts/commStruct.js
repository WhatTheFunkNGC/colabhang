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
		var chatIntervalCounter;
		var chatIntervalTotal;
		var dTimer; // hold the timer object for refreshing the display
		var dataDisplay;	
		var optionsDisplay;
		var currentUserProfileChecker; // changes each time a user changes profile. used for re-drawing display
		
	//-------------------- Convo Type settings -------------------------
		var currentProfileLoaded;
		var currentUserProfileLoaded;
		var allowButtingIn; // Allow users to speak over eachover
		var muteIfSpeaker; // All users bar speaker muted
		var notifyChatLength; // if enabled the system displays notes to the user baised on the amount they have been speaking
		var muteChatOnTimer; // if enabled, if user chats for too long they will be muted
		
		
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");				
			startSystem();	
			document.getElementById("optionDisplayToggle").onclick = this.toggleOptionDisplay.bind(this); // bind data display button
			document.getElementById("dataDisplayToggle").onclick = this.toggleDataDisplay.bind(this); // bind data display button
			document.getElementById("handUpBtn").onclick = this.toggleHandUp.bind(this); // bind data display button
			
			//gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {				// add callback event for list change
			//updateCheckerCommStruct(stateChangeEvent.addedKeys,stateChangeEvent.removedKeys);
			//});
		};	
		
		// initilise global vars 
		totalTime = 1;
		speakTime = 0;
		chatIntervalCounter = 0;
		chatIntervalTotal = 0;
		dataDisplay = false;
		optionsDisplay = false;

		// setup timers
		//var tTimer = setInterval(function() {userTimer()},1000);			// setup connection timer		
		var uTimer = setInterval(function() {userTimer(); updateTimer(); displaySpeakerInfo();},1000);			// setup update timer	
		//var sTimer = setInterval(function() {displaySpeakerInfo()},1000);			// setup timer for displaying current speaker and thoes who wish to speak
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
		dataDisplay = true;
		} else { 
		console.log("clicked when true");
		clearInterval(dTimer);
		div = document.getElementById("userDetailsList");
		div.innerHTML = "";	
		dataDisplay = false;
		};
	};
	
	// a button fuction that toggles if the user is waiting to speak or not
	commStruct.prototype.toggleHandUp = function () {
		handsUpOverlay();
		if (!checkDataExsistanceInArray("speakQueue",userData.id)){ // if user not inchat queue
			findAndAddNewItemToSharedList("speakQueue",userData.id);	// add them
		} else { 
			findAndRemoveItemFromSharedList("speakQueue",userData.id);		// if not remove them
		};
	};
	
	// sets up the button display for the possible convo profiles
	function displayOptions() {
		//console.log("log");	
		var div, ul, tr, e, i,profName,numIn, limit;	
		div = document.getElementById("optionsList");
		div.innerHTML = "";	
		//console.log("convo mode = " + gapi.hangout.data.getValue("currentConvoMode") + " profile name " + convoProfiles[gapi.hangout.data.getValue("currentConvoMode")].profileName );
		//console.log("user num = " + currentUserProfileLoaded + " length " + convoProfiles[gapi.hangout.data.getValue("currentConvoMode")].userTypes.length );			
		div.innerHTML = "Convo Mode : " + (convoProfiles[currentProfileLoaded].profileName || "none") + " <br>User Mode : " + 
			convoProfiles[currentProfileLoaded].userTypes[currentUserProfileLoaded].name +
			"<br>" +  convoProfiles[gapi.hangout.data.getValue("currentConvoMode")].discription;			
		ul = document.createElement("table");				// create table for users waiting to chat
		tr = document.createElement("tr");
		tr.innerHTML = "Convo Modes : ";
		for (i = 0; i < convoProfiles.length; i++) {						// loop through all users in data array and display in table format					
			tr.appendChild(createProfileButton(i));
		};
		ul.appendChild(tr);
		tr = document.createElement("tr");
		tr.innerHTML = "User Modes : ";
		for (i = 0; i < convoProfiles[currentProfileLoaded].userTypes.length; i++) {				// loop through all users in data array and display in table format					
			tr.appendChild(createUserProfileButton(currentProfileLoaded,i));
		};
		ul.appendChild(tr);
		//console.log("number of user types = " + gapi.hangout.data.getValue("userProfileTotals"));
		for (i = 0; i < convoProfiles[currentProfileLoaded].userTypes.length; i++) {
			tr = document.createElement("tr");
			e = document.createElement("td");
			profName = convoProfiles[currentProfileLoaded].userTypes[i].name; 						// get main bits of statistical data to display
			numIn = (gapi.hangout.data.getValue("userProfileTotals" + i) || "0");
			limit  = convoProfiles[currentProfileLoaded].userTypes[i].limit;
			if ( limit == "-1"){limit = "Unlimited"};
			
			//console.log("name  = " + profName);
			//console.log("profile numb  = " + numIn);
			//console.log("limit = " + limit);
			
			e.innerHTML = profName + " : " + numIn + " out of " + limit;
			tr.appendChild(e);
			ul.appendChild(tr);	
		};
		div.appendChild(ul);	
	};
	
	function createProfileButton(num) {
		var btn = document.createElement("button");
		btn.innerHTML = convoProfiles[num].profileName;
		btn.id = "profileBut" + num;
		btn.value = convoProfiles[num].profileName;	
		btn.onclick = function() {
			gapi.hangout.data.setValue("currentConvoMode", btn.id.substring(10));
		};
	return btn;			
	};
	
	function createUserProfileButton(profile,userProfile) {
		//console.log("log");	
		var btn = document.createElement("button");
		btn.innerHTML = convoProfiles[profile].userTypes[userProfile].name;
		btn.id = "userProfileOptionBtn" + userProfile;
		btn.value = convoProfiles[profile].userTypes[userProfile].name;	
		btn.onclick = function() {
			console.log("USER PROFILE BUT PRESS " + btn.id.substring(20));	
			var oldTotal, oldTotalNum ,newTotalNum, newTotal;
			var limit = convoProfiles[currentProfileLoaded].userTypes[btn.id.substring(20)].limit;
			//console.log("limit = " + limit + " and current numbers = " + gapi.hangout.data.getValue("userProfileTotals" + btn.id.substring(20)));	
			if(limit > gapi.hangout.data.getValue("userProfileTotals" + btn.id.substring(20)) || limit == "-1"){
			//console.log("doing if limit not reached " + currentUserProfileLoaded);	
			
			oldTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals" + currentUserProfileLoaded)) - 1).toString();
			newTotal = (parseInt(gapi.hangout.data.getValue("userProfileTotals" + btn.id.substring(20))) + 1).toString();
			oldTotalNum = "userProfileTotals" + currentUserProfileLoaded;
			newTotalNum = "userProfileTotals" + btn.id.substring(20);
			
			gapi.hangout.data.setValue(oldTotalNum,oldTotal);
			gapi.hangout.data.setValue(newTotalNum,newTotal);
			
			currentUserProfileLoaded = btn.id.substring(20);
			loadOptions();
			gapi.hangout.data.setValue("currentUserProfileChecker",(parseInt(gapi.hangout.data.getValue("currentUserProfileChecker")) + 1).toString());
			//console.log("currne loaded = " + currentUserProfileLoaded);
			};
		};
	return btn;			
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
		div.appendChild(ul);	
		//console.log("Displayed"); 
  };
  
  //-------------------- Functions -------------------------
  
	// checks for data updates that arnt used with timers
	function updateCheckerCommStruct(addedKeys,removedKeys){
		var itemNo, div;
		//console.log("checking up");
		if (addedKeys.length != 0){
			for (var i = 0; i < addedKeys.length ; i++ ){
				console.log("add found");
				if (addedKeys[i].key.indexOf("currentConvoMode") !== -1 ){
				console.log("found true");
				loadOptions();
				};
			};
			console.log("done");
		};
	};
  
  
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
		if (chatIntervalCounter == 10){	
			if (chatIntervalTotal > 3){
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
			displayOptions();
		};
		// user profile update 
		if (currentUserProfileChecker != gapi.hangout.data.getValue("currentUserProfileChecker")){		// checker detects if a user has chnaged profile 
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
		if (gapi.hangout.data.getValue("currentSpeaker") != userData.id){									// if not the current speaker
			if (allowButtingIn){
			gapi.hangout.data.setValue("currentSpeaker",userData.id); 	// if allowed to butt in, local user become active speaker
			} else {
			console.log("MUTING " + allowButtingIn);
			gapi.hangout.av.setMicrophoneMute(true);
			handsUpOverlay();
			findAndAddNewItemToSharedList("speakQueue",userData.id); 	// else set user to be "wants to speak"
			};
			findAndRemoveItemFromSharedList("speakQueue",userData.id);
			
			if ((muteIfSpeaker == "true") && (gapi.hangout.data.getValue("timerHasControl") == "false")){													// if muteSpeaker setting, mute all users when speaking starts
				console.log("MUTE ALL BAR SPEAKER");
				//console.log("num users " + gapi.hangout.data.getValue("userData"));
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
	
	function handsUpOverlay(){
		console.log("overlay ");
		var imgRec = createImageResource("https://raw.github.com/WhatTheFunkNGC/colabhang/master/commStruct/img/handUpOverlayWantsToSpeak.png");
		console.log("img created");
		var over = imgRec.createOverlay(); //{{0,0},0, 0};
		console.log("overlay made");
		over.setVisible(true);
		console.log("displayed");
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
			gapi.hangout.av.setMicrophoneMute(true); 
		},countdown);
		setTimeout(function (){
			console.log("MUTE ENDING");
			gapi.hangout.data.setValue("timerHasControl", "false");
			gapi.hangout.data.setValue("timerHasControlMute", "false");
			gapi.hangout.av.setMicrophoneMute(false); 
		},controlLength);
	};
  	
  var commStruct = new commStruct();	
}(window));