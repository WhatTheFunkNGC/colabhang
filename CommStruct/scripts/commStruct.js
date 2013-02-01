(function (window) {	
  "use strict";	
  	
  function commStruct() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));

	
	//-------------------- VARS -------------------------	
	
	
  }	
 
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
		console.log("global Vars"); 
		var totalTime;
		var SpeakTime;
		
		console.log("creating timer var"); 
		var tTimer = setInterval(userTimer(),1000);
		console.log("completed timer var");
		var dTimer = setInterval(listUsers(),5000);
  };	
  	
	//-------------------- Functions -------------------------
  	
	
	commStruct.prototype.onParticipantsChanged = function (event) {	
    var div = document.getElementById("userList");	
    div.innerHTML = "";	
    this.listUsers();	
  };	
  	
  commStruct.prototype.listUsers = function () {	
    var div, participants, ul, li, i, l;	
    participants = gapi.hangout.getParticipants();	
    ul = document.createElement("ul");	
    l = participants.length;	
    for (i = 0; i < l; i++) {	
      li = document.createElement("li");	
      if (participants[i].person) {	
        li.innerHTML = participants[i].person.displayName + "<br>   Active time :" + totalTime;	
      }	
      ul.appendChild(li);	
    }	
    div = document.getElementById("userList");	
    div.appendChild(ul);	
	console.log(Displayed); 
  };	
  
  
  

	function userTimer() {
		totalTime = totalTime++ ;
		console.log("time = " + totalTime); 
	}
	
  	
  var commStruct = new commStruct();	
}(window));