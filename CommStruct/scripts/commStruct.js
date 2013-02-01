(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
  }	
    //-------------------- VARS -------------------------	
		var totalTime;		// glabal var - how long user has been connected
		var SpeakTime;		// global var - how long user has spoken for total
		
		var refreshUserList = 1000; // refresh rate of main display
 
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");	
	  
		gapi.hangout.onParticipantsChanged.add(		// Call function on event
        this.onParticipantsChanged.bind(this)	
		);	
		listUsers();							// list users
		}	
		totalTime = 1;
		

		var tTimer = setInterval(function() {userTimer()},1000);			// setup connection timer

		var dTimer = setInterval(function() {listUsers()},refreshUserList);	// setup refresh rate of user display
  };	
  	
	//-------------------- Functions -------------------------
 	
	// on new participant joining - refresh display
	commStruct.prototype.onParticipantsChanged = function (event) {	
    var div = document.getElementById("userList");	
    listUsers();	
  };	
  	
	// display list of partisipants with relivant time stats
  function listUsers() {	
    var div, participants, ul, tr, i, l;	
    participants = gapi.hangout.getParticipants();	
    ul = document.createElement("table");	
    l = participants.length;	
    for (i = 0; i < l; i++) {	
      tr = document.createElement("tr");	
      if (participants[i].person) {	
        tr.innerHTML = participants[i].person.displayName + "<br>   Active time : " + displayTimerString(totalTime); // list usrs connection time
      }	
      ul.appendChild(tr);	
    }	
    div = document.getElementById("userList");
	div.innerHTML = "";		
    div.appendChild(ul);	
	console.log("Displayed"); 
  };
  
	/* Displays an enterd second count in time format
	- rawTime : number of seconds
	- return : string "00:00:00" format */
	function displayTimerString(rawTime){
		var hours, minutes, seconds, dateWrap;
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
	
	
  	
  var commStruct = new commStruct();	
}(window));