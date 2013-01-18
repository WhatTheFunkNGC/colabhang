(function (window) {	
  "use strict";	
  	
  function HangoutDemo() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  	
  HangoutDemo.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("API Ready");	
      // we can start doing stuff here	
	this.displayParticipants();
	  console.log("done");	
    }	
  };	
  
  HangoutDemo.prototype.displayParticipants = function () {
	var div, participants, ul, li, i, l;
	console.log("Running");	
	participants = gapi.hangout.getParticipants();
	ul = document.createElement("ul");
	l = participants.length;
		for (i = 0; i < l; i++){
		li = document.createElement("li");
		if (participants[i].person) {
		li.innerHTML = participants[i].person.displayName; // add name to list if available
		} else {
			li.innerHTML = "unknown";
		}
			ul.appendChild(li);
	}
			div = document.getElementById("container");
			div.appendChild(ul);
};
			
  	
  var hangoutDemo = new HangoutDemo();	
}(window));