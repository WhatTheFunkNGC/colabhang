(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));

	
	//-------------------- VARS -------------------------	
	
	
  }	
  console.log("global Vars"); 
		var totalTime ;
		var SpeakTime;
 
	//-------------------- Listeners -------------------------
 
	// start of script setup
	commStruct.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {			// on ready
			console.log("API Ready");	
	  
		gapi.hangout.onParticipantsChanged.add(		// Call function on event
        this.onParticipantsChanged.bind(this)	
		);	
		console.log("lis Users");
		//this.listUsers();							// list users
		}	
		totalTime = 1;
		
		console.log("creating timer var"); 
		var tTimer = setInterval(function() {userTimer()},1000);
		console.log("completed timer var");
		var dTimer = setInterval(function() {listUsers()},5000);
  };	
  	
	//-------------------- Functions -------------------------
  	
	
	commStruct.prototype.onParticipantsChanged = function (event) {	
    var div = document.getElementById("userList");	
    div.innerHTML = "";	
    listUsers();	
  };	
  	
  function listUsers() {	
    var div, participants, ul, tr, i, l;	
    participants = gapi.hangout.getParticipants();	
    ul = document.createElement("table");	
    l = participants.length;	
    for (i = 0; i < l; i++) {	
      tr = document.createElement("tr");	
      if (participants[i].person) {	
        tr.innerHTML = participants[i].person.displayName + "<br>   Active time : " + displayTimer(totalTime);	
      }	
      ul.appendChild(tr);	
    }	
    div = document.getElementById("userList");
	div.innerHTML = "";		
    div.appendChild(ul);	
	console.log("Displayed"); 
  };	
  
	function displayTimerString(rawTime){
		var hours, minutes, seconds, dateWrap;
		hours = parseInt(rawTime / 3600);
		rawTime %= 3600;
		minutes = parseInt(rawTime / 60);
		rawTime %= 60;
		seconds = rawTime;
		if (seconds < 10) { seconds = "0" + seconds;};
		if (minutes < 10) { minutes = "0" + minutes;};
		if (hours < 10) { hours = "0" + hours;};
		
		
		return hours + ":" + minutes + ":" + seconds;
	}
  

	function userTimer() {
		totalTime = totalTime + 1 ;
	}
	
	
  	
  var commStruct = new commStruct();	
}(window));