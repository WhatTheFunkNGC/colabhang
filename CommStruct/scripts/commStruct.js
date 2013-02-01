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
        tr.innerHTML = participants[i].person.displayName + "<br>   Active time : " + displayTimer(totalTime).toTimeString;	
      }	
      ul.appendChild(tr);	
    }	
    div = document.getElementById("userList");
	div.innerHTML = "";		
    div.appendChild(ul);	
	console.log("Displayed"); 
  };	
  
	function displayTimer(rawTime){
		var hours, minutes, seconds, dateWrap;
		hours = parseInt(rawTime / 3600);
		rawTime %= 3600;
		minutes = parseInt(rawTime / 60);
		rawTime %= 60;
		seconds = rawTime;
		dateWrap = new Date();
		dateWrap.sethours(hours);
		dateWrap.setMinutes(minutes);
		dateWrap.setSeconds(seconds);
		
		
		return dateWrap;
	}
  

	function userTimer() {
		totalTime = totalTime + 1 ;
	}
	
	
  	
  var commStruct = new commStruct();	
}(window));