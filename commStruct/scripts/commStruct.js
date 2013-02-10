(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
  }	
    //-------------------- VARS -------------------------	
		var totalTime;		// glabal var - how long user has been connected
		var speakTime;		// global var - how long user has spoken for total
		var userData;		// global object - hold all local users key data
		var userDataPos;	// golbal var - marks the position that the local users data is stored in "userData"		
		var refreshUserList = 1000; // refresh rate of main display
		var chatIntervalCounter;
		var chatIntervalTotal;
 
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");	
	  
			
		startSystem();
		console.log("list");
		//listUsers();							// list users
		}	
		totalTime = 1;
		speakTime = 0;
		chatIntervalCounter = 0;
		chatIntervalTotal = 0;

		var tTimer = setInterval(function() {userTimer()},1000);			// setup connection timer
		
		var uTimer = setInterval(function() {updateTimer()},1000);			// setup update timer
		
		var cTimer = setInterval(function() {userChatCounter()},500);			// setup chat update timer

		var dTimer = setInterval(function() {listUsers()},refreshUserList);	// setup refresh rate of user display
  };	
  	
	//-------------------- Functions -------------------------
 	
	// on new user joining - refresh display
	function startSystem(){
		console.log("user data initilisation");	
		userDataPos = checkDataExsistanceInArray("userData",gapi.hangout.getLocalParticipantId());	// check if user already exsists
		console.log("dat pos got " + userDataPos);	
		if (!userDataPos){															// if false create new user data				
		var userData = { };															// create new user data object
		userData.id = gapi.hangout.getLocalParticipantId();							// fill with data
		userData.name = gapi.hangout.getLocalParticipant().person.displayName;
		userData.hasMic = gapi.hangout.getLocalParticipant().person.hasMicrophone;
		userData.connectionLength = "1";
		userData.commLength = "0";
		userDataPos = addNewItemToSharedList("userData",-1,JSON.stringify(userData));
		}
		console.log("user data complete");
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
	
	// timer function to take a set of readings each second to see if the user is speaking and incriment if threshold met
	function userChatCounter() {
		if (chatIntervalCounter == 2){	
			if (chatIntervalTotal > 1){ 
				speakTime = speakTime + 1;
			};
			chatIntervalCounter = 0; 
			chatIntervalTotal = 0;
		} else {
			chatIntervalTotal = chatIntervalTotal + gapi.hangout.av.getParticipantVolume(userData.id); // gets current mic volume level
			chatIntervalCounter = chatIntervalCounter + 1;
		};
	};
	
	
	// sends updates from local user to shared state
	function updateTimer() {
		var userDataString = gapi.hangout.data.getValue("userData" + userDataPos);
		userData = eval( "(" + userDataString + ")");						// convert to JS object
		userData.connectionLength = totalTime;
		userData.commLength = speakTime;
		gapi.hangout.data.setValue("userData" + userDataPos, JSON.stringify(userData));	// return JSON string of object
	}
	
  	
  var commStruct = new commStruct();	
}(window));