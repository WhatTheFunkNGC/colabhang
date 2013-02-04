(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
  }	
    //-------------------- VARS -------------------------	
		var totalTime;		// glabal var - how long user has been connected
		var SpeakTime;		// global var - how long user has spoken for total
		var userData;		// global object - hold all keey users data. to be updated regularly
		var userDataPos;	// golbal var - marks the position that the local users data is stored in "userData"		
		var refreshUserList = 1000; // refresh rate of main display
 
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");	
	  
			
		startSystem();
		console.log("list");
		listUsers();							// list users
		}	
		totalTime = 1;
		

		var tTimer = setInterval(function() {userTimer()},1000);			// setup connection timer

		var dTimer = setInterval(function() {listUsers()},refreshUserList);	// setup refresh rate of user display
  };	
  	
	//-------------------- Functions -------------------------
 	
	// on new user joining - refresh display
	function startSystem(){
	console.log("JSON 1");	
	var userDataTxt = gapi.hangout.data.getValue("userData") || false;
	if(!userData) { 
		console.log("JSON 2");	
		var txt= '{"users":[]}';
		userData = eval("(" + txt + ")");	
	} else { userData = eval(userDataTxt); };
	console.log("JSON 3");	
	userDataPos = userData.users.length;
	console.log("JSON 4 " + userDataPos);	
	userData.users.id.push = gapi.hangout.getLocalParticipantId();
	console.log("JSON 4.1");
	userData.users[userDataPos].name = getLocalParticipant().person.displayName;
	userData.users[userDataPos].hasMic = getLocalParticipant().person.hasMicrophone;
	userData.users[userDataPos].connectionLength = "1";
	userData.users[userDataPos].commLength = "0";
	userData.users.length = userData.users.length + 1;
	console.log("JSON 5");	
	gapi.hangout.data.setValue("userData", JSON.stringify(userData));
	console.log("JSON 6");	
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
        tr.innerHTML = participants[i].person.displayName + "<br>   Active time : " + displayTimerString(userData[userDataPos].connectionLength); // list usrs connection time
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
	
	
  	
  var commStruct = new commStruct();	
}(window));