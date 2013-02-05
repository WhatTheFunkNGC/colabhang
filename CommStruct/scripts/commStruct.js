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
			var txt= '{"users" :[ { "id":"none" , "name":"none" , "hasMic":"none" , "connectionLength":"1" , "commLength":"0" } ] }';	;	
			userData = eval("(" + txt + ")");					
		} else { userData = eval(userDataTxt); };
		userDataPos = userData.users.length ;
		var newUser = { };
		newUser.id = gapi.hangout.getLocalParticipantId();
		newUser.name = gapi.hangout.getLocalParticipant().person.displayName;
		newUser.hasMic = gapi.hangout.getLocalParticipant().person.hasMicrophone;
		newUser.connectionLength = "1";
		newUser.commLength = "0";
		userData.users.push(newUser);		
		gapi.hangout.data.setValue("userData", JSON.stringify(userData));	
	};	
  	
	// display list of partisipants with relivant time stats
	function listUsers() {	
		var div, ul, tr, i, l;		
		ul = document.createElement("table");	
		l = userData.length;
		for (i = 0; i < l; i++) {	
			tr = document.createElement("tr");
			var e1 = document.createElement("text");	
			e1.data = userData.users[i].name;
			tr.appendChild(e1);
			var e2 = document.createElement("td");	
			e2.appendChild(userData.users[i].connectionLength);
			tr.appendChild(e2);
			var e3 = document.createElement("td");	
			e3.appendChild(userData.users[i].commLength);
			tr.appendChild(e3);
			
			ul.appendChild(tr);	
		}	
		div = document.getElementById("userList");
		div.innerHTML = "eefrg";		
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